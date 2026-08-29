import { Prisma } from "@prisma/client";
import {
  bulkCatalogRequestSchema,
  catalogProductInputSchema,
  type BulkCatalogRequest,
  type CatalogProductInput,
} from "../domain/catalogSchemas";
import { PrismaCatalogRepository } from "../infrastructure/prismaCatalogRepository";
import { enqueueCatalogImport } from "../infrastructure/catalogQueue";

export type BulkValidationIssue = {
  rowNumber: number;
  issues: Array<{ path: string; message: string }>;
};

function validationIssues(error: { issues: Array<{ path: PropertyKey[]; message: string }> }) {
  return error.issues.map((issue) => ({
    path: issue.path.map(String).join("."),
    message: issue.message,
  }));
}

export class CatalogImportService {
  constructor(private readonly repository = new PrismaCatalogRepository()) {}

  validateRequest(raw: unknown) {
    return bulkCatalogRequestSchema.parse(raw);
  }

  validateItems(request: BulkCatalogRequest) {
    const validItems: CatalogProductInput[] = [];
    const issues: BulkValidationIssue[] = [];
    const stagedRows = request.items.map((rawItem, index) => {
      const rowNumber = index + 1;
      const parsed = catalogProductInputSchema.safeParse(rawItem);
      if (parsed.success) {
        validItems.push(parsed.data);
        return {
          rowNumber,
          sku: parsed.data.sku,
          payload: JSON.parse(JSON.stringify(parsed.data)) as Prisma.InputJsonValue,
          status: "PENDING" as const,
        };
      }

      const rowIssues = validationIssues(parsed.error);
      issues.push({ rowNumber, issues: rowIssues });
      return {
        rowNumber,
        sku:
          rawItem && typeof rawItem === "object" && "sku" in rawItem
            ? String(rawItem.sku || "") || undefined
            : undefined,
        payload: JSON.parse(JSON.stringify(rawItem ?? null)) as Prisma.InputJsonValue,
        status: "REJECTED" as const,
        error: { issues: rowIssues } as Prisma.InputJsonValue,
      };
    });

    return { validItems, stagedRows, issues };
  }

  async submit(raw: unknown, requestedBy?: string) {
    const request = this.validateRequest(raw);
    const validation = this.validateItems(request);

    if (request.validateOnly) {
      return {
        validateOnly: true,
        totalRows: request.items.length,
        acceptedRows: validation.validItems.length,
        rejectedRows: validation.issues.length,
        issues: validation.issues.slice(0, 200),
      };
    }

    const { job, reused } = await this.repository.createImportJob({
      idempotencyKey: request.idempotencyKey,
      source: request.source,
      requestedBy,
      rows: validation.stagedRows,
    });

    let queuedChunks = 0;
    if (!reused && validation.validItems.length > 0) {
      try {
        queuedChunks = await enqueueCatalogImport(job.id, request.items.length);
      } catch (error) {
        const message = error instanceof Error ? error.message : "No fue posible encolar la importación.";
        await this.repository.markImportFailed(job.id, message);
        throw error;
      }
    }

    return {
      validateOnly: false,
      reused,
      jobId: job.id,
      statusUrl: `/api/v1/products/bulk/${job.id}`,
      totalRows: request.items.length,
      initiallyRejectedRows: validation.issues.length,
      queuedChunks,
      issues: validation.issues.slice(0, 200),
    };
  }
}
