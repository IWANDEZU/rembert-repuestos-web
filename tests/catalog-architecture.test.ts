import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { productImageOverrides } from "../src/data/productImageOverrides.js";
import {
  GENERATED_IMAGE_BRANDS,
  inferProductAbs,
  inferProductLaterality,
  inferProductPartFamily,
  isGeneratedImageOverrideCompatible,
  normalizeImageEvidenceKey,
} from "../src/lib/generatedImageEvidence.js";
import { getPublishedGeneratedGeometryReference, products } from "../src/lib/products.js";
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
      abs?: string;
      componentScope?: string;
      includedComponents?: string[];
    };
    brandTreatment?: { badgeAsset?: string };
    geometryEvidence?: {
      publishedAsPhysicalPhoto?: boolean;
      sourcePageUrl?: string;
      crossReferenceBrand?: string;
      crossReferenceNumber?: string;
    };
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

test("el inferidor GTI conserva familia, lado abreviado y ABS explícito sin adivinar L/R", () => {
  const bySku = (sku: string) => {
    const product = products.find((item) => item.brand?.slug === "gti" && item.sku === sku);
    assert.ok(product, `No se encontró GTI ${sku}`);
    return product;
  };

  assert.equal(inferProductLaterality(bySku("GTI01-009")), "right");
  assert.equal(inferProductLaterality(bySku("GTI03-044")), "left");
  assert.equal(inferProductLaterality(bySku("GTI01-022")), "right");
  assert.equal(inferProductLaterality(bySku("GTI01-024")), "left");
  assert.equal(
    inferProductLaterality({ name: "PUNTA EJE L/R. REFERENCIA DE PRUEBA" }),
    "unknown",
    "L/R identifica lado rueda en este catálogo; no debe inventar izquierda/derecha",
  );

  for (const sku of ["GTI01-022", "GTI01-024", "GTI02-002"]) {
    assert.equal(
      inferProductPartFamily(bySku(sku)),
      "cv-axle",
      `${sku}: un eje homocinético completo no puede degradarse a punta/tulipa por el texto auxiliar`,
    );
  }
  assert.equal(
    inferProductPartFamily({ name: "PUNTA EJE L/C. REFERENCIA DE PRUEBA" }),
    "inner-cv-joint",
    "L/C delimitado debe seguir identificando una junta lado caja",
  );
  assert.equal(inferProductAbs(bySku("GTI06-062")), "yes");
  assert.equal(
    inferProductAbs({ name: "PUNTA EJE PIN INTERNO SIN ABS" }),
    "no",
    "El patrón SIN ABS debe conservarse",
  );
});

test("el validador rechaza evidencia GTI que omite lado, familia o ABS explícitos", () => {
  const bySku = (sku: string) => {
    const product = products.find((item) => item.brand?.slug === "gti" && item.sku === sku);
    assert.ok(product, `No se encontró GTI ${sku}`);
    return product;
  };
  const cases = [
    {
      sku: "GTI01-009",
      patch: { laterality: "right" },
      legacy: { laterality: "unknown" },
    },
    {
      sku: "GTI01-022",
      patch: { partFamily: "cv-axle", laterality: "right" },
      legacy: { partFamily: "inner-cv-joint" },
    },
    {
      sku: "GTI06-062",
      patch: { abs: "yes" },
      legacy: { abs: "no" },
    },
  ];

  for (const { sku, patch, legacy } of cases) {
    const product = bySku(sku);
    const corrected = structuredClone(generatedImageOverrides[normalizeImageEvidenceKey(sku)]);
    const compatibility = corrected?.sourceRecord?.compatibility;
    assert.ok(compatibility, `${sku}: falta registro de compatibilidad para probar el validador`);
    Object.assign(compatibility, patch);
    if (patch.partFamily) compatibility.includedComponents = [patch.partFamily];

    assert.equal(
      isGeneratedImageOverrideCompatible(product, corrected),
      true,
      `${sku}: la evidencia corregida debe ser compatible`,
    );

    const stale = structuredClone(corrected);
    assert.ok(stale?.sourceRecord?.compatibility, `${sku}: no se pudo clonar el registro de compatibilidad`);
    Object.assign(stale.sourceRecord.compatibility, legacy);
    assert.equal(
      isGeneratedImageOverrideCompatible(product, stale),
      false,
      `${sku}: el validador debe bloquear evidencia GTI antigua o contradictoria`,
    );
  }
});

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

