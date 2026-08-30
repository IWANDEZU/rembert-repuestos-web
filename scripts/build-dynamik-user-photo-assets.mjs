import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import dynamikUserPhotoManifest from "../src/data/dynamikUserPhotoManifest.js";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(scriptDir, "..");
const rawDir = resolve(rootDir, "assets", "dynamik-user-intake", "raw");
const publicDir = resolve(rootDir, "public", "catalogo-dynamik", "verified");
const registryPath = resolve(rootDir, "src", "data", "dynamikLocalPhotoAssets.generated.js");
const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const outputsByHash = new Map();
const registry = {};

const foregroundBounds = (pixels, info) => {
  const channels = info.channels;
  const minimumPixelsInLine = 3;
  const columnHits = new Uint32Array(info.width);
  const rowHits = new Uint32Array(info.height);

  for (let y = 0; y < info.height; y += 1) {
    for (let x = 0; x < info.width; x += 1) {
      const offset = (y * info.width + x) * channels;
      const red = pixels[offset];
      const green = pixels[offset + 1];
      const blue = pixels[offset + 2];
      // Fondo blanco real o transparente ya aplanado. Se conserva el detalle
      // de la pastilla, incluidas sombras y accesorios visibles de la misma foto.
      if (Math.min(red, green, blue) >= 245) continue;
      columnHits[x] += 1;
      rowHits[y] += 1;
    }
  }

  const activeColumns = [...columnHits.keys()].filter((index) => columnHits[index] >= minimumPixelsInLine);
  const activeRows = [...rowHits.keys()].filter((index) => rowHits[index] >= minimumPixelsInLine);
  if (!activeColumns.length || !activeRows.length) return null;

  const padding = Math.max(8, Math.round(Math.min(info.width, info.height) * 0.04));
  const left = Math.max(0, activeColumns[0] - padding);
  const top = Math.max(0, activeRows[0] - padding);
  const right = Math.min(info.width, activeColumns.at(-1) + padding + 1);
  const bottom = Math.min(info.height, activeRows.at(-1) + padding + 1);
  return { left, top, width: right - left, height: bottom - top };
};

await mkdir(publicDir, { recursive: true });

