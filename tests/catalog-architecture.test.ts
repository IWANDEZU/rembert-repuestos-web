import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { products } from "../src/lib/products.js";
import {
  bulkCatalogRequestSchema,
  catalogImageSchema,
  catalogQuerySchema,
  decodeCatalogCursor,
  encodeCatalogCursor,
} from "../src/modules/catalog/domain/catalogSchemas";

test("el cursor del catálogo conserva fecha e identificador", () => {
  const cursor = { updatedAt: "2026-08-27T18:30:00.000Z", id: "producto-5000" };
  assert.deepEqual(decodeCatalogCursor(encodeCatalogCursor(cursor)), cursor);
  assert.equal(decodeCatalogCursor("cursor-invalido"), undefined);
});

test("la consulta acepta paginación page/limit compatible con PostgreSQL", () => {
  const query = catalogQuerySchema.parse({ page: "3", limit: "40", inStock: "all" });
  assert.equal(query.page, 3);
  assert.equal(query.limit, 40);
});

test("la ingesta admite 5.000 filas y rechaza 5.001", () => {
  const base = { idempotencyKey: "catalog-test-2026", source: "ADMIN" as const };
  assert.equal(
    bulkCatalogRequestSchema.safeParse({ ...base, items: Array.from({ length: 5000 }) }).success,
    true,
  );
  assert.equal(
    bulkCatalogRequestSchema.safeParse({ ...base, items: Array.from({ length: 5001 }) }).success,
    false,
  );
});

test("una imagen generada nunca puede declararse foto real verificada", () => {
  const parsed = catalogImageSchema.safeParse({
    url: "/catalogo/referencia.webp",
    provenance: "GENERATED_REFERENCE",
    verificationStatus: "VERIFIED_REAL",
  });
  assert.equal(parsed.success, false);
});

test("la foto VAZLO 5768 publicada usa el activo de catálogo blanco", async () => {
  const product = products.find((item) =>
    String(item.sku || item.id || "").toLowerCase().includes("5768"),
  );
  assert.ok(product, "No se encontró el producto VAZLO 5768");
  assert.match(String(product.image), /vazlo-5768-.*catalogo-blanco\.webp$/);
  await access(path.join(process.cwd(), "public", String(product.image).replace(/^\//, "")));
});

test("el cliente POS no contiene ni transporta una clave fija", async () => {
  const hook = await readFile(path.join(process.cwd(), "src/hooks/useInventoryPOS.js"), "utf8");
  assert.doesNotMatch(hook, /rembert-pos-secret|[?&]secret=/i);
});
