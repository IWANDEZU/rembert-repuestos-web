import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { PrismaCatalogRepository } from "@/modules/catalog/infrastructure/prismaCatalogRepository";
import { catalogErrorResponse } from "@/modules/catalog/presentation/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ jobId: string }> },
) {
  try {
    const session = await getServerSession();
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    if (process.env.CATALOG_DATABASE_WRITES !== "true") {
      return NextResponse.json(
        { error: "CATALOG_DATABASE_WRITES_DISABLED" },
        { status: 503 },
      );
    }

    const { jobId } = await context.params;
    const job = await new PrismaCatalogRepository().getImportJob(jobId);
    return NextResponse.json(job, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return catalogErrorResponse(error);
  }
}
