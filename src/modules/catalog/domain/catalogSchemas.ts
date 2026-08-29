import { z } from "zod";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const sha256Pattern = /^[a-f0-9]{64}$/i;

export const imageProvenanceSchema = z.enum([
  "UNKNOWN",
  "SUPPLIER",
  "MANUFACTURER",
  "OWNER_PHOTO",
  "VERIFIED_WEB_SOURCE",
  "GENERATED_REFERENCE",
  "CATEGORY_REFERENCE",
]);

export const imageVerificationStatusSchema = z.enum([
  "PENDING",
  "VERIFIED_REAL",
  "GENERATED_REFERENCE",
  "REJECTED",
]);

export const catalogImageSchema = z
  .object({
    url: z.string().trim().min(1).max(2048),
    alt: z.string().trim().max(500).optional(),
    isMain: z.boolean().default(false),
    provenance: imageProvenanceSchema.default("UNKNOWN"),
    verificationStatus: imageVerificationStatusSchema.default("PENDING"),
    sourceUrl: z.url().max(2048).optional(),
    sourceSha256: z.string().regex(sha256Pattern).optional(),
    verifiedAt: z.iso.datetime({ offset: true }).optional(),
  })
  .superRefine((image, ctx) => {
    if (
      image.verificationStatus === "VERIFIED_REAL" &&
      image.provenance === "GENERATED_REFERENCE"
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["provenance"],
        message: "Una imagen generada no puede marcarse como fotografía real verificada.",
      });
    }

    if (
      image.verificationStatus === "GENERATED_REFERENCE" &&
      image.provenance !== "GENERATED_REFERENCE"
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["provenance"],
        message: "Una referencia generada debe declarar GENERATED_REFERENCE como procedencia.",
      });
    }
  });

export const catalogVariantSchema = z.object({
  id: z.string().trim().min(1).max(191).optional(),
  name: z.string().trim().min(1).max(300),
  sku: z.string().trim().min(1).max(191).optional(),
  price: z.number().finite().nonnegative().max(999_999_999).optional(),
  stock: z.number().int().nonnegative().max(10_000_000).default(0),
  attributes: z.record(z.string(), z.string()).default({}),
});

export const catalogAttributeSchema = z.object({
  name: z.string().trim().min(1).max(191),
  value: z.string().trim().min(1).max(2000),
});

export const catalogProductInputSchema = z
  .object({
    id: z.string().trim().min(1).max(191).optional(),
    name: z.string().trim().min(2).max(500),
    slug: z.string().trim().regex(slugPattern).max(500).optional(),
    sku: z.string().trim().min(1).max(191).optional(),
    description: z.string().trim().max(30_000).default(""),
    shortDesc: z.string().trim().max(2_000).optional(),
    price: z.number().finite().nonnegative().max(999_999_999),
    comparePrice: z.number().finite().nonnegative().max(999_999_999).optional(),
    cost: z.number().finite().nonnegative().max(999_999_999).optional(),
    stock: z.number().int().nonnegative().max(10_000_000).default(0),
    inStock: z.boolean().optional(),
    isActive: z.boolean().default(true),
    isFeatured: z.boolean().default(false),
    category: z
      .object({
        name: z.string().trim().min(1).max(191),
        slug: z.string().trim().regex(slugPattern).max(191).optional(),
      })
      .optional(),
    brand: z
      .object({
        name: z.string().trim().min(1).max(191),
        slug: z.string().trim().regex(slugPattern).max(191).optional(),
      })
      .optional(),
    images: z.array(catalogImageSchema).max(12).default([]),
    variants: z.array(catalogVariantSchema).max(100).default([]),
    attributes: z.array(catalogAttributeSchema).max(100).default([]),
  })
  .superRefine((product, ctx) => {
    if (!product.id && !product.slug && !product.sku) {
      ctx.addIssue({
        code: "custom",
        path: ["sku"],
        message: "Cada producto debe incluir id, slug o SKU estable.",
      });
    }
    if (
      product.comparePrice !== undefined &&
      product.comparePrice > 0 &&
      product.comparePrice < product.price
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["comparePrice"],
        message: "El precio comparativo no puede ser menor al precio de venta.",
      });
    }
  });

export const bulkCatalogRequestSchema = z.object({
  idempotencyKey: z.string().trim().min(12).max(191),
  source: z.enum(["STATIC_CATALOG", "POS", "CSV", "SUPPLIER", "ADMIN"]),
  items: z.array(z.unknown()).min(1).max(5000),
  validateOnly: z.boolean().default(false),
});

export const catalogQuerySchema = z.object({
  search: z.string().trim().max(200).default(""),
  category: z.string().trim().max(191).default(""),
  brand: z.string().trim().max(191).default(""),
  inStock: z.enum(["true", "false", "all"]).default("true"),
  cursor: z.string().trim().max(1000).optional(),
  page: z.coerce.number().int().min(1).max(10_000).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(24),
});

export type CatalogProductInput = z.infer<typeof catalogProductInputSchema>;
export type BulkCatalogRequest = z.infer<typeof bulkCatalogRequestSchema>;
export type CatalogQuery = z.infer<typeof catalogQuerySchema>;
export type CatalogImageInput = z.infer<typeof catalogImageSchema>;

export type CatalogCursor = {
  updatedAt: string;
  id: string;
};

export function encodeCatalogCursor(cursor: CatalogCursor): string {
  return Buffer.from(JSON.stringify(cursor), "utf8").toString("base64url");
}

export function decodeCatalogCursor(value?: string): CatalogCursor | undefined {
  if (!value) return undefined;
  try {
    const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
    return z
      .object({
        updatedAt: z.iso.datetime({ offset: true }),
        id: z.string().min(1).max(191),
      })
      .parse(parsed);
  } catch {
    return undefined;
  }
}

export function slugifyCatalogValue(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 191);
}
