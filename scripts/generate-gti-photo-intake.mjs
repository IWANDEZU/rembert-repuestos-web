import fs from "node:fs/promises";
import path from "node:path";
import { products } from "../src/lib/products.js";

const ROOT = process.cwd();
const args = process.argv.slice(2);
const option = (name, fallback) => {
  const index = args.indexOf(name);
  return index === -1 ? fallback : args[index + 1] || fallback;
};
const batchSize = Number.parseInt(option("--batch-size", "10"), 10);
const output = path.resolve(option("--output", path.join(ROOT, "docs", "catalogos-gti", "solicitud-fotos-exactas-gti.csv")));

if (!Number.isSafeInteger(batchSize) || batchSize < 1 || batchSize > 25) {
  throw new Error("--batch-size debe estar entre 1 y 25");
}

const quote = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
const pending = products
  .filter((product) => product.brand?.slug === "gti" && product.imageStatus === "photo-pending")
  .sort((a, b) => Number(b.inStock) - Number(a.inStock)
    || (Number(b.stock) || 0) - (Number(a.stock) || 0)
    || a.sku.localeCompare(b.sku));

const rows = [[
  "lote",
  "prioridad",
  "sku_gti",
  "nombre_tarjeta",
  "existencia",
  "nombre_archivo_sugerido",
  "foto_propia_o_fuente_autorizada",
  "source_type",
  "url_ficha_que_prueba_sku",
  "evidencia_referencia_visible",
  "confirmacion_sin_marca_de_agua_ajena",
  "autorizacion_de_uso",
  "estado",
]];

for (const [index, product] of pending.entries()) {
  const batch = Math.floor(index / batchSize) + 1;
  rows.push([
    String(batch).padStart(2, "0"),
    product.inStock ? "Alta: existencia disponible" : "Catálogo para cotización",
    product.sku,
    product.name,
    String(product.stock || 0),
    `${product.sku.replace(/[^A-Za-z0-9-]+/g, "-")}.jpg`,
    "",
    "own | manufacturer | authorized-distributor",
    "",
    "Etiqueta, grabado o página que identifica exactamente el SKU",
    "Pendiente",
    "Pendiente",
    "Pendiente",
  ]);
}

await fs.mkdir(path.dirname(output), { recursive: true });
await fs.writeFile(output, `${rows.map((row) => row.map(quote).join(",")).join("\n")}\n`, "utf8");
console.log(JSON.stringify({
  pendingGtiCards: pending.length,
  batches: Math.ceil(pending.length / batchSize),
  batchSize,
  output,
}, null, 2));
