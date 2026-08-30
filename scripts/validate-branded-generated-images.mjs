import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { products } from "../src/lib/products.js";
import { productImageOverrides } from "../src/data/productImageOverrides.js";

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, "public");
const normalizeKey = (value) => String(value ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "");
const expected = {
  ads: { publicPrefix: "/catalogo-ads/branded/", badgeVariant: "blue-wordmark" },
  gti: { publicPrefix: "/catalogo-gti/generated-branded/", badgeVariant: "yellow-on-blue-capsule" },
};

const failures = [];
const counts = { ads: 0, gti: 0 };
const outputUrls = new Set();

for (const product of products) {
  const slug = product?.brand?.slug;
  if (!expected[slug] || product.imageStatus !== "generated-reference-image") continue;
  counts[slug] += 1;
  const rule = expected[slug];
  const skuKey = normalizeKey(product.sku);
  const override = productImageOverrides[skuKey];
  const treatment = override?.sourceRecord?.brandTreatment;
  if (!product.image?.startsWith(rule.publicPrefix)) {
    failures.push(`${product.sku}: ruta no marcada para ${slug}: ${product.image || "sin imagen"}`);
    continue;
  }
  if (outputUrls.has(product.image)) failures.push(`${product.sku}: imagen reutilizada ${product.image}`);
  outputUrls.add(product.image);
  if (treatment?.version !== 2 || treatment?.badgeVariant !== rule.badgeVariant) {
    failures.push(`${product.sku}: falta evidencia de tratamiento de marca ${rule.badgeVariant}`);
  }
  const filePath = path.resolve(PUBLIC_DIR, product.image.slice(1));
  const relative = path.relative(PUBLIC_DIR, filePath);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    failures.push(`${product.sku}: ruta fuera de public/`);
    continue;
  }
  try {
    const stats = await fs.stat(filePath);
    if (!stats.isFile() || stats.size < 15_000) failures.push(`${product.sku}: archivo ausente o demasiado pequeño`);
    const metadata = await sharp(filePath).metadata();
    if (metadata.width !== 1200 || metadata.height !== 1200) failures.push(`${product.sku}: tamaño ${metadata.width}x${metadata.height}, esperado 1200x1200`);
  } catch (error) {
    failures.push(`${product.sku}: ${error.message}`);
  }
}

if (counts.ads < 1 || counts.gti < 1) failures.push(`conteos inesperados ADS=${counts.ads}, GTI=${counts.gti}`);

console.log(JSON.stringify({ counts, uniqueOutputs: outputUrls.size, failures }, null, 2));
if (failures.length) process.exitCode = 1;
