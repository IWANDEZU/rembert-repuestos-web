import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { enforceRateLimit } from "@/lib/security/rateLimit";
import { CatalogImportService } from "@/modules/catalog/application/catalogImportService";
import { catalogErrorResponse } from "@/modules/catalog/presentation/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const limited = await enforceRateLimit(request, {
    scope: "catalog-bulk-v1",
    limit: 5,
    windowMs: 60_000,
  });
  if (limited) return limited;

  try {
    const session = await getServerSession();
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > 20 * 1024 * 1024) {
      return NextResponse.json(
        { error: "PAYLOAD_TOO_LARGE", message: "El lote supera el límite de 20 MB." },
        { status: 413 },
      );
    }

    const service = new CatalogImportService();
    const payload = await request.json();
    const parsedRequest = service.validateRequest(payload);
    if (!parsedRequest.validateOnly && process.env.CATALOG_DATABASE_WRITES !== "true") {
      return NextResponse.json(
        {
          error: "CATALOG_DATABASE_WRITES_DISABLED",
          message: "Aplique la migración y sincronice el catálogo antes de habilitar escrituras.",
        },
        { status: 503 },
      );
    }

    const result = await service.submit(payload, session.user.id);
    return NextResponse.json(result, { status: result.validateOnly ? 200 : 202 });
  } catch (error) {
    return catalogErrorResponse(error);
  }
}
