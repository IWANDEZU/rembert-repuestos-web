const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const products = [
  {
    slug: "cat-deo-15w40",
    name: "CAT DEO-ULS 15W-40 5 gal",
    sku: "CAT-515-3975",
    category: "lubricantes-diesel",
    image: "/catalogo-caterpillar/cat-deo-uls-15w40-515-3975-original.jpg",
    imageAlt: "Balde original CAT DEO-ULS SAE 15W-40 de 5 galones, referencia 515-3975",
    price: 476000,
    description: "Aceite genuino CAT para motores diésel de servicio pesado. Formulado para motores Caterpillar y flotas mixtas, incluidos equipos con postratamiento que requieren API CK-4 o categorías anteriores. Presentación de 5 galones (18,9 L), referencia 515-3975.",
    shortDesc: "Aceite diésel API CK-4 para motores CAT y flotas mixtas. Precio publicado como referencia de mercado; confirmar disponibilidad.",
    attributes: [
      ["Referencia CAT", "515-3975"],
      ["Presentación", "5 gal EE. UU. / 18,9 L"],
      ["Viscosidad", "SAE 15W-40"],
      ["Especificación", "API CK-4; compatible con CJ-4, CI-4, CI-4 PLUS y CH-4"],
      ["Rendimiento CAT", "ECF-3, ECF-2 y ECF-1-a"],
      ["Aplicación", "Motores diésel CAT, flotas mixtas y camiones de servicio pesado"],
      ["Fuente técnica", "Caterpillar / ficha CAT DEO-ULS PSHJ0159-09"],
      ["Precio", "COP 476.000, referencia pública consultada en Colombia; sujeto a confirmación"],
    ],
  },
  {
    slug: "cat-hydo-advanced-10w",
    name: "CAT HYDO Advanced 10 20 L",
    sku: "CAT-309-6942",
    category: "hidraulico",
    image: "/catalogo-caterpillar/cat-hydo-advanced-10-309-6942-original.jpg",
    imageAlt: "Balde original CAT HYDO Advanced 10 de 20 litros, referencia 309-6942",
    price: 0,
    description: "Aceite hidráulico CAT SAE 10W formulado con aceites base y aditivos premium para proteger bombas, válvulas y componentes del sistema hidráulico. Con análisis S·O·S y filtros CAT puede admitir intervalos extendidos de hasta 6.000 horas, según las condiciones indicadas por Caterpillar.",
    shortDesc: "Fluido hidráulico SAE 10W de alto rendimiento para maquinaria CAT. Precio y disponibilidad bajo cotización.",
    attributes: [
      ["Referencia CAT", "309-6942"],
      ["Presentación", "20 L"],
      ["Viscosidad", "SAE 10W"],
      ["Viscosidad cinemática", "42 cSt a 40 °C; 6,7 cSt a 100 °C (valores típicos)"],
      ["Índice de viscosidad", "114 (valor típico)"],
      ["Punto de fluidez", "-39 °C (valor típico)"],
      ["Intervalo extendido", "Hasta 6.000 h con programa S·O·S y condiciones CAT"],
      ["Fuente técnica", "Caterpillar / ficha HYDO Advanced 10 PSHJ0182-02"],
    ],
  },
  {
    slug: "cat-tdto-sae30",
    name: "CAT TDTO SAE 30 5 gal",
    sku: "CAT-8T-9572",
    category: "transmision",
    image: "/catalogo-caterpillar/cat-tdto-sae30-8t-9572-original.jpg",
    imageAlt: "Balde original CAT TDTO SAE 30 de 5 galones, referencia 8T-9572",
    price: 0,
    description: "Aceite CAT Transmission/Drive Train Oil SAE 30 para compartimientos que exigen Cat TO-4. Diseñado para transmisiones powershift, mandos finales, frenos húmedos y ciertos sistemas hidrostáticos de equipos Caterpillar.",
    shortDesc: "Aceite de transmisión y tren de potencia CAT TO-4. Precio y disponibilidad bajo cotización.",
    attributes: [
      ["Referencia CAT", "8T-9572"],
      ["Presentación", "5 gal EE. UU. / 18,9 L"],
      ["Viscosidad", "SAE 30"],
      ["Especificación", "Cat TO-4"],
      ["Aplicación", "Transmisiones powershift, mandos finales, frenos húmedos y sistemas hidrostáticos"],
      ["Beneficio documentado", "Hasta 45 % más vida del disco de embrague frente a aceites TO-2, según Caterpillar"],
      ["Fuente técnica", "Caterpillar Parts, referencia 8T-9572"],
    ],
  },
  {
    slug: "cat-tdto-sae50-20l",
    name: "CAT TDTO SAE 50 20 L",
    sku: "CAT-7X-7858",
    category: "transmision",
    image: "/catalogo-caterpillar/cat-tdto-sae50-7x-7858-original.jpg",
    imageAlt: "Balde original CAT TDTO SAE 50 de 20 litros, referencia 7X-7858",
    price: 0,
    description: "Aceite CAT Transmission/Drive Train Oil SAE 50 para transmisiones, mandos finales y compartimientos que requieren el estándar Cat TO-4. Producto de primer llenado desarrollado para el tren de potencia de equipos Caterpillar.",
    shortDesc: "TDTO SAE 50 para tren de potencia y mandos finales CAT. Precio y disponibilidad bajo cotización.",
    attributes: [
      ["Referencia CAT", "7X-7858"],
      ["Presentación", "20 L"],
      ["Viscosidad", "SAE 50"],
      ["Especificación", "Cat TO-4"],
      ["Aplicación", "Transmisiones, mandos finales y compartimientos de tren de potencia"],
      ["Fuente técnica", "Caterpillar Parts, referencia 7X-7858"],
    ],
  },
  {
    slug: "cat-elc-premix-50-50-20l",
    name: "CAT ELC Premix 50/50 20 L",
    sku: "CAT-205-6612",
    category: "coolant",
    image: "/catalogo-caterpillar/cat-elc-50-50-205-6612-original.jpg",
    imageAlt: "Balde original CAT ELC Premix 50/50 de 20 litros, referencia 205-6612",
    price: 0,
    description: "Refrigerante de vida extendida CAT premezclado al 50/50. Está listo para usar y no se debe añadir agua. Su tecnología de inhibidores de ácido orgánico protege metales del sistema de enfriamiento y está recomendada para la mayoría de motores y máquinas CAT.",
    shortDesc: "Refrigerante CAT de larga vida, premezclado y listo para usar. Precio bajo cotización.",
    attributes: [
      ["Referencia CAT", "205-6612"],
      ["Presentación", "20 L"],
      ["Concentración", "Premix 50/50"],
      ["Uso", "Listo para usar; no agregar agua"],
      ["Tecnología", "Inhibidores de ácido orgánico, libre de silicato"],
      ["Protección", "Cobre, soldadura, latón, acero, hierro fundido y aluminio"],
      ["Fuente técnica", "Caterpillar Parts, referencia 205-6612"],
    ],
  },
  {
    slug: "cat-extreme-application-grease-2-16kg",
    name: "CAT Extreme Application Grease #2 16 kg",
    sku: "CAT-452-6004",
    category: "grasas-y-aditivos",
    image: "/catalogo-caterpillar/cat-extreme-grease-2-452-6004-original.jpg",
    imageAlt: "Balde CAT Extreme Application Grease número 2 de 16 kg, referencia 452-6004",
    price: 0,
    description: "Grasa CAT para servicio severo con complejo de sulfonato de calcio y 5 % de disulfuro de molibdeno. Diseñada para cargas altas, resistencia al lavado con agua y protección contra corrosión en pasadores, bujes y articulaciones.",
    shortDesc: "Grasa NLGI #2 con 5 % de molibdeno para aplicaciones severas. Precio bajo cotización.",
    attributes: [
      ["Referencia CAT", "452-6004"],
      ["Presentación", "Balde de 16 kg"],
      ["Grado", "NLGI #2"],
      ["Espesante", "Complejo de sulfonato de calcio"],
      ["Sólidos", "5 % disulfuro de molibdeno"],
      ["Aplicación", "Pasadores, bujes y articulaciones bajo carga alta y exposición al agua"],
      ["Fuente técnica", "Caterpillar Parts, referencia 452-6004"],
    ],
  },
];

