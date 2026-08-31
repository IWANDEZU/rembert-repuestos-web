import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { products } from "../src/lib/products.js";
import { productImageOverrides } from "../src/data/productImageOverrides.js";
import {
  inferProductPartFamily,
  isGeneratedImageOverrideCompatible,
  normalizeImageEvidenceKey,
} from "../src/lib/generatedImageEvidence.js";
import {
  BRAND_TREATMENT_VERSION,
  COLOR_POLICY,
  MAX_ORANGE_RATIO,
  measureOrangeRatio,
} from "./lib/branded-image-policy.mjs";

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, "public");
const MANIFEST_FILE = path.join(PUBLIC_DIR, "catalogo-generated-branded", "manifest.json");
const manifest = JSON.parse(await fs.readFile(MANIFEST_FILE, "utf8"));
const expected = {
  ads: {
    publicPrefix: "/catalogo-ads/branded/",
    badgeVariant: "catalog-blue-wordmark",
    badgeAsset: "/brands/ads-product-logo-blue-catalog.png",
    badgePath: path.join(PUBLIC_DIR, "brands", "ads-product-logo-blue-catalog.png"),
  },
  gti: {
    publicPrefix: "/catalogo-gti/generated-branded/",
    badgeVariant: "yellow-on-blue-capsule",
    badgeAsset: "/brands/gti-product-logo-capsule.svg",
    badgePath: path.join(PUBLIC_DIR, "brands", "gti-product-logo-capsule.svg"),
  },
};
const MAX_BADGE_MEAN_ERROR = 12;
const MIN_SHORT_EDGE = 360;
const MIN_LONG_EDGE = 800;

const failures = [];
const counts = { ads: 0, gti: 0 };
const totals = { ads: 0, gti: 0 };
const statusCounts = { ads: {}, gti: {} };
const outputUrls = new Set();
const generatedSkuKeys = new Set();
const badgeHashes = new Map();

const sha256 = (buffer) => crypto.createHash("sha256").update(buffer).digest("hex");

async function sha256File(filePath) {
  return sha256(await fs.readFile(filePath));
}

async function expectedBadgeHash(rule) {
  if (!badgeHashes.has(rule.badgePath)) badgeHashes.set(rule.badgePath, await sha256File(rule.badgePath));
  return badgeHashes.get(rule.badgePath);
}

async function measureBadgeMeanError(filePath, badgePath) {
  const actual = await sharp(filePath, { limitInputPixels: 60_000_000 })
    .extract({ left: 36, top: 32, width: 300, height: 110 })
    .flatten({ background: "#ffffff" })
    .removeAlpha()
    .raw()
    .toBuffer();
  const expectedBadge = await sharp(badgePath)
    .resize({ width: 300, height: 110, fit: "contain" })
    .flatten({ background: "#ffffff" })
    .removeAlpha()
    .raw()
    .toBuffer();
  if (actual.length !== expectedBadge.length) return Number.POSITIVE_INFINITY;
  let absoluteError = 0;
  for (let index = 0; index < actual.length; index += 1) {
    absoluteError += Math.abs(actual[index] - expectedBadge[index]);
  }
  return absoluteError / actual.length;
}

function resolvePublicAsset(publicUrl, label) {
  if (!publicUrl?.startsWith("/")) {
    failures.push(`${label}: imagen pública inválida o ausente`);
    return null;
  }
  const filePath = path.resolve(PUBLIC_DIR, publicUrl.slice(1));
  const relative = path.relative(PUBLIC_DIR, filePath);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    failures.push(`${label}: ruta fuera de public/`);
    return null;
  }
  return filePath;
}

