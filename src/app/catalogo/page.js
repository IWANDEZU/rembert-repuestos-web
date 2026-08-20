import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import CatalogGridWithModal from "@/components/CatalogGridWithModal";
import CatalogSidebar from "@/components/CatalogSidebar";
import { buildCatalogHref } from "@/lib/catalogUtils";
import { siteUrl } from "@/lib/site";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { products as fallbackCatalogProducts } from "@/lib/products";

export const dynamic = "force-dynamic";
const PAGE_SIZE = 24;

export async function generateMetadata({ searchParams }) {
  const resolvedParams = await searchParams;
  const categoryParam = resolvedParams?.category;
  const brandParam = resolvedParams?.brand;
  const tipoParam = resolvedParams?.tipo;
  const searchQuery = resolvedParams?.search || resolvedParams?.q;

  let title = "Catálogo de productos";
  let description =
    "Explora nuestro catálogo de filtros, siliconas, frenos, radiadores y repuestos en Rembert Repuestos BCA. Atención en Barrancabermeja y envíos a toda Colombia.";

  const categoryTitles = {
    filtros: "Filtros Automotrices e Industriales",
    siliconas: "Siliconas y Sellantes Automotrices",
    mantenimiento: "Mantenimiento Automotriz",
    "frenos-y-suspension": "Frenos y Suspensión Automotriz",
    transmision: "Cajas y Transmisiones Automotrices",
    radiadores: "Radiadores y Sistema de Enfriamiento",
    "servicio-tecnico": "Servicio Técnico y Taller Especializado",
  };

  if (categoryParam && categoryTitles[categoryParam]) {
    title = categoryTitles[categoryParam];
    description = `Compra ${categoryTitles[categoryParam].toLowerCase()} al mejor precio en Rembert Repuestos BCA Barrancabermeja. Productos originales con envíos a toda Colombia.`;
  }

  if (brandParam) {
    const brandName = brandParam.charAt(0).toUpperCase() + brandParam.slice(1);
    title = `Productos ${brandName}`;
    description = `Catálogo oficial de productos ${brandName} en Barrancabermeja. Lubricantes y filtros originales para tu motor en Rembert Repuestos BCA.`;
  }

  if (searchQuery) {
    title = `Búsqueda: ${searchQuery}`;
  }

  const queryParams = new URLSearchParams();
  if (categoryParam) queryParams.set("category", categoryParam);
  if (brandParam) queryParams.set("brand", brandParam);
  if (tipoParam) queryParams.set("tipo", tipoParam);
  const requestedPage = getPageNumber(resolvedParams?.page);
  if (requestedPage > 1) queryParams.set("page", requestedPage);
  const queryString = queryParams.toString();
  const canonicalPath = queryString ? `/catalogo?${queryString}` : "/catalogo";

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}${canonicalPath}`,
    },
    robots: searchQuery ? { index: false, follow: true } : undefined,
    openGraph: {
      title,
      description,
      url: `${siteUrl}${canonicalPath}`,
      siteName: "Rembert Repuestos BCA",
      type: "website",
    },
  };
}

const categorySlugs = [];

const filterTypeShowcase = [
  {
    slug: "aceite",
    category: "filtros",
    type: "aceite",
    title: "Filtros de aceite",
    description: "Protección para motor y lubricación.",
    image: "/catalogo-filtros-tipos/filtro-aceite.webp",
    alt: "Filtro de aceite automotriz",
  },
  {
    slug: "elemento-aceite",
    category: "filtros",
    type: "aceite",
    title: "Elemento de aceite",
    description: "Cartucho filtrante para lubricación.",
    image: "/catalogo-filtros-tipos/elemento-filtrante-aceite.webp",
    alt: "Elemento filtrante de aceite",
  },
  {
    slug: "combustible",
    category: "filtros",
    type: "combustible",
    title: "Filtro de combustible",
    description: "Protección del sistema de inyección.",
    image: "/catalogo-filtros-tipos/filtro-combustible.webp",
    alt: "Filtro de combustible automotriz",
  },
  {
    slug: "separador",
    category: "filtros",
    type: "combustible",
    title: "Separador de agua",
    description: "Separación de agua y combustible diésel.",
    image: "/catalogo-filtros-tipos/filtro-separador-agua-combustible.webp",
    alt: "Filtro separador de agua y combustible",
  },
  {
    slug: "aire-panel",
    category: "filtros",
    type: "aire",
    title: "Filtro de aire panel",
    description: "Admisión limpia en vehículos livianos.",
    image: "/catalogo-filtros-tipos/filtro-aire-panel.webp",
    alt: "Filtro de aire tipo panel",
  },
  {
    slug: "aire-radial",
    category: "filtros",
    type: "aire",
    title: "Filtro de aire radial",
    description: "Filtración cilíndrica para trabajo pesado.",
    image: "/catalogo-filtros-tipos/filtro-aire-radial.webp",
    alt: "Filtro de aire radial cilíndrico",
  },
  {
    slug: "cabina",
    category: "filtros",
    type: "cabina",
    title: "Filtros de cabina",
    description: "Mejor calidad de aire dentro del vehículo.",
    image: "/catalogo-filtros-tipos/filtro-habitaculo-cabina.webp",
    alt: "Filtro de cabina automotriz",
  },
  {
    slug: "scr",
    category: "urea",
    title: "Filtro urea / AdBlue",
    description: "Filtración para sistemas SCR.",
    image: "/catalogo-filtros-tipos/filtro-urea-adblue-scr.webp",
    alt: "Filtro para urea AdBlue SCR",
  },
];

const gasolineFilterApplications = [
  ["Chevrolet", "Spark, Spark GT, Onix, Sail, Aveo, Tracker", "Aceite · aire · combustible · cabina"],
  ["Renault", "Kwid, Sandero, Logan, Stepway, Duster, Duster Oroch", "Aceite · aire · combustible · cabina"],
  ["Toyota", "Yaris, Corolla, Etios, RAV4, Fortuner", "Aceite · aire · combustible · cabina"],
  ["Kia", "Picanto, Rio, Cerato, Sportage, Sonet", "Aceite · aire · combustible · cabina"],
  ["Mazda", "Mazda 2, Mazda 3, CX-3, CX-5", "Aceite · aire · combustible · cabina"],
  ["Hyundai", "i10, Grand i10, Accent, Elantra, Tucson, Creta", "Aceite · aire · combustible · cabina"],
  ["Ford", "Fiesta, EcoSport, Escape, Focus, Ranger gasolina", "Aceite · aire · combustible · cabina"],
  ["Nissan", "March, Versa, Sentra, Kicks, X-Trail", "Aceite · aire · combustible · cabina"],
  ["Volkswagen", "Gol, Voyage, Polo, Virtus, T-Cross", "Aceite · aire · combustible · cabina"],
  ["Mitsubishi", "Lancer, ASX, Outlander, Montero gasolina", "Aceite · aire · combustible · cabina"],
  ["Honda", "Fit, City, Civic, HR-V, CR-V", "Aceite · aire · combustible · cabina"],
  ["Suzuki", "Alto, Swift, Celerio, Vitara, S-Cross", "Aceite · aire · combustible · cabina"],
  ["BMW", "Serie 1, Serie 3, Serie 5, X1, X3 gasolina", "Aceite · aire · combustible · cabina"],
];

const gasolineFilterBrandVisuals = {
  Chevrolet: { logo: "/logos/autos/chevrolet.svg", image: "/filtro-aceite-gasolina-catalogo.png" },
  Renault: { logo: "/logos/autos/renault.svg", image: "/filtro-aire-gasolina-catalogo.png" },
  Toyota: { logo: "/logos/autos/toyota.svg", image: "/filtro-cabina-gasolina-catalogo.png" },
  Kia: { logo: "/logos/autos/kia.svg", image: "/filtro-combustible-gasolina-catalogo.png" },
  Mazda: { logo: "/logos/autos/mazda.svg", image: "/filtro-aceite-gasolina-catalogo.png" },
  Hyundai: { logo: "/logos/autos/hyundai.svg", image: "/filtro-aire-gasolina-catalogo.png" },
  Ford: { logo: "/logos/autos/ford.svg", image: "/filtro-cabina-gasolina-catalogo.png" },
  Nissan: { logo: "/logos/autos/nissan.svg", image: "/filtro-combustible-gasolina-catalogo.png" },
  Volkswagen: { logo: "/logos/autos/volkswagen.svg", image: "/filtro-aceite-gasolina-catalogo.png" },
  Mitsubishi: { logo: "/logos/autos/mitsubishi.svg", image: "/filtro-aire-gasolina-catalogo.png" },
  Honda: { logo: "/logos/autos/honda.svg", image: "/filtro-cabina-gasolina-catalogo.png" },
  Suzuki: { logo: "/logos/autos/suzuki.svg", image: "/filtro-combustible-gasolina-catalogo.png" },
  BMW: { logo: "/logos/autos/bmw.svg", image: "/filtro-aceite-gasolina-catalogo.png" },
};

function getPageNumber(value) {
  const page = Number.parseInt(value, 10);
  return Number.isSafeInteger(page) && page > 0 ? page : 1;
}

function filterFallbackCatalog({ categoryParam, brandParam, tipoParam, searchQuery }) {
  let filtered = [...fallbackCatalogProducts];

  if (categoryParam === "mantenimiento") {
    filtered = filtered.filter((product) => {
      const searchable = `${product.name} ${product.description || ""}`.toLowerCase();
      return ["siliconas", "coolant", "grasas-y-aditivos", "transmision"].includes(product.category?.slug)
        || ["refrigerante", "silicona", "grasa", "valvulina"].some((term) => searchable.includes(term));
    });
  } else if (categoryParam === "filtros") {
    const typeTerms = {
      aceite: ["aceite"],
      aire: ["aire"],
      combustible: ["combustible", "separador"],
      cabina: ["cabina"],
    };
    filtered = filtered.filter((product) =>
      product.category?.slug === "filtros" || product.name.toLowerCase().includes("filtro")
    );
    if (typeTerms[tipoParam]) {
      filtered = filtered.filter((product) => {
        const searchable = `${product.name} ${product.shortDesc || ""} ${product.description || ""}`.toLowerCase();
        return typeTerms[tipoParam].some((term) => searchable.includes(term));
      });
    }
  } else if (categoryParam === "frenos-y-suspension") {
    filtered = filtered.filter((product) => {
      const searchable = `${product.name} ${product.description || ""}`.toLowerCase();
      return ["frenos-y-suspension", "liquido-frenos"].includes(product.category?.slug)
        || ["pastilla", "disco", "amortiguador", "freno", "strut"].some((term) => searchable.includes(term));
    });
  } else if (categoryParam === "radiadores") {
    filtered = filtered.filter((product) => {
      const searchable = `${product.name} ${product.description || ""}`.toLowerCase();
      return ["radiadores", "coolant"].includes(product.category?.slug)
        || ["radiador", "intercooler", "enfriador", "refrigerante", "termostato"].some((term) => searchable.includes(term));
    });
  } else if (categoryParam === "siliconas") {
    filtered = filtered.filter((product) => {
      const searchable = `${product.name} ${product.description || ""}`.toLowerCase();
      return ["siliconas", "siliconas-y-sellantes"].includes(product.category?.slug)
        || ["silicona", "sellante", "rtv", "reinzosil"].some((term) => searchable.includes(term));
    });
  } else if (categoryParam) {
    filtered = filtered.filter((product) => product.category?.slug === categoryParam);
  }

  if (brandParam) {
    filtered = filtered.filter((product) => product.brand?.slug === brandParam);
  }

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter((product) =>
      `${product.name} ${product.description || ""} ${product.shortDesc || ""} ${product.sku || ""}`
        .toLowerCase()
        .includes(query)
    );
  }

  return filtered;
}

export default async function Catalogo({ searchParams }) {
  const resolvedParams = await searchParams;
  const categoryParam = resolvedParams?.category;
  const brandParam = resolvedParams?.brand;
  const tipoParam = resolvedParams?.tipo;
  const searchQuery = resolvedParams?.search || resolvedParams?.q;
  const requestedPage = getPageNumber(resolvedParams?.page);
  const sortParam = ["recent", "price-asc", "price-desc"].includes(resolvedParams?.sort)
    ? resolvedParams.sort
    : "recent";

  const conditions = [];

  if (categoryParam === "mantenimiento") {
    conditions.push({
      OR: [
        { category: { slug: { in: ["siliconas", "coolant", "grasas-y-aditivos", "transmision"] } } },
        { name: { contains: "Refrigerante" } },
        { name: { contains: "Valvulina" } },
      ],
    });
  } else if (categoryParam === "lubricantes") {
    conditions.push({
      OR: [
        { category: { slug: { in: categorySlugs } } },
        { name: { contains: "Aceite" } },
        { name: { contains: "Lubricante" } },
        { name: { contains: "Grasa" } },
      ],
    });
    conditions.push({
      NOT: [
        { name: { contains: "Filtro" } },
        { category: { slug: "filtros" } },
        { category: { slug: "frenos-y-suspension" } },
      ],
    });
  } else if (categoryParam === "lubricantes-gasolina") {
    conditions.push({
      OR: [
        { category: { slug: "lubricantes-gasolina" } },
        { name: { contains: "Gasolina" } },
        { name: { contains: "Edge" } },
        { name: { contains: "Magnatec" } },
        { name: { contains: "Molygen" } },
      ],
    });
    conditions.push({
      NOT: [{ name: { contains: "Filtro" } }, { category: { slug: "filtros" } }],
    });
  } else if (categoryParam === "transmision") {
    conditions.push({
      OR: [
        { category: { slug: "transmision" } },
        { name: { contains: "Caja" } },
        { name: { contains: "Transmisión" } },
        { name: { contains: "Transmision" } },
        { name: { contains: "Automática" } },
        { name: { contains: "Automatica" } },
        { name: { contains: "CVT" } },
        { name: { contains: "Manual" } },
      ],
    });
  } else if (categoryParam === "hidraulico") {
    conditions.push({
      OR: [
        { category: { slug: "hidraulico" } },
        { name: { contains: "Hidráulico" } },
        { name: { contains: "Hidraulico" } },
        { name: { contains: "HYDO" } },
        { name: { contains: "Tellus" } },
      ],
    });
  } else if (categoryParam === "coolant") {
    conditions.push({
      OR: [
        { category: { slug: "coolant" } },
        { name: { contains: "Coolant" } },
        { name: { contains: "Refrigerante" } },
        { name: { contains: "ELC" } },
      ],
    });
  } else if (categoryParam === "grasas-y-aditivos") {
    conditions.push({
      OR: [
        { category: { slug: "grasas-y-aditivos" } },
        { name: { contains: "Grasa" } },
        { name: { contains: "Grease" } },
        { name: { contains: "Aditivo" } },
      ],
    });
  } else if (categoryParam === "filtros") {
    const baseFilter = {
      OR: [
        { category: { slug: "filtros" } },
        { name: { contains: "Filtro" } },
        { shortDesc: { contains: "Filtro" } },
      ],
    };
    const typeTerms = {
      aceite: ["Aceite"],
      aire: ["Aire"],
      combustible: ["Combustible", "Separador"],
      cabina: ["Cabina"],
    };
    conditions.push(baseFilter);
    if (typeTerms[tipoParam]) {
      conditions.push({
        OR: typeTerms[tipoParam].flatMap((term) => [
          { name: { contains: term } },
          { shortDesc: { contains: term } },
        ]),
      });
    }
  } else if (categoryParam === "frenos-y-suspension") {
    conditions.push({
      OR: [
        { category: { slug: { in: ["frenos-y-suspension", "liquido-frenos"] } } },
        { name: { contains: "Pastilla" } },
        { name: { contains: "Disco" } },
      ],
    });
  } else if (categoryParam === "hidraulico") {
    conditions.push({
      OR: [
        { category: { slug: "hidraulico" } },
        { name: { contains: "Hidráulico" } },
        { name: { contains: "Hidraulico" } },
        { name: { contains: "HYDO" } },
        { name: { contains: "Tellus" } },
      ],
    });
  } else if (categoryParam === "coolant") {
    conditions.push({
      OR: [
        { category: { slug: "coolant" } },
        { name: { contains: "Coolant" } },
        { name: { contains: "Refrigerante" } },
        { name: { contains: "ELC" } },
      ],
    });
  } else if (categoryParam === "grasas-y-aditivos") {
    conditions.push({
      OR: [
        { category: { slug: "grasas-y-aditivos" } },
        { name: { contains: "Grasa" } },
        { name: { contains: "Grease" } },
        { name: { contains: "Aditivo" } },
      ],
    });
  } else if (categoryParam === "filtros") {
    const baseFilter = {
      OR: [
        { category: { slug: "filtros" } },
        { name: { contains: "Filtro" } },
        { shortDesc: { contains: "Filtro" } },
      ],
    };
    const typeTerms = {
      aceite: ["Aceite"],
      aire: ["Aire"],
      combustible: ["Combustible", "Separador"],
      cabina: ["Cabina"],
    };
    conditions.push(baseFilter);
    if (typeTerms[tipoParam]) {
      conditions.push({
        OR: typeTerms[tipoParam].flatMap((term) => [
          { name: { contains: term } },
          { shortDesc: { contains: term } },
        ]),
      });
    }
  } else if (categoryParam === "frenos-y-suspension") {
    conditions.push({
      OR: [
        { category: { slug: { in: ["frenos-y-suspension", "liquido-frenos"] } } },
        { name: { contains: "Pastilla" } },
        { name: { contains: "Disco" } },
        { name: { contains: "Amortiguador" } },
        { name: { contains: "Freno" } },
        { name: { contains: "Strut" } },
      ],
    });
  } else if (categoryParam === "maquinaria-pesada") {
    conditions.push({
      OR: [
        { category: { slug: "maquinaria-pesada" } },
        { brand: { slug: "caterpillar" } },
        { name: { contains: "Delvac" } },
        { name: { contains: "Delo" } },
        { name: { contains: "Rimula" } },
        { name: { contains: "Premium Blue" } },
        { description: { contains: "maquinaria" } },
      ],
    });
  } else if (categoryParam === "urea") {
    conditions.push({
      OR: [
        { category: { slug: "urea" } },
        { name: { contains: "Urea" } },
        { name: { contains: "AdBlue" } },
        { name: { contains: "DEF" } },
      ],
    });
  } else if (categoryParam === "radiadores") {
    conditions.push({
      OR: [
        { category: { slug: { in: ["radiadores", "coolant"] } } },
        { name: { contains: "Radiador" } },
        { name: { contains: "Intercooler" } },
        { name: { contains: "Enfriador" } },
        { name: { contains: "Tapa" } },
        { name: { contains: "Termostato" } },
        { description: { contains: "radiador" } },
      ],
    });
  } else if (categoryParam === "siliconas") {
    conditions.push({
      OR: [
        { brand: { slug: "victor-reinz" } },
        { name: { contains: "Reinzosil" } },
      ],
    });
  } else if (categoryParam) {
    conditions.push({ category: { slug: categoryParam } });
  }

  if (brandParam) {
    conditions.push({ brand: { slug: brandParam } });
  }

  if (searchQuery) {
    conditions.push({
      OR: [
        { name: { contains: searchQuery } },
        { description: { contains: searchQuery } },
        { shortDesc: { contains: searchQuery } },
        { sku: { contains: searchQuery } },
      ],
    });
  }

  // Excluir únicamente artículos diésel; refrigerantes, grasas y valvulinas
  // forman parte del catálogo de mantenimiento solicitado.
  conditions.push({
    NOT: [
      { name: { contains: "Diesel" } },
      { name: { contains: "Diésel" } },
      { name: { contains: "diesel" } },
      { name: { contains: "diésel" } },
      { brand: { slug: "loctite" } },
    ],
  });

  const where = {
    isActive: true,
    ...(conditions.length > 0 ? { AND: conditions } : {}),
  };

  const orderBy =
    sortParam === "price-asc"
      ? { price: "asc" }
      : sortParam === "price-desc"
        ? { price: "desc" }
        : { createdAt: "desc" };

  const productInclude = { category: true, brand: true, images: true, variants: true, attributes: true };
  const requiresPriceSort = sortParam.startsWith("price");

  let fetchedProducts = [];
  let totalProducts = 0;
  let brands = [];
  let session = null;

  const applyFallbackCatalog = () => {
    const filtered = filterFallbackCatalog({ categoryParam, brandParam, tipoParam, searchQuery });
    totalProducts = filtered.length;
    fetchedProducts = requiresPriceSort
      ? filtered
      : filtered.slice((requestedPage - 1) * PAGE_SIZE, requestedPage * PAGE_SIZE);
    brands = Array.from(
      new Map(
        fallbackCatalogProducts
          .filter((product) => product.brand?.slug)
          .map((product) => [product.brand.slug, product.brand])
      ).values()
    ).sort((a, b) => a.name.localeCompare(b.name, "es"));
  };

  try {
    const [dbProducts, dbTotal, dbBrands, dbSession] = await Promise.all([
      prisma.product.findMany({
        where,
        include: productInclude,
        orderBy: requiresPriceSort ? undefined : orderBy,
        ...(requiresPriceSort ? {} : { skip: (requestedPage - 1) * PAGE_SIZE, take: PAGE_SIZE }),
      }),
      prisma.product.count({ where }),
      prisma.brand.findMany({ orderBy: { name: "asc" } }),
      getServerSession(authOptions),
    ]);
    fetchedProducts = dbProducts;
    totalProducts = dbTotal;
    brands = dbBrands;
    session = dbSession;

    // Una base de datos nueva puede responder sin error pero todavía no tener
    // inventario. En ese caso la tienda debe seguir mostrando el catálogo base.
    if (dbTotal === 0) applyFallbackCatalog();
  } catch (err) {
    // Si la BD remota no responde, conservar una tienda navegable y con contenido.
    applyFallbackCatalog();
  }

  const currentPage = requestedPage;
  const totalPages = Math.max(1, Math.ceil(totalProducts / PAGE_SIZE));
  if (totalProducts > 0 && requestedPage > totalPages) {
    redirect(buildCatalogHref({
      category: categoryParam,
      brand: brandParam,
      tipo: tipoParam,
      search: searchQuery,
      sort: sortParam,
      page: totalPages,
    }));
  }

  let favoriteProductIds = [];
  if (session?.user?.id) {
    try {
      const favorites = await prisma.favorite.findMany({
        where: { userId: session.user.id },
        select: { productId: true },
      });
      favoriteProductIds = favorites.map(f => f.productId);
    } catch (err) {
      favoriteProductIds = [];
    }
  }

  // Los productos sin precio se cotizan, no se venden desde la web. Por eso
  // deben permanecer detrás de las referencias con precio al ordenar.
  let products = fetchedProducts;
  if (sortParam === "price-desc") {
    products.sort((a, b) => {
      if (a.price > 0 && b.price > 0) return b.price - a.price;
      if (a.price > 0) return -1;
      if (b.price > 0) return 1;
      return 0;
    });
    products = products.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  } else if (sortParam === "price-asc") {
    products.sort((a, b) => {
      if (a.price > 0 && b.price > 0) return a.price - b.price;
      if (a.price > 0) return -1;
      if (b.price > 0) return 1;
      return 0;
    });
    products = products.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  }

  const firstProduct = products.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0;
  const lastProduct = Math.min((currentPage - 1) * PAGE_SIZE + products.length, totalProducts);

  const banners = {
    lubricantes: ["Lubricantes y aceites", "Aceites de motor, transmisión, hidráulicos, refrigerantes y grasas."],
    siliconas: ["Siliconas y sellantes automotrices", "Sellantes adhesivos RTV, formadores de juntas de alta temperatura y empaques."],
    mantenimiento: ["Mantenimiento automotriz", "Silicona Victor Reinz, grasas, refrigerantes y valvulinas en una sola sección."],
    filtros: ["Filtros automotrices e industriales", "Filtros de aceite, aire, combustible, separadores de agua y cabina."],
    "frenos-y-suspension": ["Frenos y suspensión", "Pastillas, discos, amortiguadores y líquidos de frenos."],
    "lubricantes-gasolina": ["Lubricantes gasolina y livianos", "Aceites sintéticos y minerales para motores a gasolina."],
    transmision: ["Cajas y transmisiones automotrices", "Transmisiones manuales, automáticas y CVT para vehículos de las principales marcas."],
    hidraulico: ["Aceites hidráulicos", "Fluidos para sistemas hidráulicos móviles e industriales."],
    coolant: ["Refrigerantes y coolant", "Refrigerantes de larga vida y anticongelantes para sistemas de enfriamiento."],
    "grasas-y-aditivos": ["Grasas y aditivos", "Protección para pasadores, bujes, rodamientos y aplicaciones de servicio severo."],
    radiadores: ["Radiadores y sistema de refrigeración", "Radiadores de aluminio y cobre, tapas presurizadas, termostatos y refrigerantes para autos y camiones."],
    urea: ["Urea automotriz (AdBlue / DEF)", "Solución para reducción de emisiones en sistemas SCR."],
  };
  let [bannerTitle, bannerSubtitle] = banners[categoryParam] || [
    "Catálogo completo",
    "Repuestos, lubricantes y filtros para vehículos y maquinaria.",
  ];
  if (categoryParam === "filtros" && tipoParam) bannerSubtitle += ` Tipo: ${tipoParam}.`;
  if (brandParam) {
    const brandName = brands.find((brand) => brand.slug === brandParam)?.name || brandParam;
    bannerTitle = `Productos ${brandName}`;
    bannerSubtitle = brandParam === "caterpillar"
      ? "Lubricantes y fluidos CAT seleccionados por relevancia técnica y presencia en el mercado colombiano."
      : `Productos disponibles de la marca ${brandName}.`;
  }

  const sharedFilters = { brand: brandParam, search: searchQuery, sort: sortParam };
  const categoryHref = (category, tipo) => buildCatalogHref({ ...sharedFilters, category, tipo });
  const pageHref = (page) => buildCatalogHref({
    category: categoryParam,
    brand: brandParam,
    tipo: tipoParam,
    search: searchQuery,
    sort: sortParam,
    page,
  });

  const hasActiveFilters = !!(categoryParam || brandParam || searchQuery || tipoParam);
  const backHref = hasActiveFilters ? "/catalogo" : "/";

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Inicio",
        "item": siteUrl,
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Catálogo",
        "item": `${siteUrl}/catalogo`,
      },
      ...(categoryParam || brandParam ? [
        {
          "@type": "ListItem",
          "position": 3,
          "name": bannerTitle,
          "item": `${siteUrl}${categoryParam ? `/catalogo?category=${categoryParam}` : `/catalogo?brand=${brandParam}`}`,
        }
      ] : [])
    ],
  };

  return (
    <main className="main-container section catalog-layout">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <CatalogSidebar
        categoryParam={categoryParam}
        brandParam={brandParam}
        tipoParam={tipoParam}
        searchQuery={searchQuery}
        sortParam={sortParam}
      />
      <div className="catalog-content">
        <header className="catalog-banner">
          <h1>{bannerTitle}</h1>
          <p>{bannerSubtitle}</p>
        </header>

        {categoryParam === "filtros" && !brandParam && !searchQuery && (
          <section className="filter-showcase" aria-labelledby="filter-showcase-title">
            <div className="filter-showcase__heading">
              <div>
                <p className="filter-showcase__eyebrow">Encuentra el repuesto correcto</p>
                <h2 id="filter-showcase-title">Explora filtros por aplicación</h2>
              </div>
              <p>Selecciona el tipo de filtro. Cada ficha muestra su referencia para ayudarte a confirmar compatibilidad.</p>
            </div>
            <div className="filter-showcase__grid">
              {filterTypeShowcase.map((filterType) => (
                <Link
                  key={filterType.slug}
                  href={categoryHref(filterType.category, filterType.type)}
                  className={`filter-showcase__card ${(tipoParam && tipoParam === filterType.type) || (!tipoParam && categoryParam === filterType.category && filterType.category !== "filtros") ? "is-active" : ""}`}
                >
                  <div className="filter-showcase__image">
                    <Image src={filterType.image} alt={filterType.alt} fill sizes="(max-width: 640px) 50vw, 220px" />
                  </div>
                  <div className="filter-showcase__copy">
                    <h3>{filterType.title}</h3>
                    <p>{filterType.description}</p>
                    <span>Ver referencias <span aria-hidden="true">→</span></span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="filter-showcase__heading" style={{ marginTop: "2.5rem" }}>
              <div>
                <p className="filter-showcase__eyebrow">Aplicaciones para gasolina</p>
                <h2>Filtros por marca y modelo</h2>
              </div>
              <p>Listado orientativo para vehículos a gasolina. Confirma siempre año, motor, dimensiones y VIN antes de despachar.</p>
            </div>
            <div className="filter-showcase__grid">
              {gasolineFilterApplications.map(([brand, models, types]) => (
                <article key={brand} className="filter-showcase__card filter-showcase__card--application">
                  <div className="filter-showcase__brand-visual">
                    <Image src={gasolineFilterBrandVisuals[brand].logo} alt={`Logo ${brand}`} width={58} height={38} />
                    <Image src={gasolineFilterBrandVisuals[brand].image} alt={`Referencia visual de filtros para ${brand}`} width={92} height={72} />
                  </div>
                  <div className="filter-showcase__copy">
                    <h3>{brand}</h3>
                    <p><strong>Modelos:</strong> {models}</p>
                    <p><strong>Tipos:</strong> {types}</p>
                    <Link href={`/catalogo?category=filtros&search=${encodeURIComponent(brand)}`}>Ver filtros {brand} →</Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        <div className="catalog-toolbar">
          <p>Mostrando <strong>{firstProduct}-{lastProduct}</strong> de <strong>{totalProducts}</strong> producto(s)</p>
          <form action="/catalogo" method="get" className="catalog-sort-form">
            {categoryParam && <input type="hidden" name="category" value={categoryParam} />}
            {brandParam && <input type="hidden" name="brand" value={brandParam} />}
            {tipoParam && <input type="hidden" name="tipo" value={tipoParam} />}
            {searchQuery && <input type="hidden" name="search" value={searchQuery} />}
            <label htmlFor="catalog-sort">Ordenar por</label>
            <select id="catalog-sort" name="sort" defaultValue={sortParam}>
              <option value="recent">Más recientes</option>
              <option value="price-asc">Menor precio</option>
              <option value="price-desc">Mayor precio</option>
            </select>
            <button type="submit" className="btn btn--outline">Aplicar</button>
          </form>
        </div>

        <CatalogGridWithModal products={products} favoriteProductIds={favoriteProductIds} />
        {totalPages > 1 && (
          <nav className="catalog-pagination" aria-label="Paginación del catálogo">
            {currentPage > 1 && <Link href={pageHref(currentPage - 1)} rel="prev" className="btn btn--outline">Anterior</Link>}
            <span aria-current="page">Página {currentPage} de {totalPages}</span>
            {currentPage < totalPages && <Link href={pageHref(currentPage + 1)} rel="next" className="btn btn--outline">Siguiente</Link>}
          </nav>
        )}
      </div>
    </main>
  );
}
