import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { products } from "../src/lib/products.js";
import { productImageOverrides } from "../src/data/productImageOverrides.js";

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, "public");
const OVERRIDES_FILE = path.join(ROOT, "src", "data", "productImageOverrides.js");
const MANIFEST_FILE = path.join(PUBLIC_DIR, "catalogo-generated-branded", "manifest.json");
const APPLY = process.argv.includes("--apply");
const OUTPUT_SIZE = 1200;

const BRAND_CONFIG = Object.freeze({
  ads: {
    name: "ADS",
    badge: path.join(PUBLIC_DIR, "brands", "ads-product-logo-blue.svg"),
    badgeVariant: "blue-wordmark",
    outputDir: path.join(PUBLIC_DIR, "catalogo-ads", "branded"),
    publicDir: "/catalogo-ads/branded",
    disclosure: "Imagen generada de referencia; no es fotografía original. El logotipo ADS azul fue integrado digitalmente. Confirmar referencia, medidas y VIN antes de vender.",
  },
  gti: {
    name: "GTI",
    badge: path.join(PUBLIC_DIR, "brands", "gti-product-logo-capsule.svg"),
    badgeVariant: "yellow-on-blue-capsule",
    outputDir: path.join(PUBLIC_DIR, "catalogo-gti", "generated-branded"),
    publicDir: "/catalogo-gti/generated-branded",
    disclosure: "Imagen generada de referencia; no es fotografía original. El logotipo GTI amarillo en cápsula azul fue integrado digitalmente. Confirmar referencia, estrías, ABS, medidas y VIN antes de vender.",
  },
});

const clean = (value) => String(value ?? "").trim();
const normalizeKey = (value) => clean(value).toUpperCase().replace(/[^A-Z0-9]/g, "");
const slugify = (value) => clean(value)
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");

function resolvePublicAsset(publicUrl, label) {
  if (!publicUrl?.startsWith("/")) throw new Error(`${label}: URL pública inválida: ${publicUrl}`);
  const resolved = path.resolve(PUBLIC_DIR, publicUrl.slice(1));
  const relative = path.relative(PUBLIC_DIR, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) throw new Error(`${label}: recurso fuera de public/`);
  return resolved;
}

function sourceUrlFor(product, existingOverride) {
  const recordedSource = existingOverride?.sourceRecord?.brandTreatment?.sourceImage;
  if (recordedSource) return recordedSource;
  if (product.brand.slug === "ads") {
    const exactGalleryImage = product.images?.find((image) => image?.isMain && image?.url)
      || product.images?.find((image) => image?.url);
    return exactGalleryImage?.url || product.image;
  }
  return product.image;
}

async function renderBrandedImage({ sourcePath, badgePath }) {
  const source = await fs.readFile(sourcePath);
  const metadata = await sharp(source, { limitInputPixels: 60_000_000 }).metadata();
  if ((metadata.width || 0) < 512 || (metadata.height || 0) < 512) {
    throw new Error(`Imagen fuente menor a 512 px: ${sourcePath}`);
  }

  const productLayer = await sharp(source, { limitInputPixels: 60_000_000 })
    .flatten({ background: "#ffffff" })
    .resize({ width: OUTPUT_SIZE, height: OUTPUT_SIZE, fit: "contain", background: "#ffffff" })
    .png()
    .toBuffer();
  const badgeLayer = await sharp(await fs.readFile(badgePath))
    .resize({ width: 300, height: 110, fit: "contain" })
    .png()
    .toBuffer();

  return sharp({
    create: { width: OUTPUT_SIZE, height: OUTPUT_SIZE, channels: 4, background: "#ffffff" },
  })
    .composite([
      { input: productLayer, left: 0, top: 0 },
      { input: badgeLayer, left: 36, top: 32 },
    ])
    .webp({ quality: 92, effort: 6 })
    .toBuffer();
}

