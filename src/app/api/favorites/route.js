import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

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
  try {
    const session = await getServerSession(authOptions);

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