async function main() {
  const categoryNames = {
    "lubricantes-diesel": "Lubricantes Diésel",
    hidraulico: "Aceite Hidráulico",
    transmision: "Aceite de Transmisión y Mandos",
    coolant: "Refrigerantes y Coolant",
    "grasas-y-aditivos": "Grasas y Aditivos",
  };

  const categories = {};
  for (const [slug, name] of Object.entries(categoryNames)) {
    categories[slug] = await prisma.category.upsert({
      where: { slug },
      update: { name },
      create: { slug, name },
    });
  }

  const brand = await prisma.brand.upsert({
    where: { slug: "caterpillar" },
    update: { name: "Caterpillar (CAT)" },
    create: { slug: "caterpillar", name: "Caterpillar (CAT)" },
  });

  for (const item of products) {
    const product = await prisma.product.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        description: item.description,
        shortDesc: item.shortDesc,
        price: item.price,
        comparePrice: null,
        cost: null,
        sku: item.sku,
        inStock: false,
        stock: 0,
        isActive: true,
        isFeatured: true,
        categoryId: categories[item.category].id,
        brandId: brand.id,
      },
      create: {
        name: item.name,
        slug: item.slug,
        description: item.description,
        shortDesc: item.shortDesc,
        price: item.price,
        sku: item.sku,
        inStock: false,
        stock: 0,
        isActive: true,
        isFeatured: true,
        categoryId: categories[item.category].id,
        brandId: brand.id,
      },
    });

    await prisma.$transaction([
      prisma.productImage.deleteMany({ where: { productId: product.id } }),
      prisma.productAttribute.deleteMany({ where: { productId: product.id } }),
      prisma.variant.deleteMany({ where: { productId: product.id } }),
      prisma.productImage.create({ data: { productId: product.id, url: item.image, alt: item.imageAlt, isMain: true } }),
      prisma.productAttribute.createMany({
        data: item.attributes.map(([name, value]) => ({ productId: product.id, name, value })),
      }),
      prisma.variant.create({
        data: {
          productId: product.id,
          name: item.attributes.find(([name]) => name === "Presentación")?.[1] || "Presentación estándar",
          sku: item.sku,
          price: item.price || null,
          stock: 0,
        },
      }),
    ]);
  }

  console.log(`Sincronizados ${products.length} productos Caterpillar.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
