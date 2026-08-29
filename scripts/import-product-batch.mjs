import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const MAX_BATCH = 10;
const MAX_SOURCES = 3;
const MAX_IMAGE_BYTES = 15 * 1024 * 1024;
const OUTPUT_SIZE = 1200;
const OUTPUT_DIR = path.join(ROOT, "public", "catalogo-automatizado");
const CACHE_DIR = path.join(ROOT, ".catalog-cache");
const GENERATED_FILE = path.join(ROOT, "src", "data", "automatedCatalogProducts.js");
const MANIFEST_FILE = path.join(OUTPUT_DIR, "manifest.json");
const REMBERT_LOGO = path.join(ROOT, "public", "logo-rembert-medallion-transparent.webp");

const inputFile = process.argv[2];
const validateOnly = process.argv.includes("--validate-only");
if (!inputFile) fail("Uso: npm run catalog:import -- <archivo-lote.json>");

const slugify = (value) => String(value || "")
  .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const clean = (value) => String(value ?? "").trim();
const normalizeKey = (value) => clean(value).toUpperCase().replace(/[^A-Z0-9]/g, "");

function fail(message) {
  console.error(message);
  process.exit(1);
}

function safeHttpUrl(value) {
  const url = new URL(value);
  if (url.protocol !== "https:") throw new Error(`Solo se permite HTTPS: ${value}`);
  const host = url.hostname.toLowerCase();
  if (host === "localhost" || host === "0.0.0.0" || host === "::1" || /^127\./.test(host) || /^10\./.test(host) || /^192\.168\./.test(host) || /^169\.254\./.test(host)) {
    throw new Error(`Host privado no permitido: ${host}`);
  }
  return url;
}

