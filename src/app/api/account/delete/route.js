import { getServerSession } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deleteUserData } from "@/lib/deleteUserData";
import { enforceRateLimit } from "@/lib/security/rateLimit";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function hasSameOrigin(request) {
  const origin = request.headers.get("origin");
  return Boolean(origin) && origin === new URL(request.url).origin;
}

export async function DELETE(request) {
  const limited = await enforceRateLimit(request, { scope: "account-delete", limit: 3, windowMs: 3_600_000 });
  if (limited) return limited;
  if (!hasSameOrigin(request)) {
    return NextResponse.json({ message: "Origen no permitido" }, { status: 403 });
  }

  const session = await getServerSession();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ message: "Debes iniciar sesión" }, { status: 401 });

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Solicitud inválida" }, { status: 400 });
  }

  if (body?.confirmation !== "ELIMINAR") {
    return NextResponse.json({ message: "Confirmación requerida" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
  if (!user) return NextResponse.json({ message: "Cuenta no encontrada" }, { status: 404 });

  if (session.user.authId) {
    const { error } = await createAdminClient().auth.admin.deleteUser(session.user.authId);
    if (error) {
      console.error("No fue posible eliminar la identidad Supabase:", error.message);
      return NextResponse.json(
        { message: "No fue posible validar la eliminación completa de la cuenta." },
        { status: 502 },
      );
    }
  }
  await deleteUserData(user.id);
  return NextResponse.json({ message: "Cuenta y datos personales eliminados" });
}
