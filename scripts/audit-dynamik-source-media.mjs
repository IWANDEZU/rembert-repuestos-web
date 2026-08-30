import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { products } from "../src/lib/products.js";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(scriptDir, "..");
const outputPath = resolve(rootDir, "tmp", "dynamik-source-media-audit.json");
const sourceBase = process.env.DYNAMIK_SOURCE_BASE || "https://www.ciosa.co";
const concurrency = Math.max(1, Number.parseInt(process.env.DYNAMIK_SOURCE_AUDIT_CONCURRENCY || "6", 10));
const normalizeSku = (value) => String(value || "").trim().toUpperCase();
const pending = products
  .filter((product) => product?.brand?.slug === "dynamik" && product.imageStatus === "pending-real-photo")
  .map((product) => ({ sku: normalizeSku(product.sku), slug: product.slug, name: product.name }))
  .filter((product) => product.sku);

const sourceViews = (html, sku) => [...new Set(
  [...html.matchAll(/getImage\/marcaDetalle\/([A-Za-z0-9_-]+)/g)]
    .map((match) => match[1])
    .filter((reference) => reference === sku || reference.startsWith(`${sku}_`))
)].sort();

const fetchSource = async (product) => {
  const url = `${sourceBase}/productos/detalle/${encodeURIComponent(product.sku)}`;
  try {
    const response = await fetch(url, {
      headers: { "user-agent": "DynamikCatalogMediaAudit/1.0 (+catalog verification)" },
    });
    const html = await response.text();
    const views = response.ok ? sourceViews(html, product.sku) : [];
    return {
      ...product,
      sourceStatus: response.status,
      sourceViews: views,
      // Este auditor solo registra disponibilidad de fuente. Las imágenes nunca
      // se descargan, copian ni publican sin revisión de licencia y watermark.
      candidateStatus: views.length ? "requires-manual-photo-rights-review" : "no-source-view-detected",
    };
  } catch (error) {
    return { ...product, sourceStatus: null, sourceViews: [], candidateStatus: "source-request-failed", error: error.message };
  }
};

const results = [];
let nextIndex = 0;
const workers = Array.from({ length: Math.min(concurrency, pending.length) }, async () => {
  while (nextIndex < pending.length) {
    const item = pending[nextIndex];
    nextIndex += 1;
    results.push(await fetchSource(item));
  }
});
await Promise.all(workers);
results.sort((left, right) => left.sku.localeCompare(right.sku));

const report = {
  generatedAt: new Date().toISOString(),
  scope: "Dynamik pending real-photo NPCs only",
  totalPendingPhotoRefs: pending.length,
  sourceWithCandidateViews: results.filter((item) => item.sourceViews.length > 0).length,
  sourceWithoutCandidateViews: results.filter((item) => item.candidateStatus === "no-source-view-detected").length,
  sourceRequestFailures: results.filter((item) => item.candidateStatus === "source-request-failed").length,
  publicationPolicy: "Source availability does not authorize publication. Only exact, physical, rights-cleared photos without third-party watermark may be registered.",
  results,
};

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ ...report, results: undefined, outputPath }, null, 2));