test("los cruces geométricos ADS se publican como referencia externa, no como foto ADS", () => {
  const generatedAds = generatedBrandProducts().filter((product) => product.brand?.slug === "ads");
  assert.equal(generatedAds.length, 7, "El lote ADS generado debe conservar sus siete referencias trazables");

  for (const product of generatedAds) {
    const override = generatedImageOverrides[normalizeImageEvidenceKey(product.sku)];
    const geometryEvidence = override?.sourceRecord?.geometryEvidence;
    const label = `ADS ${product.sku}`;

    assert.equal(geometryEvidence?.publishedAsPhysicalPhoto, false, `${label}: el cruce no puede declararse foto ADS`);
    assert.match(String(geometryEvidence?.sourcePageUrl || ""), /^https:\/\//, `${label}: falta página HTTPS del cruce`);
    assert.equal(product.sourceUrl, undefined, `${label}: un cruce geométrico no debe ocupar sourceUrl de foto física`);
    assert.equal(product.imageReferenceSourceUrl, geometryEvidence?.sourcePageUrl, `${label}: falta publicar la URL del cruce geométrico`);
    assert.match(String(product.imageReferenceSourceLabel || ""), /^Cruce geométrico externo/, `${label}: el enlace debe distinguirse de una foto`);
    assert.match(String(product.imageReferenceSourceLabel || ""), /no es foto ADS/i, `${label}: el enlace debe explicar que no prueba una foto ADS`);
  }
});

test("solo se deriva un enlace geométrico HTTPS y explícitamente no fotográfico", () => {
  const baseEvidence = {
    publishedAsPhysicalPhoto: false,
    crossReferenceBrand: "Proveedor externo",
    crossReferenceNumber: "REF-01",
  };

  for (const sourcePageUrl of ["javascript:alert(1)", "http://example.test/pieza", "data:text/plain,ref"]) {
    assert.deepEqual(
      getPublishedGeneratedGeometryReference({ sourceRecord: { geometryEvidence: { ...baseEvidence, sourcePageUrl } } }),
      {},
      `No debe publicarse una URL insegura: ${sourcePageUrl}`,
    );
  }

  assert.deepEqual(
    getPublishedGeneratedGeometryReference({
      sourceRecord: {
        brandSlug: "ads",
        geometryEvidence: { ...baseEvidence, sourcePageUrl: "https://example.test/pieza" },
      },
    }),
    {
      imageReferenceSourceUrl: "https://example.test/pieza",
      imageReferenceSourceLabel: "Cruce geométrico externo · Proveedor externo · REF-01 (no es foto ADS)",
    },
  );

  assert.match(
    getPublishedGeneratedGeometryReference({
      sourceRecord: {
        brandSlug: "gti",
        geometryEvidence: { ...baseEvidence, sourcePageUrl: "https://example.test/pieza-gti" },
      },
    }).imageReferenceSourceLabel || "",
    /no es foto GTI\)$/,
    "El disclosure del cruce debe identificar la marca correcta",
  );
});