for (const entry of dynamikUserPhotoManifest) {
  const sourcePath = resolve(rawDir, entry.sourceFile);
  const sourceBuffer = await readFile(sourcePath);
  const sourceHash = sha256(sourceBuffer);
  const metadata = await sharp(sourceBuffer).metadata();
  if (!metadata.width || !metadata.height || metadata.width < 900 || metadata.height < 450) {
    throw new Error(`${entry.sku}: la lámina no tiene resolución suficiente.`);
  }

  const left = Math.max(0, Math.round(metadata.width * entry.crop.leftPct));
  const top = Math.max(0, Math.round(metadata.height * entry.crop.topPct));
  const width = Math.min(metadata.width - left, Math.round(metadata.width * entry.crop.widthPct));
  const height = Math.min(metadata.height - top, Math.round(metadata.height * entry.crop.heightPct));
  if (width < 100 || height < 40) throw new Error(`${entry.sku}: recorte inválido.`);

  const initialCrop = await sharp(sourceBuffer)
    .extract({ left, top, width, height })
    .flatten({ background: "#ffffff" })
    .raw()
    .toBuffer({ resolveWithObject: true });
  const bounds = foregroundBounds(initialCrop.data, initialCrop.info);
  if (!bounds || bounds.width < 100 || bounds.height < 40) {
    throw new Error(`${entry.sku}: no se identificó una pieza física dentro del recorte aprobado.`);
  }

  const finalLeft = left + bounds.left;
  const finalTop = top + bounds.top;
  const finalWidth = bounds.width;
  const finalHeight = bounds.height;
  const detailWidth = Math.max(100, Math.round(finalWidth * 0.72));
  const detailLeft = Math.min(
    metadata.width - detailWidth,
    finalLeft + Math.max(0, Math.round((finalWidth - detailWidth) / 2)),
  );

  // Extracción determinística: sólo reduce el fondo blanco y no añade ni modifica
  // componentes de la pieza. La prueba conserva las coordenadas de origen.
  const crop = await sharp(sourceBuffer)
    .extract({ left: finalLeft, top: finalTop, width: finalWidth, height: finalHeight })
    .flatten({ background: "#ffffff" })
    .resize({ width: 1200, height: 800, fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
    // Realce de borde determinístico; no reconstruye ni altera la geometría.
    .sharpen({ sigma: 0.65, m1: 0.45, m2: 0.25 })
    .webp({ quality: 100, smartSubsample: false, effort: 6 })
    .toBuffer();
  const cropHash = sha256(crop);
  if (outputsByHash.has(cropHash)) {
    throw new Error(`${entry.sku}: recorte idéntico al NPC ${outputsByHash.get(cropHash)}.`);
  }
  outputsByHash.set(cropHash, entry.sku);

  // El detalle es un recorte de la misma fotografía física, no una segunda
  // pieza ni una imagen generada. Permite revisar textura y silueta en el slider.
  const detail = await sharp(sourceBuffer)
    .extract({ left: detailLeft, top: finalTop, width: detailWidth, height: finalHeight })
    .flatten({ background: "#ffffff" })
    .resize({ width: 1200, height: 800, fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .sharpen({ sigma: 0.65, m1: 0.45, m2: 0.25 })
    .webp({ quality: 100, smartSubsample: false, effort: 6 })
    .toBuffer();
  const detailHash = sha256(detail);
  if (outputsByHash.has(detailHash)) {
    throw new Error(`${entry.sku}: detalle idéntico al recurso ${outputsByHash.get(detailHash)}.`);
  }
  outputsByHash.set(detailHash, `${entry.sku}:detalle`);

  const filename = `${entry.sku.toLowerCase()}-producto.webp`;
  const detailFilename = `${entry.sku.toLowerCase()}-detalle.webp`;
  await writeFile(resolve(publicDir, filename), crop);
  await writeFile(resolve(publicDir, detailFilename), detail);
  registry[entry.sku] = {
    sku: entry.sku,
    imageStatus: "exact-real-photo",
    sourceProof: {
      sha256: cropHash,
      sourceSha256: sourceHash,
      sourceKind: entry.sourceKind,
      sourceFile: entry.sourceFile,
      crop: {
        initialLeft: left,
        initialTop: top,
        initialWidth: width,
        initialHeight: height,
        left: finalLeft,
        top: finalTop,
        width: finalWidth,
        height: finalHeight,
        sourceWidth: metadata.width,
        sourceHeight: metadata.height,
      },
      detail: {
        sha256: detailHash,
        left: detailLeft,
        top: finalTop,
        width: detailWidth,
        height: finalHeight,
      },
      watermark: entry.watermark,
      approvedBy: "material-aportado-por-usuario",
      approvedAt: "2026-08-30",
    },
    views: [
      {
        url: `/catalogo-dynamik/verified/${filename}`,
        alt: `Pastilla de freno Dynamik ${entry.sku}`,
        label: entry.view,
        isMain: Boolean(entry.isMain),
        sha256: cropHash,
      },
      {
        url: `/catalogo-dynamik/verified/${detailFilename}`,
        alt: `Detalle de la misma fotografía física de la pastilla Dynamik ${entry.sku}`,
        label: "Detalle",
        zoom: true,
        isDerivative: true,
        sha256: detailHash,
      },
    ],
  };
}

const orderedRegistry = Object.fromEntries(Object.entries(registry).sort(([left], [right]) => left.localeCompare(right)));
const generated = `// Generado por scripts/build-dynamik-user-photo-assets.mjs. No editar manualmente.\n// Solo contiene fotografías recortadas de material aportado por el usuario.\nconst dynamikLocalPhotoAssets = ${JSON.stringify(orderedRegistry, null, 2)};\n\nexport default dynamikLocalPhotoAssets;\n`;
await writeFile(registryPath, generated, "utf8");
console.log(JSON.stringify({ verifiedProductPhotos: Object.keys(orderedRegistry).length, publicDir, registryPath }, null, 2));
