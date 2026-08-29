import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { products } from "../src/lib/products.js";
import { productImageOverrides } from "../src/data/productImageOverrides.js";

const ROOT = process.cwd();
const MAX_BATCH = 10;
const MAX_SOURCE_BYTES = 30 * 1024 * 1024;
const MIN_SOURCE_SIZE = 512;
const OUTPUT_SIZE = 1200;
const OUTPUT_DIR = path.join(ROOT, "public", "catalogo-gti", "generated");
const OVERRIDES_FILE = path.join(ROOT, "src", "data", "productImageOverrides.js");
const MANIFEST_FILE = path.join(OUTPUT_DIR, "manifest.json");

const args = process.argv.slice(2);
const inputFile = args.find((arg) => !arg.startsWith("--"));
const apply = args.includes("--apply");

if (!inputFile) {
  throw new Error("Uso: npm run catalog:gti-generated-image -- <lote.json> [--apply]");
}

const clean = (value) => String(value ?? "").trim();
const normalizeKey = (value) => clean(value).toUpperCase().replace(/[^A-Z0-9]/g, "");
const slugify = (value) => clean(value)
  .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const escapeSvg = (value) => clean(value)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&apos;");

function shortTitle(product) {
  const title = clean(product.name).replace(/\s+—\s+.*/, "");
  return title.length > 54 ? `${title.slice(0, 51)}…` : title;
}

function labelSvg(product) {
  const sku = escapeSvg(product.sku);
  const title = escapeSvg(shortTitle(product));
  return Buffer.from(`
    <svg width="${OUTPUT_SIZE}" height="${OUTPUT_SIZE}" viewBox="0 0 ${OUTPUT_SIZE} ${OUTPUT_SIZE}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${OUTPUT_SIZE}" height="76" fill="#0F172A"/>
      <rect y="76" width="${OUTPUT_SIZE}" height="4" fill="#F6C800"/>
      <text x="52" y="48" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="30" font-weight="700">GTI · ${sku}</text>
      <text x="${OUTPUT_SIZE - 52}" y="48" fill="#CBD5E1" font-family="Arial, sans-serif" font-size="20" font-weight="700" text-anchor="end">REMBERT REPUESTOS</text>
      <rect y="1080" width="${OUTPUT_SIZE}" height="120" fill="#0F172A"/>
      <text x="${OUTPUT_SIZE / 2}" y="1125" fill="#F8FAFC" font-family="Arial, sans-serif" font-size="25" font-weight="700" text-anchor="middle">IMAGEN GENERADA DE REFERENCIA · NO ES FOTO ORIGINAL</text>
      <text x="${OUTPUT_SIZE / 2}" y="1164" fill="#F6C800" font-family="Arial, sans-serif" font-size="22" font-weight="700" text-anchor="middle">${title} · confirmar etiqueta, medidas y VIN antes de vender</text>
    </svg>
  `);
}

async function loadGeneratedSource(value, label) {
  const rawPath = clean(value);
  if (!path.isAbsolute(rawPath)) throw new Error(`${label}: image_source debe ser una ruta local absoluta`);
  const sourcePath = path.resolve(rawPath);
  const stats = await fs.stat(sourcePath);
  if (!stats.isFile()) throw new Error(`${label}: image_source no es un archivo`);
  if (stats.size > MAX_SOURCE_BYTES) throw new Error(`${label}: image_source supera 30 MB`);
  const buffer = await fs.readFile(sourcePath);
  const metadata = await sharp(buffer, { limitInputPixels: 40_000_000 }).metadata();
  if ((metadata.width || 0) < MIN_SOURCE_SIZE || (metadata.height || 0) < MIN_SOURCE_SIZE) {
    throw new Error(`${label}: la imagen generada debe medir mínimo ${MIN_SOURCE_SIZE}×${MIN_SOURCE_SIZE} px`);
  }
  return { buffer, metadata };
}

async function renderImage(product, source) {
  const productImage = await sharp(source, { limitInputPixels: 40_000_000 })
    .flatten({ background: "#FFFFFF" })
    .resize({ width: 1100, height: 1100, fit: "contain", background: "#FFFFFF" })
    .png()
    .toBuffer();

  return sharp({
    create: {
      width: OUTPUT_SIZE,
      height: OUTPUT_SIZE,
      channels: 4,
      background: "#FFFFFF",
    },
  })
    .composite([
      { input: productImage, gravity: "center" },
    ])
    .webp({ quality: 91, effort: 6 })
    .toBuffer();
}

