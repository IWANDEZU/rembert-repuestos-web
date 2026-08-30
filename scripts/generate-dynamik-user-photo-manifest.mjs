import { readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(scriptDir, "..");
const mapPath = resolve(rootDir, "tmp", "dynamik-user-photo-card-map.json");
const inputDir = resolve(rootDir, "assets", "dynamik-user-intake", "raw");
const outputPath = resolve(rootDir, "src", "data", "dynamikUserPhotoManifest.js");
const cardMap = JSON.parse(await readFile(mapPath, "utf8"));
const stagedFiles = await readdir(inputDir);

const cropByColumn = {
  L: { leftPct: 0, topPct: 0.08, widthPct: 1 / 3, heightPct: 0.45 },
  C: { leftPct: 1 / 3, topPct: 0.08, widthPct: 1 / 3, heightPct: 0.45 },
  R: { leftPct: 2 / 3, topPct: 0.08, widthPct: 1 / 3, heightPct: 0.45 },
};
// Ajustes exclusivamente de encuadre para excluir elementos de la captura
// (no editan, reconstruyen ni cambian la pieza física fotografiada).
const cropBySku = {
  DNK7169D317SM: { leftPct: 1 / 3, topPct: 0.17, widthPct: 1 / 3, heightPct: 0.24 },
  DNK7219D319SM: { leftPct: 0, topPct: 0.18, widthPct: 1 / 3, heightPct: 0.25 },
  DNK7220D320LM: { leftPct: 2 / 3, topPct: 0.18, widthPct: 1 / 3, heightPct: 0.25 },
  DNK7286D396CK: { leftPct: 1 / 3 + 0.02, topPct: 0.08, widthPct: 1 / 3 - 0.02, heightPct: 0.45 },
  DNK7288D399SM: { leftPct: 0.015, topPct: 0.08, widthPct: 1 / 3 - 0.015, heightPct: 0.45 },
  DNK7345D465LM: { leftPct: 0.015, topPct: 0.08, widthPct: 1 / 3 - 0.015, heightPct: 0.45 },
  DNK7547D669SM: { leftPct: 0, topPct: 0.25, widthPct: 1 / 3, heightPct: 0.18 },
  DNK7559D680LM: { leftPct: 0, topPct: 0.08, widthPct: 1 / 3, heightPct: 0.4 },
  DNK7560D681CK: { leftPct: 1 / 3, topPct: 0.08, widthPct: 1 / 3, heightPct: 0.4 },
  DNK7563D688LM: { leftPct: 2 / 3, topPct: 0.08, widthPct: 1 / 3, heightPct: 0.4 },
  DNK7685D808SD: { leftPct: 0, topPct: 0.1, widthPct: 1 / 3, heightPct: 0.22 },
  DNK7688D863SM: { leftPct: 2 / 3, topPct: 0.1, widthPct: 1 / 3, heightPct: 0.22 },
  DNK7740D865LM: { leftPct: 2 / 3, topPct: 0.08, widthPct: 1 / 3, heightPct: 0.3 },
  DNK7741D866LM: { leftPct: 0, topPct: 0.08, widthPct: 1 / 3, heightPct: 0.39 },
};
const references = [];
const seenSkus = new Set();

for (const frame of cardMap) {
  const prefix = String(frame.sourcePrefix || "").trim().toLowerCase();
  const sourceFiles = stagedFiles.filter((file) => file.toLowerCase().startsWith(`codex-clipboard-${prefix}-`) && file.toLowerCase().endsWith(".png"));
  if (!frame.cards?.some((card) => card.kind === "producto")) continue;
  if (sourceFiles.length !== 1) throw new Error(`No se encontró una sola lámina staged para ${prefix}.`);

  for (const card of frame.cards) {
    if (card.kind !== "producto") continue;
    const sku = String(card.sku || "").trim().toUpperCase();
    const crop = cropBySku[sku] || cropByColumn[card.column];
    if (!sku || !crop) throw new Error(`Tarjeta inválida en ${prefix}: ${JSON.stringify(card)}.`);
    if (seenSkus.has(sku)) continue;
    seenSkus.add(sku);
    references.push({
      sku,
      sourceFile: sourceFiles[0],
      sourceKind: "captura-aportada-por-usuario",
      watermark: "none",
      crop,
      view: "Producto",
      isMain: true,
    });
  }
}

references.sort((left, right) => left.sku.localeCompare(right.sku));
if (!references.length) throw new Error("No hay fotografías de producto aptas en el mapa de láminas.");

const output = `// Generado por scripts/generate-dynamik-user-photo-manifest.mjs. No editar manualmente.\n// Recortes no generativos de material aportado por el usuario, ligados explícitamente a cada NPC.\n\nexport const dynamikUserPhotoManifest = ${JSON.stringify(references, null, 2)};\n\nexport default dynamikUserPhotoManifest;\n`;
await writeFile(outputPath, output, "utf8");
console.log(JSON.stringify({ outputPath, approvedProductPhotos: references.length }, null, 2));
