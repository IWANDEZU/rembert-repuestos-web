import { writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { products } from "../src/lib/products.js";

const outputPath = path.resolve(
  process.cwd(),
  process.argv[2] || "docs/catalogos-gti/PENDIENTES_FOTO_EXACTA_2026-08-26.md",
);

const gtiProducts = products.filter((product) => product.brand?.slug === "gti");
const available = gtiProducts.filter((product) => product.inStock && Number(product.stock) > 0);
const quoteOnly = gtiProducts.filter((product) => product.availabilityLabel === "Sin existencia · consultar");
const EXACT_IMAGE_STATUSES = new Set([
  "real-source-photo",
  "real-source-watermarked",
  "authentic-product-photo",
  "exact-real-photo",
]);
const GENERATED_IMAGE_STATUSES = new Set(["generated-reference-image"]);
const COVERED_IMAGE_STATUSES = new Set([...EXACT_IMAGE_STATUSES, ...GENERATED_IMAGE_STATUSES]);
const pendingAvailable = available.filter((product) => !COVERED_IMAGE_STATUSES.has(product.imageStatus));
const pendingQuoteOnly = quoteOnly.filter((product) => !COVERED_IMAGE_STATUSES.has(product.imageStatus));
const exactAvailable = available.filter((product) => EXACT_IMAGE_STATUSES.has(product.imageStatus));
const generatedReferences = gtiProducts.filter((product) => GENERATED_IMAGE_STATUSES.has(product.imageStatus));
const unapprovedSynthetic = gtiProducts.filter((product) => /ai-|family-reference|illustration/i.test(product.imageStatus || ""));

// La estructura del catálogo es estable; la cobertura fotográfica cambia en
// cada lote y por tanto debe calcularse, no quedar congelada en este script.
const expectedCatalog = {
  total: 464,
  available: 48,
  quoteOnly: 416,
};
const actual = {
  total: gtiProducts.length,
  available: available.length,
  quoteOnly: quoteOnly.length,
  exactAvailable: exactAvailable.length,
  generatedReferences: generatedReferences.length,
  pendingAvailable: pendingAvailable.length,
  pendingQuoteOnly: pendingQuoteOnly.length,
};

for (const [key, value] of Object.entries(expectedCatalog)) {
  if (actual[key] !== value) throw new Error(`Conteo GTI inesperado para ${key}: ${actual[key]} (esperado ${value})`);
}
if (unapprovedSynthetic.length) {
  throw new Error(`Hay ${unapprovedSynthetic.length} fichas GTI con estado sintético no autorizado`);
}

const referenceList = (catalog) => catalog
  .map((product) => `- \`${product.sku}\` — ${product.name}`)
  .join("\n");

const report = `# Pendientes de foto exacta GTI AUTOPARTS — 2026-08-26

## Resumen público

- Referencias GTI publicadas: **${actual.total}**.
- Con existencia, separadas al inicio: **${actual.available}**.
- Catálogo externo sin existencia, consultar: **${actual.quoteOnly}**.
- Con foto trazable de la referencia exacta: **${actual.exactAvailable}**.
- Con imagen generada de referencia, identificada como tal: **${actual.generatedReferences}**.
- Foto exacta pendiente entre las disponibles: **${actual.pendingAvailable}**.
- Foto exacta pendiente en el catálogo externo: **${actual.pendingQuoteOnly}**.
- Pendientes totales de foto exacta: **${actual.pendingAvailable + actual.pendingQuoteOnly}**.
- Fichas GTI con estado sintético no autorizado: **0**.

## Regla de cierre

Una referencia sólo sale de los pendientes visuales cuando tiene una foto exacta trazable o una imagen generada de referencia identificada explícitamente. Sólo una foto trazable puede cerrar el pendiente de autenticidad. Una pieza parecida no es evidencia suficiente.

## Disponibles pendientes de foto exacta (${actual.pendingAvailable})

${referenceList(pendingAvailable)}

## Catálogo externo pendiente de foto exacta (${actual.pendingQuoteOnly})

${referenceList(pendingQuoteOnly)}
`;

await writeFile(outputPath, report, "utf8");
console.log(JSON.stringify({ ...actual, generatedReferences: generatedReferences.length, unapprovedSynthetic: unapprovedSynthetic.length, outputPath }, null, 2));
