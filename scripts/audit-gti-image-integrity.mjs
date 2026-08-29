import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { products } from "../src/lib/products.js";

const REAL_STATUSES = new Set([
  "real-source-photo",
  "real-source-watermarked",
  "authentic-product-photo",
  "exact-real-photo",
]);
const GENERATED_STATUS = "generated-reference-image";
const publicDir = path.resolve(process.cwd(), "public");
const gtiProducts = products.filter((product) => product.brand?.slug === "gti");

const imageFile = (product) => {
  const image = String(product.image || "");
  if (!image.startsWith("/") || image.startsWith("//")) return null;
  const file = path.resolve(publicDir, `.${image}`);
  return file.startsWith(`${publicDir}${path.sep}`) ? file : null;
};

const catalogCanvasEdgeBrightness = async (file) => {
  const { data, info } = await sharp(file)
    .resize(48, 48, { fit: "fill" })
    .flatten({ background: "#ffffff" })
    .raw()
    .toBuffer({ resolveWithObject: true });
  const patchSize = 5;
  // Las imágenes generadas llevan bandas de identificación arriba y abajo.
  // Se mide el lienzo del producto, dentro de esas bandas, en sus cuatro bordes.
  const upperCanvas = Math.round(info.height * 0.14);
  const lowerCanvas = Math.round(info.height * 0.76);
  const origins = [
    [0, upperCanvas],
    [info.width - patchSize, upperCanvas],
    [0, lowerCanvas],
    [info.width - patchSize, lowerCanvas],
  ];
  return origins.map(([left, top]) => {
    let total = 0;
    let count = 0;
    for (let y = top; y < top + patchSize; y += 1) {
      for (let x = left; x < left + patchSize; x += 1) {
        const offset = (y * info.width + x) * info.channels;
        total += (data[offset] + data[offset + 1] + data[offset + 2]) / 3;
        count += 1;
      }
    }
    return Number((total / count).toFixed(1));
  });
};

const skuGroups = new Map();
for (const product of gtiProducts) skuGroups.set(product.sku, [...(skuGroups.get(product.sku) || []), product.id]);
const duplicateSkus = [...skuGroups.entries()].filter(([, ids]) => ids.length > 1);

const fileRows = [];
for (const product of gtiProducts) {
  const file = imageFile(product);
  if (!file) {
    fileRows.push({ sku: product.sku, error: "invalid-public-path" });
    continue;
  }
  try {
    const buffer = await fs.readFile(file);
    fileRows.push({
      sku: product.sku,
      status: product.imageStatus,
      image: product.image,
      file,
      sha256: crypto.createHash("sha256").update(buffer).digest("hex"),
      canvasEdges: await catalogCanvasEdgeBrightness(file),
    });
  } catch {
    fileRows.push({ sku: product.sku, image: product.image, error: "missing-or-invalid-image" });
  }
}

const fileErrors = fileRows.filter((row) => row.error);
const hashGroups = new Map();
for (const row of fileRows.filter((entry) => entry.sha256)) {
  hashGroups.set(row.sha256, [...(hashGroups.get(row.sha256) || []), row]);
}
const duplicateImageGroups = [...hashGroups.values()].filter((entries) => entries.length > 1);

const realProducts = gtiProducts.filter((product) => REAL_STATUSES.has(product.imageStatus));
const generatedProducts = gtiProducts.filter((product) => product.imageStatus === GENERATED_STATUS);
const realWithTraceability = realProducts.filter((product) => product.sourceRecord);
const realTraceabilityFailures = realWithTraceability.filter((product) => (
  product.sourceRecord.exactReferenceConfirmed !== true
  || product.sourceRecord.usageAuthorized !== true
  || !product.sourceRecord.referenceEvidence
  || !product.sourceRecord.sourceType
  || !Array.isArray(product.sourceRecord.pages)
  || product.sourceRecord.pages.length === 0
));
const generatedTraceabilityFailures = generatedProducts.filter((product) => (
  product.sourceRecord?.type !== "ai-generated-reference"
  || !product.sourceRecord?.generationPrompt
  || !/^[a-f0-9]{64}$/i.test(product.sourceRecord?.sourceSha256 || "")
  || !/no es fotograf[ií]a original/i.test(product.imageDisclosure || "")
  || !product.images?.some((image) => /no es fotograf[ií]a original/i.test(image.alt || ""))
));

const generatedRows = fileRows.filter((row) => row.status === GENERATED_STATUS);
const generatedNonWhiteCanvas = generatedRows.filter((row) => row.canvasEdges?.some((value) => value < 235));

const report = {
  totalGtiProducts: gtiProducts.length,
  uniqueSkus: skuGroups.size,
  duplicateSkus: duplicateSkus.length,
  readableLocalImages: fileRows.length - fileErrors.length,
  invalidLocalImages: fileErrors.length,
  duplicateImageGroupsAllStatuses: duplicateImageGroups.length,
  realImages: realProducts.length,
  realImagesWithTraceability: realWithTraceability.length,
  legacyRealImagesWithoutSourceRecord: realProducts.length - realWithTraceability.length,
  realTraceabilityFailures: realTraceabilityFailures.length,
  generatedImages: generatedProducts.length,
  generatedTraceabilityFailures: generatedTraceabilityFailures.length,
  generatedImagesWithWhiteCatalogCanvas: generatedRows.length - generatedNonWhiteCanvas.length,
  generatedImagesWithNonWhiteCatalogCanvas: generatedNonWhiteCanvas.length,
  details: {
    duplicateSkus,
    fileErrors,
    duplicateImageGroups: duplicateImageGroups.map((entries) => entries.map(({ sku, image }) => ({ sku, image }))),
    realTraceabilityFailures: realTraceabilityFailures.map(({ sku }) => sku),
    generatedTraceabilityFailures: generatedTraceabilityFailures.map(({ sku }) => sku),
    generatedNonWhiteCatalogCanvas: generatedNonWhiteCanvas.map(({ sku, image, canvasEdges }) => ({ sku, image, canvasEdges })),
  },
};

console.log(JSON.stringify(report, null, 2));
if (
  gtiProducts.length !== 464
  || duplicateSkus.length
  || fileErrors.length
  || duplicateImageGroups.length
  || realTraceabilityFailures.length
  || generatedTraceabilityFailures.length
  || generatedNonWhiteCanvas.length
) process.exitCode = 1;
