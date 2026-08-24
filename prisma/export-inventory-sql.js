const crypto = require("node:crypto");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

const quote = (value) => value == null ? "NULL" : `'${String(value).replaceAll("'", "''")}'`;
const number = (value) => Number.isFinite(Number(value)) ? Number(value) : 0;
const stableId = (prefix, value) => `${prefix}_${crypto.createHash("sha256").update(String(value)).digest("hex").slice(0, 24)}`;

async function loadCatalog() {
  const moduleUrl = pathToFileURL(path.join(__dirname, "..", "src", "lib", "products.js")).href;
  return (await import(moduleUrl)).products;
}

async function main() {
  const products = await loadCatalog();
  const setup = process.argv.includes("--setup");
  const offsetArg = process.argv.find((arg) => arg.startsWith("--offset="));
  const limitArg = process.argv.find((arg) => arg.startsWith("--limit="));
  const offset = Math.max(0, Number(offsetArg?.split("=")[1]) || 0);
  const limit = Math.min(500, Math.max(1, Number(limitArg?.split("=")[1]) || 200));

  if (setup) {
    const categories = [...new Map(products.filter((p) => p.category?.slug).map((p) => [p.category.slug, p.category])).values()];
    const brands = [...new Map(products.filter((p) => p.brand?.slug).map((p) => [p.brand.slug, p.brand])).values()];
    const categoryValues = categories.map((item) => `(${quote(stableId("cat", item.slug))},${quote(item.name)},${quote(item.slug)})`).join(",\n");
    const brandValues = brands.map((item) => `(${quote(stableId("brd", item.slug))},${quote(item.name)},${quote(item.slug)})`).join(",\n");
    process.stdout.write(`INSERT INTO "Category" ("id","name","slug") VALUES\n${categoryValues}\nON CONFLICT ("slug") DO UPDATE SET "name"=EXCLUDED."name";\nINSERT INTO "Brand" ("id","name","slug") VALUES\n${brandValues}\nON CONFLICT ("slug") DO UPDATE SET "name"=EXCLUDED."name";`);
    return;
  }

  const batch = products.slice(offset, offset + limit);
  const productValues = batch.map((product) => {
    const stock = Math.max(0, Math.trunc(number(product.stock)));
    return `(${quote(stableId("prd", product.sku))},${quote(product.name)},${quote(product.slug)},${quote(product.description || product.shortDesc || product.name)},${quote(product.shortDesc || null)},${Math.max(0, number(product.price))},${product.comparePrice == null ? "NULL" : Math.max(0, number(product.comparePrice))},${quote(product.sku)},${product.inStock && stock > 0},${stock},${quote(product.category?.slug ? stableId("cat", product.category.slug) : null)},${quote(product.brand?.slug ? stableId("brd", product.brand.slug) : null)},true,false,NOW(),NOW())`;
  }).join(",\n");
  const imageRows = batch.map((product) => {
    const image = product.images?.find((item) => item?.isMain)?.url || product.image || product.images?.[0]?.url;
    return image ? `(${quote(product.sku)},${quote(stableId("img", product.sku))},${quote(image)},${quote(product.name)})` : null;
  }).filter(Boolean).join(",\n");

  let sql = `INSERT INTO "Product" ("id","name","slug","description","shortDesc","price","comparePrice","sku","inStock","stock","categoryId","brandId","isActive","isFeatured","createdAt","updatedAt") VALUES\n${productValues}\nON CONFLICT ("sku") DO UPDATE SET "name"=EXCLUDED."name","slug"=EXCLUDED."slug","description"=EXCLUDED."description","shortDesc"=EXCLUDED."shortDesc","price"=EXCLUDED."price","comparePrice"=EXCLUDED."comparePrice","inStock"=EXCLUDED."inStock","stock"=EXCLUDED."stock","categoryId"=EXCLUDED."categoryId","brandId"=EXCLUDED."brandId","isActive"=true,"updatedAt"=NOW();`;
  if (imageRows) {
    sql += `\nINSERT INTO "ProductImage" ("id","url","alt","isMain","productId") SELECT v.image_id,v.url,v.alt,true,p.id FROM (VALUES\n${imageRows}\n) AS v(sku,image_id,url,alt) JOIN "Product" p ON p.sku=v.sku ON CONFLICT ("id") DO UPDATE SET "url"=EXCLUDED."url","alt"=EXCLUDED."alt","isMain"=true;`;
  }
  process.stdout.write(sql);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
