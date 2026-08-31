import crypto from "node:crypto";
import { products } from "../src/lib/products.js";
import { CatalogImportService } from "../src/modules/catalog/application/catalogImportService";
import { PrismaCatalogRepository } from "../src/modules/catalog/infrastructure/prismaCatalogRepository";
import type {
  CatalogImageInput,
  CatalogProductInput,
} from "../src/modules/catalog/domain/catalogSchemas";
import { slugifyCatalogValue } from "../src/modules/catalog/domain/catalogSchemas";

const APPLY = process.argv.includes("--apply");
const REAL_STATUSES = new Set([
  "authentic-product-photo",
  "exact-real-photo",
  "manufacturer-exact",
  "real-product-photo",
  "real-source-photo",
  "real-source-watermarked",
  "source-grounded-web-image",
]);
const GENERATED_STATUSES = new Set([
  "ai-catalog-watermarked",
  "generated-product-reference",
  "generated-reference-image",
]);
const OWNER_SOURCE_TYPES = new Set([
  "owner-photo",
  "first-party-photo",
  "in-house-photo",
  "rembert-photo",
]);
const MANUFACTURER_SOURCE_TYPES = new Set([
  "manufacturer",
  "manufacturer-catalog",
  "official-manufacturer",
]);
const SUPPLIER_SOURCE_TYPES = new Set([
  "supplier",
  "supplier-catalog",
  "authorized-distributor",
  "distributor",
]);

type LegacyProduct = (typeof products)[number] & Record<string, unknown>;

