const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { createPrismaClient } = require("./create-client");

const APPLY = process.argv.includes("--apply");
const BATCH_SIZE = 8;

const asNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

async function loadCatalog() {
  const moduleUrl = pathToFileURL(path.join(__dirname, "..", "src", "lib", "products.js")).href;
  const { products } = await import(moduleUrl);
  return products;
}

async function runBatch(items, handler) {
  for (let index = 0; index < items.length; index += BATCH_SIZE) {
    await Promise.all(items.slice(index, index + BATCH_SIZE).map(handler));
    if ((index + BATCH_SIZE) % 400 === 0 || index + BATCH_SIZE >= items.length) {
      console.log(`Procesados ${Math.min(index + BATCH_SIZE, items.length)} de ${items.length}`);
    }
  }
}

async function main() {
  const catalog = await loadCatalog();
  const invalid = catalog.filter((product) => !product.sku || !product.slug || !product.name);
  if (invalid.length) throw new Error(`${invalid.length} productos no tienen SKU, slug o nombre.`);

  const prisma = createPrismaClient();
  try {
    const existing = await prisma.product.findMany({ select: { id: true, sku: true, slug: true } });
    const existingBySku = new Map(existing.filter((item) => item.sku).map((item) => [item.sku.toUpperCase(), item]));
    const existingBySlug = new Map(existing.map((item) => [item.slug, item]));
    const matches = catalog.filter((product) => existingBySku.has(product.sku.toUpperCase()) || existingBySlug.has(product.slug)).length;

    console.log(JSON.stringify({ mode: APPLY ? "apply" : "check", catalog: catalog.length, database: existing.length, matches, pending: catalog.length - matches }, null, 2));
    if (!APPLY) {
      console.log("Diagnóstico terminado. Usa --apply para sincronizar sin borrar productos existentes.");
      return;
    }

    const categories = new Map();
    const brands = new Map();
    for (const product of catalog) {
      if (product.category?.slug) categories.set(product.category.slug, product.category);
      if (product.brand?.slug) brands.set(product.brand.slug, product.brand);
    }

    const categoryIds = new Map();
    for (const category of categories.values()) {
      const saved = await prisma.category.upsert({
        where: { slug: category.slug },
        update: { name: category.name },
        create: { slug: category.slug, name: category.name },
        select: { id: true },
      });
      categoryIds.set(category.slug, saved.id);
    }

    const brandIds = new Map();
    for (const brand of brands.values()) {
      const saved = await prisma.brand.upsert({
        where: { slug: brand.slug },
        update: { name: brand.name },
        create: { slug: brand.slug, name: brand.name },
        select: { id: true },
      });
      brandIds.set(brand.slug, saved.id);
    }

    let created = 0;
    let updated = 0;
    await runBatch(catalog, async (product) => {
      const skuKey = product.sku.toUpperCase();
      const matched = existingBySku.get(skuKey) || existingBySlug.get(product.slug);
      const stock = Math.max(0, Math.trunc(asNumber(product.stock)));
      const imageUrl = product.images?.find((image) => image?.isMain)?.url || product.image || product.images?.[0]?.url;
      const data = {
        name: String(product.name).slice(0, 300),
        slug: product.slug,
        description: String(product.description || product.shortDesc || product.name),
        shortDesc: product.shortDesc ? String(product.shortDesc).slice(0, 500) : null,
        price: Math.max(0, asNumber(product.price)),
        comparePrice: product.comparePrice == null ? null : Math.max(0, asNumber(product.comparePrice)),
        sku: product.sku,
        stock,
        inStock: Boolean(product.inStock && stock > 0),
        isActive: true,
        categoryId: categoryIds.get(product.category?.slug) || null,
        brandId: brandIds.get(product.brand?.slug) || null,
      };

      await prisma.$transaction(async (tx) => {
        let saved;
        if (matched) {
          saved = await tx.product.update({ where: { id: matched.id }, data, select: { id: true } });
          updated++;
        } else {
          saved = await tx.product.create({ data, select: { id: true } });
          created++;
        }
        if (imageUrl) {
          const main = await tx.productImage.findFirst({ where: { productId: saved.id, isMain: true }, select: { id: true } });
          if (main) {
            await tx.productImage.update({ where: { id: main.id }, data: { url: imageUrl, alt: product.name } });
          } else {
            await tx.productImage.create({ data: { productId: saved.id, url: imageUrl, alt: product.name, isMain: true } });
          }
        }
      });
    });

    const databaseAfter = await prisma.product.count();
    console.log(JSON.stringify({ success: true, catalog: catalog.length, created, updated, databaseAfter }, null, 2));
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("No fue posible sincronizar el catálogo:", error.message);
  process.exitCode = 1;
});
