import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { products } from "../src/lib/products.js";

const ROOT = process.cwd();
const CACHE_DIR = path.join(ROOT, ".catalog-cache", "gti-source-discovery");
const DEFAULT_OUTPUT = path.join(ROOT, "docs", "catalogos-gti", "gti-source-candidates.json");
const SITEMAP_URL = "https://www.imotriz.com/products-sitemap.xml";
const DIRECT_PRODUCT_PAGE = (sku) => `https://www.imotriz.com/producto/3/${encodeURIComponent(sku)}-/`;
const MAX_SITEMAP_PAGES = 18;
const args = process.argv.slice(2);

const option = (name, fallback = null) => {
  const index = args.indexOf(name);
  return index === -1 ? fallback : args[index + 1] || fallback;
};
const has = (name) => args.includes(name);
const normal = (value) => String(value || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
const pages = Number.parseInt(option("--sitemap-pages", String(MAX_SITEMAP_PAGES)), 10);
const verificationLimit = Number.parseInt(option("--verify-limit", "0"), 10);
const delayMs = Number.parseInt(option("--delay-ms", "1500"), 10);
const output = path.resolve(option("--output", DEFAULT_OUTPUT));
const probeAll = has("--probe-all");

if (!Number.isSafeInteger(pages) || pages < 1 || pages > MAX_SITEMAP_PAGES) {
  throw new Error(`--sitemap-pages debe estar entre 1 y ${MAX_SITEMAP_PAGES}`);
}
if (!Number.isSafeInteger(verificationLimit) || verificationLimit < 0) {
  throw new Error("--verify-limit debe ser cero o un entero positivo");
}
if (!Number.isSafeInteger(delayMs) || delayMs < 500) {
  throw new Error("--delay-ms debe ser un entero de al menos 500 ms");
}
if (has("--verify-pages") && verificationLimit === 0) {
  throw new Error("--verify-pages requiere --verify-limit para limitar las solicitudes a fichas públicas");
}

const pending = products
  .filter((product) => product.brand?.slug === "gti" && product.imageStatus === "photo-pending")
  .map((product) => ({
    sku: product.sku,
    key: normal(product.sku),
    name: product.name,
    stock: Number(product.stock) || 0,
    inStock: Boolean(product.inStock),
  }));

async function cachedText(url, kind) {
  const hash = crypto.createHash("sha256").update(url).digest("hex");
  const cacheFile = path.join(CACHE_DIR, `${kind}-${hash}.txt`);
  if (!has("--refresh")) {
    try { return await fs.readFile(cacheFile, "utf8"); } catch {}
  }
  const response = await fetch(url, {
    headers: {
      // Algunos distribuidores bloquean agentes no navegadores aun cuando las
      // fichas son públicas. Un UA de navegador evita falsos 429; el retardo y
      // la caché siguen limitando cada ficha a una sola consulta.
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/138.0 Safari/537.36 REMBERT-GTI-Source-Audit/1.0",
      accept: kind === "sitemap" ? "application/xml,text/xml;q=0.9,*/*;q=0.8" : "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
    },
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) throw new Error(`${response.status} al leer ${url}`);
  const text = await response.text();
  await fs.mkdir(CACHE_DIR, { recursive: true });
  await fs.writeFile(cacheFile, text);
  return text;
}

const sitemapUrls = [];
const sitemapErrors = [];
if (!probeAll) {
  for (let page = 0; page < pages; page += 1) {
    const url = `${SITEMAP_URL}${page ? `?page=${page}` : ""}`;
    try {
      const xml = await cachedText(url, "sitemap");
      sitemapUrls.push(...[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]));
    } catch (error) {
      // Un sitemap lento no invalida los hallazgos de las páginas que sí se
      // pudieron revisar. El informe conserva el error para reintentar sólo
      // esa página, en vez de perder el progreso completo.
      sitemapErrors.push({ page, url, error: error.message });
    }
  }
}

const discovered = new Map(pending.map((product) => [product.key, { ...product, pages: [] }]));
const GTI_REFERENCE_IN_URL = /GTI(?:[-_]?(?:\d{2,3}|[A-Z]{2}))?[-_]?[A-Z0-9]{3}/gi;
for (const url of sitemapUrls) {
  for (const match of url.matchAll(GTI_REFERENCE_IN_URL)) {
    const item = discovered.get(normal(match[0]));
    if (item && !item.pages.includes(url)) {
      item.pages.push(url);
    }
  }
}
if (probeAll) {
  for (const item of discovered.values()) item.pages = [DIRECT_PRODUCT_PAGE(item.sku)];
}

function findProductSchema(value) {
  if (!value || typeof value !== "object") return null;
  if (Array.isArray(value)) {
    for (const entry of value) {
      const product = findProductSchema(entry);
      if (product) return product;
    }
    return null;
  }
  const types = Array.isArray(value["@type"]) ? value["@type"] : [value["@type"]];
  if (types.includes("Product")) return value;
  if (value["@graph"]) return findProductSchema(value["@graph"]);
  return null;
}

function absoluteImage(image, pageUrl) {
  const raw = Array.isArray(image) ? image[0] : image;
  return raw ? new URL(raw, pageUrl).href : null;
}

function isPlaceholderImage(image) {
  const value = String(image || "").toLowerCase();
  return value.includes("imotriz_product_box")
    || value.includes("solicitar-foto")
    || value.includes("76c623939494f9d36a95f7c2145f5fe4");
}

async function verifyCandidate(item) {
  const page = item.pages[0];
  if (!page) return null;
  const html = await cachedText(page, "product");
  const jsonLd = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .map((match) => match[1].trim())
    .flatMap((text) => {
      try { return [JSON.parse(text)]; } catch { return []; }
    });
  const schema = jsonLd.map(findProductSchema).find(Boolean);
  if (!schema) return {
    page,
    metadataExact: false,
    publicationApproved: false,
    reason: "La ficha no expone Product JSON-LD",
  };
  const identifiers = [schema.sku, ...(Array.isArray(schema.mpn) ? schema.mpn : [schema.mpn])]
    .filter(Boolean)
    .map(normal);
  const brand = typeof schema.brand === "string" ? schema.brand : schema.brand?.name;
  const exactReference = identifiers.includes(item.key);
  const exactBrand = normal(brand) === "GTI";
  const image = absoluteImage(schema.image, page);
  const placeholder = isPlaceholderImage(image);
  return {
    page,
    metadataExact: exactReference && exactBrand && Boolean(image) && !placeholder,
    // Un sitio público puede probar que una ficha nombra el SKU, pero no da
    // por sí solo permiso para reutilizar su fotografía. La aprobación exige
    // autorización de uso y revisión visual registradas en el lote de carga.
    publicationApproved: false,
    name: schema.name || null,
    brand: brand || null,
    identifiers,
    image,
    reason: exactReference && exactBrand && image && !placeholder
      ? "Coincidencia documental; falta autorización de uso y revisión visual de la fotografía."
      : placeholder
        ? "La ficha usa una imagen de marcador o reutilizada; no es una foto exacta publicable."
      : "La ficha no confirma simultáneamente marca GTI, SKU exacto e imagen",
  };
}

const withPages = [...discovered.values()]
  .filter((item) => item.pages.length)
  .sort((a, b) => Number(b.inStock) - Number(a.inStock) || b.stock - a.stock || a.sku.localeCompare(b.sku));

// Conserva los resultados de las fichas ya inspeccionadas. Así una ejecución
// posterior continúa con las pendientes en vez de volver a solicitar las
// mismas páginas y consumir cuota del proveedor.
try {
  const previous = JSON.parse(await fs.readFile(output, "utf8"));
  const previousBySku = new Map((previous.references || []).map((item) => [item.sku, item.candidate]));
  for (const item of withPages) {
    const candidate = previousBySku.get(item.sku);
    if (candidate?.page === item.pages[0]) item.candidate = candidate;
  }
} catch {}

let verificationStoppedAt = null;
if (has("--verify-pages")) {
  const uninspected = withPages.filter((item) => !item.candidate || item.candidate.reason?.startsWith("Verificación no completada:"));
  for (const item of uninspected.slice(0, verificationLimit)) {
    try {
      item.candidate = await verifyCandidate(item);
    } catch (error) {
      item.candidate = {
        page: item.pages[0],
        metadataExact: false,
        publicationApproved: false,
        reason: `Verificación no completada: ${error.message}`,
      };
      if (/^429\b/.test(String(error.message))) {
        verificationStoppedAt = item.sku;
        break;
      }
    }
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
}

// La ficha puede declarar el SKU correcto y aun así reutilizar una imagen de
// placeholder para varias referencias. Una foto exacta no puede validar más
// de una tarjeta GTI distinta sin evidencia adicional de equivalencia.
const imageOwners = new Map();
for (const item of withPages) {
  const image = item.candidate?.image;
  if (image) imageOwners.set(image, [...(imageOwners.get(image) || []), item.sku]);
}
for (const item of withPages) {
  const owners = imageOwners.get(item.candidate?.image) || [];
  if (item.candidate?.metadataExact && owners.length > 1) {
    item.candidate.metadataExact = false;
    item.candidate.reason = `La misma imagen se reutiliza para ${owners.join(", ")}; no prueba una foto exacta por referencia.`;
  }
}

const report = {
  generatedAt: new Date().toISOString(),
  source: {
    sitemap: SITEMAP_URL,
    discovery: probeAll ? "Consulta directa de ficha por cada SKU GTI pendiente." : "Búsqueda por sitemap público.",
    note: "Las URLs son candidatas de fichas públicas. La imagen no se descarga ni se publica hasta contar con autorización de uso y validación visual.",
  },
  totals: {
    pendingGtiCards: pending.length,
    sitemapPagesRequested: probeAll ? 0 : pages,
    sitemapPagesRead: probeAll ? 0 : pages - sitemapErrors.length,
    sitemapUrlsRead: sitemapUrls.length,
    referenceCandidates: withPages.length,
    pagesInspected: withPages.filter((item) => item.candidate && !item.candidate.reason?.startsWith("Verificación no completada:")).length,
    retryableVerificationErrors: withPages.filter((item) => item.candidate?.reason?.startsWith("Verificación no completada:")).length,
    metadataExactCandidates: withPages.filter((item) => item.candidate?.metadataExact).length,
    publicationApproved: withPages.filter((item) => item.candidate?.publicationApproved).length,
    verificationStoppedAt,
  },
  sitemapErrors,
  references: [...discovered.values()]
    .sort((a, b) => Number(b.inStock) - Number(a.inStock) || b.stock - a.stock || a.sku.localeCompare(b.sku))
    .map(({ key, ...item }) => item),
};

await fs.mkdir(path.dirname(output), { recursive: true });
await fs.writeFile(output, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ ...report.totals, output }, null, 2));
