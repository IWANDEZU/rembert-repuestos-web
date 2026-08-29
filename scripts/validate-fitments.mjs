import { products } from "../src/lib/products.js";
import { getProductFitment, isInternalQuoteReference } from "../src/lib/productCompatibility.js";

const errors = [];
const uniqueValues = {
  id: new Map(),
  slug: new Map(),
  sku: new Map(),
};
const normalizeSku = (value) => String(value || "").toUpperCase().replace(/[^A-Z0-9]/g, "");

for (const product of products) {
  const fitment = getProductFitment(product);
  const label = `${product.sku || product.id} (${product.name})`;

  if (isInternalQuoteReference(product) && fitment.status !== "family") {
    errors.push(`${label}: un código de cotización no puede figurar como aplicación verificada.`);
  }

  if (fitment.status === "verified") {
    if (product.referenceType !== "manufacturer") {
      errors.push(`${label}: una aplicación verificada debe usar referenceType=manufacturer.`);
    }
    if (!fitment.fitments.length) {
      errors.push(`${label}: una aplicación verificada necesita fitments estructurados.`);
    }
    fitment.fitments.forEach((item, index) => {
      for (const field of ["make", "model", "years", "position"]) {
        if (!String(item?.[field] || "").trim()) {
          errors.push(`${label}: fitments[${index}].${field} es obligatorio.`);
        }
      }
    });
  }

  if (fitment.status === "family" && (Number(product.price) > 0 || product.inStock)) {
    errors.push(`${label}: una familia sin referencia exacta no debe venderse como SKU en inventario.`);
  }

  if (/todos los años/i.test(String(product.description || ""))) {
    errors.push(`${label}: "todos los años" es una afirmación de compatibilidad no permitida.`);
  }

  for (const [field, value] of [
    ["id", product.id],
    ["slug", product.slug],
    ["sku", normalizeSku(product.sku)],
  ]) {
    if (!value) continue;
    const previous = uniqueValues[field].get(value);
    if (previous) {
      errors.push(`${label}: ${field} duplicado con ${previous}.`);
    } else {
      uniqueValues[field].set(value, label);
    }
  }
}

if (errors.length) {
  console.error(`Validación de compatibilidad fallida (${errors.length}):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

const totals = products.reduce((result, product) => {
  result[getProductFitment(product).status] += 1;
  return result;
}, { verified: 0, conditional: 0, family: 0 });

console.log(`Compatibilidad validada: ${products.length} productos (${totals.verified} verificados, ${totals.conditional} condicionados, ${totals.family} familias).`);
