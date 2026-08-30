import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { dynamikCiosaCatalogRefs } from "../src/data/dynamikCiosaCatalogRefs.generated.js";
import dynamikCiosaPhotoAssets from "../src/data/dynamikCiosaPhotoAssets.generated.js";
import { products } from "../src/lib/products.js";

const rootDir = resolve(import.meta.dirname, "..");
const jsonPath = resolve(rootDir, "tmp", "dynamik-photo-gap-queue.json");
const csvPath = resolve(rootDir, "tmp", "dynamik-photo-gap-queue.csv");
const realPhotoStatuses = new Set(["exact-real-photo", "official-catalog-watermarked", "real-source-photo"]);
const publishedBySku = new Map(products
  .filter((product) => product?.brand?.slug === "dynamik")
  .map((product) => [String(product.sku || "").toUpperCase(), product]));

const gaps = dynamikCiosaCatalogRefs
  .map((reference) => {
    const product = publishedBySku.get(reference.sku);
    const media = dynamikCiosaPhotoAssets[reference.sku];
    if (product && realPhotoStatuses.has(product.imageStatus)) return null;
    const views = media?.views || [];
    const diagrams = views.filter((view) => view.mediaType === "technical-diagram" && !view.isSharedAcrossSkus);
    const packaging = views.filter((view) => view.mediaType === "generic-packaging" || view.isSharedAcrossSkus);
    const primarySpecifications = reference.specifications || [];
    const supplementalSpecifications = reference.supplementalSpecifications || [];
    const hasGeometryEvidence = Boolean(reference.fmsi || diagrams.length || primarySpecifications.length || supplementalSpecifications.length);
    const workflow = product?.imageStatus === "generated-reference-image"
      ? "replace-recreation-with-physical-photo"
      : hasGeometryEvidence
        ? "cross-brand-research-eligible-but-physical-photo-still-required"
        : "supplier-or-owner-photo-required";
    return {
      priority: reference.subgroup === "JUEGO DE EMBRAGUES" ? 1 : reference.subgroup === "DISCOS DE FRENO" ? 2 : 3,
      sku: reference.sku,
      productName: product?.name || reference.description,
      subgroup: reference.subgroup,
      imageStatus: product?.imageStatus || "pending-real-photo",
      ciosaColombiaUrl: reference.sourceUrl,
      description: reference.description,
      position: reference.position || "",
      formula: reference.formula || "",
      fmsi: reference.fmsi || "",
      primarySpecificationCount: primarySpecifications.length,
      supplementalSpecificationCount: supplementalSpecifications.length,
      technicalDiagramCount: diagrams.length,
      genericPackagingCount: packaging.length,
      workflow,
      crossBrandSearchQuery: [reference.sku, reference.fmsi, reference.description, "brake pad disc clutch product photo"].filter(Boolean).join(" "),
      acceptanceRule: "Aceptar sólo foto física ligada al NPC exacto o equivalencia técnica documentada; una recreación debe etiquetarse como IA y nunca cuenta como foto real.",
    };
  })
  .filter(Boolean)
  .sort((left, right) => left.priority - right.priority || left.sku.localeCompare(right.sku));

const summary = {
  generatedAt: new Date().toISOString(),
  targetReferences: dynamikCiosaCatalogRefs.length,
  physicalPhotoGaps: gaps.length,
  bySubgroup: Object.fromEntries([...new Set(gaps.map((gap) => gap.subgroup))].map((subgroup) => [
    subgroup,
    gaps.filter((gap) => gap.subgroup === subgroup).length,
  ])),
  withTechnicalDiagram: gaps.filter((gap) => gap.technicalDiagramCount > 0).length,
  crossBrandResearchEligible: gaps.filter((gap) => gap.workflow.includes("cross-brand")).length,
  supplierOrOwnerPhotoRequired: gaps.filter((gap) => gap.workflow === "supplier-or-owner-photo-required").length,
  generatedRecreationsToReplace: gaps.filter((gap) => gap.imageStatus === "generated-reference-image").length,
};

const columns = [
  "priority", "sku", "subgroup", "imageStatus", "description", "position", "formula", "fmsi",
  "primarySpecificationCount", "supplementalSpecificationCount", "technicalDiagramCount",
  "genericPackagingCount", "workflow", "ciosaColombiaUrl", "crossBrandSearchQuery", "acceptanceRule",
];
const csvCell = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
const csv = [columns.join(","), ...gaps.map((gap) => columns.map((column) => csvCell(gap[column])).join(","))].join("\n");

await mkdir(resolve(rootDir, "tmp"), { recursive: true });
await writeFile(jsonPath, `${JSON.stringify({ summary, gaps }, null, 2)}\n`, "utf8");
await writeFile(csvPath, `${csv}\n`, "utf8");
console.log(JSON.stringify({ summary, jsonPath, csvPath }, null, 2));

