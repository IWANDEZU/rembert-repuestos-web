import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const args = process.argv.slice(2);
const option = (name, fallback) => {
  const index = args.indexOf(name);
  return index === -1 ? fallback : args[index + 1] || fallback;
};
const input = path.resolve(option("--input", path.join(ROOT, "docs", "catalogos-gti", "gti-source-candidates-direct.json")));
const outputDir = path.resolve(option("--output-dir", path.join(ROOT, "docs", "catalogos-gti", "borradores-fotos-candidatas")));
const batchSize = Number.parseInt(option("--batch-size", "10"), 10);

if (!Number.isSafeInteger(batchSize) || batchSize < 1 || batchSize > 10) {
  throw new Error("--batch-size debe estar entre 1 y 10");
}

const report = JSON.parse(await fs.readFile(input, "utf8"));
const candidates = (report.references || [])
  .filter((item) => item.candidate?.metadataExact && item.candidate?.image && item.candidate?.page)
  .sort((a, b) => Number(b.inStock) - Number(a.inStock) || a.sku.localeCompare(b.sku));

await fs.mkdir(outputDir, { recursive: true });
const files = [];
for (let index = 0; index < candidates.length; index += batchSize) {
  const batchNumber = String((index / batchSize) + 1).padStart(2, "0");
  const batch = candidates.slice(index, index + batchSize).map((item) => ({
    sku: item.sku,
    image_source: item.candidate.image,
    sources: [item.candidate.page],
    exact_reference_confirmed: true,
    // Bloqueos deliberados: `catalog:image-update --apply` no aceptará este
    // borrador hasta que una persona responsable pruebe el derecho de uso y
    // confirme que la foto fuente está limpia.
    usage_authorized: false,
    source_type: "",
    source_image_clean: false,
    reference_evidence: `Ficha pública que declara SKU y marca GTI: ${item.candidate.page}`,
  }));
  const file = path.join(outputDir, `lote-${batchNumber}-pendiente-autorizacion.json`);
  await fs.writeFile(file, `${JSON.stringify(batch, null, 2)}\n`, "utf8");
  files.push(file);
}

const indexFile = path.join(outputDir, "README.md");
await fs.writeFile(indexFile, `# Borradores de fotos candidatas GTI\n\nGenerado desde \`${path.relative(ROOT, input).replaceAll("\\", "/")}\`.\n\n- Candidatas con coincidencia documental: **${candidates.length}**.\n- Estado de estos archivos: **no autorizados para publicar**.\n- Para usar un lote, validar la fotografía, cambiar \`usage_authorized\` a \`true\`, indicar \`source_type\` y cambiar \`source_image_clean\` a \`true\`. Después ejecutar \`npm run catalog:image-update -- <lote.json> --apply\`.\n\nEl importador rechaza los borradores mientras persistan los valores de bloqueo.\n`, "utf8");

console.log(JSON.stringify({
  metadataExactCandidates: candidates.length,
  batches: files.length,
  outputDir,
  indexFile,
}, null, 2));
