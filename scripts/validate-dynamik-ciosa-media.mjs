import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import dynamikCiosaPhotoAssets from "../src/data/dynamikCiosaPhotoAssets.generated.js";
import { dynamikCiosaCatalogRefs } from "../src/data/dynamikCiosaCatalogRefs.generated.js";
import { products } from "../src/lib/products.js";

const rootDir = resolve(import.meta.dirname, "..");
const reportPath = resolve(rootDir, "tmp", "dynamik-ciosa-media-validation-report.json");
const requireFullPhotoCoverage = /^(1|true|yes)$/i.test(String(process.env.DYNAMIK_REQUIRE_FULL_PHOTO_COVERAGE || ""));
const failures = [];
const technicalFailures = [];
let checkedViews = 0;
let exclusiveViews = 0;
const placeholderHashes = new Set([
  "ca1a24af8b6e37cb8a41b8b22c8b7838b500de4a89105b604ec95b6769f95a15",
  "5022e85b43813dcb0debd8ee66fc0d68aaa03c7265331c5ab7afde9f3de2d14f",
]);

for (const record of Object.values(dynamikCiosaPhotoAssets)) {
  if (!record?.sku || !Array.isArray(record.views)) {
    failures.push({ sku: record?.sku || null, reason: "registro inválido" });
    continue;
  }
  for (const view of record.views) {
    checkedViews += 1;
    if (!view.isSharedAcrossSkus) exclusiveViews += 1;
    const relativePath = String(view.url || "").replace(/^\//, "");
    const buffer = await readFile(resolve(rootDir, "public", relativePath)).catch(() => null);
    if (!buffer) {
      failures.push({ sku: record.sku, url: view.url, reason: "archivo ausente" });
      continue;
    }
    const sha256 = createHash("sha256").update(buffer).digest("hex");
    if (sha256 !== view.sha256) failures.push({ sku: record.sku, url: view.url, reason: "hash distinto" });
    if (placeholderHashes.has(sha256)) failures.push({ sku: record.sku, url: view.url, reason: "placeholder de Ciosa importado como producto" });
    if (!view.sourceUrl?.includes(record.sku)) failures.push({ sku: record.sku, url: view.url, reason: "fuente no ligada al NPC" });
    if (Number(view.width) < 300 || Number(view.height) < 300) failures.push({ sku: record.sku, url: view.url, reason: "resolución insuficiente" });
    if (view.isSharedAcrossSkus && view.mediaType !== "generic-packaging") {
      failures.push({ sku: record.sku, url: view.url, reason: "recurso compartido no marcado como empaque genérico" });
    }
    if (!view.isSharedAcrossSkus && !["photo", "technical-diagram"].includes(view.mediaType)) {
      failures.push({ sku: record.sku, url: view.url, reason: "vista exclusiva sin clasificación foto/plano" });
    }
  }
  const hasExactPhoto = record.views.some((view) => !view.isSharedAcrossSkus && view.mediaType === "photo");
  if ((record.imageStatus === "official-catalog-watermarked") !== hasExactPhoto) {
    failures.push({ sku: record.sku, reason: "estado de imagen no coincide con la existencia de una foto exacta" });
  }
}

const targetSkus = new Set(dynamikCiosaCatalogRefs.map((reference) => reference.sku));
const dynamik = products.filter((product) => product?.brand?.slug === "dynamik" && targetSkus.has(product.sku));
const realPhotoStatuses = new Set(["exact-real-photo", "official-catalog-watermarked", "real-source-photo"]);
const physicalReferences = dynamik;
for (const product of physicalReferences) {
  const record = dynamikCiosaPhotoAssets[product.sku];
  const requiredTechnicalFields = ["description", "system", "subgroup", "group"];
  if (!record) {
    technicalFailures.push({ sku: product.sku, reason: "registro técnico Ciosa ausente" });
    continue;
  }
  if (!record.sourceProof?.detailUrl?.startsWith("https://www.ciosa.co/productos/detalle/")) {
    technicalFailures.push({ sku: product.sku, reason: "la fuente primaria del manifiesto no es Ciosa Colombia" });
  }
  if (String(record.technical?.npc || "").toUpperCase() !== product.sku) {
    technicalFailures.push({ sku: product.sku, reason: "NPC técnico no coincide" });
  }
  for (const field of requiredTechnicalFields) {
    if (!String(record.technical?.[field] || "").trim()) {
      technicalFailures.push({ sku: product.sku, reason: `campo técnico ausente: ${field}` });
    }
  }
  if (!/^https:\/\/www\.ciosa\.(?:co|com)\/productos\/detalle\//i.test(product.sourceUrl || "")) {
    technicalFailures.push({ sku: product.sku, reason: "fuente técnica no publicada en la ficha" });
  }
  const attributeNames = new Set((product.attributes || []).map((attribute) => String(attribute.name || "").toLowerCase()));
  for (const name of ["descripción ciosa", "sistema", "subgrupo", "grupo", "fuente técnica"]) {
    if (!attributeNames.has(name)) technicalFailures.push({ sku: product.sku, reason: `atributo técnico no publicado: ${name}` });
  }
  if (product.imageStatus === "official-catalog-watermarked") {
    const exactPhotoUrls = new Set((record.views || [])
      .filter((view) => !view.isSharedAcrossSkus && view.mediaType === "photo")
      .map((view) => view.url));
    if (!exactPhotoUrls.has(product.image)) {
      failures.push({ sku: product.sku, url: product.image, reason: "la portada Ciosa no es una foto real del NPC exacto" });
    }
    if (product.images?.[0]?.mediaType !== "photo") {
      failures.push({ sku: product.sku, url: product.image, reason: "la galería no prioriza una foto real" });
    }
  }
  if (product.imageStatus === "pending-real-photo" && (product.image || product.images?.length)) {
    failures.push({ sku: product.sku, url: product.image, reason: "una ficha pendiente publica un plano o recurso no fotográfico como imagen" });
  }
}
const pendingReferences = physicalReferences
  .filter((product) => !realPhotoStatuses.has(product.imageStatus))
  .map((product) => ({ sku: product.sku, imageStatus: product.imageStatus, name: product.name }));

const subgroupPhotoCoverage = Object.fromEntries([
  ...new Set(dynamikCiosaCatalogRefs.map((reference) => reference.subgroup)),
].map((subgroup) => {
  const subgroupSkus = new Set(dynamikCiosaCatalogRefs.filter((reference) => reference.subgroup === subgroup).map((reference) => reference.sku));
  const subgroupProducts = physicalReferences.filter((product) => subgroupSkus.has(product.sku));
  const withPhoto = subgroupProducts.filter((product) => realPhotoStatuses.has(product.imageStatus)).length;
  return [subgroup, { total: subgroupProducts.length, withPhoto, pending: subgroupProducts.length - withPhoto }];
}));
const report = {
  ciosaRecords: Object.keys(dynamikCiosaPhotoAssets).length,
  checkedViews,
  exclusiveViews,
  physicalReferences: physicalReferences.length,
  referencesWithRealPhoto: physicalReferences.filter((product) => realPhotoStatuses.has(product.imageStatus)).length,
  referencesWithCompleteCiosaTechnicalData: physicalReferences.length - new Set(technicalFailures.map((failure) => failure.sku)).size,
  pendingOrSyntheticReferences: pendingReferences.length,
  pendingReferences,
  subgroupPhotoCoverage,
  integrityFailures: failures,
  technicalFailures,
};
await mkdir(resolve(rootDir, "tmp"), { recursive: true });
await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(JSON.stringify({
  ciosaRecords: report.ciosaRecords,
  targetReferences: physicalReferences.length,
  checkedViews,
  referencesWithRealPhoto: report.referencesWithRealPhoto,
  pendingOrSyntheticReferences: report.pendingOrSyntheticReferences,
  subgroupPhotoCoverage,
  integrityFailures: failures.length,
  technicalFailures: technicalFailures.length,
  fullPhotoCoverageRequired: requireFullPhotoCoverage,
  reportPath,
}, null, 2));
if (failures.length || technicalFailures.length || (requireFullPhotoCoverage && pendingReferences.length)) process.exitCode = 1;
