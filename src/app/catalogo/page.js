import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import CatalogGridWithModal from "@/components/CatalogGridWithModal";
import CatalogSidebar from "@/components/CatalogSidebar";
import { buildCatalogHref } from "@/lib/catalogUtils";
import PrioridadDieselCatalogSection from "@/components/PrioridadDieselCatalogSection";
import { siteUrl } from "@/lib/site";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { generateWhatsAppProductText, getWhatsAppUrl } from "@/lib/orderFormatter";

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
    "Explora nuestro catálogo de lubricantes, filtros de motor, frenos y repuestos en Victor Services. Atención en Barrancabermeja y envíos a toda Colombia.";

  const categoryTitles = {
    lubricantes: "Lubricantes y Aceites de Motor",
    filtros: "Filtros Automotrices e Industriales",
    "frenos-y-suspension": "Frenos y Suspensión Automotriz",
    "maquinaria-pesada": "Línea Amarilla y Maquinaria Pesada",
    "lubricantes-diesel": "Lubricantes Diésel Trabajo Pesado",
    "lubricantes-gasolina": "Lubricantes para Motor a Gasolina",
    transmision: "Aceites de Transmisión y Diferencial",
    hidraulico: "Aceites Hidráulicos Industriales",
    coolant: "Refrigerantes y Coolant para Motor",
    "grasas-y-aditivos": "Grasas Automotrices y Aditivos",
    urea: "Urea Automotriz (AdBlue / DEF)",
  };

  if (categoryParam && categoryTitles[categoryParam]) {
    title = categoryTitles[categoryParam];
    description = `Compra ${categoryTitles[categoryParam].toLowerCase()} al mejor precio en Victor Services Barrancabermeja. Productos originales con envíos a toda Colombia.`;
  }

  if (brandParam) {
    const brandName = brandParam.charAt(0).toUpperCase() + brandParam.slice(1);
    title = `Productos ${brandName}`;
    description = `Catálogo oficial de productos ${brandName} en Barrancabermeja. Lubricantes y filtros originales para tu motor.`;
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
      canonical: canonicalPath,
    },
    robots: searchQuery ? { index: false, follow: true } : undefined,
    openGraph: {
      title,
      description,
      url: `${siteUrl}${canonicalPath}`,
      siteName: "Victor Services",
      type: "website",
    },
  };
}

const categorySlugs = [
  "lubricantes-diesel",
  "lubricantes-gasolina",
  "transmision",
  "hidraulico",
  "coolant",
  "grasas-y-aditivos",
  "maquinaria-pesada",
];

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
    slug: "dpf",
    category: "maquinaria-pesada",
    title: "Filtro DPF",
    description: "Control de partículas en motores diésel.",
    image: "/catalogo-filtros-tipos/filtro-particulas-diesel-dpf.webp",
    alt: "Filtro de partículas diésel DPF",
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

const suspensionReferenceShowcase = [
  {
    slug: "mazda-bt50",
    title: "Mazda BT-50 II / UR",
    description: "Amortiguador delantero de gas para aplicaciones 2011+.",
    image: "/catalogo-suspensiones/referencias-camionetas/mazda-bt50-front-shock.webp",
    alt: "Amortiguador delantero de referencia para Mazda BT-50",
  },
  {
    slug: "hyundai-h100-porter",
    title: "Hyundai H-100 / Porter",
    description: "Amortiguador delantero convencional para trabajo liviano.",
    image: "/catalogo-suspensiones/referencias-camionetas/hyundai-h100-porter-front-shock.webp",
    alt: "Amortiguador delantero de referencia para Hyundai H-100 Porter",
  },
  {
    slug: "volkswagen-amarok",
    title: "Volkswagen Amarok 2.0",
    description: "Strut delantero con soporte de mangueta y vástago roscado.",
    image: "/catalogo-suspensiones/referencias-camionetas/volkswagen-amarok-front-strut.webp",
    alt: "Strut delantero de referencia para Volkswagen Amarok",
  },
  {
    slug: "ford-ranger",
    title: "Ford Ranger T6",
    description: "Amortiguador delantero estructural para 4x2 y 4x4.",
    image: "/catalogo-suspensiones/referencias-camionetas/ford-ranger-front-shock.webp",
    alt: "Amortiguador delantero de referencia para Ford Ranger",
  },
  {
    slug: "chevrolet-dmax",
    title: "Chevrolet D-Max",
    description: "Amortiguador delantero de gas para aplicaciones 4x2 y 4x4.",
    image: "/catalogo-suspensiones/referencias-camionetas/chevrolet-dmax-front-shock.webp",
    alt: "Amortiguador delantero de referencia para Chevrolet D-Max",
  },
  {
    slug: "hino-300",
    title: "Hino 300 / Dutro",
    description: "Amortiguador reforzado para camión liviano de carga.",
    image: "/catalogo-suspensiones/referencias-camionetas/hino-300-dutro-front-shock.webp",
    alt: "Amortiguador delantero reforzado de referencia para Hino 300",
  },
  {
    slug: "foton-tunland",
    title: "Foton Tunland",
    description: "Strut delantero directo para pickup diésel.",
    image: "/catalogo-suspensiones/referencias-camionetas/foton-tunland-front-strut.webp",
    alt: "Strut delantero de referencia para Foton Tunland",
  },
  {
    slug: "isuzu-npr-turbo",
    title: "Isuzu NPR Turbo",
    description: "Amortiguador reforzado para camión cab-over diésel.",
    image: "/catalogo-suspensiones/referencias-camionetas/isuzu-npr-turbo-front-shock.webp",
    alt: "Amortiguador delantero reforzado de referencia para Isuzu NPR Turbo",
  },
];

