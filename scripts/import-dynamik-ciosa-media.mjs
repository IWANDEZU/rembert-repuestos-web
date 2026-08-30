import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { products } from "../src/lib/products.js";
import { dynamikCiosaCatalogRefs } from "../src/data/dynamikCiosaCatalogRefs.generated.js";
import { classifyCiosaMedia } from "./lib/dynamik-ciosa-media-classifier.mjs";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(scriptDir, "..");
const publicRoot = resolve(rootDir, "public", "catalogo-dynamik", "ciosa");
const manifestPath = resolve(rootDir, "src", "data", "dynamikCiosaPhotoAssets.generated.js");
const reportPath = resolve(rootDir, "tmp", "dynamik-ciosa-import-report.json");
const sourceBase = process.env.DYNAMIK_SOURCE_BASE || "https://www.ciosa.co";
const PLACEHOLDER_HASHES = new Set([
  "ca1a24af8b6e37cb8a41b8b22c8b7838b500de4a89105b604ec95b6769f95a15",
  "5022e85b43813dcb0debd8ee66fc0d68aaa03c7265331c5ab7afde9f3de2d14f",
]);
const concurrency = Math.max(1, Number.parseInt(process.env.DYNAMIK_CIOSA_CONCURRENCY || "8", 10));
const requestedLimit = Number.parseInt(process.env.DYNAMIK_CIOSA_LIMIT || "0", 10);
const onlySku = String(process.env.DYNAMIK_CIOSA_SKU || "").trim().toUpperCase();
const onlyMissing = /^(1|true|yes)$/i.test(String(process.env.DYNAMIK_CIOSA_ONLY_MISSING || ""));

