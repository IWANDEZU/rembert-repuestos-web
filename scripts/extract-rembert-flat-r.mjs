import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const source = path.join(root, "public", "logo-rembert-transparent.png");
const outputDir = path.join(root, "public", "brand");
const output = path.join(outputDir, "rembert-r-flat-transparent.png");
const lockupOutput = path.join(outputDir, "rembert-lockup-transparent.png");
const vividLockupOutput = path.join(outputDir, "rembert-lockup-vivid-yellow.png");

await fs.mkdir(outputDir, { recursive: true });

await sharp(source)
  .extract({ left: 0, top: 0, width: 200, height: 230 })
  .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .resize({ height: 512, fit: "inside", withoutEnlargement: false })
  .png()
  .toFile(output);

// Logotipo horizontal sin las líneas decorativas inferior y lateral del arte fuente.
await sharp(source)
  .extract({ left: 0, top: 0, width: 950, height: 330 })
  .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .resize({ width: 1400, fit: "inside", withoutEnlargement: false })
  .png()
  .toFile(lockupOutput);

const { data: vividPixels, info: vividInfo } = await sharp(lockupOutput)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

for (let index = 0; index < vividPixels.length; index += vividInfo.channels) {
  const red = vividPixels[index];
  const green = vividPixels[index + 1];
  const blue = vividPixels[index + 2];
  if (red > 145 && green > 75 && blue < 135 && red > blue * 1.55) {
    vividPixels[index] = 255;
    vividPixels[index + 1] = 255;
    vividPixels[index + 2] = 0;
  }
}

await sharp(vividPixels, {
  raw: {
    width: vividInfo.width,
    height: vividInfo.height,
    channels: vividInfo.channels,
  },
})
  .png()
  .toFile(vividLockupOutput);

const metadata = await sharp(output).metadata();
const lockupMetadata = await sharp(lockupOutput).metadata();
const vividLockupMetadata = await sharp(vividLockupOutput).metadata();
console.log(
  JSON.stringify(
    {
      flatR: { output, width: metadata.width, height: metadata.height },
      lockup: {
        output: lockupOutput,
        width: lockupMetadata.width,
        height: lockupMetadata.height,
      },
      vividLockup: {
        output: vividLockupOutput,
        width: vividLockupMetadata.width,
        height: vividLockupMetadata.height,
        yellow: "#FFFF00",
      },
    },
    null,
    2,
  ),
);
