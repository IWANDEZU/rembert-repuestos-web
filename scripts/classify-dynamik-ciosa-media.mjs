import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { classifyCiosaMedia } from "./lib/dynamik-ciosa-media-classifier.mjs";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(scriptDir, "..");
const manifestPath = resolve(rootDir, "src", "data", "dynamikCiosaPhotoAssets.generated.js");
const source = await readFile(manifestPath, "utf8");
const match = source.match(/const dynamikCiosaPhotoAssets = (\{[\s\S]*\});\s*\n\s*export default/);
if (!match) throw new Error("No se pudo leer el manifiesto Ciosa generado.");

const records = JSON.parse(match[1]);
const entries = Object.values(records).flatMap((record) => (
  (record.views || []).map((view) => ({ record, view }))
));
let nextIndex = 0;

await Promise.all(Array.from({ length: 12 }, async () => {
  while (nextIndex < entries.length) {
    const { record, view } = entries[nextIndex];
    nextIndex += 1;
    if (view.isSharedAcrossSkus) {
      view.mediaType = "generic-packaging";
      view.analysis = undefined;
      view.label = "Empaque genérico Dynamik";
      view.alt = `Empaque genérico Dynamik; no representa el NPC ${record.sku}`;
      continue;
    }

    const localPath = resolve(rootDir, "public", view.url.replace(/^\//, ""));
    const classification = await classifyCiosaMedia(localPath);
    view.mediaType = classification.mediaType;
    view.analysis = classification.analysis;
    view.label = classification.mediaType === "photo" ? "Fotografía del producto" : "Plano técnico";
    view.alt = classification.mediaType === "photo"
      ? `Fotografía real de ${record.name}, NPC ${record.sku}`
      : `Plano técnico oficial de ${record.name}, NPC ${record.sku}`;
  }
}));

for (const record of Object.values(records)) {
  const hasExactPhoto = (record.views || []).some((view) => !view.isSharedAcrossSkus && view.mediaType === "photo");
  record.imageStatus = hasExactPhoto ? "official-catalog-watermarked" : "official-catalog-technical-only";
  record.imageDisclosure = hasExactPhoto
    ? "Fotografía real de catálogo Ciosa para este NPC; los planos se muestran solo como detalle técnico."
    : "Ciosa publica datos o planos para este NPC, pero no una fotografía real exclusiva; la foto permanece pendiente.";
}

const header = "// Archivo generado por scripts/import-dynamik-ciosa-media.mjs y clasificado por scripts/classify-dynamik-ciosa-media.mjs.\n// No editar manualmente: cada vista conserva URL fuente, hash, dimensiones y tipo de contenido.\n";
await writeFile(manifestPath, `${header}const dynamikCiosaPhotoAssets = ${JSON.stringify(records, null, 2)};\n\nexport default dynamikCiosaPhotoAssets;\n`, "utf8");

const physicalRecords = Object.values(records);
const summary = {
  records: physicalRecords.length,
  recordsWithExactPhoto: physicalRecords.filter((record) => record.imageStatus === "official-catalog-watermarked").length,
  recordsWithTechnicalDiagramsOnly: physicalRecords.filter((record) => (
    record.imageStatus === "official-catalog-technical-only"
    && (record.views || []).some((view) => view.mediaType === "technical-diagram")
  )).length,
  exactPhotos: entries.filter(({ view }) => view.mediaType === "photo").length,
  technicalDiagrams: entries.filter(({ view }) => view.mediaType === "technical-diagram").length,
  genericPackaging: entries.filter(({ view }) => view.mediaType === "generic-packaging").length,
};
console.log(JSON.stringify(summary, null, 2));