async function fetchImage(urlValue, redirects = 0) {
  if (redirects > 3) throw new Error("Demasiadas redirecciones al descargar imagen");
  const url = safeHttpUrl(urlValue);
  const cacheName = `${crypto.createHash("sha256").update(url.href).digest("hex")}.bin`;
  const cachePath = path.join(CACHE_DIR, cacheName);
  try { return await fs.readFile(cachePath); } catch {}

  const response = await fetch(url, {
    redirect: "manual",
    signal: AbortSignal.timeout(15_000),
    headers: { "user-agent": "REMBERT-Catalog-Importer/1.0" },
  });
  if (response.status >= 300 && response.status < 400) {
    const location = response.headers.get("location");
    if (!location) throw new Error(`Redirección sin destino: ${url.href}`);
    return fetchImage(new URL(location, url).href, redirects + 1);
  }
  if (!response.ok) throw new Error(`Descarga fallida ${response.status}: ${url.href}`);
  const type = response.headers.get("content-type") || "";
  if (!type.startsWith("image/")) throw new Error(`El recurso no es una imagen: ${url.href}`);
  const declaredLength = Number(response.headers.get("content-length") || 0);
  if (declaredLength > MAX_IMAGE_BYTES) throw new Error(`Imagen mayor de 15 MB: ${url.href}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length > MAX_IMAGE_BYTES) throw new Error(`Imagen mayor de 15 MB: ${url.href}`);
  await fs.writeFile(cachePath, buffer);
  return buffer;
}

async function loadImage(source) {
  const value = clean(source);
  if (!value) throw new Error("Falta image_source");
  if (/^https:\/\//i.test(value)) return fetchImage(value);
  const absolute = path.resolve(value);
  return fs.readFile(absolute);
}

async function makeLogo(buffer, maxWidth, maxHeight, opacity = 1) {
  const normalized = await sharp(buffer).rotate().ensureAlpha().resize({
    width: maxWidth, height: maxHeight, fit: "inside", withoutEnlargement: true,
  }).png().toBuffer();
  if (opacity === 1) return normalized;
  const meta = await sharp(normalized).metadata();
  return sharp(normalized).composite([{
    input: Buffer.from(`<svg width="${meta.width}" height="${meta.height}"><rect width="100%" height="100%" fill="white" fill-opacity="${opacity}"/></svg>`),
    blend: "dest-in",
  }]).png().toBuffer();
}

async function renderCatalogImage(product, slug) {
  const source = await loadImage(product.image_source);
  const sourceMeta = await sharp(source).metadata();
  if ((sourceMeta.width || 0) < 500 || (sourceMeta.height || 0) < 500) {
    throw new Error(`${product.sku}: la foto real debe medir mínimo 500×500 px`);
  }

  const productLayer = await sharp(source).rotate().resize({
    width: 980, height: 980, fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 },
  }).png().toBuffer();
  const overlays = [{ input: productLayer, gravity: "center" }];

  if (product.brand_logo_source) {
    const brandLogo = await makeLogo(await loadImage(product.brand_logo_source), 250, 105);
    overlays.push({ input: brandLogo, left: 42, top: 38 });
  }
  const rembertLogo = await makeLogo(await fs.readFile(REMBERT_LOGO), 126, 126, 0.9);
  overlays.push({ input: rembertLogo, left: OUTPUT_SIZE - 126 - 38, top: OUTPUT_SIZE - 126 - 38 });

  const outputName = `${slug}.webp`;
  const outputPath = path.join(OUTPUT_DIR, outputName);
  await sharp({ create: { width: OUTPUT_SIZE, height: OUTPUT_SIZE, channels: 4, background: "#ffffff" } })
    .composite(overlays)
    .withMetadata({ exif: { IFD0: {
      Artist: "REMBERT Repuestos BCA",
      Copyright: "Catálogo REMBERT; fotografía fuente conservada en manifest.json",
      ImageDescription: `${product.nombre_repuesto} | ${product.sku} | ${product.numero_parte_oem}`,
    } } })
    .webp({ quality: 84, effort: 5 })
    .toFile(outputPath);
  return `/catalogo-automatizado/${outputName}`;
}

function validateProduct(product, index) {
  const prefix = `Producto ${index + 1}`;
  for (const field of ["sku", "nombre_repuesto", "numero_parte_oem", "marca", "categoria", "compatibilidad", "descripcion_seo", "image_source", "sources"]) {
    if (product[field] == null || product[field] === "") throw new Error(`${prefix}: falta ${field}`);
  }
  if (!product.categoria?.name || !product.categoria?.slug) throw new Error(`${prefix}: categoria requiere name y slug`);
  if (!Array.isArray(product.sources) || product.sources.length < 1 || product.sources.length > MAX_SOURCES) throw new Error(`${prefix}: sources debe contener entre 1 y ${MAX_SOURCES} fuentes`);
  product.sources.forEach((source) => safeHttpUrl(source));
  if (!Array.isArray(product.compatibilidad) || product.compatibilidad.length < 1) throw new Error(`${prefix}: falta compatibilidad estructurada`);
  product.compatibilidad.forEach((fitment, fitmentIndex) => {
    for (const field of ["make", "model", "years", "position"]) {
      if (!clean(fitment[field])) throw new Error(`${prefix}: compatibilidad[${fitmentIndex}].${field} es obligatorio`);
    }
  });
  if (/todos los (autos|veh[ií]culos|a[nñ]os)|varios|universal/i.test(product.descripcion_seo)) {
    throw new Error(`${prefix}: descripción contiene una compatibilidad vaga o universal no permitida`);
  }
}

await fs.mkdir(OUTPUT_DIR, { recursive: true });
await fs.mkdir(CACHE_DIR, { recursive: true });
const batch = JSON.parse(await fs.readFile(path.resolve(inputFile), "utf8"));
if (!Array.isArray(batch) || batch.length < 1 || batch.length > MAX_BATCH) fail(`El lote debe contener entre 1 y ${MAX_BATCH} repuestos`);

const seenSkus = new Set();
const seenSlugs = new Set();
batch.forEach((product, index) => {
  validateProduct(product, index);
  const skuKey = normalizeKey(product.sku);
  const slug = slugify(product.slug || `${product.marca}-${product.numero_parte_oem}-${product.nombre_repuesto}`);
  if (seenSkus.has(skuKey)) throw new Error(`SKU duplicado en lote: ${product.sku}`);
  if (seenSlugs.has(slug)) throw new Error(`Slug duplicado en lote: ${slug}`);
  seenSkus.add(skuKey); seenSlugs.add(slug);
});

if (validateOnly) {
  for (const product of batch) {
    const image = await loadImage(product.image_source);
    const meta = await sharp(image).metadata();
    if ((meta.width || 0) < 500 || (meta.height || 0) < 500) throw new Error(`${product.sku}: la foto real debe medir mínimo 500×500 px`);
    if (product.brand_logo_source) await sharp(await loadImage(product.brand_logo_source)).metadata();
  }
  console.log(`Lote válido: ${batch.length} producto(s). No se modificó el catálogo.`);
  process.exit(0);
}

let existing = [];
try {
  const text = await fs.readFile(MANIFEST_FILE, "utf8");
  existing = JSON.parse(text).products || [];
} catch {}
const bySku = new Map(existing.map((item) => [normalizeKey(item.sku), item]));

for (const product of batch) {
  const slug = slugify(product.slug || `${product.marca}-${product.numero_parte_oem}-${product.nombre_repuesto}`);
  const image = await renderCatalogImage(product, slug);
  const fitments = product.compatibilidad.map((item) => ({
    make: clean(item.make), model: clean(item.model), engine: clean(item.engine) || "Confirmar por VIN",
    years: clean(item.years), position: clean(item.position),
  }));
  const price = Number.isFinite(Number(product.precio_cop)) && Number(product.precio_cop) > 0 ? Math.round(Number(product.precio_cop)) : 0;
  const entry = {
    id: slug, slug, name: clean(product.nombre_repuesto),
    category: { name: clean(product.categoria.name), slug: slugify(product.categoria.slug) },
    brand: { name: clean(product.marca), slug: slugify(product.marca) },
    price, sku: clean(product.sku), numeroParteOem: clean(product.numero_parte_oem),
    referenceType: "manufacturer", fitmentStatus: "verified", fitments,
    fitmentSummary: fitments.map((item) => `${item.make} ${item.model} (${item.years}) · ${item.position}`).join("; "),
    fitmentRequirements: Array.isArray(product.fitment_requirements) && product.fitment_requirements.length ? product.fitment_requirements.map(clean) : ["VIN", "año", "motor", "referencia OEM"],
    fitmentSource: product.sources.join(" · "), shortDesc: clean(product.descripcion_seo), description: clean(product.descripcion_seo),
    image, images: [{ url: image, alt: `${clean(product.nombre_repuesto)} ${clean(product.marca)} ${clean(product.numero_parte_oem)}`, isMain: true }],
    imageStatus: "real-source-watermarked", inStock: false, stock: 0,
    attributes: [
      { id: `${slug}-oem`, name: "Referencia OEM / fabricante", value: clean(product.numero_parte_oem) },
      { id: `${slug}-material`, name: "Material", value: clean(product.especificaciones_tecnicas?.material) || "No publicado por el fabricante" },
      { id: `${slug}-weight`, name: "Peso aproximado", value: clean(product.especificaciones_tecnicas?.peso_aprox) || "No publicado por el fabricante" },
      { id: `${slug}-image`, name: "Imagen", value: "Fotografía real normalizada para web y marcada por REMBERT" },
    ],
    catalogApproval: "explicit-batch",
    sourceRecord: { image: clean(product.image_source), brandLogo: clean(product.brand_logo_source) || null, pages: product.sources },
  };
  bySku.set(normalizeKey(entry.sku), entry);
  console.log(`Preparado: ${entry.sku} -> ${image}`);
}

const products = [...bySku.values()].sort((a, b) => a.name.localeCompare(b.name, "es"));
await fs.writeFile(MANIFEST_FILE, `${JSON.stringify({ generatedAt: new Date().toISOString(), products }, null, 2)}\n`);
await fs.writeFile(GENERATED_FILE, `// Generado por scripts/import-product-batch.mjs. No editar manualmente.\nexport const automatedCatalogProducts = ${JSON.stringify(products, null, 2)};\n`);
console.log(`Catálogo automático actualizado: ${products.length} producto(s). Ejecute npm run catalog:check antes de desplegar.`);
