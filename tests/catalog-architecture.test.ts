import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { productImageOverrides } from "../src/data/productImageOverrides.js";
import {
  GENERATED_IMAGE_BRANDS,
  isGeneratedImageOverrideCompatible,
  normalizeImageEvidenceKey,
} from "../src/lib/generatedImageEvidence.js";
import { products } from "../src/lib/products.js";
import {
  bulkCatalogRequestSchema,
  catalogImageSchema,
  catalogQuerySchema,
  decodeCatalogCursor,
  encodeCatalogCursor,
} from "../src/modules/catalog/domain/catalogSchemas";

type GeneratedImageOverride = {
  image: string;
  images: Array<{ url: string; alt?: string; isMain?: boolean }>;
  imageStatus: string;
  imageDisclosure?: string;
  sourceRecord?: {
    sku?: string;
    skuKey?: string;
    brandSlug?: string;
    generationPrompt?: string;
    compatibility?: {
      partFamily?: string;
      laterality?: string;
      componentScope?: string;
      includedComponents?: string[];
    };
    brandTreatment?: { badgeAsset?: string };
    geometryEvidence?: { publishedAsPhysicalPhoto?: boolean };
  };
};

const generatedImageOverrides = productImageOverrides as unknown as Readonly<
  Record<string, GeneratedImageOverride>
>;

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

const generatedBrandProducts = () => products.filter((product) => (
  GENERATED_IMAGE_BRANDS.has(product.brand?.slug)
  && product.imageStatus === "generated-reference-image"
));

test("cada referencia generada ADS o GTI conserva un override estructurado y compatible", () => {
  const generated = generatedBrandProducts();
  assert.ok(generated.length > 0, "Se esperaba al menos una referencia generada ADS/GTI");
  assert.ok(generated.some((product) => product.brand?.slug === "ads"), "Faltan referencias generadas ADS");
  assert.ok(generated.some((product) => product.brand?.slug === "gti"), "Faltan referencias generadas GTI");

  for (const product of generated) {
    const skuKey = normalizeImageEvidenceKey(product.sku);
    const override = generatedImageOverrides[skuKey];
    const record = override?.sourceRecord;
    const compatibility = record?.compatibility;
    const label = `${product.brand?.slug?.toUpperCase()} ${product.sku}`;

    assert.ok(override, `${label}: falta override de imagen`);
    assert.equal(override.imageStatus, "generated-reference-image", `${label}: estado de override inválido`);
    assert.equal(override.image, product.image, `${label}: la tarjeta no usa la imagen registrada en el override`);
    assert.equal(record?.sku, product.sku, `${label}: SKU de evidencia distinto`);
    assert.equal(record?.skuKey, skuKey, `${label}: skuKey de evidencia distinto`);
    assert.equal(record?.brandSlug, product.brand?.slug, `${label}: marca de evidencia distinta`);
    assert.match(String(record?.generationPrompt || ""), /[\s\S]{40}/, `${label}: falta prompt auditable`);
    assert.ok(compatibility, `${label}: falta compatibilidad estructurada`);
    const partFamily = compatibility?.partFamily;
    assert.ok(partFamily && partFamily !== "unknown", `${label}: familia de pieza desconocida`);
    assert.equal(compatibility?.componentScope, "primary-component-only", `${label}: alcance visual inseguro`);
    assert.ok(
      compatibility?.includedComponents?.includes(partFamily),
      `${label}: el componente principal no quedó declarado`,
    );
    assert.ok(record?.brandTreatment?.badgeAsset, `${label}: falta activo de marca aprobado`);
    assert.equal(
      isGeneratedImageOverrideCompatible(product, override),
      true,
      `${label}: el override generado no es compatible con su producto`,
    );
  }
});

test("intercambiar la tijera ADS izquierda y derecha falla aun si se falsifica el SKU", () => {
  const leftProduct = products.find((product) => (
    product.brand?.slug === "ads" && product.sku === "9833753380"
  ));
  const leftOverride = generatedImageOverrides["9833753380"];
  const rightOverride = generatedImageOverrides["9833753280"];

  assert.ok(leftProduct, "No se encontró la tijera ADS izquierda 9833753380");
  assert.ok(leftOverride && rightOverride, "Faltan evidencias ADS para comprobar el intercambio lateral");
  assert.equal(leftOverride.sourceRecord?.compatibility?.laterality, "left");
  assert.equal(rightOverride.sourceRecord?.compatibility?.laterality, "right");

  const forgedSwap = structuredClone(rightOverride);
  const forgedRecord = forgedSwap.sourceRecord;
  assert.ok(forgedRecord, "La evidencia derecha debe conservar su registro estructurado");
  forgedRecord.sku = leftProduct.sku;
  forgedRecord.skuKey = normalizeImageEvidenceKey(leftProduct.sku);
  forgedRecord.brandSlug = "ads";

  assert.equal(
    isGeneratedImageOverrideCompatible(leftProduct, forgedSwap),
    false,
    "Un visual derecho no puede pasar como compatible con la referencia izquierda",
  );
});

test("ninguna referencia generada ADS o GTI se presenta como fotografía física", () => {
  const physicalPhotoStatuses = new Set([
    "real-source-photo",
    "real-source-watermarked",
    "authentic-product-photo",
    "exact-real-photo",
    "manufacturer-exact",
  ]);

  for (const product of generatedBrandProducts()) {
    const override = generatedImageOverrides[normalizeImageEvidenceKey(product.sku)];
    const label = `${product.brand?.slug?.toUpperCase()} ${product.sku}`;
    const mainImage = override?.images?.find((image) => image?.isMain) || override?.images?.[0];

    assert.equal(physicalPhotoStatuses.has(product.imageStatus), false, `${label}: tarjeta declarada como foto física`);
    assert.equal(physicalPhotoStatuses.has(override?.imageStatus), false, `${label}: override declarado como foto física`);
    assert.match(String(override?.imageDisclosure || ""), /no es fotograf[ií]a original/i, `${label}: falta disclosure de referencia generada`);
    assert.match(String(mainImage?.alt || ""), /no es fotograf[ií]a original/i, `${label}: alt presenta la imagen como fotografía física`);
    assert.notEqual(
      override?.sourceRecord?.geometryEvidence?.publishedAsPhysicalPhoto,
      true,
      `${label}: evidencia geométrica declarada como foto física`,
    );

    const parsed = catalogImageSchema.safeParse({
      url: override?.image,
      provenance: "GENERATED_REFERENCE",
      verificationStatus: "GENERATED_REFERENCE",
    });
    assert.equal(parsed.success, true, `${label}: la referencia generada no es válida para la capa de catálogo`);
  }
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
