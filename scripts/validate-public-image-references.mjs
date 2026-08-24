import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const projectRoot = path.resolve(import.meta.dirname, "..");
const publicRoot = path.join(projectRoot, "public");
const sourceRoots = [path.join(projectRoot, "src")];
const sourceExtensions = new Set([".js", ".jsx", ".mjs", ".ts", ".tsx", ".json", ".css"]);
const imageReference = /["'`](\/[^"'`?#\s]+\.(?:avif|gif|ico|jpe?g|png|svg|webp))(?:[?#][^"'`]*)?["'`]/gi;

async function walk(directory) {
  const files = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(fullPath));
    else files.push(fullPath);
  }
  return files;
}

const references = new Map();
for (const root of sourceRoots) {
  for (const filePath of await walk(root)) {
    if (!sourceExtensions.has(path.extname(filePath).toLowerCase())) continue;
    const content = await fs.readFile(filePath, "utf8");
    for (const match of content.matchAll(imageReference)) {
      const publicPath = match[1];
      if (publicPath.startsWith("/api/") || publicPath.includes("${")) continue;
      const locations = references.get(publicPath) || [];
      locations.push(path.relative(projectRoot, filePath));
      references.set(publicPath, locations);
    }
  }
}

const missing = [];
for (const [publicPath, locations] of references) {
  const filePath = path.join(publicRoot, ...publicPath.slice(1).split("/"));
  try {
    await fs.access(filePath);
  } catch {
    missing.push({ publicPath, locations: [...new Set(locations)] });
  }
}

if (missing.length) {
  console.error(`Referencias de imagen inexistentes: ${missing.length}`);
  for (const item of missing) console.error(`${item.publicPath} <- ${item.locations.join(", ")}`);
  process.exit(1);
}

console.log(`Referencias de imagen verificadas: ${references.size}. Ninguna ruta rota.`);