test("las diez referencias GTI generadas con existencia conservan evidencia y compatibilidad auditables", () => {
  const prioritySkus = [
    "GTI04-161",
    "GTI106-092",
    "GTI04-089",
    "GTI04-D01",
    "GTI06-081",
    "GTI03-003",
    "GTI01-092",
    "GTI03-072",
    "GTI06-037",
    "GTI-038",
  ];
  const identityPending = new Set(["GTI04-D01", "GTI-038"]);

  for (const sku of prioritySkus) {
    const product = products.find((item) => item.brand?.slug === "gti" && item.sku === sku);
    const override = generatedImageOverrides[normalizeImageEvidenceKey(sku)];
    const evidence = override?.sourceRecord?.geometryEvidence;
    const label = `GTI ${sku}`;

    assert.ok(product, `${label}: no se encontró el producto`);
    assert.ok(Number(product.stock) > 0, `${label}: la referencia prioritaria debe conservar existencia`);
    assert.equal(product.imageStatus, "generated-reference-image", `${label}: perdió la imagen segura`);
    assert.equal(evidence?.publishedAsPhysicalPhoto, false, `${label}: no puede presentarse como foto física`);
    assert.match(String(evidence?.crossReferenceNumber || ""), /\S/, `${label}: falta cruce documentado`);
    assert.equal(isGeneratedImageOverrideCompatible(product, override), true, `${label}: override incompatible`);

    if (identityPending.has(sku)) {
      assert.equal(evidence?.sourcePageUrl, undefined, `${label}: no debe inventar una fuente exacta`);
    } else {
      assert.match(String(evidence?.sourcePageUrl || ""), /^https:\/\//, `${label}: falta fuente HTTPS`);
      assert.match(String(product.imageReferenceSourceLabel || ""), /no es foto GTI/i, `${label}: falta disclosure GTI`);
    }
  }
});

test("las correcciones GTI críticas no regresan a medidas o aplicaciones descartadas", () => {
  const mazda2 = products.find((product) => product.brand?.slug === "gti" && product.sku === "GTI03-072");
  const anomalous = products.find((product) => product.brand?.slug === "gti" && product.sku === "GTI-038");
  const innerKit = products.find((product) => product.brand?.slug === "gti" && product.sku === "GTI06-037");
  const d01 = products.find((product) => product.brand?.slug === "gti" && product.sku === "GTI04-D01");
  const picantoAlias = products.find((product) => product.brand?.slug === "gti" && product.sku === "GTI106-092");

  assert.ok(mazda2 && anomalous && innerKit && d01 && picantoAlias, "Faltan referencias GTI críticas");
  assert.match(`${mazda2.name} ${mazda2.description}`, /25(?:\s+externas)?\s*[×x*]\s*29/i);
  assert.doesNotMatch(`${mazda2.name} ${mazda2.description}`, /25(?:\s+externas)?\s*[×x*]\s*39/i);
  assert.doesNotMatch(`${anomalous.name} ${anomalous.description}`, /Sephia/i);
  assert.match(`${anomalous.name} ${anomalous.description}`, /código por confirmar|etiqueta/i);
  assert.match(`${innerKit.name} ${innerKit.description}`, /junta homocinética|kit interior|triceta/i);
  assert.match(`${d01.name} ${d01.description}`, /identidad por confirmar|sin indicar el extremo/i);
  assert.doesNotMatch(`${d01.name} ${d01.description}`, /28\s+(?:externas|internas)/i);
  assert.match(`${picantoAlias.name} ${picantoAlias.description}`, /junta homocinética lado caja/i);
  assert.match(`${picantoAlias.name} ${picantoAlias.description}`, /25(?:\s+externas)?\s*[×x*]\s*21/i);
  assert.match(`${picantoAlias.name} ${picantoAlias.description}`, /GTI06-092|alias/i);
});

test("las fichas con override generado no conservan textos que niegan la imagen publicada", () => {
  for (const product of generatedBrandProducts()) {
    const label = `${product.brand?.slug?.toUpperCase()} ${product.sku}`;
    const visualAttributes = (product.attributes || [])
      .filter((attribute: { name?: string }) => ["Imagen", "Estado de imagen"].includes(attribute.name || ""))
      .map((attribute: { value?: unknown }) => String(attribute.value || ""))
      .join(" ");

    assert.doesNotMatch(
      String(product.description || ""),
      /no muestra un repuesto genérico ni una geometría generada|no se publica una pieza parecida, genérica o generada/i,
      `${label}: descripción contradictoria con el override publicado`,
    );
    if (visualAttributes) {
      assert.match(visualAttributes, /no es fotograf[ií]a original/i, `${label}: atributo visual sin disclosure`);
    }
  }
});

test("los soportes ADS 184441 y 184442 no se llaman hidráulicos sin evidencia", () => {
  for (const sku of ["184441", "184442"]) {
    const product = products.find((item) => item.brand?.slug === "ads" && item.sku === sku);
    assert.ok(product, `No se encontró ADS ${sku}`);

    const semanticFields = [
      product.id,
      product.slug,
      product.name,
      product.shortDesc,
      product.description,
      product.images?.[0]?.alt,
    ].filter(Boolean).join(" ");

    assert.doesNotMatch(semanticFields, /hidráulic/i, `ADS ${sku}: conserva una afirmación hidráulica no verificada`);
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
