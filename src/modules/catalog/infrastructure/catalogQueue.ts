import { getCloudflareContext } from "@opennextjs/cloudflare";
import { CatalogConfigurationError } from "../domain/catalogErrors";

export type CatalogImportMessage = {
  jobId: string;
  startRow: number;
  endRow: number;
};

type CatalogQueueBinding = {
  sendBatch(messages: Array<{ body: CatalogImportMessage; contentType: "json" }>): Promise<void>;
};

export async function enqueueCatalogImport(jobId: string, totalRows: number) {
  const { env } = await getCloudflareContext({ async: true });
  const queue = (env as unknown as { CATALOG_IMPORT_QUEUE?: CatalogQueueBinding })
    .CATALOG_IMPORT_QUEUE;

  if (!queue) {
    throw new CatalogConfigurationError(
      "La cola CATALOG_IMPORT_QUEUE no está enlazada al Worker.",
    );
  }

  const messages: Array<{ body: CatalogImportMessage; contentType: "json" }> = [];
  for (let startRow = 1; startRow <= totalRows; startRow += 100) {
    messages.push({
      body: { jobId, startRow, endRow: Math.min(startRow + 99, totalRows) },
      contentType: "json",
    });
  }

  await queue.sendBatch(messages);
  return messages.length;
}
