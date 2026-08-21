import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { prisma } from "@/lib/prisma";

export const getServerSession = cache(async () => {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  const authUser = data?.user;
  if (error || !authUser?.email) return null;

  const email = authUser.email.toLowerCase();
  let appUser = await prisma.user.findUnique({ where: { email } });

  if (!appUser) {
    appUser = await prisma.user.create({
      data: {
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
  }

  return {
    user: {
      id: appUser.id,
      name: appUser.name,
      email: appUser.email,
      image: appUser.image,
      role: appUser.role,
      authId: authUser.id,
    },
  };
});
