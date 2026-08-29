import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const basePath = path.join(root, ".catalog-cache", "marketing-generated", "rembert-banner-suspension-base-v1.png");
const logoPath = path.join(root, "public", "logo-rembert-transparent.png");
const outputDir = path.join(root, "public", "banners");
const outputPath = path.join(outputDir, "rembert-banner-promocional-suspension-v4.jpg");

await fs.mkdir(outputDir, { recursive: true });
try {
  await fs.access(outputPath);
  throw new Error(`El banner ya existe: ${outputPath}`);
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

const logo = await sharp(logoPath)
  .resize({ width: 510, height: 196, fit: "inside", withoutEnlargement: true })
  .png()
  .toBuffer();

const textLayer = Buffer.from(`
<svg width="1600" height="600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="shade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#050b14" stop-opacity="0.72"/>
      <stop offset="0.46" stop-color="#050b14" stop-opacity="0.28"/>
      <stop offset="0.60" stop-color="#050b14" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="940" height="600" fill="url(#shade)"/>
  <text x="72" y="286" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="46" font-weight="800" letter-spacing="0.35">SUSPENSIÓN QUE RESPONDE</text>
  <rect x="72" y="315" width="108" height="5" rx="2.5" fill="#ffd000"/>
  <text x="72" y="363" fill="#f4f7fb" font-family="Arial, Helvetica, sans-serif" font-size="27" font-weight="500">Control, estabilidad y confort en cada camino</text>
  <text x="72" y="402" fill="#cbd5e1" font-family="Arial, Helvetica, sans-serif" font-size="23">Amortiguadores · Bases · Rótulas · Tijeras</text>
  <rect x="72" y="444" width="350" height="62" rx="12" fill="#ffd000"/>
  <text x="247" y="484" text-anchor="middle" fill="#0b1220" font-family="Arial, Helvetica, sans-serif" font-size="23" font-weight="800">38 AÑOS DE EXPERIENCIA</text>
  <text x="72" y="553" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="23" font-weight="700" letter-spacing="0.4">rembertrepuestos.com</text>
</svg>`);

await sharp(basePath)
  .resize(1600, 600, { fit: "cover", position: "centre" })
  .composite([
    { input: textLayer, left: 0, top: 0 },
    { input: logo, left: 72, top: 45 },
  ])
  .jpeg({ quality: 92, chromaSubsampling: "4:4:4", progressive: true })
  .toFile(outputPath);

const metadata = await sharp(outputPath).metadata();
console.log(JSON.stringify({ outputPath, width: metadata.width, height: metadata.height, format: metadata.format }, null, 2));
