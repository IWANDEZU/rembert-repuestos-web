import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import existingMedia from "../src/data/dynamikCiosaPhotoAssets.generated.js";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(scriptDir, "..");
const outputPath = resolve(rootDir, "src", "data", "dynamikCiosaCatalogRefs.generated.js");
const reportPath = resolve(rootDir, "tmp", "dynamik-ciosa-complete-catalog-report.json");
const sourceBase = "https://www.ciosa.co";
const listingPath = "/autopartes/dynamik";
const pageSize = 12;
const concurrency = Math.max(1, Number.parseInt(process.env.DYNAMIK_CIOSA_CATALOG_CONCURRENCY || "8", 10));
const apply = process.argv.includes("--apply");

const TARGET_SUBGROUPS = new Set([
  "ACCESORIOS DE FRENADO",
  "BALATAS Y ZAPATAS",
  "DISCOS DE FRENO",
  "JUEGO DE EMBRAGUES",
]);

// This card is listed by Ciosa Colombia, but its live detail template contains no
// product fields. Preserve the listed NPC and the literal card description. Do
// not infer an OE/canonical equivalence that Ciosa has not explicitly published.
const CIOSA_BROKEN_DETAIL_FALLBACKS = new Map([
  ["DNKOE410602596L", {
    npc: "DNKOE410602596L",
    description: "Pastilla de freno delantera Renault Kwid",
    system: "No publicado en la ficha accesible",
    subgroup: "BALATAS Y ZAPATAS",
    group: "FRENOS",
    specifications: [],
    dataQuality: "ciosa-co-broken-detail-listing-only",
  }],
]);

const normalizeSku = (value) => String(value || "").trim().toUpperCase();
const normalizeWhitespace = (value) => String(value || "").replace(/\s+/g, " ").trim();
const decodeHtml = (value) => normalizeWhitespace(String(value || "")
  .replace(/<br\s*\/?>/gi, " ")
  .replace(/<[^>]+>/g, " ")
  .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
  .replace(/&#x([a-f0-9]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
  .replace(/&aacute;/gi, "á").replace(/&eacute;/gi, "é").replace(/&iacute;/gi, "í")
  .replace(/&oacute;/gi, "ó").replace(/&uacute;/gi, "ú").replace(/&ntilde;/gi, "ñ")
  .replace(/&Aacute;/g, "Á").replace(/&Eacute;/g, "É").replace(/&Iacute;/g, "Í")
  .replace(/&Oacute;/g, "Ó").replace(/&Uacute;/g, "Ú").replace(/&Ntilde;/g, "Ñ")
  .replace(/&amp;/gi, "&").replace(/&quot;/gi, "\"").replace(/&#39;/g, "'")
  .replace(/&nbsp;/gi, " "));
const capture = (html, pattern) => decodeHtml(html.match(pattern)?.[1] || "");

const wait = (milliseconds) => new Promise((resolvePromise) => setTimeout(resolvePromise, milliseconds));
const fetchText = async (url, attempts = 3) => {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { "user-agent": "RembertDynamikCatalogSync/1.0 (+exact NPC audit)" },
      });
      const text = await response.text();
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return text;
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await wait(250 * attempt);
    }
  }
  throw new Error(`${url}: ${lastError?.message || "error desconocido"}`);
};