const targets = products.filter((product) => {
  const slug = product?.brand?.slug;
  return Boolean(BRAND_CONFIG[slug]) && product.imageStatus === "generated-reference-image";
});

if (!targets.length) throw new Error("No se encontraron imágenes generadas ADS/GTI para marcar");

const overrides = { ...productImageOverrides };
const manifest = { version: 2, generatedAt: new Date().toISOString(), images: {} };
const prepared = [];

for (const product of targets) {
  const skuKey = normalizeKey(product.sku);
  const config = BRAND_CONFIG[product.brand.slug];
  const existingOverride = overrides[skuKey] || {};
  const sourceUrl = sourceUrlFor(product, existingOverride);
  const sourcePath = resolvePublicAsset(sourceUrl, product.sku);
  const stats = await fs.stat(sourcePath).catch(() => null);
  if (!stats?.isFile()) throw new Error(`${product.sku}: no existe la fuente ${sourceUrl}`);

  const fileName = `${slugify(product.sku)}-${slugify(product.slug || product.name).slice(0, 88)}-branded-v2.webp`;
  const outputPath = path.join(config.outputDir, fileName);
  const outputUrl = `${config.publicDir}/${fileName}`;
  const sourceBuffer = await fs.readFile(sourcePath);
  const sourceSha256 = crypto.createHash("sha256").update(sourceBuffer).digest("hex");
  const alt = `Imagen generada de referencia de ${product.name}, SKU ${product.sku}; no es fotografía original. Identificada con el logotipo ${config.name}.`;
  const generatedAt = new Date().toISOString();

  prepared.push({ product, config, sourcePath, outputPath, outputUrl });
  overrides[skuKey] = {
    ...existingOverride,
    image: outputUrl,
    images: [{ url: outputUrl, alt, isMain: true }],
    imageStatus: "generated-reference-image",
    imageDisclosure: config.disclosure,
    sourceRecord: {
      ...(existingOverride.sourceRecord || {}),
      type: existingOverride.sourceRecord?.type || "ai-generated-reference",
      brandTreatment: {
        version: 2,
        brand: config.name,
        badgeVariant: config.badgeVariant,
        sourceImage: sourceUrl,
        sourceSha256,
        renderer: "scripts/brand-generated-product-images.mjs",
        appliedAt: generatedAt,
      },
    },
  };
  manifest.images[skuKey] = {
    sku: product.sku,
    brand: config.name,
    sourceImage: sourceUrl,
    sourceSha256,
    outputImage: outputUrl,
    badgeVariant: config.badgeVariant,
    imageStatus: "generated-reference-image",
  };
}

const counts = Object.fromEntries(Object.keys(BRAND_CONFIG).map((slug) => [
  slug,
  prepared.filter((item) => item.product.brand.slug === slug).length,
]));

if (!APPLY) {
  console.log(JSON.stringify({ valid: prepared.length, counts, changesApplied: false }, null, 2));
  process.exit(0);
}

for (const item of prepared) {
  await fs.mkdir(path.dirname(item.outputPath), { recursive: true });
  const buffer = await renderBrandedImage({ sourcePath: item.sourcePath, badgePath: item.config.badge });
  await fs.writeFile(item.outputPath, buffer);
}

const overrideSource = "// Generado por scripts/update-product-images.mjs, scripts/apply-generated-gti-image.mjs y scripts/brand-generated-product-images.mjs. No editar manualmente.\n"
  + `export const productImageOverrides = Object.freeze(${JSON.stringify(overrides, null, 2)});\n`;
await fs.mkdir(path.dirname(MANIFEST_FILE), { recursive: true });
await fs.writeFile(OVERRIDES_FILE, overrideSource);
await fs.writeFile(MANIFEST_FILE, `${JSON.stringify(manifest, null, 2)}\n`);

console.log(JSON.stringify({ updated: prepared.length, counts, manifest: "/catalogo-generated-branded/manifest.json" }, null, 2));
