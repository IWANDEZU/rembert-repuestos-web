import { NextResponse } from "next/server";
import { catalogQuerySchema, decodeCatalogCursor } from "@/modules/catalog/domain/catalogSchemas";
import { CatalogDomainError } from "@/modules/catalog/domain/catalogErrors";
import { PrismaCatalogRepository } from "@/modules/catalog/infrastructure/prismaCatalogRepository";
import { catalogErrorResponse } from "@/modules/catalog/presentation/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    if (process.env.CATALOG_DATABASE_READS !== "true") {
      throw new CatalogDomainError(
        "CATALOG_DATABASE_READS_DISABLED",
        "La API de catálogo transaccional está instalada pero aún no se ha activado.",
        503,
      );
    }

    const url = new URL(request.url);
    const query = catalogQuerySchema.parse({
      search: url.searchParams.get("search") || url.searchParams.get("q") || "",
      category: url.searchParams.get("category") || "",
      brand: url.searchParams.get("brand") || "",
      inStock: url.searchParams.get("inStock") || "true",
      cursor: url.searchParams.get("cursor") || undefined,
      page: url.searchParams.get("page") || undefined,
      limit: url.searchParams.get("limit") || 24,
    });
    if (query.page && query.cursor) {
      throw new CatalogDomainError(
        "PAGINATION_MODE_CONFLICT",
        "Use page o cursor, pero no ambos en la misma solicitud.",
        400,
      );
    }
    const cursor = decodeCatalogCursor(query.cursor);
    if (query.cursor && !cursor) {
      throw new CatalogDomainError("INVALID_CURSOR", "El cursor del catálogo no es válido.", 400);
    }

    const page = await new PrismaCatalogRepository().search(query, cursor);
    return NextResponse.json(page, {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120",
        "X-Data-Source": "postgresql-catalog-v1",
      },
    });
  } catch (error) {
    return catalogErrorResponse(error);
  }
}
