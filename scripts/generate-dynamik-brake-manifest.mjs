import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(scriptDir, "..");
const inputPath = process.env.DYNAMIK_BRAKE_AUDIT
  ? resolve(rootDir, process.env.DYNAMIK_BRAKE_AUDIT)
  : resolve(rootDir, "tmp", "dynamik-brake-gap-audit-20260830.json");
const outputPath = resolve(rootDir, "src", "data", "dynamikBrakeCoverageRefs.js");

const audit = JSON.parse(await readFile(inputPath, "utf8"));
const references = Array.isArray(audit.missing) ? audit.missing : [];
const expectedBrands = new Set(audit.scope?.brands || []);
const expectedTotal = Number(audit.result?.missingUniqueReferences || 0);
const allowedGroups = new Set(["BALATAS Y ZAPATAS", "DISCOS DE FRENO"]);
const seenSkus = new Set();

if (references.length !== expectedTotal || !references.length) {
  throw new Error(`El lote de cobertura debe contener ${expectedTotal} referencias; se recibieron ${references.length}.`);
}

for (const reference of references) {
  const sku = String(reference?.sku || "").trim().toUpperCase();
  const title = String(reference?.title || "").trim();
  const subgroup = String(reference?.subgrupo || "").trim();
  const brands = Array.isArray(reference?.marcas) ? reference.marcas : [];

  if (!sku || !title || !allowedGroups.has(subgroup)) {
    throw new Error(`Referencia inválida en lote de cobertura: ${JSON.stringify(reference)}.`);
  }
  if (seenSkus.has(sku)) throw new Error(`NPC repetido en lote de cobertura: ${sku}.`);
  if (!brands.length || brands.some((brand) => !expectedBrands.has(brand))) {
    throw new Error(`Marcas fuera del alcance para ${sku}.`);
  }
  seenSkus.add(sku);
}

const normalizedReferences = references
  .map((reference) => ({
    sku: String(reference.sku).trim().toUpperCase(),
    title: String(reference.title).trim(),
    subgrupo: String(reference.subgrupo).trim(),
    marcas: [...new Set(reference.marcas.map((brand) => String(brand).trim().toUpperCase()))].sort(),
  }))
  .sort((left, right) => left.sku.localeCompare(right.sku));

const publicAudit = {
  scope: { brands: [...expectedBrands] },
  result: {
    scopedReferences: Number(audit.result?.scopedReferences || 0),
    publishedReferencesBeforeBatch: Number(audit.result?.publishedReferences || 0),
    referencesAddedByBatch: normalizedReferences.length,
    missingByType: audit.result?.missingByType || {},
  },
  coverageByBrand: audit.coverageByBrand || {},
};

const file = `// Generado por scripts/generate-dynamik-brake-manifest.mjs. No editar manualmente.\n// Cada NPC representa una ficha individual sin fotografía hasta validación física.\n\nexport const dynamikBrakeCoverageAudit = ${JSON.stringify(publicAudit, null, 2)};\n\nexport const dynamikBrakeCoverageRefs = ${JSON.stringify(normalizedReferences, null, 2)};\n\nexport default dynamikBrakeCoverageRefs;\n`;

await writeFile(outputPath, file, "utf8");
console.log(JSON.stringify({ outputPath, references: normalizedReferences.length }, null, 2));