const brakeDiscReferenceShowcase = [
  {
    slug: "mazda-bt50-front-disc",
    title: "Mazda BT-50 UP / UR",
    description: "Disco delantero ventilado compartido con Ranger PX/T6.",
    image: "/catalogo-frenos/discos-referencias/mazda-bt50-ford-ranger-front-disc.webp",
    alt: "Disco de freno delantero ventilado de referencia para Mazda BT-50",
  },
  {
    slug: "ford-ranger-front-disc",
    title: "Ford Ranger PX / T6",
    description: "Misma familia de rotor delantero 6x139,7 en varias aplicaciones.",
    image: "/catalogo-frenos/discos-referencias/mazda-bt50-ford-ranger-front-disc.webp",
    alt: "Disco de freno delantero ventilado de referencia para Ford Ranger",
  },
  {
    slug: "hyundai-h100-front-disc",
    title: "Hyundai H-100 / Porter",
    description: "Rotor delantero ventilado compacto para camión liviano.",
    image: "/catalogo-frenos/discos-referencias/hyundai-h100-porter-front-disc.webp",
    alt: "Disco de freno delantero ventilado de referencia para Hyundai H-100 Porter",
  },
  {
    slug: "volkswagen-amarok-front-disc",
    title: "Volkswagen Amarok",
    description: "Rotor delantero de alto diámetro y ventilación interna profunda.",
    image: "/catalogo-frenos/discos-referencias/volkswagen-amarok-front-disc.webp",
    alt: "Disco de freno delantero ventilado de referencia para Volkswagen Amarok",
  },
  {
    slug: "chevrolet-dmax-front-disc",
    title: "Chevrolet D-Max",
    description: "Disco delantero ventilado para pickup 4x2 y 4x4.",
    image: "/catalogo-frenos/discos-referencias/chevrolet-dmax-front-disc.webp",
    alt: "Disco de freno delantero ventilado de referencia para Chevrolet D-Max",
  },
  {
    slug: "hino-300-front-disc",
    title: "Hino 300 / Dutro",
    description: "Rotor ventilado reforzado para operación de carga.",
    image: "/catalogo-frenos/discos-referencias/hino-300-front-disc.webp",
    alt: "Disco de freno delantero ventilado de referencia para Hino 300",
  },
  {
    slug: "foton-tunland-front-disc",
    title: "Foton Tunland",
    description: "Disco ventilado robusto para pickup diésel 4x4.",
    image: "/catalogo-frenos/discos-referencias/foton-tunland-front-disc.webp",
    alt: "Disco de freno delantero ventilado de referencia para Foton Tunland",
  },
  {
    slug: "isuzu-npr-front-disc",
    title: "Isuzu NPR Turbo",
    description: "Rotor ventilado de alta masa para camión cab-over.",
    image: "/catalogo-frenos/discos-referencias/isuzu-npr-turbo-front-disc.webp",
    alt: "Disco de freno delantero ventilado de referencia para Isuzu NPR Turbo",
  },
];

function getReferenceWhatsAppUrl(reference, type) {
  return getWhatsAppUrl(
    generateWhatsAppProductText({
      product: {
        name: reference.title,
        reference: reference.slug,
        brand: reference.title.split(" ")[0],
        category: "Frenos y suspensión",
        image: reference.image,
        productPath: `/catalogo?category=frenos-y-suspension&search=${encodeURIComponent(reference.title)}`,
      },
      image: reference.image,
      extraDetails: `${type}: ${reference.description}\nCompatibilidad: confirmar por VIN, medidas y año.`,
    })
  );
}

