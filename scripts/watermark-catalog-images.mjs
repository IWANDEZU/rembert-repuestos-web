import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const [sourceDir, outputDir, watermarkFile] = process.argv.slice(2);

if (!sourceDir || !outputDir || !watermarkFile) {
  console.error("Uso: node scripts/watermark-catalog-images.mjs <origen> <salida> <marca.png>");
  process.exit(1);
}

const supported = new Set([".jpg", ".jpeg", ".png", ".webp"]);
await fs.mkdir(outputDir, { recursive: true });

const watermarkBase = sharp(watermarkFile).ensureAlpha();
const watermarkMetadata = await watermarkBase.metadata();
const watermarkSize = Math.min(watermarkMetadata.width ?? 1, watermarkMetadata.height ?? 1);

const circularWatermark = await watermarkBase
  .resize(watermarkSize, watermarkSize, { fit: "cover" })
  .composite([
    {
      input: Buffer.from(
        `<svg width="${watermarkSize}" height="${watermarkSize}">
          <circle cx="${watermarkSize / 2}" cy="${watermarkSize / 2}" r="${watermarkSize / 2}" fill="white"/>
        </svg>`,
      ),
      blend: "dest-in",
    },
  ])
  .png()
  .toBuffer();

const entries = await fs.readdir(sourceDir, { withFileTypes: true });
let processed = 0;

for (const entry of entries) {
  if (!entry.isFile() || !supported.has(path.extname(entry.name).toLowerCase())) continue;

  const inputPath = path.join(sourceDir, entry.name);
  const outputPath = path.join(outputDir, `${path.parse(entry.name).name}.webp`);
  const image = sharp(inputPath).rotate();
  const metadata = await image.metadata();
  const width = metadata.width ?? 1200;
  const height = metadata.height ?? 1200;
  const markWidth = Math.max(52, Math.round(Math.min(width, height) * 0.16));
  const margin = Math.max(14, Math.round(Math.min(width, height) * 0.025));

  const watermark = await sharp(circularWatermark)
    .resize(markWidth, markWidth)
    .modulate({ brightness: 1, saturation: 1 })
    .composite([
      {
        input: Buffer.from(
          `<svg width="${markWidth}" height="${markWidth}">
            <rect width="100%" height="100%" fill="white" fill-opacity="0.78"/>
          </svg>`,
        ),
        blend: "dest-in",
      },
    ])
    .png()
    .toBuffer();

  await image
    .composite([{ input: watermark, left: width - markWidth - margin, top: height - markWidth - margin }])
    .webp({ quality: 82, effort: 5 })
    .toFile(outputPath);

  processed += 1;
  console.log(`${entry.name} -> ${path.basename(outputPath)}`);
}

console.log(`Procesadas: ${processed}`);
