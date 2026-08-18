const { createClient } = require("@libsql/client");
const { PrismaClient } = require("@prisma/client");

const source = createClient({ url: "file:./prisma/dev.db" });
const target = new PrismaClient();

const tables = [
  ["User", "user"],
  ["Category", "category"],
  ["Brand", "brand"],
  ["Product", "product"],
  ["ProductImage", "productImage"],
  ["Variant", "variant"],
  ["ProductAttribute", "productAttribute"],
  ["Account", "account"],
  ["Session", "session"],
  ["Address", "address"],
  ["Favorite", "favorite"],
  ["Review", "review"],
  ["Cart", "cart"],
  ["CartItem", "cartItem"],
  ["Coupon", "coupon"],
  ["Order", "order"],
  ["OrderItem", "orderItem"],
];

const booleanFields = new Set(["inStock", "isActive", "isFeatured", "isMain", "isApproved", "isDefault"]);
const dateFields = new Set(["emailVerified", "expires", "expiresAt", "createdAt", "updatedAt"]);

function normalize(row) {
  return Object.fromEntries(
    Object.entries(row).map(([key, value]) => {
      if (value === null) return [key, value];
      if (booleanFields.has(key)) return [key, Boolean(value)];
      if (dateFields.has(key)) return [key, new Date(value)];
      return [key, value];
    })
  );
}

async function sourceRows(table) {
  const result = await source.execute(`SELECT * FROM "${table}"`);
  return result.rows.map((row) => normalize({ ...row }));
}

async function importTable(table, delegate) {
  const rows = await sourceRows(table);
  for (let index = 0; index < rows.length; index += 250) {
    await target[delegate].createMany({
      data: rows.slice(index, index + 250),
      skipDuplicates: true,
    });
  }
  return rows.length;
}

async function importCategories() {
  const pending = await sourceRows("Category");
  const imported = new Set();

  while (pending.length) {
    const ready = pending.filter((category) => !category.parentId || imported.has(category.parentId));
    if (!ready.length) {
      throw new Error("Invalid Category hierarchy: a parent category is missing from SQLite data.");
    }

    await target.category.createMany({ data: ready, skipDuplicates: true });
    ready.forEach((category) => imported.add(category.id));
    pending.splice(0, pending.length, ...pending.filter((category) => !imported.has(category.id)));
  }
}

async function main() {
  const sourceCounts = {};
  for (const [table] of tables) sourceCounts[table] = (await sourceRows(table)).length;

  for (const [table, delegate] of tables) {
    if (table === "Category") {
      await importCategories();
      console.log(`Imported ${table}: ${sourceCounts[table]}`);
      continue;
    }
    const count = await importTable(table, delegate);
    console.log(`Imported ${table}: ${count}`);
  }

  const mismatches = [];
  for (const [table, delegate] of tables) {
    const destinationCount = await target[delegate].count();
    if (destinationCount !== sourceCounts[table]) {
      mismatches.push(`${table}: SQLite=${sourceCounts[table]}, PostgreSQL=${destinationCount}`);
    }
  }

  if (mismatches.length) {
    throw new Error(`Data verification failed:\n${mismatches.join("\n")}`);
  }

  console.log("SQLite to PostgreSQL migration verified successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await target.$disconnect();
  });
