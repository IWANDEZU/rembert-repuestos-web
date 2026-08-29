import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { PrismaCatalogRepository } from "@/modules/catalog/infrastructure/prismaCatalogRepository";
import { catalogErrorResponse } from "@/modules/catalog/presentation/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const messageSchema = z.object({
  jobId: z.uuid(),
  startRow: z.number().int().min(1).max(5000),
  endRow: z.number().int().min(1).max(5000),
});

function secretsMatch(received: string | null, expected: string | undefined) {
  if (!received || !expected) return false;
  const receivedBytes = Buffer.from(received);
  const expectedBytes = Buffer.from(expected);
  return (
    receivedBytes.length === expectedBytes.length &&
    timingSafeEqual(receivedBytes, expectedBytes)
  );
}

export async function POST(request: Request) {
  try {
    if (process.env.CATALOG_DATABASE_WRITES !== "true") {
      return NextResponse.json(
        { error: "CATALOG_DATABASE_WRITES_DISABLED" },
        { status: 503 },
      );
    }
    if (
      !secretsMatch(
        request.headers.get("x-rembert-catalog-worker"),
        process.env.CATALOG_WORKER_SECRET,
      )
    ) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const message = messageSchema.parse(await request.json());
    if (message.endRow < message.startRow) {
      return NextResponse.json(
        { error: "INVALID_ROW_RANGE", message: "El rango del lote es inválido." },
        { status: 422 },
      );
    }

    const job = await new PrismaCatalogRepository().processImportChunk(
      message.jobId,
      message.startRow,
      message.endRow,
    );
    return NextResponse.json({ ok: true, job });
  } catch (error) {
    return catalogErrorResponse(error);
  }
}
