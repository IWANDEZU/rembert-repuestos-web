import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import manifest from "../src/data/dynamikSourcedPhotoManifest.js";
import registry from "../src/data/dynamikSourcedPhotoAssets.generated.js";
import { products } from "../src/lib/products.js";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const failures = [];
const manifestBySku = new Map(manifest.map((entry) => [entry.sku, entry]));
const outputHashes = new Map();

for (const [sku, record] of Object.entries(registry)) {
  const source = manifestBySku.get(sku);
  if (!source || record.imageStatus !== "exact-real-photo") {
    failures.push(`${sku}: registro sin manifiesto exacto.`);
    continue;
  }
  if (record.sourceProof?.sourceKind !== "retailer-exact-reference-photo" || !record.sourceProof?.sourcePageUrl) {
    failures.push(`${sku}: procedencia incompleta.`);
  }
  if (!source.exactReferenceEvidence?.includes(sku)) failures.push(`${sku}: falta evidencia textual del NPC.`);
  for (const view of record.views || []) {
    try {
      const data = await readFile(resolve(rootDir, "public", view.url.slice(1)));
      const hash = sha256(data);
      if (hash !== view.sha256) failures.push(`${sku}: hash de ${view.label} no coincide.`);
      if (outputHashes.has(hash)) failures.push(`${sku}: imagen repetida con ${outputHashes.get(hash)}.`);
      outputHashes.set(hash, `${sku}:${view.label}`);
    } catch {
      failures.push(`${sku}: falta el archivo ${view.url}.`);
    }
  }
}

for (const entry of manifest) {
  if (!registry[entry.sku]) failures.push(`${entry.sku}: no fue generado.`);
  const product = products.find((item) => item.sku === entry.sku);
  if (!product || product.imageStatus !== "exact-real-photo" || product.imageReferenceSourceUrl !== entry.sourcePageUrl) {
    failures.push(`${entry.sku}: la ficha no publica la foto exacta con su fuente.`);
  }
}

console.log(JSON.stringify({ sourcedExactPhotos: manifest.length, registered: Object.keys(registry).length, failures }, null, 2));
if (failures.length) process.exitCode = 1;
