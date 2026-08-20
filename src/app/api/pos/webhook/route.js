import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { normalizePosProduct, POS_PROVIDERS } from "@/lib/posIntegrations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Webhook Receptor para POS e Inventarios Colombianos
 * URL: /api/pos/webhook
 * 
 * Permite recibir actualizaciones en tiempo real desde Siigo, Zoe POS, Alegra,
 * o cualquier software POS con webhook / cron de sincronización.
 */
export async function POST(request) {
  try {
    const authHeader = request.headers.get("authorization");
    const posApiKey = request.headers.get("x-pos-key");
    const { searchParams } = new URL(request.url);
    const secretQuery = searchParams.get("secret");

    const expectedSecret = process.env.POS_SYNC_SECRET || "rembert-pos-secret-2026";
    const providedSecret = posApiKey || secretQuery || authHeader?.replace("Bearer ", "");

    if (providedSecret !== expectedSecret) {
      return NextResponse.json(
        { error: "No autorizado. Clave de POS inválida o faltante en encabezado 'x-pos-key'." },
        { status: 401 }
      );
    }

    const payload = await request.json();
    const provider = searchParams.get("provider") || payload.provider || POS_PROVIDERS.UNIVERSAL;

    // Acepta un solo producto o una lista de productos en el payload
    const rawItems = Array.isArray(payload) 
      ? payload 
      : Array.isArray(payload.items || payload.products || payload.data) 
        ? (payload.items || payload.products || payload.data) 
        : [payload];

    const results = {
      totalReceived: rawItems.length,
      updated: 0,
      created: 0,
      failed: 0,
      errors: [],
    };

    for (const rawItem of rawItems) {
      try {
        const item = normalizePosProduct(rawItem, provider);
        if (!item.name && !item.sku) {
          results.failed++;
          continue;
        }

        // Buscar producto existente por SKU o por slug
        let existing = null;
        if (item.sku) {
          existing = await prisma.product.findUnique({ where: { sku: item.sku } });
        }
        if (!existing && item.slug) {
          existing = await prisma.product.findUnique({ where: { slug: item.slug } });
        }

        // Obtener o crear categoría si viene informada
        let categoryId = null;
        if (item.category) {
          const categorySlug = item.category.toLowerCase().replace(/[^a-z0-9]+/g, "-");
          const cat = await prisma.category.upsert({
            where: { slug: categorySlug },
            update: { name: item.category },
            create: { name: item.category, slug: categorySlug },
          });
          categoryId = cat.id;
        }

        // Obtener o crear marca si viene informada
        let brandId = null;
        if (item.brand) {
          const brandSlug = item.brand.toLowerCase().replace(/[^a-z0-9]+/g, "-");
          const br = await prisma.brand.upsert({
            where: { slug: brandSlug },
            update: { name: item.brand },
            create: { name: item.brand, slug: brandSlug },
          });
          brandId = br.id;
        }

        if (existing) {
          // Actualizar stock y precio del producto existente
          await prisma.product.update({
            where: { id: existing.id },
            data: {
              price: item.price > 0 ? item.price : existing.price,
              stock: item.stock,
              inStock: item.stock > 0,
              description: item.description || existing.description,
              ...(categoryId ? { categoryId } : {}),
              ...(brandId ? { brandId } : {}),
            },
          });
          results.updated++;
        } else {
          // Crear nuevo producto desde el POS
          await prisma.product.create({
            data: {
              name: item.name,
              slug: item.slug,
              sku: item.sku,
              price: item.price,
              stock: item.stock,
              inStock: item.stock > 0,
              description: item.description || `Repuesto original código ${item.sku || item.name}`,
              categoryId,
              brandId,
            },
          });
          results.created++;
        }
      } catch (itemErr) {
        results.failed++;
        results.errors.push({ sku: rawItem?.sku || rawItem?.code, message: itemErr.message });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Sincronización POS completada: ${results.updated} actualizados, ${results.created} creados.`,
      stats: results,
    });
  } catch (error) {
    console.error("Error en Webhook POS:", error);
    return NextResponse.json(
      { error: "Error procesando sincronización de inventario POS", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/pos/webhook
 * Permite verificar el estado y documentación rápida del webhook de integración POS
 */
export async function GET(request) {
  return NextResponse.json({
    status: "online",
    service: "Rembert Repuestos BCA - POS & Inventory Webhook",
    compatibleSystems: ["Siigo Nube", "Zoe POS", "Alegra", "Helisa", "World Office", "PosCloud", "Excel / CSV / JSON"],
    authRequired: "Header 'x-pos-key' o parámetro '?secret=TU_CLAVE'",
    samplePayload: {
      items: [
        {
          sku: "FIL-WIX-51515",
          nombre: "Filtro de Aceite WIX 51515",
          precio: 45000,
          stock: 24,
          marca: "WIX Filters",
          categoria: "Filtros",
          descripcion: "Filtro de aceite roscado para camionetas",
        },
      ],
    },
  });
}
