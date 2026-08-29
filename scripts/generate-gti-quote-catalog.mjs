import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const projectRoot = process.cwd();
const inputPath = path.resolve(
  projectRoot,
  process.argv[2] || "tmp/gti-audit-20260826/catalogo-fjmb.html",
);
const outputPath = path.resolve(
  projectRoot,
  process.argv[3] || "src/data/gti-quote-catalog.json",
);

const decodeHtml = (value) => String(value || "")
  .replace(/&nbsp;|&#160;/gi, " ")
  .replace(/&amp;/gi, "&")
  .replace(/&quot;/gi, "\"")
  .replace(/&#39;|&apos;/gi, "'")
  .replace(/&lt;/gi, "<")
  .replace(/&gt;/gi, ">")
  .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
  .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)));

const normalizeText = (value) => decodeHtml(value)
  .replace(/<[^>]+>/g, " ")
  .replace(/\s+/g, " ")
  .trim();

const sortReference = (left, right) => left.reference.localeCompare(
  right.reference,
  "es",
  { numeric: true, sensitivity: "base" },
);

const html = await readFile(inputPath, "utf8");
const catalogMatch = html.match(/<p\s+class=["']overflow-auto\s+text-justify["'][^>]*>([\s\S]*?)<\/p>/i);

if (!catalogMatch) {
  throw new Error(`No se encontró el bloque principal del catálogo en ${inputPath}`);
}

const lines = catalogMatch[1]
  .replace(/<br\s*\/?>/gi, "\n")
  .split(/\r?\n/)
  .map(normalizeText)
  .filter(Boolean);

const rowsByReference = new Map();
for (let index = 0; index < lines.length; index += 1) {
  const references = [...lines[index].matchAll(/\b(GTI0[1-7]-[A-Z0-9]+)\+/gi)]
    .map((match) => match[1].toUpperCase());

  if (!references.length) continue;

  const description = lines.slice(index + 1).find((line) => (
    line !== "GTI"
    && !/^\$/.test(line)
    && !/CATALOGO PRODUCTOS|COMERCIALIZADORA AUTOPARTES|DESCRIPCION|MARCA MARGEN|cra\. 82c/i.test(line)
  ));

  if (!description) {
    throw new Error(`No se encontró descripción para ${references.join(", ")}`);
  }

  for (const reference of references) {
    const existing = rowsByReference.get(reference);
    if (existing && existing.description !== description) {
      throw new Error(`Descripción contradictoria para ${reference}: "${existing.description}" / "${description}"`);
    }

    rowsByReference.set(reference, {
      reference,
      description,
      sourceUrl: "https://dokument.pub/repuestos-puntas-y-ejes-flipbook-pdf.html",
    });
  }
}

const rows = [...rowsByReference.values()].sort(sortReference);
if (rows.length !== 446) {
  throw new Error(`Se esperaban 446 referencias únicas y se extrajeron ${rows.length}`);
}

await writeFile(outputPath, `${JSON.stringify(rows, null, 2)}\n`, "utf8");
console.log(`Catálogo GTI generado: ${rows.length} referencias en ${outputPath}`);