function cleanObject(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function normalizedValue(value: unknown): string {
  return String(value || "").trim().toLowerCase();
}

function firstHttpsUrl(...values: unknown[]): string | undefined {
  for (const value of values.flat()) {
    if (typeof value === "string" && /^https:\/\//i.test(value.trim())) return value.trim();
  }
  return undefined;
}

function sourceUrlFor(product: LegacyProduct, sourceRecord: Record<string, unknown>): string | undefined {
  const brandTreatment = cleanObject(sourceRecord.brandTreatment);
  const geometryEvidence = cleanObject(sourceRecord.geometryEvidence);
  const pages = Array.isArray(sourceRecord.pages) ? sourceRecord.pages : [];

  return firstHttpsUrl(
    sourceRecord.sourceUrl,
    sourceRecord.image,
    sourceRecord.sourceImageUrl,
    sourceRecord.sourcePageUrl,
    sourceRecord.referenceUrl,
    brandTreatment.sourceUrl,
    brandTreatment.sourceImageUrl,
    geometryEvidence.sourcePageUrl,
    geometryEvidence.sourceImageUrl,
    product.sourceUrl,
    product.imageReferenceSourceUrl,
    pages,
  );
}

function sourceSha256For(sourceRecord: Record<string, unknown>): string | undefined {
  const brandTreatment = cleanObject(sourceRecord.brandTreatment);
  const candidates = [
    sourceRecord.sourceSha256,
    sourceRecord.sha256,
    brandTreatment.sourceSha256,
  ];
  const hash = candidates.find((value) => typeof value === "string" && /^[a-f0-9]{64}$/i.test(value));
  return typeof hash === "string" ? hash.toLowerCase() : undefined;
}

function hasVerifiedSourceEvidence(sourceRecord: Record<string, unknown>): boolean {
  return sourceRecord.exactReferenceConfirmed === true
    && sourceRecord.usageAuthorized === true
    && typeof sourceRecord.referenceEvidence === "string"
    && sourceRecord.referenceEvidence.trim().length > 0;
}

function imageProvenance(
  status: string,
  sourceRecord: Record<string, unknown>,
  sourceUrl?: string,
) {
  const sourceType = normalizedValue(sourceRecord.sourceType);
  const sourceRecordType = normalizedValue(sourceRecord.type);
  const isGenerated = GENERATED_STATUSES.has(status)
    || sourceRecordType.includes("generated")
    || sourceRecord.generationPrompt !== undefined;

  // Structured generation evidence always wins over a legacy status. A branded
  // render cannot become an owner or supplier photograph during import.
  if (isGenerated) {
    return { provenance: "GENERATED_REFERENCE", verificationStatus: "GENERATED_REFERENCE" } as const;
  }

  const verified = hasVerifiedSourceEvidence(sourceRecord);
  if (OWNER_SOURCE_TYPES.has(sourceType) && verified) {
    return { provenance: "OWNER_PHOTO", verificationStatus: "VERIFIED_REAL" } as const;
  }
  if (MANUFACTURER_SOURCE_TYPES.has(sourceType)) {
    return {
      provenance: "MANUFACTURER",
      verificationStatus: verified ? "VERIFIED_REAL" : "PENDING",
    } as const;
  }
  if (SUPPLIER_SOURCE_TYPES.has(sourceType)) {
    return {
      provenance: "SUPPLIER",
      verificationStatus: verified ? "VERIFIED_REAL" : "PENDING",
    } as const;
  }

  if (status === "manufacturer-exact") {
    return { provenance: "MANUFACTURER", verificationStatus: "PENDING" } as const;
  }

  // A web URL is source evidence, but not proof that REMBERT owns the image or
  // that a visible product is the exact SKU. Keep it pending unless the
  // structured record above establishes both identity and authorization.
  if (sourceUrl || status === "source-grounded-web-image") {
    return { provenance: "VERIFIED_WEB_SOURCE", verificationStatus: "PENDING" } as const;
  }
  if (REAL_STATUSES.has(status)) {
    return { provenance: "UNKNOWN", verificationStatus: "PENDING" } as const;
  }
  return { provenance: "CATEGORY_REFERENCE", verificationStatus: "PENDING" } as const;
}

function normalizeLegacyProduct(product: LegacyProduct): CatalogProductInput {
  const status = String(product.imageStatus || "PENDING");
  const sourceRecord = cleanObject(product.sourceRecord);
  const sourceUrl = sourceUrlFor(product, sourceRecord);
  const sourceSha256 = sourceSha256For(sourceRecord);
  const provenance = imageProvenance(status, sourceRecord, sourceUrl);
  const rawImages: unknown[] = Array.isArray(product.images) && product.images.length
    ? (product.images as unknown[])
    : product.image
      ? [{ url: product.image, alt: product.name, isMain: true }]
      : [];

  const images: CatalogImageInput[] = [];
  rawImages.forEach((rawImage, index) => {
      const image = cleanObject(rawImage);
      const url = String(image.url || "").trim();
      if (!url) return;
      images.push({
        url,
        alt: String(image.alt || product.name).slice(0, 500),
        isMain: Boolean(image.isMain ?? index === 0),
        ...provenance,
        ...(sourceUrl ? { sourceUrl } : {}),
        ...(sourceSha256 ? { sourceSha256 } : {}),
      });
    });

  const attributes = (Array.isArray(product.attributes) ? product.attributes as unknown[] : [])
    .map((rawAttribute: unknown) => {
      const attribute = cleanObject(rawAttribute);
      return {
        name: String(attribute.name || "").trim(),
        value: String(attribute.value || "").trim(),
      };
    })
    .filter((attribute) => attribute.name && attribute.value);

  const variants = (Array.isArray(product.variants) ? product.variants as unknown[] : [])
    .map((rawVariant: unknown) => {
      const variant = cleanObject(rawVariant);
      const rawAttributes = cleanObject(variant.attributes);
      return {
        ...(variant.id ? { id: String(variant.id) } : {}),
        name: String(variant.name || variant.sku || "Presentación").trim(),
        ...(variant.sku ? { sku: String(variant.sku).trim() } : {}),
        ...(Number.isFinite(Number(variant.price)) ? { price: Number(variant.price) } : {}),
        stock: Math.max(0, Math.trunc(Number(variant.stock) || 0)),
        attributes: Object.fromEntries(
          Object.entries(rawAttributes).map(([key, value]) => [key, String(value)]),
        ),
      };
    });

  const category = cleanObject(product.category);
  const brand = cleanObject(product.brand);
  return {
    id: String(product.id),
    name: String(product.name),
    slug: slugifyCatalogValue(String(product.slug || `${product.name}-${product.id}`)),
    ...(product.sku ? { sku: String(product.sku) } : {}),
    description: String(product.description || ""),
    ...(product.shortDesc ? { shortDesc: String(product.shortDesc) } : {}),
    price: Math.max(0, Number(product.price) || 0),
    ...(Number.isFinite(Number(product.comparePrice))
      ? { comparePrice: Math.max(0, Number(product.comparePrice)) }
      : {}),
    stock: Math.max(0, Math.trunc(Number(product.stock) || 0)),
    inStock: Boolean(product.inStock && Number(product.stock) > 0),
    isActive: true,
    isFeatured: Boolean(product.isFeatured),
    category: {
      name: String(category.name || "Repuestos"),
      slug: slugifyCatalogValue(String(category.slug || "repuestos")),
    },
    brand: {
      name: String(brand.name || product.brand || "Marca según empaque"),
      slug: slugifyCatalogValue(String(brand.slug || "marca-segun-empaque")),
    },
    images,
    variants,
    attributes,
  };
}

async function main() {
  const items = (products as LegacyProduct[]).map(normalizeLegacyProduct);
  const digest = crypto
    .createHash("sha256")
    .update(JSON.stringify(items.map((item) => [item.id, item.slug, item.sku, item.stock, item.images])))
    .digest("hex")
    .slice(0, 24);
  const request = {
    idempotencyKey: `static-catalog-${digest}`,
    source: "STATIC_CATALOG" as const,
    items,
    validateOnly: !APPLY,
  };

  const service = new CatalogImportService();
  const validation = service.validateItems(service.validateRequest(request));
  console.log(
    JSON.stringify(
      {
        mode: APPLY ? "apply" : "validate-only",
        totalRows: items.length,
        validRows: validation.validItems.length,
        rejectedRows: validation.issues.length,
        realPhotos: items.filter((item) =>
          item.images.some((image) => image?.verificationStatus === "VERIFIED_REAL"),
        ).length,
        generatedReferences: items.filter((item) =>
          item.images.some((image) => image?.verificationStatus === "GENERATED_REFERENCE"),
        ).length,
        pendingRealPhotos: items.filter((item) =>
          !item.images.some((image) => image?.verificationStatus === "VERIFIED_REAL"),
        ).length,
        issues: validation.issues.slice(0, 30),
      },
      null,
      2,
    ),
  );

  if (validation.issues.length) process.exitCode = 1;
  if (!APPLY || validation.issues.length) return;

  const repository = new PrismaCatalogRepository();
  const { job } = await repository.createImportJob({
    idempotencyKey: request.idempotencyKey,
    source: request.source,
    requestedBy: "catalog-static-sync",
    rows: validation.stagedRows,
  });

  for (let startRow = 1; startRow <= items.length; startRow += 100) {
    const progress = await repository.processImportChunk(
      job.id,
      startRow,
      Math.min(startRow + 99, items.length),
    );
    console.log(
      `${progress.processedRows}/${progress.totalRows} · ${progress.status} · rechazados ${progress.rejectedRows}`,
    );
  }

  console.log(JSON.stringify(await repository.getImportJob(job.id), null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
