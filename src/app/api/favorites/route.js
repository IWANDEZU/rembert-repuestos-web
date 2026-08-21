import { getServerSession } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { enforceRateLimit } from "@/lib/security/rateLimit";

export async function POST(req) {
  const limited = await enforceRateLimit(req, { scope: "favorites-write", limit: 30, windowMs: 60_000 });
  if (limited) return limited;
  try {
    const session = await getServerSession();

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Debes iniciar sesión para agregar a favoritos" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { error: "Se requiere el ID del producto" },
        { status: 400 }
      );
    }

    // Verificar si ya está en favoritos para no duplicar
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: productId,
        }
      }
    });

    if (existingFavorite) {
      return NextResponse.json({ message: "El producto ya está en favoritos" }, { status: 200 });
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: session.user.id,
        productId: productId,
      },
    });

    return NextResponse.json({ favorite }, { status: 201 });
  } catch (error) {
    console.error("Error al agregar a favoritos:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al agregar a favoritos" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  const limited = await enforceRateLimit(req, { scope: "favorites-write", limit: 30, windowMs: 60_000 });
  if (limited) return limited;
  try {
    const session = await getServerSession();

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Debes iniciar sesión para remover de favoritos" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { error: "Se requiere el ID del producto" },
        { status: 400 }
      );
    }

    await prisma.favorite.deleteMany({
      where: {
        userId: session.user.id,
        productId: productId,
      },
    });

    return NextResponse.json({ message: "Removido de favoritos" }, { status: 200 });
  } catch (error) {
    console.error("Error al remover de favoritos:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al remover de favoritos" },
      { status: 500 }
    );
  }
}