function getPageNumber(value) {
  const page = Number.parseInt(value, 10);
  return Number.isSafeInteger(page) && page > 0 ? page : 1;
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

  if (categoryParam === "lubricantes") {
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
  } else if (categoryParam === "lubricantes-diesel") {
    conditions.push({
      OR: [
        { category: { slug: "lubricantes-diesel" } },
        { name: { contains: "Delvac" } },
        { name: { contains: "Delo" } },
        { name: { contains: "Rimula" } },
        { name: { contains: "Premium Blue" } },
        { name: { contains: "Diesel" } },
        { name: { contains: "Diésel" } },
        { name: { contains: "DEO" } },
      ],
    });
    conditions.push({
      NOT: [{ name: { contains: "Filtro" } }, { category: { slug: "filtros" } }],
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
        { name: { contains: "Transmisión" } },
        { name: { contains: "Transmision" } },
        { name: { contains: "TDTO" } },
        { name: { contains: "Gear" } },
        { name: { contains: "80W-90" } },
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
  const [fetchedProducts, totalProducts, brands, session] = await Promise.all([
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
  const currentPage = requestedPage;
  let favoriteProductIds = [];
  if (session?.user?.id) {
    const favorites = await prisma.favorite.findMany({
      where: { userId: session.user.id },
      select: { productId: true },
    });
    favoriteProductIds = favorites.map(f => f.productId);
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
    filtros: ["Filtros automotrices e industriales", "Filtros de aceite, aire, combustible, separadores de agua y cabina."],
    "frenos-y-suspension": ["Frenos y suspensión", "Pastillas, discos, amortiguadores y líquidos de frenos."],
    "maquinaria-pesada": ["Maquinaria pesada y línea amarilla", "Fluidos de alto rendimiento para equipos, camiones y operación industrial."],
    "lubricantes-diesel": ["Lubricantes diésel trabajo pesado", "Aceites para motores diésel de carga pesada y maquinaria."],
    "lubricantes-gasolina": ["Lubricantes gasolina y livianos", "Aceites sintéticos y minerales para motores a gasolina."],
    transmision: ["Aceites de transmisión y diferencial", "Fluidos para transmisiones, mandos finales, frenos húmedos y engranajes."],
    hidraulico: ["Aceites hidráulicos", "Fluidos para sistemas hidráulicos móviles e industriales."],
    coolant: ["Refrigerantes y coolant", "Refrigerantes de larga vida y anticongelantes para sistemas de enfriamiento."],
    "grasas-y-aditivos": ["Grasas y aditivos", "Protección para pasadores, bujes, rodamientos y aplicaciones de servicio severo."],
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
          </section>
        )}

        {categoryParam === "frenos-y-suspension" && !brandParam && !searchQuery && (
          <section className="brake-disc-showcase suspension-showcase" aria-labelledby="brake-disc-showcase-title">
            <div className="suspension-showcase__heading">
              <div>
                <p className="filter-showcase__eyebrow">Referencias visuales investigadas</p>
                <h2 id="brake-disc-showcase-title">Discos de freno por aplicación</h2>
              </div>
              <p>Los rotores cambian por diámetro, espesor, ventilación, número de pernos y posición. Confirma medidas y VIN antes de vender.</p>
            </div>
            <div className="suspension-showcase__grid">
              {brakeDiscReferenceShowcase.map((reference) => (
                <article key={reference.slug} className="suspension-showcase__card">
                  <div className="suspension-showcase__image">
                    <Image src={reference.image} alt={reference.alt} fill sizes="(max-width: 640px) 50vw, (max-width: 1100px) 25vw, 220px" />
                  </div>
                  <h3>{reference.title}</h3>
                  <p>{reference.description}</p>
                  <span>Referencia visual · verificar diámetro y patrón</span>
                  <a
                    href={getReferenceWhatsAppUrl(reference, "Disco de freno")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="suspension-showcase__quote"
                  >
                    💬 Cotizar por WhatsApp
                  </a>
                </article>
              ))}
            </div>
          </section>
        )}

        {categoryParam === "frenos-y-suspension" && !brandParam && !searchQuery && (
          <section className="suspension-showcase" aria-labelledby="suspension-showcase-title">
            <div className="suspension-showcase__heading">
              <div>
                <p className="filter-showcase__eyebrow">Guía visual de aplicaciones</p>
                <h2 id="suspension-showcase-title">Amortiguadores para camionetas y camiones</h2>
              </div>
              <p>La geometría cambia por marca, año, posición y tracción. Confirma siempre la referencia por VIN antes de instalar.</p>
            </div>
            <div className="suspension-showcase__grid">
              {suspensionReferenceShowcase.map((reference) => (
                <article key={reference.slug} className="suspension-showcase__card">
                  <div className="suspension-showcase__image">
                    <Image src={reference.image} alt={reference.alt} fill sizes="(max-width: 640px) 50vw, (max-width: 1100px) 25vw, 220px" />
                  </div>
                  <h3>{reference.title}</h3>
                  <p>{reference.description}</p>
                  <span>Referencia visual · confirmar compatibilidad</span>
                  <a
                    href={getReferenceWhatsAppUrl(reference, "Amortiguador")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="suspension-showcase__quote"
                  >
                    💬 Cotizar por WhatsApp
                  </a>
                </article>
              ))}
            </div>
          </section>
        )}

        {!categoryParam && !brandParam && !searchQuery && sortParam === "recent" && <PrioridadDieselCatalogSection />}

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
