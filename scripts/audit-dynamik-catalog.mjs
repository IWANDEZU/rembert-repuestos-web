import { products } from "../src/lib/products.js";
import { dynamikLaminaRefs } from "../src/data/dynamikLaminasAudit.js";

const target = Number.parseInt(process.env.DYNAMIK_MIN_REFS || "160", 10);
const dynamik = products.filter((product) => product?.brand?.slug === "dynamik");
const realPhotoStatuses = new Set([
  "authentic-product-photo",
  "exact-real-photo",
  "official-catalog-watermarked",
  "real-product-photo",
  "real-source-photo",
  "real-source-watermarked",
  "source-grounded-web-image",
  "user-supplied-product-photo-official-brand-rembert-watermarked",
]);

const skuCounts = new Map();
for (const product of dynamik) {
  const sku = String(product.sku || product.id || "").trim();
  skuCounts.set(sku, [...(skuCounts.get(sku) || []), product.id]);
}

const duplicates = [...skuCounts.entries()]
  .filter(([, ids]) => ids.length > 1)
  .map(([sku, ids]) => ({ sku, ids }));
const byImageStatus = Object.fromEntries(
  [...dynamik.reduce((result, product) => {
    const status = product.imageStatus || "not-declared";
    result.set(status, (result.get(status) || 0) + 1);
    return result;
  }, new Map()).entries()].sort(([left], [right]) => left.localeCompare(right)),
);
const catalogSkus = new Set(dynamik.map((product) => String(product.sku || "").trim()));
const laminaDuplicateSkus = dynamikLaminaRefs
  .map((reference) => reference.sku)
  .filter((sku, index, references) => references.indexOf(sku) !== index);
const missingLaminaSkus = dynamikLaminaRefs
  .map((reference) => reference.sku)
  .filter((sku) => !catalogSkus.has(sku));

const report = {
  scope: "Dynamik only",
  totalProducts: dynamik.length,
  uniqueSkus: skuCounts.size,
  target,
  missingToTarget: Math.max(0, target - skuCounts.size),
  targetMet: skuCounts.size >= target,
  duplicateSkuCount: duplicates.length,
  duplicates,
  realVerifiedPhotoCount: dynamik.filter((product) => realPhotoStatuses.has(product.imageStatus)).length,
  generatedReferenceImageCount: dynamik.filter((product) => product.imageStatus === "generated-reference-image").length,
  imageStatusBreakdown: byImageStatus,
  laminaAudit: {
    sourceSkuCount: dynamikLaminaRefs.length,
    sourceDuplicateSkuCount: new Set(laminaDuplicateSkus).size,
    missingFromCatalogCount: missingLaminaSkus.length,
    missingFromCatalog: missingLaminaSkus,
  },
};

console.log(JSON.stringify(report, null, 2));

if (duplicates.length > 0 || laminaDuplicateSkus.length > 0 || missingLaminaSkus.length > 0) process.exitCode = 1;