const batch = JSON.parse(await fs.readFile(path.resolve(inputFile), "utf8"));
if (!Array.isArray(batch) || batch.length < 1 || batch.length > MAX_BATCH) {
  throw new Error(`El lote debe contener entre 1 y ${MAX_BATCH} productos`);
}

const catalogBySku = new Map(products.map((product) => [normalizeKey(product.sku), product]));
const seen = new Set();
const prepared = [];
for (const [index, row] of batch.entries()) {
  const label = `Fila ${index + 1}`;
  const skuKey = normalizeKey(row?.sku);
  if (!skuKey) throw new Error(`${label}: falta sku`);
  if (seen.has(skuKey)) throw new Error(`${label}: SKU duplicado ${row.sku}`);
  seen.add(skuKey);
  const product = catalogBySku.get(skuKey);
  if (!product) throw new Error(`${label}: SKU no existe en el catálogo: ${row.sku}`);
  if (product.brand?.slug !== "gti") throw new Error(`${label}: sólo se permiten referencias GTI`);
  if (["real-source-photo", "real-source-watermarked", "authentic-product-photo", "exact-real-photo"].includes(product.imageStatus)) {
    throw new Error(`${label}: ${product.sku} ya tiene fotografía real; este flujo no la reemplaza`);
  }
  const prompt = clean(row.generation_prompt);
  if (prompt.length < 40) throw new Error(`${label}: generation_prompt debe documentar la instrucción usada (mínimo 40 caracteres)`);
  const source = await loadGeneratedSource(row.image_source, label);
  const fileName = `${slugify(product.slug || `${product.sku}-${product.name}`)}-generated-reference.webp`;
  prepared.push({ row, product, source: source.buffer, fileName, prompt });
}

if (!apply) {
  console.log(JSON.stringify({
    valid: prepared.length,
    changesApplied: false,
    skus: prepared.map((item) => item.product.sku),
    message: "Lote válido. Repita con --apply para publicar referencias generadas claramente etiquetadas.",
  }, null, 2));
  process.exit(0);
}

const rendered = [];
for (const item of prepared) {
  const buffer = await renderImage(item.product, item.source);
  rendered.push({
    ...item,
    buffer,
    image: `/catalogo-gti/generated/${item.fileName}`,
    sourceHash: crypto.createHash("sha256").update(item.source).digest("hex"),
  });
}

let manifest = { version: 1, images: {} };
try { manifest = JSON.parse(await fs.readFile(MANIFEST_FILE, "utf8")); } catch {}
const overrides = { ...productImageOverrides };
for (const item of rendered) {
  const skuKey = normalizeKey(item.product.sku);
  const alt = `Imagen generada de referencia para ${item.product.name}, SKU ${item.product.sku}. No es fotografía original.`;
  const entry = {
    image: item.image,
    images: [{ url: item.image, alt, isMain: true }],
    imageStatus: "generated-reference-image",
    imageDisclosure: "Imagen generada de referencia; no es fotografía original. Confirmar etiqueta GTI, medidas y VIN antes de vender.",
    sourceRecord: {
      type: "ai-generated-reference",
      generationPrompt: item.prompt,
      sourceSha256: item.sourceHash,
      renderer: "scripts/apply-generated-gti-image.mjs",
      generatedAt: new Date().toISOString(),
    },
  };
  overrides[skuKey] = entry;
  manifest.images[skuKey] = {
    sku: item.product.sku,
    name: item.product.name,
    outputImage: item.image,
    sourceSha256: item.sourceHash,
    generationPrompt: item.prompt,
    imageStatus: entry.imageStatus,
    generatedAt: entry.sourceRecord.generatedAt,
  };
}

const overrideSource = "// Generado por scripts/update-product-images.mjs y scripts/apply-generated-gti-image.mjs. No editar manualmente.\n"
  + `export const productImageOverrides = Object.freeze(${JSON.stringify(overrides, null, 2)});\n`;
await fs.mkdir(OUTPUT_DIR, { recursive: true });
for (const item of rendered) await fs.writeFile(path.join(OUTPUT_DIR, item.fileName), item.buffer);
await fs.writeFile(OVERRIDES_FILE, overrideSource);
await fs.writeFile(MANIFEST_FILE, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify({
  updated: rendered.length,
  imageStatus: "generated-reference-image",
  skus: rendered.map((item) => item.product.sku),
  next: "Ejecute npm run catalog:gti-images:check y npm run lint antes de desplegar.",
}, null, 2));
