import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const basePath = path.join(
  root,
  ".catalog-cache",
  "marketing-generated",
  "rembert-epic-suspension-poster-base-v1.png",
);
const logoPath = path.join(root, "public", "logo-rembert-transparent.png");
const outputDir = path.join(root, "public", "banners");
const outputPath = path.join(outputDir, "rembert-poster-epico-alta-calidad-v4.jpg");

await fs.mkdir(outputDir, { recursive: true });
try {
  await fs.access(outputPath);
  throw new Error(`El póster ya existe: ${outputPath}`);
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

const logo = await sharp(logoPath)
  .extract({ left: 0, top: 0, width: 200, height: 230 })
  .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .resize({ height: 176, fit: "inside", withoutEnlargement: false })
  .png()
  .toBuffer();

const typography = Buffer.from(`
  <svg width="1080" height="1350" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="copyShade" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#00040a" stop-opacity="0.94"/>
        <stop offset="0.43" stop-color="#00040a" stop-opacity="0.66"/>
        <stop offset="0.68" stop-color="#00040a" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="footer" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#05080d" stop-opacity="0.90"/>
        <stop offset="1" stop-color="#010205" stop-opacity="0.98"/>
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="5"/>
        <feOffset dx="0" dy="5" result="offsetblur"/>
        <feComponentTransfer><feFuncA type="linear" slope="0.75"/></feComponentTransfer>
        <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <path d="M0 0H740L545 835H0Z" fill="url(#copyShade)"/>
    <rect x="67" y="268" width="88" height="8" rx="4" fill="#ffd000"/>
    <text x="67" y="375" fill="#ffffff" font-family="Impact, Arial Black, Arial, sans-serif" font-size="94" letter-spacing="2" filter="url(#shadow)">DOMINA</text>
    <text x="67" y="462" fill="#ffd000" font-family="Impact, Arial Black, Arial, sans-serif" font-size="78" letter-spacing="1.2" filter="url(#shadow)">CADA CAMINO</text>
    <text x="70" y="522" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="27" font-weight="800" letter-spacing="2.4">REPUESTOS DE ALTA</text>
    <text x="70" y="568" fill="#ffd000" font-family="Arial, Helvetica, sans-serif" font-size="29" font-weight="900" letter-spacing="1.8">CALIDAD Y RESISTENCIA</text>
    <rect x="0" y="1170" width="1080" height="180" fill="url(#footer)"/>
    <rect x="0" y="1170" width="1080" height="7" fill="#ffd000"/>
    <text x="540" y="1239" text-anchor="middle" fill="#ffd000" font-family="Impact, Arial Black, Arial, sans-serif" font-size="40" letter-spacing="1.5">PRÓXIMAMENTE TIENDA ONLINE</text>
    <text x="540" y="1302" text-anchor="middle" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="32" font-weight="800">www.rembertrepuestos.com</text>
  </svg>
`);

await sharp(basePath)
  .resize(1080, 1350, { fit: "cover", position: "centre" })
  .composite([
    { input: typography, left: 0, top: 0 },
    { input: logo, left: 67, top: 54 },
  ])
  .jpeg({ quality: 95, chromaSubsampling: "4:4:4", progressive: true })
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
