import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const MAX_BATCH = 10;
const MAX_BYTES = 15 * 1024 * 1024;
const CACHE_DIR = path.join(ROOT, ".catalog-cache", "gti-photo-verification");
const args = process.argv.slice(2);
const input = args.find((arg) => !arg.startsWith("--"));

if (!input) throw new Error("Uso: node scripts/fetch-gti-candidate-previews.mjs <lote.json>");

const clean = (value) => String(value ?? "").trim();
const normalizeKey = (value) => clean(value).toUpperCase().replace(/[^A-Z0-9]/g, "");

function safeUrl(value) {
  const url = new URL(value);
  if (url.protocol !== "https:" || url.username || url.password) {
    throw new Error(`La fuente debe ser HTTPS pública: ${value}`);
  }
  const host = url.hostname.toLowerCase();
  const privateIpv4 = /^(127|10)\./.test(host)
    || /^169\.254\./.test(host)
    || /^192\.168\./.test(host)
    || /^172\.(1[6-9]|2\d|3[01])\./.test(host);
  if (host === "localhost" || host === "::1" || host.endsWith(".local") || privateIpv4) {
    throw new Error(`Host privado no permitido: ${host}`);
  }
  return url;
}

async function readBody(response, url) {
  const length = Number(response.headers.get("content-length") || 0);
  if (length > MAX_BYTES) throw new Error(`Imagen mayor de 15 MB: ${url}`);
  const chunks = [];
  let bytes = 0;
  for await (const chunk of response.body) {
    bytes += chunk.length;
    if (bytes > MAX_BYTES) throw new Error(`Imagen mayor de 15 MB: ${url}`);
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

async function fetchImage(value, referrer = null, redirects = 0) {
  if (redirects > 3) throw new Error("Demasiadas redirecciones al descargar imagen");
  const url = safeUrl(value);
  const response = await fetch(url, {
    redirect: "manual",
    signal: AbortSignal.timeout(20_000),
    headers: {
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/138.0 Safari/537.36",
      ...(referrer ? { referer: safeUrl(referrer).href } : {}),
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
  return { buffer: await readBody(response, url.href), source: url.href, contentType };
}

const batch = JSON.parse(await fs.readFile(path.resolve(input), "utf8"));
if (!Array.isArray(batch) || !batch.length || batch.length > MAX_BATCH) {
  throw new Error(`El lote debe tener entre 1 y ${MAX_BATCH} referencias`);
}

await fs.mkdir(CACHE_DIR, { recursive: true });
const report = [];
for (const row of batch) {
  const sku = clean(row.sku);
  if (!sku || !clean(row.image_source)) {
    report.push({ sku: sku || "(sin SKU)", error: "Falta sku o image_source" });
    continue;
  }
  try {
    const downloaded = await fetchImage(row.image_source, Array.isArray(row.sources) ? row.sources[0] : null);
    const meta = await sharp(downloaded.buffer).metadata();
    const format = meta.format === "jpeg" ? "jpg" : meta.format;
    if (!format || !["png", "jpg", "webp", "avif"].includes(format)) {
      throw new Error(`Formato no admitido para revisión: ${meta.format || "desconocido"}`);
    }
    const hash = crypto.createHash("sha256").update(downloaded.buffer).digest("hex");
    const fileName = `${normalizeKey(sku).toLowerCase()}-${hash.slice(0, 12)}.${format}`;
    const output = path.join(CACHE_DIR, fileName);
    await fs.writeFile(output, downloaded.buffer);
    report.push({
      sku,
      name: clean(row.name),
      source: downloaded.source,
      cacheFile: output,
      sha256: hash,
      bytes: downloaded.buffer.length,
      width: meta.width || null,
      height: meta.height || null,
      format,
      contentType: downloaded.contentType,
    });
  } catch (error) {
    report.push({ sku, error: error.message });
  }
}

const manifest = {
  generatedAt: new Date().toISOString(),
  input: path.resolve(input),
  cacheDirectory: CACHE_DIR,
  reviewed: report.filter((entry) => !entry.error).length,
  failed: report.filter((entry) => entry.error).length,
  references: report,
};
await fs.writeFile(path.join(CACHE_DIR, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify(manifest, null, 2));
if (manifest.failed) process.exitCode = 1;
