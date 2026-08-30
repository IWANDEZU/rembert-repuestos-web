import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import dynamikSourcedPhotoManifest from "../src/data/dynamikSourcedPhotoManifest.js";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(scriptDir, "..");
const rawDir = resolve(rootDir, "assets", "source-homecenter");
const publicDir = resolve(rootDir, "public", "catalogo-dynamik", "sourced");
const registryPath = resolve(rootDir, "src", "data", "dynamikSourcedPhotoAssets.generated.js");
const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const registry = {};
const outputHashes = new Map();

await mkdir(publicDir, { recursive: true });

for (const entry of dynamikSourcedPhotoManifest) {
  if (!entry.views?.length || !entry.views.some((view) => view.isMain)) {
    throw new Error(`${entry.sku}: la fuente exacta necesita al menos una vista principal.`);
  }

  const processedViews = [];
  const sourceHashes = [];
  for (const [index, view] of entry.views.entries()) {
    const sourceBuffer = await readFile(resolve(rawDir, view.sourceFile));
    const sourceHash = sha256(sourceBuffer);
    const metadata = await sharp(sourceBuffer).metadata();
    if (!metadata.width || !metadata.height || metadata.width < 800 || metadata.height < 800) {
      throw new Error(`${entry.sku}: ${view.sourceFile} no tiene resolución suficiente.`);
    }

    // Normalización determinística: fondo blanco, reducción proporcional y
    // nitidez leve. No se añade, elimina ni recolorea ningún componente.
    const output = await sharp(sourceBuffer)
      .rotate()
      .flatten({ background: "#ffffff" })
      .resize({ width: 1200, height: 800, fit: "contain", background: "#ffffff" })
      .sharpen({ sigma: 0.5, m1: 0.35, m2: 0.2 })
      .webp({ quality: 96, smartSubsample: false, effort: 6 })
      .toBuffer();
    const outputHash = sha256(output);
    if (outputHashes.has(outputHash)) throw new Error(`${entry.sku}: vista duplicada con ${outputHashes.get(outputHash)}.`);
    outputHashes.set(outputHash, `${entry.sku}:${view.label}`);

    const filename = `${entry.sku.toLowerCase()}-${index + 1}.webp`;
    await writeFile(resolve(publicDir, filename), output);
    sourceHashes.push(sourceHash);
    processedViews.push({
      url: `/catalogo-dynamik/sourced/${filename}`,
      alt: `${view.label} real de pastillas Dynamik ${entry.sku}`,
      label: view.label,
      isMain: Boolean(view.isMain),
      zoom: Boolean(view.zoom),
      sha256: outputHash,
      sourceSha256: sourceHash,
      sourceImageUrl: view.sourceImageUrl,
    });
  }

  registry[entry.sku] = {
    sku: entry.sku,
    imageStatus: "exact-real-photo",
    sourceProof: {
      sha256: processedViews.find((view) => view.isMain)?.sha256 || processedViews[0].sha256,
      sourceHashes,
      sourceKind: "retailer-exact-reference-photo",
      retailer: entry.retailer,
      manufacturer: entry.manufacturer,
      sourceProductCode: entry.sourceProductCode,
      sourcePageUrl: entry.sourcePageUrl,
      exactReferenceEvidence: entry.exactReferenceEvidence,
      approvedBy: "cruce-npc-y-marcacion-visible",
      approvedAt: entry.approvedAt,
    },
    views: processedViews,
  };
}

const ordered = Object.fromEntries(Object.entries(registry).sort(([left], [right]) => left.localeCompare(right)));
const generated = `// Generado por scripts/build-dynamik-sourced-photo-assets.mjs. No editar manualmente.\nconst dynamikSourcedPhotoAssets = ${JSON.stringify(ordered, null, 2)};\n\nexport default dynamikSourcedPhotoAssets;\n`;
await writeFile(registryPath, generated, "utf8");
console.log(JSON.stringify({ sourcedExactPhotos: Object.keys(ordered).length, publicDir, registryPath }, null, 2));
