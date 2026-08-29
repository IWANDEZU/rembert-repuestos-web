import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { products } from "../src/lib/products.js";
import { productImageOverrides } from "../src/data/productImageOverrides.js";

const ROOT = process.cwd();
const MAX_BATCH = 10;
const MAX_SOURCES = 3;
const MAX_IMAGE_BYTES = 15 * 1024 * 1024;
const MIN_SOURCE_SIZE = 500;
const OUTPUT_SIZE = 1200;
const OUTPUT_DIR = path.join(ROOT, "public", "catalogo-real");
const CACHE_DIR = path.join(ROOT, ".catalog-cache");
const OVERRIDES_FILE = path.join(ROOT, "src", "data", "productImageOverrides.js");
const MANIFEST_FILE = path.join(OUTPUT_DIR, "manifest.json");
const REMBERT_LOGO = path.join(ROOT, "public", "logo-rembert-medallion-transparent.webp");

const args = process.argv.slice(2);
const inputFile = args.find((arg) => !arg.startsWith("--"));
const apply = args.includes("--apply");

if (!inputFile) {
  throw new Error("Uso: npm run catalog:image-update -- <lote.json> [--apply]");
}

const clean = (value) => String(value ?? "").trim();
const normalizeKey = (value) => clean(value).toUpperCase().replace(/[^A-Z0-9]/g, "");
const slugify = (value) => clean(value)
  .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function safeHttpUrl(value) {
  const url = new URL(value);
  if (url.protocol !== "https:" || url.username || url.password) {
    throw new Error(`La fuente debe ser HTTPS pública: ${value}`);
  }
  const host = url.hostname.toLowerCase();
  const privateIpv4 = /^(127|10)\./.test(host)
    || /^169\.254\./.test(host)
    || /^192\.168\./.test(host)
    || /^172\.(1[6-9]|2\d|3[01])\./.test(host);
  if (host === "localhost" || host === "::1" || host.endsWith(".local") || host.startsWith("fc") || host.startsWith("fd") || host.startsWith("fe80") || privateIpv4) {
    throw new Error(`Host privado no permitido: ${host}`);
  }
  return url;
}

