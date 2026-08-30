import { createHash } from "node:crypto";
import { access, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import dynamikUserPhotoManifest from "../src/data/dynamikUserPhotoManifest.js";
import dynamikLocalPhotoAssets from "../src/data/dynamikLocalPhotoAssets.generated.js";
import dynamikSourcedPhotoAssets from "../src/data/dynamikSourcedPhotoAssets.generated.js";
import { products } from "../src/lib/products.js";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(scriptDir, "..");
const rawDir = resolve(rootDir, "assets", "dynamik-user-intake", "raw");
const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const manifestBySku = new Map(dynamikUserPhotoManifest.map((entry) => [entry.sku, entry]));
const failures = [];
const outputHashes = new Map();

for (const [sku, record] of Object.entries(dynamikLocalPhotoAssets)) {
  const manifest = manifestBySku.get(sku);
  if (!manifest || record.sku !== sku || record.imageStatus !== "exact-real-photo") {
    failures.push(`${sku}: metadatos de registro inválidos.`);
    continue;
  }
  if (record.sourceProof?.watermark !== "none" || record.sourceProof?.sourceKind !== "captura-aportada-por-usuario") {
    failures.push(`${sku}: procedencia o estado de marca inválido.`);
  }
  const view = record.views?.find((item) => item.isMain);
  const detail = record.views?.find((item) => item.label === "Detalle");
  if (!view || view.label !== "Producto" || !view.url.startsWith("/catalogo-dynamik/verified/") || /referencial|generated/i.test(view.url)) {
    failures.push(`${sku}: vista principal no válida.`);
    continue;
  }
  if (!detail || !detail.zoom || !detail.isDerivative || !detail.url.startsWith("/catalogo-dynamik/verified/") || !detail.sha256) {
    failures.push(`${sku}: vista de detalle no válida.`);
    continue;
  }
  if (record.views.length !== 2) failures.push(`${sku}: la galería debe contener exactamente producto y detalle.`);
  const rawPath = resolve(rawDir, manifest.sourceFile);
  try {
    const [mainOutput, detailOutput, source] = await Promise.all([
      readFile(resolve(rootDir, "public", view.url.slice(1))),
      readFile(resolve(rootDir, "public", detail.url.slice(1))),
      readFile(rawPath),
    ]);
    if (sha256(mainOutput) !== record.sourceProof?.sha256 || sha256(mainOutput) !== view.sha256) failures.push(`${sku}: hash del recorte no coincide.`);
    if (sha256(detailOutput) !== record.sourceProof?.detail?.sha256 || sha256(detailOutput) !== detail.sha256) failures.push(`${sku}: hash del detalle no coincide.`);
    if (sha256(source) !== record.sourceProof?.sourceSha256) failures.push(`${sku}: hash de lámina no coincide.`);
    for (const item of [{ hash: view.sha256, label: "producto" }, { hash: detail.sha256, label: "detalle" }]) {
      if (outputHashes.has(item.hash)) failures.push(`${sku}: comparte ${item.label} con ${outputHashes.get(item.hash)}.`);
      outputHashes.set(item.hash, `${sku}:${item.label}`);
    }
  } catch {
    failures.push(`${sku}: archivo de imagen o lámina no disponible.`);
  }
}

for (const entry of dynamikUserPhotoManifest) {
  if (!dynamikLocalPhotoAssets[entry.sku]) failures.push(`${entry.sku}: falta en registro generado.`);
}

const dynamik = products.filter((product) => product?.brand?.slug === "dynamik");
const publishedWithPhoto = dynamik.filter((product) => product.imageStatus === "exact-real-photo");
const productMismatch = publishedWithPhoto
  .filter((product) => !dynamikLocalPhotoAssets[product.sku] && !dynamikSourcedPhotoAssets[product.sku])
  .map((product) => product.sku);
if (productMismatch.length) failures.push(`SKU publicados fuera del registro: ${productMismatch.join(", ")}.`);

console.log(JSON.stringify({
  userSuppliedProductPhotos: dynamikUserPhotoManifest.length,
  registeredProductPhotos: Object.keys(dynamikLocalPhotoAssets).length,
  publishedWithPhoto: publishedWithPhoto.length,
  failures,
}, null, 2));

if (failures.length) process.exitCode = 1;
