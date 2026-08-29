import { Prisma, type PrismaClient } from "@prisma/client";
import { prisma as sharedPrisma } from "@/lib/prisma";
import type {
  CatalogCursor,
  CatalogImageInput,
  CatalogProductInput,
  CatalogQuery,
} from "../domain/catalogSchemas";
import {
  encodeCatalogCursor,
  slugifyCatalogValue,
} from "../domain/catalogSchemas";
import {
  CatalogConflictError,
  CatalogNotFoundError,
} from "../domain/catalogErrors";

type DbClient = PrismaClient | Prisma.TransactionClient;

type StagedImportRow = {
  rowNumber: number;
  sku?: string;
  payload: Prisma.InputJsonValue;
  status: "PENDING" | "REJECTED";
  error?: Prisma.InputJsonValue;
};

type RawCatalogProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDesc: string | null;
  price: number;
  comparePrice: number | null;
  sku: string | null;
  inStock: boolean;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  category: { id: string; name: string; slug: string } | null;
  brand: { id: string; name: string; slug: string } | null;
  images: Array<{
    id: string;
    url: string;
    alt: string | null;
    isMain: boolean;
    provenance: string;
    verificationStatus: string;
    sourceUrl: string | null;
  }>;
};

export type CatalogPage = {
  items: RawCatalogProduct[];
  nextCursor: string | null;
  hasMore: boolean;
  page?: number;
  limit: number;
};

function toJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

function normalizeImage(image: CatalogImageInput) {
  return {
    url: image.url,
    alt: image.alt ?? null,
    isMain: image.isMain,
    provenance: image.provenance,
    verificationStatus: image.verificationStatus,
    sourceUrl: image.sourceUrl ?? null,
    sourceSha256: image.sourceSha256?.toLowerCase() ?? null,
    verifiedAt: image.verifiedAt ? new Date(image.verifiedAt) : null,
  };
}

export class PrismaCatalogRepository {
  private readonly db: PrismaClient;

  constructor(db = sharedPrisma as PrismaClient) {
    this.db = db;
  }

  async search(query: CatalogQuery, cursor?: CatalogCursor): Promise<CatalogPage> {
    const conditions: Prisma.Sql[] = [Prisma.sql`p."isActive" = true`];

    if (query.inStock !== "all") {
      conditions.push(Prisma.sql`p."inStock" = ${query.inStock === "true"}`);
    }
    if (query.category) {
      conditions.push(Prisma.sql`c."slug" = ${query.category}`);
    }
    if (query.brand) {
      conditions.push(Prisma.sql`b."slug" = ${query.brand}`);
    }
    if (query.search) {
      const contains = `%${query.search.toLowerCase()}%`;
      conditions.push(Prisma.sql`(
        p."search_document" @@ websearch_to_tsquery('simple', ${query.search})
        or lower(p."name") % lower(${query.search})
        or lower(coalesce(p."sku", '')) like ${contains}
      )`);
    }
    if (cursor) {
      const cursorDate = new Date(cursor.updatedAt);
      conditions.push(Prisma.sql`(
        p."updatedAt" < ${cursorDate}
        or (p."updatedAt" = ${cursorDate} and p."id" < ${cursor.id})
      )`);
    }

    const offset = query.page ? (query.page - 1) * query.limit : 0;
    const rows = await this.db.$queryRaw<RawCatalogProduct[]>(Prisma.sql`
      select
        p."id", p."name", p."slug", p."description", p."shortDesc",
        p."price", p."comparePrice", p."sku", p."inStock", p."stock",
        p."isActive", p."isFeatured", p."version", p."createdAt", p."updatedAt",
        case when c."id" is null then null else json_build_object(
          'id', c."id", 'name', c."name", 'slug', c."slug"
        ) end as category,
        case when b."id" is null then null else json_build_object(
          'id', b."id", 'name', b."name", 'slug', b."slug"
        ) end as brand,
        coalesce((
          select json_agg(json_build_object(
            'id', i."id", 'url', i."url", 'alt', i."alt", 'isMain', i."isMain",
            'provenance', i."provenance", 'verificationStatus', i."verificationStatus",
            'sourceUrl', i."sourceUrl"
          ) order by i."isMain" desc, i."id")
          from public."ProductImage" i
          where i."productId" = p."id" and i."verificationStatus" <> 'REJECTED'
        ), '[]'::json) as images
      from public."Product" p
      left join public."Category" c on c."id" = p."categoryId"
      left join public."Brand" b on b."id" = p."brandId"
      where ${Prisma.join(conditions, " and ")}
      order by p."updatedAt" desc, p."id" desc
      limit ${query.limit + 1}
      offset ${offset}
    `);

    const hasMore = rows.length > query.limit;
    const items = hasMore ? rows.slice(0, query.limit) : rows;
    const last = items.at(-1);

    return {
      items,
      hasMore,
      limit: query.limit,
      ...(query.page ? { page: query.page } : {}),
      nextCursor:
        !query.page && hasMore && last
          ? encodeCatalogCursor({
              updatedAt: new Date(last.updatedAt).toISOString(),
              id: last.id,
            })
          : null,
    };
  }