for (const product of products) {
  const slug = product?.brand?.slug;
  if (!expected[slug]) continue;
  totals[slug] += 1;
  const status = product.imageStatus || "missing-status";
  statusCounts[slug][status] = (statusCounts[slug][status] || 0) + 1;
  if (!product.image || /(?:foto-real-pendiente|placeholder|sin-imagen|image-pending)/i.test(product.image)) {
    failures.push(`${product.sku}: ficha ${slug.toUpperCase()} sin imagen útil`);
    continue;
  }
  const catalogImagePath = resolvePublicAsset(product.image, product.sku);
  if (catalogImagePath) {
    try {
      const stats = await fs.stat(catalogImagePath);
      const metadata = await sharp(catalogImagePath).metadata();
      if (!stats.isFile() || stats.size < 7_000) failures.push(`${product.sku}: recurso de catálogo ausente o demasiado pequeño`);
      const shortEdge = Math.min(metadata.width || 0, metadata.height || 0);
      const longEdge = Math.max(metadata.width || 0, metadata.height || 0);
      if (shortEdge < MIN_SHORT_EDGE || longEdge < MIN_LONG_EDGE) {
        failures.push(`${product.sku}: imagen ${metadata.width}x${metadata.height}; mínimo ${MIN_SHORT_EDGE}px en lado corto y ${MIN_LONG_EDGE}px en lado largo`);
      }
    } catch (error) {
      failures.push(`${product.sku}: ${error.message}`);
    }
  }
  if (product.imageStatus !== "generated-reference-image") continue;
  counts[slug] += 1;
  const rule = expected[slug];
  const skuKey = normalizeImageEvidenceKey(product.sku);
  generatedSkuKeys.add(skuKey);
  const override = productImageOverrides[skuKey];
  const treatment = override?.sourceRecord?.brandTreatment;
  const manifestRecord = manifest?.images?.[skuKey];
  if (!product.image?.startsWith(rule.publicPrefix)) {
    failures.push(`${product.sku}: ruta no marcada para ${slug}: ${product.image || "sin imagen"}`);
    continue;
  }
  if (outputUrls.has(product.image)) failures.push(`${product.sku}: imagen reutilizada ${product.image}`);
  outputUrls.add(product.image);
  if (treatment?.version !== BRAND_TREATMENT_VERSION || treatment?.badgeVariant !== rule.badgeVariant) {
    failures.push(`${product.sku}: falta evidencia de tratamiento de marca ${rule.badgeVariant}`);
  }
  if (treatment?.badgeAsset !== rule.badgeAsset) failures.push(`${product.sku}: activo de logotipo incorrecto`);
  if (treatment?.colorPolicy !== COLOR_POLICY) {
    failures.push(`${product.sku}: falta política de color ${COLOR_POLICY}`);
  }
  if (!isGeneratedImageOverrideCompatible(product, override)) failures.push(`${product.sku}: override generado incompatible con SKU, marca o familia`);
  if (!override?.sourceRecord?.generationPrompt || override?.sourceRecord?.generationPromptStatus !== "recorded") {
    failures.push(`${product.sku}: prompt de generación no auditable`);
  }
  if (override?.sourceRecord?.skuKey !== skuKey || override?.sourceRecord?.brandSlug !== slug) {
    failures.push(`${product.sku}: identidad estructurada de SKU/marca inconsistente`);
  }
  if (override?.sourceRecord?.compatibility?.partFamily !== inferProductPartFamily(product)) {
    failures.push(`${product.sku}: familia estructurada no coincide con el producto`);
  }
  if (slug === "ads" && override?.sourceRecord?.geometryEvidence?.publishedAsPhysicalPhoto !== false) {
    failures.push(`${product.sku}: falta declaración cross-brand no física`);
  }
  if (!manifestRecord || manifestRecord.outputImage !== product.image || manifestRecord.skuKey !== skuKey) {
    failures.push(`${product.sku}: manifiesto y override no coinciden`);
  }
  const filePath = resolvePublicAsset(product.image, product.sku);
  if (!filePath) continue;
  try {
    const stats = await fs.stat(filePath);
    if (!stats.isFile() || stats.size < 15_000) failures.push(`${product.sku}: archivo ausente o demasiado pequeño`);
    const metadata = await sharp(filePath).metadata();
    if (metadata.width !== 1200 || metadata.height !== 1200) failures.push(`${product.sku}: tamaño ${metadata.width}x${metadata.height}, esperado 1200x1200`);
    const outputSha256 = await sha256File(filePath);
    if (treatment?.outputSha256 !== outputSha256 || manifestRecord?.outputSha256 !== outputSha256) {
      failures.push(`${product.sku}: SHA-256 de salida no coincide`);
    }
    const badgeSha256 = await expectedBadgeHash(rule);
    if (treatment?.badgeSha256 !== badgeSha256 || manifestRecord?.badgeSha256 !== badgeSha256) {
      failures.push(`${product.sku}: SHA-256 del logotipo no coincide`);
    }
    const badgeMeanError = await measureBadgeMeanError(filePath, rule.badgePath);
    if (badgeMeanError > MAX_BADGE_MEAN_ERROR) {
      failures.push(`${product.sku}: el logotipo ${rule.badgeVariant} no coincide visualmente (error medio ${badgeMeanError.toFixed(2)})`);
    }
    const sourcePath = resolvePublicAsset(treatment?.sourceImage, `${product.sku} fuente`);
    if (sourcePath) {
      const sourceSha256 = await sha256File(sourcePath);
      if (treatment?.sourceSha256 !== sourceSha256 || manifestRecord?.sourceSha256 !== sourceSha256) {
        failures.push(`${product.sku}: SHA-256 de fuente no coincide`);
      }
      const orangeRatio = await measureOrangeRatio(sourcePath);
      if (orangeRatio > MAX_ORANGE_RATIO) {
        failures.push(`${product.sku}: fuente con ${(orangeRatio * 100).toFixed(2)}% de naranja; no se permite recoloración DYNAMIK`);
      }
      if (Math.abs(orangeRatio - Number(treatment?.orangePixelRatio)) > 0.001) {
        failures.push(`${product.sku}: la evidencia cromática no coincide con la fuente`);
      }
    }
  } catch (error) {
    failures.push(`${product.sku}: ${error.message}`);
  }
}

if (totals.ads < 1 || totals.gti < 1) failures.push(`catálogo de marca vacío ADS=${totals.ads}, GTI=${totals.gti}`);
if (counts.ads < 1 || counts.gti < 1) failures.push(`conteos generados inesperados ADS=${counts.ads}, GTI=${counts.gti}`);
if (manifest?.version !== 3) failures.push(`manifiesto de marca con versión ${manifest?.version}; esperada 3`);
const manifestKeys = Object.keys(manifest?.images || {});
if (manifestKeys.length !== generatedSkuKeys.size) failures.push(`manifiesto ${manifestKeys.length} != generados ${generatedSkuKeys.size}`);
for (const skuKey of manifestKeys) {
  if (!generatedSkuKeys.has(skuKey)) failures.push(`${skuKey}: entrada huérfana en manifiesto`);
}

console.log(JSON.stringify({ totals, generated: counts, statusCounts, uniqueOutputs: outputUrls.size, colorPolicy: COLOR_POLICY, failures }, null, 2));
if (failures.length) process.exitCode = 1;
