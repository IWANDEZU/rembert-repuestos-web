import { catalogoProveedoresProducts } from "../src/data/catalogoProveedoresProducts.js";
import {
  dynamikBrakeCoverageAudit,
  dynamikBrakeCoverageRefs,
} from "../src/data/dynamikBrakeCoverageRefs.js";
import { products } from "../src/lib/products.js";

const BATCH = "dynamik-brake-coverage-20260830";
const normalizeSku = (value) => String(value || "").trim().toUpperCase().replaceAll(/[^A-Z0-9]/g, "");
const isDynamik = (product) => String(product?.brand?.slug || product?.brand?.name || "").trim().toLowerCase() === "dynamik";

const countBy = (items, valueOf) => {
  const result = new Map();
  for (const item of items) {
    const key = valueOf(item);
    result.set(key, (result.get(key) || 0) + 1);
  }
  return result;
};

const manifestSkuCounts = countBy(dynamikBrakeCoverageRefs, (reference) => normalizeSku(reference.sku));
const rawBatchProducts = catalogoProveedoresProducts.filter((product) => product.catalogBatch === BATCH);
const rawSkuCounts = countBy(rawBatchProducts, (product) => normalizeSku(product.sku));
const publishedBatchProducts = products.filter((product) => product.catalogBatch === BATCH);
const publishedSkuCounts = countBy(publishedBatchProducts, (product) => normalizeSku(product.sku));
const dynamikProducts = products.filter(isDynamik);
const dynamikSkuCounts = countBy(dynamikProducts, (product) => normalizeSku(product.sku || product.id));

const duplicateManifestSkus = [...manifestSkuCounts.entries()]
  .filter(([, count]) => count !== 1)
  .map(([sku, count]) => ({ sku, count }));
const duplicateRawSkus = [...rawSkuCounts.entries()]
  .filter(([, count]) => count !== 1)
  .map(([sku, count]) => ({ sku, count }));
const duplicatePublishedBatchSkus = [...publishedSkuCounts.entries()]
  .filter(([, count]) => count !== 1)
  .map(([sku, count]) => ({ sku, count }));
const duplicateDynamikSkus = [...dynamikSkuCounts.entries()]
  .filter(([, count]) => count !== 1)
  .map(([sku, count]) => ({ sku, count }));

const missingFromRaw = dynamikBrakeCoverageRefs
  .map((reference) => normalizeSku(reference.sku))
  .filter((sku) => rawSkuCounts.get(sku) !== 1);
const missingFromPublished = dynamikBrakeCoverageRefs
  .map((reference) => normalizeSku(reference.sku))
  .filter((sku) => publishedSkuCounts.get(sku) !== 1);
const unexpectedPublished = publishedBatchProducts
  .map((product) => normalizeSku(product.sku))
  .filter((sku) => !manifestSkuCounts.has(sku));

const hasMedia = (product) => Boolean(product.image || (Array.isArray(product.images) && product.images.length > 0));
const realPhotoStatuses = new Set(["exact-real-photo", "official-catalog-watermarked", "real-source-photo"]);
const hasExactRealPhoto = (product) => realPhotoStatuses.has(product.imageStatus) && Boolean(product.image);
const hasSyntheticReference = (product) => product.imageStatus === "generated-reference-image" && Boolean(product.image);
const invalidMedia = dynamikProducts
  .filter((product) => hasMedia(product) ? !hasExactRealPhoto(product) && !hasSyntheticReference(product) : product.imageStatus !== "pending-real-photo")
  .map((product) => ({ sku: product.sku, imageStatus: product.imageStatus, image: product.image || null, images: product.images?.length || 0 }));

const coverageByBrand = Object.fromEntries(
  Object.entries(dynamikBrakeCoverageAudit.coverageByBrand || {}).map(([brand, coverage]) => {
    const publishedInBatch = dynamikBrakeCoverageRefs.filter((reference) => reference.marcas.includes(brand)).length;
    return [brand, {
      source: Number(coverage.source || 0),
      publishedBeforeBatch: Number(coverage.published || 0),
      expectedInBatch: Number(coverage.missing || 0),
      publishedInBatch,
      coveredAfterBatch: Number(coverage.published || 0) + publishedInBatch,
    }];
  }),
);

const badBrandCoverage = Object.entries(coverageByBrand)
  .filter(([, coverage]) => coverage.expectedInBatch !== coverage.publishedInBatch || coverage.coveredAfterBatch !== coverage.source)
  .map(([brand, coverage]) => ({ brand, ...coverage }));

const expectedBatchSize = Number(dynamikBrakeCoverageAudit.result?.referencesAddedByBatch || 0);
const expectedMinimumDynamikSkus = Number(dynamikBrakeCoverageAudit.result?.scopedReferences || 0);
const report = {
  scope: "Dynamik · frenos por NPC",
  expectedBatchSize,
  rawBatchProducts: rawBatchProducts.length,
  publishedBatchProducts: publishedBatchProducts.length,
  uniqueDynamikSkus: dynamikSkuCounts.size,
  expectedMinimumDynamikSkus,
  realVerifiedPhotoCount: dynamikProducts.filter(hasExactRealPhoto).length,
  syntheticReferenceImageCount: dynamikProducts.filter(hasSyntheticReference).length,
  pendingRealPhotoCount: dynamikProducts.filter((product) => !hasExactRealPhoto(product)).length,
  mediaPolicy: "Fotos físicas exactas con NPC validado y fuente trazable; las ilustraciones sintéticas autorizadas se publican con etiqueta visible y nunca cuentan como foto real.",
  coverageByBrand,
  failures: {
    duplicateManifestSkus,
    duplicateRawSkus,
    duplicatePublishedBatchSkus,
    duplicateDynamikSkus,
    missingFromRaw,
    missingFromPublished,
    unexpectedPublished,
    invalidMedia,
    badBrandCoverage,
    insufficientDynamikCoverage: dynamikSkuCounts.size < expectedMinimumDynamikSkus,
  },
};

console.log(JSON.stringify(report, null, 2));

const failed = [
  duplicateManifestSkus,
  duplicateRawSkus,
  duplicatePublishedBatchSkus,
  duplicateDynamikSkus,
  missingFromRaw,
  missingFromPublished,
  unexpectedPublished,
  invalidMedia,
  badBrandCoverage,
].some((items) => items.length > 0)
  || rawBatchProducts.length !== expectedBatchSize
  || publishedBatchProducts.length !== expectedBatchSize
  || dynamikSkuCounts.size < expectedMinimumDynamikSkus;

if (failed) process.exitCode = 1;
