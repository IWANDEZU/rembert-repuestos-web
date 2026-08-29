import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const basePath = path.join(
  root,
  ".catalog-cache",
  "marketing-generated",
  "rembert-vertical-suspension-macro-base-v1.png",
);
const logoPath = path.join(root, "public", "brand", "rembert-r-medallion.png");
const outputDir = path.join(root, "public", "banners");
const outputPath = path.join(outputDir, "rembert-vertical-suspension-macro-tienda-online-v2.jpg");

await fs.mkdir(outputDir, { recursive: true });
try {
  await fs.access(outputPath);
  throw new Error(`La imagen ya existe: ${outputPath}`);
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

const logoSize = 286;
const circularMask = Buffer.from(`
  <svg width="${logoSize}" height="${logoSize}" xmlns="http://www.w3.org/2000/svg">
    <circle cx="${logoSize / 2}" cy="${logoSize / 2}" r="${logoSize / 2 - 3}" fill="#fff"/>
  </svg>
`);

const logo = await sharp(logoPath)
  .resize(logoSize, logoSize, { fit: "cover" })
  .composite([{ input: circularMask, blend: "dest-in" }])
  .png()
  .toBuffer();

const finish = Buffer.from(`
  <svg width="1080" height="1350" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="halo">
        <stop offset="0" stop-color="#ffd000" stop-opacity="0.24"/>
        <stop offset="0.47" stop-color="#d89b00" stop-opacity="0.10"/>
        <stop offset="1" stop-color="#000" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="topShade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#02050a" stop-opacity="0.62"/>
        <stop offset="0.30" stop-color="#02050a" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <rect width="1080" height="470" fill="url(#topShade)"/>
    <circle cx="540" cy="184" r="205" fill="url(#halo)"/>
    <circle cx="540" cy="184" r="151" fill="none" stroke="#ffd000" stroke-width="3" stroke-opacity="0.75"/>
    <rect x="0" y="1168" width="1080" height="182" fill="#02050a" fill-opacity="0.90"/>
    <rect x="0" y="1168" width="1080" height="6" fill="#ffd000"/>
    <text x="540" y="1237" text-anchor="middle" fill="#ffd000" font-family="Arial, Helvetica, sans-serif" font-size="38" font-weight="800" letter-spacing="0.8">PRÓXIMAMENTE TIENDA ONLINE</text>
    <text x="540" y="1297" text-anchor="middle" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="32" font-weight="700" letter-spacing="0.5">www.rembertrepuestos.com</text>
  </svg>
`);

await sharp(basePath)
  .resize(1080, 1350, { fit: "cover", position: "centre" })
  .composite([
    { input: finish, left: 0, top: 0 },
    { input: logo, left: Math.round((1080 - logoSize) / 2), top: 41 },
  ])
  .jpeg({ quality: 94, chromaSubsampling: "4:4:4", progressive: true })
  .toFile(outputPath);

const metadata = await sharp(outputPath).metadata();
console.log(
  JSON.stringify(
    {
      outputPath,
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
    },
    null,
    2,
  ),
);
