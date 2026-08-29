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

type LegacyProduct = (typeof products)[number] & Record<string, unknown>;

function cleanObject(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function imageProvenance(status: string) {
  if (GENERATED_STATUSES.has(status)) {
    return { provenance: "GENERATED_REFERENCE", verificationStatus: "GENERATED_REFERENCE" } as const;
  }
  if (REAL_STATUSES.has(status)) {
    return { provenance: "OWNER_PHOTO", verificationStatus: "VERIFIED_REAL" } as const;
  }
  return { provenance: "CATEGORY_REFERENCE", verificationStatus: "PENDING" } as const;
}

function normalizeLegacyProduct(product: LegacyProduct): CatalogProductInput {
  const status = String(product.imageStatus || "PENDING");
  const provenance = imageProvenance(status);
  const sourceRecord = cleanObject(product.sourceRecord);
  const sourceUrl =
    typeof sourceRecord.image === "string" && /^https:\/\//i.test(sourceRecord.image)
      ? sourceRecord.image
      : undefined;
  const sourceSha256 =
    typeof sourceRecord.sha256 === "string" && /^[a-f0-9]{64}$/i.test(sourceRecord.sha256)
      ? sourceRecord.sha256.toLowerCase()
      : undefined;
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
