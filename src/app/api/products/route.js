import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { products as catalogFallback } from "@/lib/products";
import { searchAndRankProducts, cleanText, cleanAlphaNum } from "@/lib/searchEngine";
import { NextResponse } from "next/server";
import { enforceRateLimit } from "@/lib/security/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get("search") || searchParams.get("q") || "";
    const categoryParam = searchParams.get("category") || "";
    const brandParam = searchParams.get("brand") || "";
    const lineParam = searchParams.get("line") || "";
    const vehicleParam = searchParams.get("vehicle") || "";
    const limitParam = parseInt(searchParams.get("limit") || "", 10);
    const pageParam = parseInt(searchParams.get("page") || "", 10);

    let filtered = [...catalogFallback];

    // 1. Filtro por categoría
    if (categoryParam && categoryParam !== "todas") {
      const catClean = cleanText(categoryParam);
      filtered = filtered.filter((p) => {
        const slug = cleanText(p.category?.slug);
        const name = cleanText(p.category?.name);
        return slug === catClean || slug.includes(catClean) || name.includes(catClean);
      });
    }

    // 2. Filtro por marca
    if (brandParam && brandParam !== "todas") {
      const brandClean = cleanText(brandParam);
      const brandVariants = [
        brandClean,
        brandClean.replace(/-/g, " "),
        brandClean.replace(/\s+/g, "-"),
      ].filter(Boolean);

      filtered = filtered.filter((p) => {
        const pBrandSlug = cleanText(p.brand?.slug);
        const pBrandName = cleanText(p.brand?.name);
        const pName = cleanText(p.name);
        const pLine = cleanText(p.inventoryLine);
        const pFitmentSummary = cleanText(p.fitmentSummary);
        const fullText = `${pName} ${pLine} ${pFitmentSummary}`;

        if (pBrandSlug === brandClean || pBrandName === brandClean || pBrandName.includes(brandClean)) {
          return true;
        }

        return brandVariants.some((variant) => {
          const safeRegexStr = variant.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          const regex = new RegExp(`(?:^|[^a-z0-9])${safeRegexStr}(?:[^a-z0-9]|$)`, "i");
          return regex.test(fullText);
        });
      });
    }

    // 3. Filtro por línea
    if (lineParam) {
      filtered = filtered.filter((p) => p.inventoryLine === lineParam);
    }

    // 4. Filtro por vehículo
    if (vehicleParam) {
      const vehClean = cleanText(vehicleParam);
      filtered = filtered.filter((p) => {
        const fullText = cleanText(`${p.name} ${p.shortDesc || ""} ${p.description || ""} ${p.fitmentSummary || ""}`);
        return fullText.includes(vehClean);
      });
    }

    // 5. Búsqueda y ranking inteligente
    if (searchQuery && searchQuery.trim()) {
      filtered = searchAndRankProducts(filtered, searchQuery.trim());
    }

    const total = filtered.length;

    // Si se especifica paginación o límite
    if (limitParam && limitParam > 0) {
      const page = pageParam && pageParam > 0 ? pageParam : 1;
      const pageSize = Math.min(limitParam, 200);
      const totalPages = Math.max(1, Math.ceil(total / pageSize));
      const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

      return NextResponse.json(
        {
          items: paginated,
          total,
          page,
          pageSize,
          totalPages,
        },
        {
          status: 200,
          headers: {
            "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
            "X-Data-Source": "inventory-general-pdf",
            "X-Inventory-Items": String(total),
          },
        }
      );
    }

    return NextResponse.json(filtered, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
        "X-Data-Source": "inventory-general-pdf",
        "X-Inventory-Items": String(total),
      },
    });
  } catch (error) {
    console.error("Error en GET /api/products:", error);
    return NextResponse.json({ error: "Error consultando productos" }, { status: 500 });
  }
}

export async function POST(request) {
  const limited = await enforceRateLimit(request, { scope: "admin-products", limit: 20, windowMs: 60_000 });
  if (limited) return limited;
  try {
    const session = await getServerSession();
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