const normalizeSku = (value) => String(value || "").trim().toUpperCase();
const decodeHtml = (value) => String(value || "")
  .replace(/<br\s*\/?>/gi, " ")
  .replace(/<[^>]+>/g, " ")
  .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
  .replace(/&#x([a-f0-9]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
  .replace(/&aacute;/gi, "á").replace(/&eacute;/gi, "é").replace(/&iacute;/gi, "í")
  .replace(/&oacute;/gi, "ó").replace(/&uacute;/gi, "ú").replace(/&ntilde;/gi, "ñ")
  .replace(/&Aacute;/g, "Á").replace(/&Eacute;/g, "É").replace(/&Iacute;/g, "Í")
  .replace(/&Oacute;/g, "Ó").replace(/&Uacute;/g, "Ú").replace(/&Ntilde;/g, "Ñ")
  .replace(/&amp;/gi, "&").replace(/&quot;/gi, '"').replace(/&#39;/g, "'")
  .replace(/&nbsp;/gi, " ").replace(/\s+/g, " ").trim();
const capture = (html, pattern) => decodeHtml(html.match(pattern)?.[1] || "");
const extractSpecifications = (html) => {
  const section = html.match(/id=["']especificaciones-prod["'][^>]*>([\s\S]*?)<div class=["']row mt-4["']/i)?.[1] || "";
  const boxes = section.split(/<div\s+class=["']bordered-box[^"']*["'][^>]*>/i).slice(1);
  const specifications = [];
  for (let index = 0; index + 1 < boxes.length; index += 2) {
    const labels = [...boxes[index].matchAll(/<strong[^>]*>([\s\S]*?)<\/strong>/gi)].map((match) => decodeHtml(match[1]));
    const values = [...boxes[index + 1].matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map((match) => decodeHtml(match[1]));
    labels.forEach((name, labelIndex) => {
      const value = values[labelIndex];
      if (name && value) specifications.push({ name, value });
    });
  }
  return specifications;
};
const extractSourceViews = (html, sku) => {
  const references = new Map();
  for (const match of html.matchAll(/getImage\/marcaDetalle\/([A-Za-z0-9_-]+)/g)) {
    const reference = match[1];
    if (reference === sku || reference.startsWith(`${sku}_`)) {
      references.set(reference, `${sourceBase}/getImage/marcaDetalle/${reference}`);
    }
  }
  const imageApiPattern = new RegExp(`https:\\/\\/img\\.ciosa\\.com\\/api\\/v1\\/img\\/filter\\/${sku}\\/([A-Za-z0-9_-]+)`, "g");
  for (const match of html.matchAll(imageApiPattern)) {
    const reference = match[1];
    if (reference === sku || reference.startsWith(`${sku}_`)) references.set(reference, match[0]);
  }
  return [...references.entries()]
    .map(([reference, url]) => ({ reference, url }))
    .sort((left, right) => {
      if (left.reference === sku) return -1;
      if (right.reference === sku) return 1;
      return left.reference.localeCompare(right.reference);
    });
};
const extractTechnicalData = (html, sku) => ({
  npc: capture(html, new RegExp(`<h6[^>]*>\\s*NPC\\s+(${sku})`, "i")) || sku,
  description: capture(html, /<span\s+id=["']p-dcompl["'][^>]*>([\s\S]*?)<\/span>/i),
  system: capture(html, /<strong>\s*SISTEMA\s*:?\s*<\/strong>\s*<p>([\s\S]*?)<\/p>/i),
  subgroup: capture(html, /<strong>\s*SUBGRUPO\s*:?\s*<\/strong>\s*<p>([\s\S]*?)<\/p>/i),
  group: capture(html, /<strong>\s*GRUPO\s*:?\s*<\/strong>\s*<p>([\s\S]*?)<\/p>/i),
  specifications: extractSpecifications(html),
});
const imageDimensions = (buffer) => {
  if (buffer.length >= 24 && buffer.subarray(1, 4).toString("ascii") === "PNG") {
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }
  if (buffer.length >= 4 && buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2;
    while (offset + 9 < buffer.length) {
      if (buffer[offset] !== 0xff) { offset += 1; continue; }
      const marker = buffer[offset + 1];
      if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
        return { height: buffer.readUInt16BE(offset + 5), width: buffer.readUInt16BE(offset + 7) };
      }
      if (marker === 0xd8 || marker === 0xd9 || (marker >= 0xd0 && marker <= 0xd7)) { offset += 2; continue; }
      const size = buffer.readUInt16BE(offset + 2);
      if (size < 2) break;
      offset += size + 2;
    }
  }
  return { width: 0, height: 0 };
};
const extensionFor = (contentType) => contentType.includes("png") ? ".png" : contentType.includes("webp") ? ".webp" : ".jpg";
const labelFor = (index) => index === 0 ? "Vista principal" : `Vista ${index + 1}`;

const existingSource = await readFile(manifestPath, "utf8").catch(() => "");
const existingMatch = existingSource.match(/const dynamikCiosaPhotoAssets = (\{[\s\S]*\});\s*\n\s*export default/);
const existing = existingMatch ? JSON.parse(existingMatch[1]) : {};
const publishedNames = new Map(products
  .filter((product) => product?.brand?.slug === "dynamik")
  .map((product) => [normalizeSku(product.sku), product.name]));
const allTargets = dynamikCiosaCatalogRefs
  .map((reference) => ({
    sku: normalizeSku(reference.sku),
    name: publishedNames.get(normalizeSku(reference.sku)) || `Producto Dynamik ${reference.sku} — ${reference.description}`,
    reference,
  }))
  .filter((target) => target.sku)
  .filter((target) => !onlySku || target.sku === onlySku)
  .filter((target) => !onlyMissing || !existing[target.sku])
  .sort((left, right) => left.sku.localeCompare(right.sku));
const targets = requestedLimit > 0 ? allTargets.slice(0, requestedLimit) : allTargets;

const imported = {};
const results = [];
let nextIndex = 0;

const fetchOne = async (target) => {
  const detailUrl = `${sourceBase}/productos/detalle/${encodeURIComponent(target.sku)}`;
  try {
    const response = await fetch(detailUrl, { headers: { "user-agent": "RembertDynamikCatalogImporter/1.0 (+exact SKU verification)" } });
    const html = await response.text();
    if (!response.ok) throw new Error(`Ficha HTTP ${response.status}`);
    const sourceViews = extractSourceViews(html, target.sku);
    const liveTechnical = extractTechnicalData(html, target.sku);
    const technical = {
      npc: target.sku,
      description: target.reference.description || liveTechnical.description,
      system: target.reference.system || liveTechnical.system,
      subgroup: target.reference.subgroup || liveTechnical.subgroup,
      group: target.reference.group || liveTechnical.group,
      specifications: target.reference.specifications || [],
    };
    const supplementalTechnical = target.reference.supplementalSpecifications?.length ? {
      region: target.reference.supplementalRegion,
      sourceUrl: target.reference.supplementalSourceUrl,
      specifications: target.reference.supplementalSpecifications,
    } : null;
    const registerTechnicalOnly = () => {
      imported[target.sku] = {
        sku: target.sku,
        name: target.name,
        imageStatus: "official-catalog-technical-only",
        imageDisclosure: "Ciosa Colombia no publica una fotografía física exclusiva para este NPC; la ficha conserva sus datos técnicos y la foto permanece pendiente.",
        sourceProof: { detailUrl, retrievedAt: new Date().toISOString(), provider: "Ciosa Autopartes", region: "Colombia" },
        technical,
        ...(supplementalTechnical ? { supplementalTechnical } : {}),
        views: [],
      };
      return { sku: target.sku, name: target.name, detailUrl, status: "technical-only", views: 0 };
    };
    if (!sourceViews.length) {
      return registerTechnicalOnly();
    }

    const localDir = resolve(publicRoot, target.sku.toLowerCase());
    await mkdir(localDir, { recursive: true });
    const views = [];
    const viewErrors = [];
    for (let index = 0; index < sourceViews.length; index += 1) {
      const { reference: sourceReference, url: sourceUrl } = sourceViews[index];
      try {
        const imageResponse = await fetch(sourceUrl, { headers: { "user-agent": "RembertDynamikCatalogImporter/1.0 (+exact SKU verification)" } });
        const contentType = String(imageResponse.headers.get("content-type") || "").toLowerCase();
        if (!imageResponse.ok || !contentType.startsWith("image/")) throw new Error(`HTTP ${imageResponse.status} ${contentType}`);
        const buffer = Buffer.from(await imageResponse.arrayBuffer());
        const dimensions = imageDimensions(buffer);
        if (buffer.length < 3_000 || dimensions.width < 300 || dimensions.height < 300) {
          throw new Error(`${buffer.length} bytes, ${dimensions.width}x${dimensions.height}`);
        }
        const sha256 = createHash("sha256").update(buffer).digest("hex");
        if (PLACEHOLDER_HASHES.has(sha256)) continue;
        const classification = await classifyCiosaMedia(buffer);
        const extension = extensionFor(contentType);
        const suffix = sourceReference === target.sku ? "principal" : sourceReference.slice(target.sku.length + 1).toLowerCase();
        const filename = `${target.sku.toLowerCase()}-${suffix}${extension}`;
        await writeFile(resolve(localDir, filename), buffer);
        views.push({
          url: `/catalogo-dynamik/ciosa/${target.sku.toLowerCase()}/${filename}`,
          sourceUrl,
          sourceReference,
          sha256,
          bytes: buffer.length,
          ...dimensions,
          mediaType: classification.mediaType,
          analysis: classification.analysis,
          label: classification.mediaType === "photo" ? "Fotografía del producto" : "Plano técnico",
          alt: classification.mediaType === "photo"
            ? `Fotografía real de ${target.name}, NPC ${target.sku}`
            : `Plano técnico oficial de ${target.name}, NPC ${target.sku}`,
          isMain: index === 0,
        });
      } catch (error) {
        viewErrors.push({ sourceReference, sourceUrl, error: error.message });
      }
    }

    if (!views.length) {
      const result = registerTechnicalOnly();
      return { ...result, skippedViews: viewErrors };
    }

    const hasExactPhoto = views.some((view) => view.mediaType === "photo");
    imported[target.sku] = {
      sku: target.sku,
      name: target.name,
      imageStatus: hasExactPhoto ? "official-catalog-watermarked" : "official-catalog-technical-only",
      imageDisclosure: hasExactPhoto
        ? "Fotografía real de catálogo Ciosa para este NPC; los planos se muestran solo como detalle técnico."
        : "Ciosa publica datos o planos para este NPC, pero no una fotografía real exclusiva; la foto permanece pendiente.",
      sourceProof: { detailUrl, retrievedAt: new Date().toISOString(), provider: "Ciosa Autopartes", region: "Colombia" },
      technical,
      ...(supplementalTechnical ? { supplementalTechnical } : {}),
      views,
    };
    return { sku: target.sku, name: target.name, detailUrl, status: "imported", views: views.length, bytes: views.reduce((sum, view) => sum + view.bytes, 0), skippedViews: viewErrors };
  } catch (error) {
    return { sku: target.sku, name: target.name, detailUrl, status: "failed", views: 0, error: error.message };
  }
};

await Promise.all(Array.from({ length: Math.min(concurrency, Math.max(1, targets.length)) }, async () => {
  while (nextIndex < targets.length) {
    const target = targets[nextIndex];
    nextIndex += 1;
    const result = await fetchOne(target);
    results.push(result);
    if (results.length % 25 === 0) console.log(`Procesadas ${results.length}/${targets.length}`);
  }
}));

const merged = { ...existing, ...imported };
const duplicateHashes = {};
for (const record of Object.values(merged)) {
  for (const view of record.views || []) {
    duplicateHashes[view.sha256] ||= [];
    duplicateHashes[view.sha256].push({ sku: record.sku, sourceReference: view.sourceReference });
  }
}
const crossSkuDuplicateHashes = Object.entries(duplicateHashes)
  .filter(([, occurrences]) => new Set(occurrences.map((item) => item.sku)).size > 1)
  .map(([sha256, occurrences]) => ({ sha256, occurrences }));
const sharedHashSet = new Set(crossSkuDuplicateHashes.map((item) => item.sha256));
const markedMerged = Object.fromEntries(Object.entries(merged).map(([sku, record]) => {
  const views = (record.views || []).map((view) => ({
    ...view,
    isSharedAcrossSkus: sharedHashSet.has(view.sha256),
  }));
  const hasExactPhoto = views.some((view) => view.mediaType === "photo" && !view.isSharedAcrossSkus);
  return [sku, {
    ...record,
    imageStatus: hasExactPhoto ? "official-catalog-watermarked" : "official-catalog-technical-only",
    imageDisclosure: hasExactPhoto
      ? "Fotografía física de catálogo Ciosa Colombia vinculada a este NPC; los planos se muestran sólo como detalle técnico."
      : "Ciosa Colombia no publica una fotografía física exclusiva para este NPC; la foto permanece pendiente.",
    views,
  }];
}));

const header = "// Archivo generado por scripts/import-dynamik-ciosa-media.mjs.\n// No editar manualmente: cada vista conserva URL fuente, hash y dimensiones.\n";
await writeFile(manifestPath, `${header}const dynamikCiosaPhotoAssets = ${JSON.stringify(markedMerged, null, 2)};\n\nexport default dynamikCiosaPhotoAssets;\n`, "utf8");
results.sort((left, right) => left.sku.localeCompare(right.sku));
const report = {
  generatedAt: new Date().toISOString(),
  requested: targets.length,
  imported: results.filter((item) => item.status === "imported").length,
  technicalOnly: results.filter((item) => item.status === "technical-only").length,
  withoutGallery: results.filter((item) => item.status === "no-source-gallery").length,
  failed: results.filter((item) => item.status === "failed").length,
  totalViewsImported: results.reduce((sum, item) => sum + item.views, 0),
  totalBytesImported: results.reduce((sum, item) => sum + (item.bytes || 0), 0),
  manifestRecords: Object.keys(merged).length,
  referencesWithExclusiveViews: Object.values(markedMerged).filter((record) => record.views.some((view) => !view.isSharedAcrossSkus)).length,
  crossSkuDuplicateHashes,
  results,
};
await mkdir(dirname(reportPath), { recursive: true });
await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ ...report, results: undefined, crossSkuDuplicateHashes: crossSkuDuplicateHashes.length, reportPath, manifestPath }, null, 2));
