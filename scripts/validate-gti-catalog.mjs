import fs from "node:fs/promises";
import path from "node:path";
import inventoryStock from "../src/data/inventory-stock.json" with { type: "json" };
import { gtiProducts } from "../src/data/gtiProducts.js";

const normalizeReference = (value) => String(value || "")
  .toUpperCase()
  .replace(/[^A-Z0-9]/g, "");

const errors = [];
const productsByReference = new Map();

for (const product of gtiProducts) {
  const reference = normalizeReference(product.sku);
  if (!reference) errors.push(`${product.name}: referencia vacía`);
  if (productsByReference.has(reference)) errors.push(`${product.sku}: referencia GTI duplicada`);
  productsByReference.set(reference, product);

  if (product.brand?.slug !== "gti") errors.push(`${product.sku}: marca o slug inválido`);
  if (!product.fitments?.length) errors.push(`${product.sku}: faltan aplicaciones estructuradas`);
  if (!product.fitmentSource?.includes("dispartes.com/gtiautoparts")) errors.push(`${product.sku}: falta fuente oficial/distribuidor`);
  if (!product.fitmentSource?.includes("REPUESTOS_PUNTAS_Y_EJES")) errors.push(`${product.sku}: falta fuente de catálogo`);
  if (!product.fitmentRequirements?.includes("VIN")) errors.push(`${product.sku}: falta control por VIN`);
  if (!product.image?.startsWith("/catalogo-gti/")) errors.push(`${product.sku}: ruta de imagen fuera del catálogo GTI`);
  else {
    try {
      await fs.access(path.join(process.cwd(), "public", product.image.replace(/^\//, "")));
    } catch {
      errors.push(`${product.sku}: imagen inexistente (${product.image})`);
    }
  }
}

const inventoryReferences = new Set(
  inventoryStock
    .filter((item) => /^GTI/i.test(String(item.c || "")))
    .map((item) => normalizeReference(item.c))
);

for (const reference of inventoryReferences) {
  if (!productsByReference.has(reference)) errors.push(`${reference}: referencia del inventario sin ficha GTI`);
}
for (const reference of productsByReference.keys()) {
  if (!inventoryReferences.has(reference)) errors.push(`${reference}: ficha GTI ausente del inventario autorizado`);
}

if (gtiProducts.length !== 47 || inventoryReferences.size !== 47) {
  errors.push(`conteo inesperado: ${gtiProducts.length} fichas y ${inventoryReferences.size} referencias de inventario`);
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

const verified = gtiProducts.filter((product) => product.fitmentStatus === "verified").length;
const exactImages = gtiProducts.filter((product) => product.imageStatus === "studio-reference-derived-watermarked").length;
console.log(`Catálogo GTI validado: ${gtiProducts.length} referencias, ${verified} verificadas y ${exactImages} imágenes derivadas de referencia.`);
