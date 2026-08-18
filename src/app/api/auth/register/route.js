import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password, privacyAccepted } = body;
    const normalizedName = typeof name === "string" ? name.trim() : "";
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!normalizedName || !normalizedEmail || typeof password !== "string") {
      return NextResponse.json({ message: "Faltan campos obligatorios" }, { status: 400 });
    }

    if (normalizedName.length > 120 || normalizedEmail.length > 254 || password.length < 8 || password.length > 128) {
      return NextResponse.json({ message: "Verifica los datos de registro y usa una contraseña de 8 a 128 caracteres" }, { status: 400 });
    }

    if (privacyAccepted !== true) {
      return NextResponse.json({ message: "Debes autorizar el tratamiento de datos para crear una cuenta" }, { status: 400 });
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json({ message: "El correo ya está registrado" }, { status: 400 });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        name: normalizedName,
        email: normalizedEmail,
        password: hashedPassword,
        role: "USER"
      },
    });

    return NextResponse.json({ message: "Usuario creado exitosamente", user: { id: user.id, name: user.name, email: user.email } }, { status: 201 });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}
