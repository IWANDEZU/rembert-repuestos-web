const { createPrismaClient } = require("./create-client");

const prioridadDiesel = require("../src/data/catalogo-prioridad-diesel.json");
const catalogoPartmo = require("../src/data/catalogo-filtros-diesel.json");

let prisma;

function getPrisma() {
  prisma ??= createPrismaClient();
  return prisma;
}

const MANN_REFERENCES = [
  "W 712/83",
  "C 33 017",
  "PU 9023 z",
  "C 22 024",
  "HU 7002 z",
  "PU 9008 z",
];

const PARTMO_REFERENCES = [
  "AS-R90TSP",
  "AS-1441SP",
  "A-1345",
  "A-5813",
  "AS-4654SP",
  "A-7674SP",
  "AS-3202SP",
  "AS-7301SP",
];

const SPEC_LABELS = {
  diametro_exterior_mm: "Diámetro exterior",
  diametro_interior_mm: "Diámetro interior",
  largo_mm: "Largo",
  ancho_mm: "Ancho",
  alto_mm: "Alto",
  altura_mm: "Altura",
  rosca: "Rosca",
  tipo: "Construcción",
  combustible: "Combustible",
  incluye_junta: "Incluye junta",
  valvula_bypass: "Válvula bypass",
  valvula_antirretorno: "Válvula antirretorno",
};

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function formatSpecValue(key, value) {
  if (typeof value === "boolean") return value ? "Sí" : "No";
  if (key.endsWith("_mm")) return `${value} mm`;
  return String(value);
}

function mannProducts() {
  const source = prioridadDiesel.products.filter((item) =>
    MANN_REFERENCES.includes(item.reference),
  );

  return source.map((item) => ({
    name: `${item.subtype} MANN-FILTER ${item.reference}`,
    slug: `mann-${slugify(item.reference)}`,
    sku: `MANN-${item.reference.replace(/[^a-z0-9]/gi, "").toUpperCase()}`,
    brandSlug: "mann-filter",
    description: `${item.subtype} MANN-FILTER ${item.reference} para ${item.vehicle}. Referencias originales: ${item.oe.join(", ")}. ${item.fitment_note}`,
    shortDesc: `${item.vehicle} · ${item.subtype}`,
    image: item.web_image,
    alt: `${item.subtype} MANN-FILTER ${item.reference} para ${item.vehicle}`,
    attributes: [
      { name: "Referencia", value: item.reference },
      { name: "Tipo", value: item.subtype },
      { name: "Aplicación", value: item.vehicle },
      { name: "Motor", value: item.engine },
      { name: "Posición", value: item.position },
      { name: "Referencias OE", value: item.oe.join(" · ") },
      ...(item.gtin ? [{ name: "GTIN", value: item.gtin }] : []),
      ...Object.entries(item.specifications || {}).map(([key, value]) => ({
        name: SPEC_LABELS[key] || key,
        value: formatSpecValue(key, value),
      })),
      { name: "Disponibilidad", value: "Consultar antes de comprar" },
      { name: "Validación", value: item.fitment_note },
    ],
  }));
}

function partmoProducts() {
  const source = catalogoPartmo.filter((item) =>
    PARTMO_REFERENCES.includes(item.reference),
  );

  return source.map((item) => ({
    name: item.name,
    slug: `partmo-${slugify(item.reference)}`,
    sku: `PARTMO-${item.reference.replace(/[^a-z0-9]/gi, "").toUpperCase()}`,
    brandSlug: "partmo",
    description: `${item.description}. Equivalencia de catálogo: ${item.equivalentReference || "consultar"}. Confirmar aplicación por motor, año y referencia instalada antes de vender o instalar.`,
    shortDesc: `${item.reference} · Separador agua/combustible`,
    image: item.image,
    alt: item.alt,
    attributes: [
      { name: "Referencia", value: item.reference },
      { name: "Tipo", value: "Separador agua/combustible" },
      { name: "Aplicación", value: item.description.replace(/^Filtro Separador Agua\/?Combustible\s*/i, "") },
      { name: "Equivalencia", value: item.equivalentReference || "Consultar" },
      { name: "Disponibilidad", value: "Consultar antes de comprar" },
      { name: "Validación", value: "Confirmar por motor, año y referencia instalada." },
    ],
  }));
}

