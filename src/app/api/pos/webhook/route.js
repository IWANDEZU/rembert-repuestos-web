import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { normalizePosProduct, POS_PROVIDERS } from "@/lib/posIntegrations";
import { enforceRateLimit } from "@/lib/security/rateLimit";
import { createHash, timingSafeEqual } from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 2 * 1024 * 1024;
const MAX_ITEMS = 500;
const secretsMatch = (provided, expected) => {
  if (!provided || !expected) return false;
  const left = createHash("sha256").update(provided).digest();
  const right = createHash("sha256").update(expected).digest();
  return timingSafeEqual(left, right);
};

/**
 * Webhook Receptor para POS e Inventarios Colombianos
 * URL: /api/pos/webhook
 * 
 * Permite recibir actualizaciones en tiempo real desde Siigo, Zoe POS, Alegra,
 * o cualquier software POS con webhook / cron de sincronización.
 */
export async function POST(request) {
  const limited = await enforceRateLimit(request, { scope: "pos-webhook", limit: 20, windowMs: 60_000 });
  if (limited) return limited;
  try {
    const authHeader = request.headers.get("authorization");
    const posApiKey = request.headers.get("x-pos-key");
    const { searchParams } = new URL(request.url);

    const expectedSecret = process.env.POS_SYNC_SECRET;
    const providedSecret = posApiKey || authHeader?.replace(/^Bearer\s+/i, "");

    if (!expectedSecret) {
      return NextResponse.json(
        { error: "Webhook POS no configurado: Falta definir POS_SYNC_SECRET en variables de entorno." },
        { status: 500 }
      );
    }

    if (!secretsMatch(providedSecret, expectedSecret)) {
      return NextResponse.json(
        { error: "No autorizado. Clave de POS inválida o faltante en encabezado 'x-pos-key'." },
        { status: 401 }
      );
    }

    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Payload demasiado grande" }, { status: 413 });
    }

    const payload = await request.json();
    const provider = searchParams.get("provider") || payload.provider || POS_PROVIDERS.UNIVERSAL;

    // Acepta un solo producto o una lista de productos en el payload
    const rawItems = Array.isArray(payload) 
      ? payload 
      : Array.isArray(payload.items || payload.products || payload.data) 
        ? (payload.items || payload.products || payload.data) 
        : [payload];

    if (rawItems.length > MAX_ITEMS) {
      return NextResponse.json({ error: `Máximo ${MAX_ITEMS} productos por solicitud` }, { status: 413 });
    }

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
      { error: "Error procesando sincronización de inventario POS" },
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
    authRequired: "Header 'x-pos-key' o Authorization Bearer",
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
