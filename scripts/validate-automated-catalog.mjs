import fs from "node:fs/promises";
import path from "node:path";
import { automatedCatalogProducts } from "../src/data/automatedCatalogProducts.js";

const errors = [];
const skus = new Set();
const slugs = new Set();
for (const product of automatedCatalogProducts) {
  const label = `${product.sku} (${product.name})`;
  const sku = String(product.sku || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (skus.has(sku)) errors.push(`${label}: SKU duplicado`); else skus.add(sku);
  if (slugs.has(product.slug)) errors.push(`${label}: slug duplicado`); else slugs.add(product.slug);
  if (product.catalogApproval !== "explicit-batch") errors.push(`${label}: falta aprobación explícita de lote`);
  if (product.fitmentStatus !== "verified" || product.referenceType !== "manufacturer") errors.push(`${label}: referencia/compatibilidad no verificable`);
  if (!product.fitments?.length) errors.push(`${label}: no tiene aplicaciones estructuradas`);
  if (!product.fitmentSource || product.fitmentSource.split(" · ").length > 3) errors.push(`${label}: fuentes inválidas`);
  if (!product.image?.startsWith("/catalogo-automatizado/")) errors.push(`${label}: ruta de imagen inválida`);
  else {
    try { await fs.access(path.join(process.cwd(), "public", product.image.replace(/^\//, ""))); }
    catch { errors.push(`${label}: archivo de imagen inexistente`); }
  }
}
if (errors.length) {
  console.error(errors.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}
console.log(`Catálogo automático validado: ${automatedCatalogProducts.length} producto(s).`);