function validateSource(products) {
  const expected = MANN_REFERENCES.length + PARTMO_REFERENCES.length;
  if (products.length !== expected) {
    throw new Error(`Se esperaban ${expected} productos y se encontraron ${products.length}.`);
  }

  for (const product of products) {
    if (!product.image.startsWith("/")) {
      throw new Error(`Ruta de imagen inválida para ${product.sku}: ${product.image}`);
    }
  }
}

async function ensureCatalogEntities() {
  const prisma = getPrisma();
  const category = await prisma.category.upsert({
    where: { slug: "filtros" },
    update: {
      name: "Filtros",
      description: "Filtros de aceite, aire, combustible y separadores agua/diésel",
    },
    create: {
      name: "Filtros",
      slug: "filtros",
      description: "Filtros de aceite, aire, combustible y separadores agua/diésel",
    },
  });

  const mann = await prisma.brand.upsert({
    where: { slug: "mann-filter" },
    update: { name: "MANN-FILTER", logo: "/11_mann_filter_logo_oficial.png" },
    create: {
      name: "MANN-FILTER",
      slug: "mann-filter",
      logo: "/11_mann_filter_logo_oficial.png",
    },
  });

  const partmo = await prisma.brand.upsert({
    where: { slug: "partmo" },
    update: { logo: "/logos/partmo-real.png" },
    create: {
      name: "Partmo",
      slug: "partmo",
      logo: "/logos/partmo-real.png",
    },
  });

  return { category, brands: { "mann-filter": mann, partmo } };
}

async function dryRun(products) {
  const prisma = getPrisma();
  const existing = await prisma.product.findMany({
    where: { slug: { in: products.map((product) => product.slug) } },
    select: { slug: true, sku: true, name: true },
  });

  const existingSlugs = new Set(existing.map((product) => product.slug));
  console.log(`Productos preparados: ${products.length}`);
  console.log(`Nuevos: ${products.filter((product) => !existingSlugs.has(product.slug)).length}`);
  console.log(`A actualizar: ${existing.length}`);
  console.log("Modo diagnóstico: no se realizaron cambios. Use --apply para escribir.");
}

async function apply(products) {
  const prisma = getPrisma();
  const { category, brands } = await ensureCatalogEntities();

  for (const product of products) {
    const brand = brands[product.brandSlug];
    const common = {
      name: product.name,
      description: product.description,
      shortDesc: product.shortDesc,
      price: 0,
      comparePrice: null,
      cost: null,
      sku: product.sku,
      inStock: true,
      stock: 0,
      isActive: true,
      isFeatured: false,
      categoryId: category.id,
      brandId: brand.id,
    };

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        ...common,
        images: {
          deleteMany: {},
          create: [{ url: product.image, alt: product.alt, isMain: true }],
        },
        attributes: {
          deleteMany: {},
          create: product.attributes,
        },
      },
      create: {
        slug: product.slug,
        ...common,
        images: {
          create: [{ url: product.image, alt: product.alt, isMain: true }],
        },
        attributes: { create: product.attributes },
      },
    });

    console.log(`OK ${product.sku} · ${product.name}`);
  }
}

async function main() {
  const products = [...mannProducts(), ...partmoProducts()];
  validateSource(products);

  if (process.argv.includes("--build-sync")) {
    const hasProductionDatabase = /^postgres(?:ql)?:\/\//i.test(
      process.env.DATABASE_URL || "",
    );
    if (process.env.VERCEL_ENV !== "production" || !hasProductionDatabase) {
      console.log("Sincronización omitida: no hay una conexión PostgreSQL de producción disponible.");
      return;
    }
    await apply(products);
    console.log(`Sincronización de producción terminada: ${products.length} productos.`);
    return;
  }

  if (process.argv.includes("--apply")) {
    await apply(products);
    console.log(`Sincronización terminada: ${products.length} productos.`);
  } else {
    await dryRun(products);
  }
}

main()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma?.$disconnect();
  });