  async createImportJob(input: {
    idempotencyKey: string;
    source: string;
    requestedBy?: string;
    rows: StagedImportRow[];
  }) {
    const existing = await this.db.catalogImportJob.findUnique({
      where: { idempotencyKey: input.idempotencyKey },
    });
    if (existing) return { job: existing, reused: true };

    const rejectedRows = input.rows.filter((row) => row.status === "REJECTED").length;
    try {
      const job = await this.db.catalogImportJob.create({
        data: {
          idempotencyKey: input.idempotencyKey,
          source: input.source,
          requestedBy: input.requestedBy ?? null,
          totalRows: input.rows.length,
          processedRows: rejectedRows,
          rejectedRows,
          status:
            rejectedRows === input.rows.length
              ? "COMPLETED_WITH_ERRORS"
              : "RECEIVED",
          completedAt:
            rejectedRows === input.rows.length ? new Date() : undefined,
        },
      });

      for (let index = 0; index < input.rows.length; index += 500) {
        await this.db.catalogImportRow.createMany({
          data: input.rows.slice(index, index + 500).map((row) => ({
            jobId: job.id,
            rowNumber: row.rowNumber,
            sku: row.sku ?? null,
            status: row.status,
            payload: row.payload,
            error: row.error ?? undefined,
          })),
        });
      }

      return { job, reused: false };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        const raced = await this.db.catalogImportJob.findUnique({
          where: { idempotencyKey: input.idempotencyKey },
        });
        if (raced) return { job: raced, reused: true };
      }
      throw error;
    }
  }

  async getImportJob(jobId: string) {
    const job = await this.db.catalogImportJob.findUnique({
      where: { id: jobId },
      select: {
        id: true,
        idempotencyKey: true,
        source: true,
        status: true,
        totalRows: true,
        processedRows: true,
        acceptedRows: true,
        rejectedRows: true,
        errorSummary: true,
        createdAt: true,
        startedAt: true,
        completedAt: true,
        updatedAt: true,
      },
    });
    if (!job) throw new CatalogNotFoundError("La importación solicitada no existe.");
    return job;
  }

  async markImportFailed(jobId: string, message: string) {
    await this.db.catalogImportJob.update({
      where: { id: jobId },
      data: {
        status: "FAILED",
        completedAt: new Date(),
        errorSummary: { message },
      },
    });
  }

  async processImportChunk(jobId: string, startRow: number, endRow: number) {
    const job = await this.db.catalogImportJob.findUnique({ where: { id: jobId } });
    if (!job) throw new CatalogNotFoundError("La importación solicitada no existe.");
    if (["COMPLETED", "COMPLETED_WITH_ERRORS"].includes(job.status)) return job;

    await this.db.catalogImportJob.update({
      where: { id: jobId },
      data: {
        status: "PROCESSING",
        startedAt: job.startedAt ?? new Date(),
        completedAt: null,
      },
    });

    const rows = await this.db.catalogImportRow.findMany({
      where: {
        jobId,
        status: "PENDING",
        rowNumber: { gte: startRow, lte: endRow },
      },
      orderBy: { rowNumber: "asc" },
    });

    let accepted = 0;
    let rejected = 0;
    for (const row of rows) {
      try {
        const product = row.payload as unknown as CatalogProductInput;
        const saved = await this.upsertProduct(product, {
          source: job.source,
          actorUserId: job.requestedBy ?? undefined,
          requestId: job.id,
        });
        await this.db.catalogImportRow.update({
          where: { id: row.id },
          data: { status: "PROCESSED", productId: saved.id, error: Prisma.JsonNull },
        });
        accepted += 1;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Error desconocido";
        await this.db.catalogImportRow.update({
          where: { id: row.id },
          data: { status: "REJECTED", error: { message } },
        });
        rejected += 1;
      }
    }

    if (accepted || rejected) {
      await this.db.catalogImportJob.update({
        where: { id: jobId },
        data: {
          processedRows: { increment: accepted + rejected },
          acceptedRows: { increment: accepted },
          rejectedRows: { increment: rejected },
        },
      });
    }

    const progress = await this.db.catalogImportJob.findUniqueOrThrow({ where: { id: jobId } });
    if (progress.processedRows >= progress.totalRows) {
      return this.db.catalogImportJob.update({
        where: { id: jobId },
        data: {
          status: progress.rejectedRows > 0 ? "COMPLETED_WITH_ERRORS" : "COMPLETED",
          completedAt: new Date(),
        },
      });
    }
    return progress;
  }

  async upsertProduct(
    input: CatalogProductInput,
    context: { source: string; actorUserId?: string; requestId?: string },
  ) {
    const slug = input.slug || slugifyCatalogValue(`${input.name}-${input.sku || input.id || "producto"}`);
    if (!slug) throw new CatalogConflictError("No fue posible construir un slug estable para el producto.");

    return this.db.$transaction(async (tx) => {
      const categoryId = input.category
        ? (
            await tx.category.upsert({
              where: { slug: input.category.slug || slugifyCatalogValue(input.category.name) },
              update: { name: input.category.name },
              create: {
                name: input.category.name,
                slug: input.category.slug || slugifyCatalogValue(input.category.name),
              },
            })
          ).id
        : null;

      const brandId = input.brand
        ? (
            await tx.brand.upsert({
              where: { slug: input.brand.slug || slugifyCatalogValue(input.brand.name) },
              update: { name: input.brand.name },
              create: {
                name: input.brand.name,
                slug: input.brand.slug || slugifyCatalogValue(input.brand.name),
              },
            })
          ).id
        : null;

      const existing = await tx.product.findFirst({
        where: {
          OR: [
            ...(input.id ? [{ id: input.id }] : []),
            ...(input.sku ? [{ sku: input.sku }] : []),
            { slug },
          ],
        },
      });

      const data = {
        name: input.name,
        slug,
        description: input.description,
        shortDesc: input.shortDesc ?? null,
        price: input.price,
        comparePrice: input.comparePrice ?? null,
        cost: input.cost ?? null,
        sku: input.sku ?? null,
        stock: input.stock,
        inStock: input.inStock ?? input.stock > 0,
        isActive: input.isActive,
        isFeatured: input.isFeatured,
        categoryId,
        brandId,
      };

      const product = existing
        ? await tx.product.update({
            where: { id: existing.id },
            data: { ...data, version: { increment: 1 } },
          })
        : await tx.product.create({
            data: { id: input.id, ...data },
          });

      for (const image of input.images) {
        const imageData = normalizeImage(image);
        const stored = await tx.productImage.findFirst({
          where: { productId: product.id, url: image.url },
          select: { id: true },
        });
        if (stored) {
          await tx.productImage.update({ where: { id: stored.id }, data: imageData });
        } else {
          await tx.productImage.create({ data: { productId: product.id, ...imageData } });
        }
      }

      for (const attribute of input.attributes) {
        const stored = await tx.productAttribute.findFirst({
          where: { productId: product.id, name: attribute.name, value: attribute.value },
          select: { id: true },
        });
        if (!stored) {
          await tx.productAttribute.create({ data: { productId: product.id, ...attribute } });
        }
      }

      for (const variant of input.variants) {
        const stored = await tx.variant.findFirst({
          where: {
            productId: product.id,
            OR: [
              ...(variant.id ? [{ id: variant.id }] : []),
              ...(variant.sku ? [{ sku: variant.sku }] : []),
              { name: variant.name },
            ],
          },
        });
        const variantData = {
          name: variant.name,
          sku: variant.sku ?? null,
          price: variant.price ?? null,
          stock: variant.stock,
          attributes: JSON.stringify(variant.attributes),
        };
        if (stored) {
          await tx.variant.update({
            where: { id: stored.id },
            data: { ...variantData, version: { increment: 1 } },
          });
        } else {
          await tx.variant.create({
            data: { id: variant.id, productId: product.id, ...variantData },
          });
        }
      }

      const location = await tx.inventoryLocation.upsert({
        where: { code: "PRINCIPAL" },
        update: { isActive: true },
        create: { code: "PRINCIPAL", name: "Bodega principal REMBERT" },
      });
      const inventory = await tx.inventoryItem.findFirst({
        where: { productId: product.id, locationId: location.id },
      });
      if (inventory) {
        if (inventory.onHand !== input.stock) {
          await tx.inventoryMovement.create({
            data: {
              inventoryItemId: inventory.id,
              quantityDelta: input.stock - inventory.onHand,
              onHandBefore: inventory.onHand,
              onHandAfter: input.stock,
              reason: context.source === "POS" ? "POS_SYNC" : "IMPORT",
              reference: product.sku,
              source: context.source,
              actorUserId: context.actorUserId ?? null,
            },
          });
        }
        await tx.inventoryItem.update({
          where: { id: inventory.id },
          data: { onHand: input.stock, version: { increment: 1 } },
        });
      } else {
        await tx.inventoryItem.create({
          data: {
            productId: product.id,
            locationId: location.id,
            onHand: input.stock,
          },
        });
      }

      await tx.auditLog.create({
        data: {
          actorUserId: context.actorUserId ?? null,
          action: existing ? "PRODUCT_UPDATED" : "PRODUCT_CREATED",
          entityType: "Product",
          entityId: product.id,
          before: existing ? toJson(existing) : undefined,
          after: toJson(product),
          requestId: context.requestId ?? null,
        },
      });

      return product;
    });
  }
}
