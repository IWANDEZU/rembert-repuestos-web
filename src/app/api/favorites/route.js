import { getServerSession } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getProductById } from "@/lib/products";
import { enforceRateLimit } from "@/lib/security/rateLimit";

export async function GET(req) {
  const limited = await enforceRateLimit(req, { scope: "favorites-read", limit: 60, windowMs: 60_000 });
  if (limited) return limited;

  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ productIds: [] }, { status: 401 });
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId: session.user.id },
      select: { productId: true },
    });
    return NextResponse.json(
      { productIds: favorites.map((favorite) => favorite.productId) },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    console.error("Error al consultar favoritos:", error);
    return NextResponse.json({ productIds: [] }, { status: 500 });
  }
}

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

    // Asegurar que el producto existe en la tabla Product para satisfacer la llave foránea de Favorite
    try {
      const existingProduct = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!existingProduct) {
        const catalogItem = getProductById(productId);
        if (catalogItem) {
          await prisma.product.upsert({
            where: { id: catalogItem.id },
            update: {},
            create: {
              id: catalogItem.id,
              name: catalogItem.name,
              slug: catalogItem.slug || catalogItem.id,
              description: catalogItem.description || catalogItem.shortDesc || "",
              price: Number(catalogItem.price) || 0,
              sku: catalogItem.sku || null,
              stock: Number(catalogItem.stock) || 0,
              inStock: catalogItem.inStock ?? true,
            },
          });
        }
      }
    } catch (productCheckErr) {
      console.warn("No se pudo verificar/crear producto previo a favorito:", productCheckErr.message);
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