async function readResponseBody(response, url) {
  const declaredLength = Number(response.headers.get("content-length") || 0);
  if (declaredLength > MAX_IMAGE_BYTES) throw new Error(`Imagen mayor de 15 MB: ${url}`);
  const chunks = [];
  let bytes = 0;
  for await (const chunk of response.body) {
    bytes += chunk.length;
    if (bytes > MAX_IMAGE_BYTES) throw new Error(`Imagen mayor de 15 MB: ${url}`);
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

async function fetchImage(value, referrer = null, redirects = 0) {
  if (redirects > 3) throw new Error("Demasiadas redirecciones al descargar imagen");
  const url = safeHttpUrl(value);
  const cachePath = path.join(CACHE_DIR, `${crypto.createHash("sha256").update(url.href).digest("hex")}.bin`);
  try { return await fs.readFile(cachePath); } catch {}

  const response = await fetch(url, {
    redirect: "manual",
    signal: AbortSignal.timeout(15_000),
    headers: {
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/138.0 Safari/537.36",
      ...(referrer ? { referer: safeHttpUrl(referrer).href } : {}),
    },
  });
  if (response.status >= 300 && response.status < 400) {
    const location = response.headers.get("location");
    if (!location) throw new Error(`Redirección sin destino: ${url.href}`);
    return fetchImage(new URL(location, url).href, referrer, redirects + 1);
  }
  if (!response.ok) throw new Error(`Descarga fallida ${response.status}: ${url.href}`);
  const contentType = response.headers.get("content-type") || "";
  if (contentType && !contentType.startsWith("image/")) {
    throw new Error(`El recurso no es una imagen: ${url.href}`);
  }
  const buffer = await readResponseBody(response, url.href);
  await fs.mkdir(CACHE_DIR, { recursive: true });
  await fs.writeFile(cachePath, buffer);
  return buffer;
}

async function loadImage(value, referrer = null) {
  const source = clean(value);
  if (!source) throw new Error("Falta image_source");
  return /^https:\/\//i.test(source) ? fetchImage(source, referrer) : fs.readFile(path.resolve(source));
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

async function renderImage(product, source, brandLogo) {
  const meta = await sharp(source).metadata();
  if ((meta.width || 0) < MIN_SOURCE_SIZE || (meta.height || 0) < MIN_SOURCE_SIZE) {
    throw new Error(`${product.sku}: la foto real debe medir mínimo ${MIN_SOURCE_SIZE}×${MIN_SOURCE_SIZE} px`);
  }
  // Las fichas de distribuidor suelen dejar un amplio marco blanco alrededor
  // de la pieza. Recortarlo antes de normalizar conserva la fotografía real
  // y evita que el producto quede ilegible en una tarjeta cuadrada.
  const productLayer = await sharp(source).rotate().trim({ background: "#ffffff", threshold: 12 }).resize({
    width: 980, height: 980, fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 },
  }).png().toBuffer();
  const overlays = [{ input: productLayer, gravity: "center" }];
  if (brandLogo) overlays.push({ input: await makeLogo(brandLogo, 250, 105), left: 42, top: 38 });
  overlays.push({ input: await makeLogo(await fs.readFile(REMBERT_LOGO), 126, 126, 0.9), left: OUTPUT_SIZE - 164, top: OUTPUT_SIZE - 164 });
  return sharp({ create: { width: OUTPUT_SIZE, height: OUTPUT_SIZE, channels: 4, background: "#ffffff" } })
    .composite(overlays)
    .withMetadata({ exif: { IFD0: {
      Artist: "REMBERT Repuestos BCA",
      Copyright: "Catálogo REMBERT; fuente trazable en productImageOverrides.js",
      ImageDescription: `${product.name} | ${product.sku}`,
    } } })
    .webp({ quality: 84, effort: 5 })
    .toBuffer();
}

function validateRow(row, index, catalogBySku) {
  const label = `Producto ${index + 1}`;
  if (!clean(row.sku)) throw new Error(`${label}: falta sku`);
  if (!clean(row.image_source)) throw new Error(`${label}: falta image_source`);
  if (!Array.isArray(row.sources) || row.sources.length < 1 || row.sources.length > MAX_SOURCES) {
    throw new Error(`${label}: sources debe tener entre 1 y ${MAX_SOURCES} fuentes`);
  }
  row.sources.forEach((source) => safeHttpUrl(source));
  const product = catalogBySku.get(normalizeKey(row.sku));
  if (!product) throw new Error(`${label}: SKU inexistente en el catálogo publicado: ${row.sku}`);
  if (product.brand?.slug === "gti") {
    if (row.exact_reference_confirmed !== true) {
      throw new Error(`${label}: para GTI se requiere exact_reference_confirmed: true`);
    }
    if (row.usage_authorized !== true) {
      throw new Error(`${label}: para GTI se requiere usage_authorized: true antes de publicar una foto externa`);
    }
    if (!clean(row.reference_evidence)) {
      throw new Error(`${label}: para GTI falta reference_evidence con la prueba de que la foto corresponde al SKU`);
    }
    if (!new Set(["own", "manufacturer", "authorized-distributor"]).has(clean(row.source_type))) {
      throw new Error(`${label}: para GTI source_type debe ser own, manufacturer o authorized-distributor`);
    }
    if (row.source_image_clean !== true) {
      throw new Error(`${label}: para GTI se requiere source_image_clean: true; no se publican fotos con marca de agua ajena o textos de terceros`);
    }
  }
  return product;
}

const batch = JSON.parse(await fs.readFile(path.resolve(inputFile), "utf8"));
if (!Array.isArray(batch) || batch.length < 1 || batch.length > MAX_BATCH) {
  throw new Error(`El lote debe contener entre 1 y ${MAX_BATCH} productos`);
}

const catalogBySku = new Map(products.map((product) => [normalizeKey(product.sku), product]));
const seen = new Set();
const prepared = [];
for (const [index, row] of batch.entries()) {
  const skuKey = normalizeKey(row.sku);
  if (seen.has(skuKey)) throw new Error(`SKU duplicado en lote: ${row.sku}`);
  seen.add(skuKey);
  const product = validateRow(row, index, catalogBySku);
  const source = await loadImage(row.image_source, Array.isArray(row.sources) ? row.sources[0] : null);
  const brandLogo = row.brand_logo_source ? await loadImage(row.brand_logo_source) : null;
  const fileName = `${slugify(`${product.sku}-${product.slug || product.name}`)}.webp`;
  prepared.push({ row, product, source, brandLogo, fileName });
}

if (!apply) {
  console.log(`Lote válido: ${prepared.length} producto(s). No se modificó el catálogo; repita con --apply para actualizarlo.`);
  process.exit(0);
}

const rendered = [];
for (const item of prepared) {
  const buffer = await renderImage(item.product, item.source, item.brandLogo);
  const image = `/catalogo-real/${item.fileName}`;
  const sourceHash = crypto.createHash("sha256").update(item.source).digest("hex");
  rendered.push({ ...item, buffer, image, sourceHash });
}

let manifest = { version: 1, images: {} };
try { manifest = JSON.parse(await fs.readFile(MANIFEST_FILE, "utf8")); } catch {}
const overrides = { ...productImageOverrides };
for (const item of rendered) {
  const skuKey = normalizeKey(item.product.sku);
  const alt = `Fotografía real de ${item.product.name}, referencia ${item.product.sku}`;
  const entry = {
    image: item.image,
    images: [{ url: item.image, alt, isMain: true }],
    imageStatus: "real-source-watermarked",
    imageDisclosure: "Fotografía real de la referencia, normalizada y marcada por REMBERT.",
    sourceRecord: {
      image: clean(item.row.image_source),
      pages: item.row.sources.map(clean),
      sha256: item.sourceHash,
      ...(item.product.brand?.slug === "gti" ? {
        exactReferenceConfirmed: true,
        usageAuthorized: true,
        referenceEvidence: clean(item.row.reference_evidence),
        sourceType: clean(item.row.source_type),
        sourceImageClean: true,
      } : {}),
    },
  };
  overrides[skuKey] = entry;
  manifest.images[skuKey] = {
    sku: item.product.sku,
    name: item.product.name,
    outputImage: item.image,
    sourceImage: entry.sourceRecord.image,
    sources: entry.sourceRecord.pages,
    sha256: entry.sourceRecord.sha256,
    updatedAt: new Date().toISOString(),
  };
}

const overrideSource = `// Generado por scripts/update-product-images.mjs. No editar manualmente.\nexport const productImageOverrides = Object.freeze(${JSON.stringify(overrides, null, 2)});\n`;
await fs.mkdir(OUTPUT_DIR, { recursive: true });
for (const item of rendered) await fs.writeFile(path.join(OUTPUT_DIR, item.fileName), item.buffer);
await fs.writeFile(OVERRIDES_FILE, overrideSource);
await fs.writeFile(MANIFEST_FILE, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Actualizadas ${rendered.length} imagen(es) reales. Ejecute npm run catalog:image-audit y npm run lint antes de desplegar.`);
