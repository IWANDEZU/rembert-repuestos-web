import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { products } from "../src/lib/products.js";

const args = process.argv.slice(2);
const requireComplete = args.includes("--require-complete");
const requireAuthentic = args.includes("--require-authentic");
const verbose = args.includes("--verbose");
const REAL_GTI_STATUSES = new Set([
  "real-source-photo",
  "real-source-watermarked",
  "authentic-product-photo",
  "exact-real-photo",
]);
const GENERATED_GTI_STATUSES = new Set([
  "generated-reference-image",
]);
const COVERED_GTI_STATUSES = new Set([...REAL_GTI_STATUSES, ...GENERATED_GTI_STATUSES]);

const gtiProducts = products.filter((product) => product.brand?.slug === "gti");
const realProducts = gtiProducts.filter((product) => REAL_GTI_STATUSES.has(product.imageStatus));
const generatedProducts = gtiProducts.filter((product) => GENERATED_GTI_STATUSES.has(product.imageStatus));
const missing = gtiProducts.filter((product) => !COVERED_GTI_STATUSES.has(product.imageStatus));
const unexpectedImage = gtiProducts.filter((product) => {
  const image = String(product.image || "");
  return REAL_GTI_STATUSES.has(product.imageStatus) && (!image || image.includes("gti-foto-real-pendiente"));
});
const unexpectedVisualImage = gtiProducts.filter((product) => {
  const image = String(product.image || "");
  return COVERED_GTI_STATUSES.has(product.imageStatus) && (!image || image.includes("gti-foto-real-pendiente"));
});

const publicDir = path.resolve(process.cwd(), "public");
const localImageIdentity = async (product) => {
  const image = String(product.image || "");
  if (!image.startsWith("/") || image.startsWith("//")) {
    return { sku: product.sku, image, error: "La imagen de catálogo marcada como cubierta no es un archivo local" };
  }
  const file = path.resolve(publicDir, `.${image}`);
  if (!file.startsWith(`${publicDir}${path.sep}`)) {
    return { sku: product.sku, image, error: "La ruta de la imagen sale del directorio público" };
  }
  try {
    const buffer = await fs.readFile(file);
    return { sku: product.sku, image, hash: crypto.createHash("sha256").update(buffer).digest("hex") };
  } catch {
    return { sku: product.sku, image, error: "No se encontró el archivo local de la imagen marcada como cubierta" };
  }
};

const coveredImages = await Promise.all(
  gtiProducts.filter((product) => COVERED_GTI_STATUSES.has(product.imageStatus)).map(localImageIdentity),
);
const invalidCoveredImages = coveredImages.filter((entry) => entry.error);
const realImages = coveredImages.filter((entry) => realProducts.some((product) => product.sku === entry.sku));
const invalidRealImages = realImages.filter((entry) => entry.error);
const imagesByHash = new Map();
for (const entry of realImages.filter((entry) => entry.hash)) {
  imagesByHash.set(entry.hash, [...(imagesByHash.get(entry.hash) || []), entry]);
}
const duplicateExactPhotoGroups = [...imagesByHash.values()]
  .filter((entries) => entries.length > 1)
  .map((entries) => ({ hash: entries[0].hash, products: entries.map(({ sku, image }) => ({ sku, image })) }));

const coveredImagesByHash = new Map();
for (const entry of coveredImages.filter((entry) => entry.hash)) {
  coveredImagesByHash.set(entry.hash, [...(coveredImagesByHash.get(entry.hash) || []), entry]);
}
const duplicateCoveredImageGroups = [...coveredImagesByHash.values()]
  .filter((entries) => entries.length > 1)
  .map((entries) => ({ hash: entries[0].hash, products: entries.map(({ sku, image }) => ({ sku, image })) }));

const report = {
  totalGtiCards: gtiProducts.length,
  exactRealPhotos: realProducts.length,
  generatedReferenceImages: generatedProducts.length,
  cardsWithReferenceVisual: realProducts.length + generatedProducts.length,
  pendingWithoutReferenceVisual: missing.length,
  inconsistentRealStatus: unexpectedImage.length,
  inconsistentCoveredStatus: unexpectedVisualImage.length,
  invalidRealImages: invalidRealImages.length,
  invalidCoveredImages: invalidCoveredImages.length,
  duplicateExactPhotoGroups: duplicateExactPhotoGroups.length,
  duplicateCoveredImageGroups: duplicateCoveredImageGroups.length,
  ...(verbose ? {
    pending: missing.map((product) => ({ sku: product.sku, name: product.name, imageStatus: product.imageStatus, image: product.image })),
    invalidRealImageDetails: invalidRealImages,
    invalidCoveredImageDetails: invalidCoveredImages,
    duplicateExactPhotoDetails: duplicateExactPhotoGroups,
    duplicateCoveredImageDetails: duplicateCoveredImageGroups,
  } : {}),
};

console.log(JSON.stringify(report, null, 2));
if (requireComplete && (missing.length || unexpectedVisualImage.length || invalidCoveredImages.length || duplicateCoveredImageGroups.length)) {
  process.exitCode = 1;
}
if (requireAuthentic && (generatedProducts.length || missing.length || unexpectedImage.length || invalidRealImages.length || duplicateExactPhotoGroups.length)) {
  process.exitCode = 1;
}
