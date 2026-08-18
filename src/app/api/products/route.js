import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        category: true,
        brand: true,
        images: true,
        variants: true,
      },
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const data = await request.json();
    if (!data.name || !data.slug || !data.price) {
      return NextResponse.json({ error: "Nombre, slug y precio son obligatorios" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || "",
        shortDesc: data.shortDesc || null,
        price: parseFloat(data.price),
        comparePrice: data.comparePrice ? parseFloat(data.comparePrice) : null,
        sku: data.sku || null,
        stock: parseInt(data.stock, 10) || 0,
        inStock: data.inStock ?? true,
        categoryId: data.categoryId || null,
        brandId: data.brandId || null,
      },
    });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creando producto:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