const extractSpecifications = (html) => {
  const section = html.match(/id=["']especificaciones-prod["'][^>]*>([\s\S]*?)<div class=["']row mt-4["']/i)?.[1] || "";
  const boxes = section.split(/<div\s+class=["']bordered-box[^"']*["'][^>]*>/i).slice(1);
  const specifications = [];
  for (let index = 0; index + 1 < boxes.length; index += 2) {
    const labels = [...boxes[index].matchAll(/<strong[^>]*>([\s\S]*?)<\/strong>/gi)].map((match) => decodeHtml(match[1]));
    const values = [...boxes[index + 1].matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map((match) => decodeHtml(match[1]));
    labels.forEach((name, labelIndex) => {
      const value = values[labelIndex];
      if (name && value && value !== "–" && value !== "-") specifications.push({ name, value });
    });
  }
  return specifications;
};

const extractTechnicalData = (html, sku) => ({
  npc: capture(html, new RegExp(`<h6[^>]*>\\s*NPC\\s+(${sku})`, "i")) || sku,
  description: capture(html, /<span\s+id=["']p-dcompl["'][^>]*>([\s\S]*?)<\/span>/i),
  system: capture(html, /<strong>\s*SISTEMA\s*:?\s*<\/strong>\s*<p>([\s\S]*?)<\/p>/i),
  subgroup: capture(html, /<strong>\s*SUBGRUPO\s*:?\s*<\/strong>\s*<p>([\s\S]*?)<\/p>/i),
  group: capture(html, /<strong>\s*GRUPO\s*:?\s*<\/strong>\s*<p>([\s\S]*?)<\/p>/i),
  specifications: extractSpecifications(html),
});

const extractExpectedSubgroupCounts = (html) => Object.fromEntries(
  [...TARGET_SUBGROUPS].map((subgroup) => {
    const escaped = subgroup.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const count = Number.parseInt(html.match(new RegExp(`${escaped}\\s*\\((\\d+)\\)`, "i"))?.[1] || "0", 10);
    return [subgroup, count];
  }),
);

const extractListingSkus = (html) => [...new Set(
  [...html.matchAll(/productos\/detalle\/([A-Za-z0-9_-]+)/g)].map((match) => normalizeSku(match[1])),
)].filter(Boolean);

const firstHtml = await fetchText(`${sourceBase}${listingPath}`);
const total = Number.parseInt(
  [...firstHtml.matchAll(/\b\d+\s*-\s*\d+\s+de\s+(\d+)\b/gi)][0]?.[1]
    || firstHtml.match(/DYNAMIK\s*\((\d+)\)/i)?.[1]
    || "0",
  10,
);
if (!total) throw new Error("No se pudo determinar el total del catálogo Dynamik de Ciosa Colombia.");

const expectedSubgroupCounts = extractExpectedSubgroupCounts(firstHtml);
const expectedTargetTotal = Object.values(expectedSubgroupCounts).reduce((sum, count) => sum + count, 0);
if (!expectedTargetTotal) throw new Error("No se pudieron leer los conteos de subgrupos objetivo.");

const offsets = Array.from({ length: Math.ceil(total / pageSize) }, (_, index) => index * pageSize);
const listingPages = new Map([[0, firstHtml]]);
let nextListingIndex = 1;
await Promise.all(Array.from({ length: Math.min(concurrency, offsets.length) }, async () => {
  while (nextListingIndex < offsets.length) {
    const offset = offsets[nextListingIndex];
    nextListingIndex += 1;
    listingPages.set(offset, await fetchText(`${sourceBase}${listingPath}/${offset}`));
  }
}));

const listedSkus = [...new Set(
  [...listingPages.entries()]
    .sort(([left], [right]) => left - right)
    .flatMap(([, html]) => extractListingSkus(html)),
)];
if (listedSkus.length !== total) {
  throw new Error(`Ciosa declara ${total} referencias Dynamik, pero el rastreo obtuvo ${listedSkus.length}.`);
}

const technicalBySku = new Map();
// Fetch every Colombian detail page. The older media manifest can contain
// technical data from ciosa.com (Mexico), so reusing it here would silently mix
// regional provenance.
const detailsToFetch = listedSkus;

const failures = [];
let nextDetailIndex = 0;
await Promise.all(Array.from({ length: Math.min(concurrency, Math.max(1, detailsToFetch.length)) }, async () => {
  while (nextDetailIndex < detailsToFetch.length) {
    const sku = detailsToFetch[nextDetailIndex];
    nextDetailIndex += 1;
    try {
      const html = await fetchText(`${sourceBase}/productos/detalle/${encodeURIComponent(sku)}`);
      let technical = extractTechnicalData(html, sku);
      if (
        normalizeSku(technical.npc) !== sku
        || !technical.description
        || !technical.system
        || !technical.subgroup
        || !technical.group
      ) {
        technical = CIOSA_BROKEN_DETAIL_FALLBACKS.get(sku);
      }
      if (!technical) {
        throw new Error("ficha técnica colombiana incompleta o NPC distinto");
      }
      technicalBySku.set(sku, technical);
    } catch (error) {
      failures.push({ sku, error: error.message });
    }
    if (nextDetailIndex % 50 === 0) console.log(`Fichas nuevas auditadas ${nextDetailIndex}/${detailsToFetch.length}`);
  }
}));

const formulaFor = (sku) => {
  const suffix = sku.match(/(CK|LM|RS|SD|SM)$/)?.[1];
  return ({
    CK: "Cerámica",
    LM: "Bajos metales",
    RS: "Sport",
    SD: "Servicio severo",
    SM: "Semimetálica",
  })[suffix] || "";
};
const positionFor = (description) => {
  if (/\b(tras|trasera|trasero|posterior)\b/i.test(description)) return "Trasera";
  if (/\b(del|delantera|delantero|frontal)\b/i.test(description)) return "Delantera";
  return "";
};
const clutchDimensionsFor = (description) => {
  const normalized = normalizeWhitespace(description).toUpperCase();
  const diameter = normalized.match(/(?:EMBRAGUE|CLUTCH)\s+(\d{3})(?:\s*MM)?\b/)?.[1] || "";
  const splines = normalized.match(/(?:EMBRAGUE|CLUTCH)\s+\d{3}(?:\s*MM)?\s+(\d{1,2})(?:\s*D|\b)/)?.[1] || "";
  return {
    diameterMm: diameter ? Number.parseInt(diameter, 10) : null,
    splines: splines ? Number.parseInt(splines, 10) : null,
  };
};
const fmsiFor = (sku) => sku.match(/^DNK(\d{3,5}D\d{2,5})/i)?.[1] || "";

const records = listedSkus
  .map((sku) => {
    const technical = technicalBySku.get(sku);
    if (!technical || !TARGET_SUBGROUPS.has(technical.subgroup.toUpperCase())) return null;
    const clutch = technical.subgroup.toUpperCase() === "JUEGO DE EMBRAGUES";
    const supplemental = existingMedia[sku];
    const supplementalSourceUrl = supplemental?.sourceProof?.detailUrl || "";
    const supplementalSpecifications = supplementalSourceUrl.startsWith("https://www.ciosa.com/")
      ? (supplemental?.technical?.specifications || [])
      : [];
    return {
      sku,
      sourceUrl: `${sourceBase}/productos/detalle/${encodeURIComponent(sku)}`,
      ...(technical.dataQuality ? { dataQuality: technical.dataQuality } : {}),
      retrievedAt: new Date().toISOString(),
      description: technical.description,
      system: technical.system,
      subgroup: technical.subgroup.toUpperCase(),
      group: technical.group,
      position: positionFor(technical.description),
      formula: formulaFor(sku),
      fmsi: fmsiFor(sku),
      ...(clutch ? clutchDimensionsFor(technical.description) : { diameterMm: null, splines: null }),
      specifications: technical.specifications || [],
      ...(supplementalSpecifications.length ? {
        supplementalSpecifications,
        supplementalSourceUrl,
        supplementalRegion: "Ciosa México",
      } : {}),
    };
  })
  .filter(Boolean)
  .sort((left, right) => left.sku.localeCompare(right.sku));

const actualSubgroupCounts = Object.fromEntries([...TARGET_SUBGROUPS].map((subgroup) => [
  subgroup,
  records.filter((record) => record.subgroup === subgroup).length,
]));
const subgroupMismatches = [...TARGET_SUBGROUPS]
  .filter((subgroup) => actualSubgroupCounts[subgroup] !== expectedSubgroupCounts[subgroup])
  .map((subgroup) => ({ subgroup, expected: expectedSubgroupCounts[subgroup], actual: actualSubgroupCounts[subgroup] }));

const report = {
  generatedAt: new Date().toISOString(),
  source: `${sourceBase}${listingPath}`,
  listedDynamikReferences: total,
  targetReferences: records.length,
  nonTargetReferences: total - records.length,
  expectedSubgroupCounts,
  actualSubgroupCounts,
  cachedTechnicalRecords: 0,
  fetchedTechnicalRecords: detailsToFetch.length - failures.length,
  listingFallbackRecords: records.filter((record) => record.dataQuality === "ciosa-co-broken-detail-listing-only").length,
  supplementalMexicoRecords: records.filter((record) => record.supplementalSpecifications?.length).length,
  failures,
  subgroupMismatches,
};

await mkdir(dirname(reportPath), { recursive: true });
await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

if (failures.length || subgroupMismatches.length || records.length !== expectedTargetTotal) {
  console.log(JSON.stringify(report, null, 2));
  process.exitCode = 1;
} else if (apply) {
  const header = "// Generado por scripts/sync-dynamik-ciosa-catalog.mjs desde ciosa.co.\n// No editar manualmente: cada registro conserva el NPC y la ficha técnica oficial.\n";
  await writeFile(
    outputPath,
    `${header}export const dynamikCiosaCompleteCatalogAudit = ${JSON.stringify({
      source: report.source,
      listedDynamikReferences: report.listedDynamikReferences,
      targetReferences: report.targetReferences,
      subgroupCounts: report.actualSubgroupCounts,
      generatedAt: report.generatedAt,
    }, null, 2)};\n\nexport const dynamikCiosaCatalogRefs = ${JSON.stringify(records, null, 2)};\n\nexport default dynamikCiosaCatalogRefs;\n`,
    "utf8",
  );
  console.log(JSON.stringify({ ...report, failures: undefined, subgroupMismatches: undefined, outputPath, reportPath }, null, 2));
} else {
  console.log(JSON.stringify({ ...report, failures: undefined, subgroupMismatches: undefined, mode: "audit-only", reportPath }, null, 2));
}
