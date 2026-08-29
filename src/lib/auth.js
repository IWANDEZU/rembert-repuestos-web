import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { prisma } from "@/lib/prisma";

export const getServerSession = cache(async () => {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    const authUser = data?.user;
    if (error || !authUser?.email) return null;

    const email = authUser.email.toLowerCase();
    let appUser = null;

    try {
      appUser = await prisma.user.findUnique({ where: { email } });

      if (!appUser) {
        appUser = await prisma.user.create({
          data: {
            supabaseAuthId: authUser.id,
            email,
            name:
              authUser.user_metadata?.full_name ||
              authUser.user_metadata?.name ||
              email.split("@")[0],
            image: authUser.user_metadata?.avatar_url || null,
            emailVerified: authUser.email_confirmed_at ? new Date(authUser.email_confirmed_at) : null,
            role: "USER",
            password: null,
          },
        });
      } else if (appUser.supabaseAuthId !== authUser.id) {
        appUser = await prisma.user.update({
          where: { id: appUser.id },
          data: { supabaseAuthId: authUser.id },
        });
      }

      for (const identity of authUser.identities || []) {
        const providerAccountId =
          identity.provider_id || identity.identity_data?.sub || null;
        if (!identity.provider || !providerAccountId) continue;

        await prisma.account.upsert({
          where: {
            provider_providerAccountId: {
              provider: identity.provider,
              providerAccountId: String(providerAccountId),
            },
          },
          update: { userId: appUser.id, type: "oauth" },
          create: {
            userId: appUser.id,
            type: "oauth",
            provider: identity.provider,
            providerAccountId: String(providerAccountId),
          },
        });
      }
    } catch (dbError) {
      console.warn("No se pudo sincronizar usuario con base de datos Prisma:", dbError.message);
    }

    return {
      user: {
        id: appUser?.id || authUser.id,
        name: appUser?.name || authUser.user_metadata?.full_name || authUser.email.split("@")[0],
        email: appUser?.email || authUser.email,
        image: appUser?.image || authUser.user_metadata?.avatar_url || null,
        role: appUser?.role || "USER",
        authId: appUser?.supabaseAuthId || authUser.id,
      },
    };
  } catch (err) {
    console.error("Error al obtener sesión en getServerSession:", err);
    return null;
  }
});
