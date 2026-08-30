import { dynamikCiosaCompleteProducts } from "../src/data/dynamikCiosaCompleteProducts.js";
import {
  dynamikCiosaCatalogRefs,
  dynamikCiosaCompleteCatalogAudit,
} from "../src/data/dynamikCiosaCatalogRefs.generated.js";
import { products } from "../src/lib/products.js";

const normalizeSku = (value) => String(value || "").trim().toUpperCase();
const expectedCounts = {
  "ACCESORIOS DE FRENADO": 1,
  "BALATAS Y ZAPATAS": 732,
  "DISCOS DE FRENO": 79,
  "JUEGO DE EMBRAGUES": 32,
};
const failures = [];

const expectedBySku = new Map();
for (const reference of dynamikCiosaCatalogRefs) {
  const sku = normalizeSku(reference.sku);
  if (!sku) failures.push("Existe una referencia Ciosa sin NPC.");
  if (expectedBySku.has(sku)) failures.push(`NPC duplicado en el manifiesto completo: ${sku}`);
  expectedBySku.set(sku, reference);

  for (const field of ["description", "system", "subgroup", "group", "sourceUrl"]) {
    if (!String(reference[field] || "").trim()) failures.push(`${sku}: falta ${field}.`);
  }
  if (!reference.sourceUrl.startsWith("https://www.ciosa.co/productos/detalle/")) {
    failures.push(`${sku}: la fuente primaria no es una ficha Ciosa Colombia.`);
  }
  if (reference.supplementalSpecifications?.length && !reference.supplementalSourceUrl?.startsWith("https://www.ciosa.com/")) {
    failures.push(`${sku}: hay especificaciones complementarias sin fuente mexicana separada.`);
  }
}

if (dynamikCiosaCompleteCatalogAudit.listedDynamikReferences !== 845) {
  failures.push(`El rastreo no conserva las 845 tarjetas Dynamik declaradas por Ciosa: ${dynamikCiosaCompleteCatalogAudit.listedDynamikReferences}.`);
}
if (dynamikCiosaCompleteCatalogAudit.targetReferences !== 844 || expectedBySku.size !== 844) {
  failures.push(`El universo objetivo debe contener 844 NPC únicos; manifiesto=${expectedBySku.size}, auditoría=${dynamikCiosaCompleteCatalogAudit.targetReferences}.`);
}

for (const [subgroup, expected] of Object.entries(expectedCounts)) {
  const actual = dynamikCiosaCatalogRefs.filter((reference) => reference.subgroup === subgroup).length;
  if (actual !== expected) failures.push(`${subgroup}: se esperaban ${expected} referencias y hay ${actual}.`);
}

const completeProductsBySku = new Map();
for (const product of dynamikCiosaCompleteProducts) {
  const sku = normalizeSku(product.sku);
  if (completeProductsBySku.has(sku)) failures.push(`Producto completo duplicado: ${sku}`);
  completeProductsBySku.set(sku, product);
  if (product.catalogBatch !== "dynamik-ciosa-complete-catalog-20260830") failures.push(`${sku}: lote completo incorrecto.`);
  if (!product.officialSourceUrl?.startsWith("https://www.ciosa.co/productos/detalle/")) failures.push(`${sku}: falta URL oficial colombiana.`);
  if (product.image || product.images?.length || product.imageStatus !== "pending-real-photo") {
    failures.push(`${sku}: el lote base debe permanecer sin visual hasta que una fotografía física exacta sea validada.`);
  }
}
if (completeProductsBySku.size !== expectedBySku.size) {
  failures.push(`La capa de productos completos tiene ${completeProductsBySku.size}; se esperaban ${expectedBySku.size}.`);
}

const publishedBySku = new Map();
for (const product of products.filter((product) => product.brand?.slug === "dynamik")) {
  const sku = normalizeSku(product.sku);
  if (!expectedBySku.has(sku)) continue;
  if (!publishedBySku.has(sku)) publishedBySku.set(sku, []);
  publishedBySku.get(sku).push(product);
}

for (const sku of expectedBySku.keys()) {
  const matches = publishedBySku.get(sku) || [];
  if (matches.length !== 1) failures.push(`${sku}: debe publicarse exactamente una vez y aparece ${matches.length}.`);
  if (matches[0]?.fitmentStatus === "family") failures.push(`${sku}: una referencia física no puede publicarse como ficha de familia.`);
}

const report = {
  expectedDynamikCards: dynamikCiosaCompleteCatalogAudit.listedDynamikReferences,
  targetReferences: expectedBySku.size,
  completeProductRecords: completeProductsBySku.size,
  publishedTargetReferences: publishedBySku.size,
  subgroupCounts: Object.fromEntries(Object.keys(expectedCounts).map((subgroup) => [
    subgroup,
    dynamikCiosaCatalogRefs.filter((reference) => reference.subgroup === subgroup).length,
  ])),
  listingFallbacks: dynamikCiosaCatalogRefs.filter((reference) => reference.dataQuality === "ciosa-co-broken-detail-listing-only").map((reference) => reference.sku),
  supplementalMexicoRecords: dynamikCiosaCatalogRefs.filter((reference) => reference.supplementalSpecifications?.length).length,
  failures,
};

console.log(JSON.stringify(report, null, 2));
if (failures.length) process.exitCode = 1;

