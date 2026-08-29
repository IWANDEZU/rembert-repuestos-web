import fs from "node:fs/promises";
import path from "node:path";
import { products } from "../src/lib/products.js";

const args = process.argv.slice(2);
const valueAfter = (flag) => {
  const index = args.indexOf(flag);
  return index === -1 ? null : args[index + 1] || null;
};

const statusFilter = valueAfter("--status");
const format = valueAfter("--format") || "json";
const output = valueAfter("--output");
const limitRaw = valueAfter("--limit");
const limit = limitRaw ? Number.parseInt(limitRaw, 10) : null;

if (!new Set(["json", "csv", "markdown"]).has(format)) {
  throw new Error("--format debe ser json, csv o markdown");
}
if (limitRaw && (!Number.isSafeInteger(limit) || limit < 1)) {
  throw new Error("--limit debe ser un entero positivo");
}

const REAL_IMAGE_STATUSES = new Set([
  "manufacturer-exact",
  "exact-real-photo",
  "authentic-product-photo",
  "real-product-photo",
  "real-source-photo",
  "real-source-watermarked",
  "source-grounded-web-image",
  "official-catalog-watermarked",
  "user-supplied-product-photo-official-brand-rembert-watermarked",
]);

const PRIORITY_BY_STATUS = new Map([
  ["photo-pending", 0],
  ["generated-product-reference", 1],
  ["ai-catalog-watermarked", 2],
  ["studio-reference-derived-watermarked", 3],
  ["illustrative-family", 4],
  ["inventory-family-reference", 5],
  ["verified-brand-family-reference", 6],
  ["inventory-brand-family-reference", 7],
  ["inventory-matched-editorial", 8],
]);

const csvCell = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
const asText = (value) => String(value || "").trim();
const searchQuery = (product) => [product.brand?.name, product.sku, product.name]
  .filter(Boolean)
  .join(" ")
  .replace(/\s+/g, " ");

const allStatuses = new Map();
for (const product of products) {
  const status = product.imageStatus || "unclassified";
  allStatuses.set(status, (allStatuses.get(status) || 0) + 1);
}

const candidates = products
  .filter((product) => {
    const status = product.imageStatus || "unclassified";
    return !REAL_IMAGE_STATUSES.has(status) && (!statusFilter || status === statusFilter);
  })
  .map((product) => ({
    sku: asText(product.sku),
    slug: asText(product.slug),
    name: asText(product.name),
    brand: asText(product.brand?.name),
    category: asText(product.category?.name),
    imageStatus: product.imageStatus || "unclassified",
    currentImage: asText(product.image),
    inStock: Boolean(product.inStock),
    stock: Number(product.stock) || 0,
    priority: PRIORITY_BY_STATUS.get(product.imageStatus) ?? 99,
    searchQuery: searchQuery(product),
  }))
  .sort((a, b) => (
    a.priority - b.priority
    || Number(b.inStock) - Number(a.inStock)
    || b.stock - a.stock
    || a.name.localeCompare(b.name, "es")
  ));

const queue = limit ? candidates.slice(0, limit) : candidates;
const report = {
  generatedAt: new Date().toISOString(),
  totalProducts: products.length,
  realImageProducts: products.filter((product) => REAL_IMAGE_STATUSES.has(product.imageStatus)).length,
  candidates: candidates.length,
  byStatus: Object.fromEntries([...allStatuses.entries()].sort(([a], [b]) => a.localeCompare(b))),
  queue,
};

let rendered;
if (format === "json") {
  rendered = `${JSON.stringify(report, null, 2)}\n`;
} else if (format === "csv") {
  const columns = ["sku", "slug", "name", "brand", "category", "imageStatus", "inStock", "stock", "priority", "searchQuery", "currentImage"];
  rendered = `${columns.join(",")}\n${queue.map((item) => columns.map((column) => csvCell(item[column])).join(",")).join("\n")}\n`;
} else {
  const rows = queue.map((item) => `| ${item.priority} | ${item.sku} | ${item.name.replaceAll("|", "\\|")} | ${item.imageStatus} | ${item.stock} | ${item.searchQuery.replaceAll("|", "\\|")} |`);
  rendered = `# Cola de imágenes reales\n\nTotal de productos: ${report.totalProducts}. Pendientes de mejora: ${report.candidates}.\n\n| Prioridad | SKU | Producto | Estado actual | Stock | Consulta sugerida |\n| --- | --- | --- | --- | ---: | --- |\n${rows.join("\n")}\n`;
}

if (output) {
  const destination = path.resolve(output);
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.writeFile(destination, rendered);
  console.log(`Cola guardada: ${destination} (${queue.length} producto(s)).`);
} else {
  process.stdout.write(rendered);
}
