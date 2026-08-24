import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";

const projectRoot = path.resolve(import.meta.dirname, "..");
const publicRoot = path.join(projectRoot, "public");
const applyChanges = process.argv.includes("--apply");
const thresholdArg = process.argv.find((arg) => arg.startsWith("--threshold-kb="));
const thresholdBytes = Number(thresholdArg?.split("=")[1] || 150) * 1024;
const backupArg = process.argv.find((arg) => arg.startsWith("--backup="));
const backupRoot = backupArg
  ? path.resolve(backupArg.slice("--backup=".length))
  : path.join(projectRoot, ".image-optimization-backup");

const rasterExtensions = new Set([".png", ".jpg", ".jpeg"]);
const textExtensions = new Set([
  ".js", ".jsx", ".mjs", ".cjs", ".ts", ".tsx", ".json", ".jsonc",
  ".css", ".scss", ".md", ".html", ".xml", ".webmanifest",
]);
const ignoredDirectories = new Set([
  "node_modules", ".next", ".wrangler", ".git", "repositorio-1",
  ".tmp-local", ".tmp-wrangler-config", ".tmp-cloudflare-dry-run-20260822",
  ".open-next-stale-rowen",
]);

async function walk(directory, { ignore = ignoredDirectories } = {}) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.isDirectory() && ignore.has(entry.name)) continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(fullPath, { ignore }));
    else files.push(fullPath);
  }
  return files;
}

function webPath(filePath) {
  return `/${path.relative(publicRoot, filePath).split(path.sep).join("/")}`;
}

async function uniqueWebpPath(sourcePath) {
  const preferred = sourcePath.replace(/\.(png|jpe?g)$/i, ".webp");
  try {
    await fs.access(preferred);
    return sourcePath.replace(/\.(png|jpe?g)$/i, "-optimized.webp");
  } catch {
    return preferred;
  }
}

const publicFiles = await walk(publicRoot, { ignore: new Set() });
const candidates = [];
for (const filePath of publicFiles) {
  const extension = path.extname(filePath).toLowerCase();
  if (!rasterExtensions.has(extension)) continue;
  const stat = await fs.stat(filePath);
  if (stat.size < thresholdBytes) continue;
  try {
    const metadata = await sharp(filePath).metadata();
    if (!metadata.width || !metadata.height) continue;
    candidates.push({
      sourcePath: filePath,
      outputPath: await uniqueWebpPath(filePath),
      inputBytes: stat.size,
      width: metadata.width,
      height: metadata.height,
      hasAlpha: Boolean(metadata.hasAlpha),
    });
  } catch (error) {
    console.warn(`Omitida (no es una imagen válida): ${webPath(filePath)} — ${error.message}`);
  }
}

console.log(`${applyChanges ? "APLICAR" : "SIMULAR"}: ${candidates.length} imágenes de ${Math.round(thresholdBytes / 1024)} KB o más.`);
console.log(`Peso candidato: ${(candidates.reduce((sum, item) => sum + item.inputBytes, 0) / 1024 / 1024).toFixed(2)} MB.`);

if (!applyChanges) {
  for (const item of candidates.slice(0, 25)) {
    console.log(`${webPath(item.sourcePath)} -> ${webPath(item.outputPath)} (${(item.inputBytes / 1024).toFixed(1)} KB)`);
  }
  if (candidates.length > 25) console.log(`… y ${candidates.length - 25} archivos más.`);
  console.log("No se modificó ningún archivo. Use --apply y --backup=RUTA para ejecutar.");
  process.exit(0);
}

await fs.mkdir(backupRoot, { recursive: true });
const mappings = new Map();
const results = [];

for (const item of candidates) {
  const relativePath = path.relative(publicRoot, item.sourcePath);
  const backupPath = path.join(backupRoot, "public", relativePath);
  await fs.mkdir(path.dirname(backupPath), { recursive: true });
  await fs.copyFile(item.sourcePath, backupPath);

  await sharp(item.sourcePath)
    .rotate()
    .resize({ width: 1920, height: 1920, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 78, alphaQuality: 86, effort: 5, smartSubsample: true })
    .toFile(item.outputPath);

  const outputStat = await fs.stat(item.outputPath);
  if (outputStat.size >= item.inputBytes) {
    await fs.rm(item.outputPath);
    results.push({ ...item, keptOriginal: true, outputBytes: item.inputBytes });
    continue;
  }

  mappings.set(webPath(item.sourcePath), webPath(item.outputPath));
  results.push({ ...item, keptOriginal: false, outputBytes: outputStat.size });
}

const textRoots = [
  path.join(projectRoot, "src"),
  path.join(projectRoot, "prisma"),
  path.join(projectRoot, "scripts"),
  publicRoot,
];
const rootTextFiles = [
  "next.config.mjs", "wrangler.jsonc", "README.md", "cloudflare-worker.js",
].map((name) => path.join(projectRoot, name));
const textFiles = [];
for (const root of textRoots) {
  try {
    for (const filePath of await walk(root, { ignore: ignoredDirectories })) {
      if (textExtensions.has(path.extname(filePath).toLowerCase())) textFiles.push(filePath);
    }
  } catch {
    // La carpeta es opcional.
  }
}
for (const filePath of rootTextFiles) {
  try {
    await fs.access(filePath);
    textFiles.push(filePath);
  } catch {
    // El archivo es opcional.
  }
}

let changedTextFiles = 0;
for (const filePath of new Set(textFiles)) {
  let content = await fs.readFile(filePath, "utf8");
  const original = content;
  for (const [oldPath, newPath] of mappings) content = content.split(oldPath).join(newPath);
  if (content !== original) {
    await fs.writeFile(filePath, content, "utf8");
    changedTextFiles += 1;
  }
}

for (const item of results) {
  if (!item.keptOriginal) await fs.rm(item.sourcePath);
}

const inputBytes = results.reduce((sum, item) => sum + item.inputBytes, 0);
const outputBytes = results.reduce((sum, item) => sum + item.outputBytes, 0);
const report = {
  createdAt: new Date().toISOString(),
  thresholdKb: thresholdBytes / 1024,
  converted: results.filter((item) => !item.keptOriginal).length,
  keptOriginal: results.filter((item) => item.keptOriginal).length,
  changedTextFiles,
  inputBytes,
  outputBytes,
  savedBytes: inputBytes - outputBytes,
  backupRoot,
  mappings: Object.fromEntries(mappings),
};
await fs.mkdir(path.join(projectRoot, "docs"), { recursive: true });
await fs.writeFile(
  path.join(projectRoot, "docs", "image-optimization-report.json"),
  `${JSON.stringify(report, null, 2)}\n`,
  "utf8",
);

console.log(`Convertidas: ${report.converted}; originales conservados por tamaño: ${report.keptOriginal}.`);
console.log(`Referencias actualizadas en ${changedTextFiles} archivos.`);
console.log(`Antes: ${(inputBytes / 1024 / 1024).toFixed(2)} MB; después: ${(outputBytes / 1024 / 1024).toFixed(2)} MB.`);
console.log(`Ahorro: ${(report.savedBytes / 1024 / 1024).toFixed(2)} MB (${((report.savedBytes / inputBytes) * 100).toFixed(1)}%).`);
console.log(`Respaldo: ${backupRoot}`);
