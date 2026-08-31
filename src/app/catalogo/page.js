import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import CatalogGridWithModal from "@/components/CatalogGridWithModal";
import CatalogPagination from "@/components/CatalogPagination";
import CatalogSidebar from "@/components/CatalogSidebar";
import VehicleFilterSelector from "@/components/VehicleFilterSelector";
import VerkePriorityShowcase from "@/components/VerkePriorityShowcase";
import RowenPriorityShowcase from "@/components/RowenPriorityShowcase";
import { buildCatalogHref } from "@/lib/catalogUtils";
import { siteUrl } from "@/lib/site";
import { products as fallbackCatalogProducts } from "@/lib/products";
import { inventoryLineSummary } from "@/data/inventoryProducts";
import { searchAndRankProducts, cleanText } from "@/lib/searchEngine";
import { filterProductsByVehicle } from "@/lib/vehicleIndex";

// El catálogo es público. La autenticación de favoritos se resuelve en el
// cliente para no ejecutar Supabase + Prisma durante cada visita anónima.
export const revalidate = 300;
const PAGE_SIZE = 24;
const BRAND_SEO = {
  dynamik: {
    name: "Dynamik",
    title: "Dynamik: Pastillas y Discos de Freno por Referencia",
    description: "Catálogo Dynamik de pastillas y discos de freno en REMBERT Repuestos. Cotiza por referencia, VIN y sistema de freno con envío desde Barrancabermeja a Colombia.",
  },
};
const PART_FILTERS = {
  pastillas: ["pastilla"],
  discos: ["disco", "rotor"],
  bandas: ["banda", "zapata"],
  campanas: ["campana", "tambor"],
  amortiguadores: ["amortiguador", "strut", "puntal"],
  terminales: ["terminal"],
  rotulas: ["rótula", "rotula"],
  axiales: ["axial"],
  bujes: ["buje", "silentbloc"],
  sensores: ["sensor", "abs"],
  brazos: ["brazo", "tijera"],
  mordazas: ["mordaza", "caliper"],
  servofrenos: ["servofreno", "booster"],
  cables: ["cable", "estacionamiento"],
  resortes: ["resorte", "helicoidal"],
  rodamientos: ["rodamiento", "cubo"],
  mangueras: ["manguera", "línea flexible"],
  bombas: ["bomba maestra", "cilindro maestro"],
  cilindros: ["cilindro de rueda"],
  bieletas: ["bieleta", "estabilizadora"],
  guardapolvos: ["guardapolvo", "fuelle"],
  soportes: ["soporte", "soporte motor", "soporte caja", "soporte amortiguador", "copela", "strut mount"],
};

const SMART_BRAKE_FAMILIES = [
  ["pastillas", "Pastillas"], ["discos", "Discos"], ["bandas", "Bandas y zapatas"],
  ["campanas", "Campanas"], ["mordazas", "Mordazas"], ["bombas", "Bombas maestras"],
  ["cilindros", "Cilindros de rueda"], ["mangueras", "Mangueras"], ["servofrenos", "Servofrenos"],
  ["cables", "Cables de estacionamiento"], ["amortiguadores", "Amortiguadores"], ["resortes", "Resortes"],
  ["rotulas", "Rótulas"], ["terminales", "Terminales"], ["axiales", "Axiales"],
  ["bieletas", "Bieletas"], ["bujes", "Bujes"], ["brazos", "Tijeras y brazos"],
  ["rodamientos", "Cubos y rodamientos"], ["sensores", "Sensores ABS"], ["guardapolvos", "Guardapolvos"],
  ["soportes", "Soportes"],
];

function getSoporteBrandScore(product) {
  const brandSlug = cleanText(product?.brand?.slug || "");
  const brandName = cleanText(product?.brand?.name || "");
  // Marca ADS siempre primero con máxima prioridad
  if (brandSlug === "ads" || brandName === "ads") return 1000;
  if (brandSlug === "eagle-bhp" || brandName.includes("eagle")) return 800;
  if (brandSlug === "vazlo" || brandName.includes("vazlo")) return 700;
  if (brandSlug === "corteco" || brandName.includes("corteco")) return 600;
  if (brandSlug === "verke" || brandName.includes("verke")) return 500;
  if (brandSlug === "moog" || brandName.includes("moog")) return 400;
  if (brandSlug === "gti" || brandName.includes("gti")) return 300;
  if (brandSlug && brandSlug !== "marca-segun-empaque") return 200;
  return 100;
}

function isMotorMountProduct(product) {
  const searchable = cleanText(`${product?.name || ""} ${product?.shortDesc || ""} ${product?.description || ""}`);
  return /soporte.*(motor|caja|transmi|hidraulico|torsion|derech|izquierd|traser|delanter)/i.test(searchable);
}

function sortSoportesByBrand(productsList) {
  return [...productsList].sort((a, b) => {
    const scoreA = getSoporteBrandScore(a);
    const scoreB = getSoporteBrandScore(b);
    if (scoreB !== scoreA) return scoreB - scoreA;
    const motorA = isMotorMountProduct(a) ? 1 : 0;
    const motorB = isMotorMountProduct(b) ? 1 : 0;
    if (motorB !== motorA) return motorB - motorA;
    const brandA = a.brand?.name || "";
    const brandB = b.brand?.name || "";
    if (brandA !== brandB && brandA !== "Marca según empaque" && brandB !== "Marca según empaque") {
      return brandA.localeCompare(brandB, "es");
    }
    return (a.name || "").localeCompare(b.name || "", "es");
  });
}

function filterSlug(value = "") {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function normalizeCatalogText(value = "") {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export async function generateMetadata({ searchParams }) {
  const resolvedParams = await searchParams;
  const categoryParam = resolvedParams?.category === "partes-electricas"
    ? "electrico-y-encendido"
    : resolvedParams?.category;
  const brandParam = resolvedParams?.brand;
  const tipoParam = resolvedParams?.tipo;
  const vehicleParam = resolvedParams?.vehicle;
  const partParam = resolvedParams?.part;
  const searchQuery = resolvedParams?.search || resolvedParams?.q;

  const titularPrincipal = "Repuestos para Automóviles de Todas las Marcas";
  let title = titularPrincipal;
  let description =
    "Encuentra repuestos originales y alternativos para automóviles de todas las marcas en Rembert Repuestos BCA Barrancabermeja. Filtros, lubricantes, frenos, radiadores y más con envíos a toda Colombia.";

  if (categoryParam) {
    description = `Venta de repuestos, filtros y accesorios para automóviles de todas las marcas al mejor precio en Rembert Repuestos BCA Barrancabermeja. Envíos seguros a todo el país.`;
  }

  if (brandParam) {
    const brand = BRAND_SEO[brandParam];
    const brandName = brand?.name || brandParam.charAt(0).toUpperCase() + brandParam.slice(1);
    title = brand?.title || `${titularPrincipal} - ${brandName}`;
    description = brand?.description || `Catálogo de repuestos automotrices para ${brandName} y todas las marcas en Barrancabermeja. Filtros y piezas originales en Rembert Repuestos BCA.`;
  }

  if (searchQuery) {
    title = `${titularPrincipal} - ${searchQuery}`;
  }

  const queryParams = new URLSearchParams();
  if (categoryParam) queryParams.set("category", categoryParam);
  if (brandParam) queryParams.set("brand", brandParam);
  if (tipoParam) queryParams.set("tipo", tipoParam);
  if (vehicleParam) queryParams.set("vehicle", vehicleParam);
  if (partParam) queryParams.set("part", partParam);
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
      title: titularPrincipal,
      description,
      url: `${siteUrl}${canonicalPath}`,
      siteName: "REMBERT Repuestos BCA",
      type: "website",
      images: [
        {
          url: `${siteUrl}/logo.png`,
          width: 1011,
          height: 387,
          alt: "REMBERT - Repuestos para Automóviles de Todas las Marcas",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: titularPrincipal,
      description,
      images: [`${siteUrl}/logo.png`],
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

const defaultFilterSystems = "Aceite · aire · combustible · cabina";
const gasolineFilterApplications = [
  ["Chevrolet", "Spark, Spark GT, Onix, Sail, Aveo, Tracker", defaultFilterSystems],
  ["Renault", "Kwid, Sandero, Logan, Stepway, Duster, Duster Oroch", defaultFilterSystems],
  ["Toyota", "Yaris, Corolla, Etios, RAV4, Fortuner", defaultFilterSystems],
  ["Kia", "Picanto, Rio, Cerato, Sportage, Sonet", defaultFilterSystems],
  ["Mazda", "Mazda 2, Mazda 3, CX-3, CX-5", defaultFilterSystems],
  ["Hyundai", "i10, Grand i10, Accent, Elantra, Tucson, Creta", defaultFilterSystems],
  ["Ford", "Fiesta, EcoSport, Escape, Focus, Ranger gasolina", defaultFilterSystems],
  ["Nissan", "March, Versa, Sentra, Kicks, X-Trail", defaultFilterSystems],
  ["Volkswagen", "Gol, Voyage, Polo, Virtus, T-Cross", defaultFilterSystems],
  ["Mitsubishi", "Lancer, ASX, Outlander, Montero gasolina", defaultFilterSystems],
  ["Honda", "Fit, City, Civic, HR-V, CR-V", defaultFilterSystems],
  ["Suzuki", "Alto, Swift, Celerio, Vitara, S-Cross", defaultFilterSystems],
  ["BMW", "Serie 1, Serie 3, Serie 5, X1, X3 gasolina", defaultFilterSystems],
];

const defaultBrakeSystems = "Pastillas · discos · amortiguadores · terminales";
const gasolineBrakeApplications = [
  ["Chevrolet", "Spark, Spark GT, Aveo, Optra, Sail, Onix, Tracker y Montana", "Pastillas · discos · bandas · amortiguadores · terminales"],
  ["Renault", "Kwid, Logan, Sandero, Stepway, Duster, Oroch y Captur", "Pastillas · discos · campanas · amortiguadores · rótulas"],
  ["Nissan", "March, Versa, Sentra, Kicks, Qashqai y X-Trail", "Pastillas · discos · amortiguadores · axiales · terminales"],
  ["Toyota", "Yaris, Corolla, Etios, RAV4, Rush y Hilux gasolina", "Pastillas · discos · bandas · amortiguadores · bujes"],
  ["Kia", "Picanto, Rio, Cerato, Soul, Sonet y Sportage", "Pastillas · discos · amortiguadores · rótulas · axiales"],
  ["Hyundai", "i10, Grand i10, Accent, HB20, Elantra, Creta y Tucson", "Pastillas · discos · amortiguadores · terminales · bujes"],
  ["Volkswagen", "Gol, Voyage, Saveiro, Fox, Polo, Virtus y T-Cross", "Pastillas · discos · campanas · amortiguadores · rótulas"],
  ["Mazda", "Mazda 2, Mazda 3, Mazda 6, CX-3, CX-30 y CX-5", "Pastillas · discos · amortiguadores · axiales · terminales"],
  ["Ford", "Fiesta, Focus, EcoSport, Escape, Edge y Ranger gasolina", "Pastillas · discos · bandas · amortiguadores · rótulas"],
  ["Suzuki", "Alto, Celerio, Swift, Baleno, Jimny, Vitara y S-Cross", "Pastillas · discos · bandas · amortiguadores · terminales"],
  ["Honda", "Fit, City, Civic, Accord, HR-V y CR-V", "Pastillas · discos · amortiguadores · rótulas · bujes"],
  ["Mitsubishi", "Lancer, Mirage, ASX, Outlander y Montero gasolina", "Pastillas · discos · amortiguadores · terminales · bujes"],
  ["Peugeot", "206, 207, 208, 301, 2008 y 3008 gasolina", "Pastillas · discos · amortiguadores · axiales · rótulas"],
  ["SEAT", "Ibiza, Córdoba, León, Toledo, Arona y Ateca", defaultBrakeSystems],
  ["Škoda", "Fabia, Octavia, Rapid, Scala, Kamiq y Karoq", "Pastillas · discos · amortiguadores · rótulas · axiales"],
  ["Daihatsu", "Mira, Cuore, Sirion, Terios, Bego y Gran Max gasolina", "Pastillas · discos · bandas · amortiguadores · terminales"],
  ["Daewoo", "Tico, Matiz, Lanos, Nubira, Espero y Leganza", "Pastillas · discos · bandas · amortiguadores · rótulas"],
  ["BMW", "Serie 1, Serie 3, Serie 5, X1 y X3 gasolina", "Pastillas · discos · sensores · amortiguadores · brazos"],
].map(([brand, models, systems]) => ({
  brand,
  logo: `/logos/autos/${brand.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}.svg`,
  models,
  systems,
}));

const filterVisualImgs = [
  "/filtro-aceite-gasolina-catalogo.png",
  "/filtro-aire-gasolina-catalogo.png",
  "/filtro-cabina-gasolina-catalogo.png",
  "/filtro-combustible-gasolina-catalogo.png",
];
const gasolineFilterBrandVisuals = Object.fromEntries([
  ["Chevrolet", 0], ["Renault", 1], ["Toyota", 2], ["Kia", 3],
  ["Mazda", 0], ["Hyundai", 1], ["Ford", 2], ["Nissan", 3],
  ["Volkswagen", 0], ["Mitsubishi", 1], ["Honda", 2], ["Suzuki", 3], ["BMW", 0],
].map(([brand, imgIdx]) => [
  brand,
  { logo: `/logos/autos/${brand.toLowerCase()}.svg`, image: filterVisualImgs[imgIdx] },
]));

function getPageNumber(value) {
  const page = Number.parseInt(value, 10);
  return Number.isSafeInteger(page) && page > 0 ? page : 1;
}

function filterFallbackCatalog({ categoryParam, brandParam, tipoParam, lineParam, makeParam, modelParam, vehicleParam, partParam, searchQuery }) {
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
    const brandClean = cleanText(brandParam);
    const brandVariants = [
      brandClean,
      brandClean.replace(/-/g, " "),
      brandClean.replace(/\s+/g, "-"),
    ].filter(Boolean);

    filtered = filtered.filter((product) => {
      const pBrandSlug = cleanText(product.brand?.slug);
      const pBrandName = cleanText(product.brand?.name);
      const pName = cleanText(product.name);
      const pLine = cleanText(product.inventoryLine);
      const pFitmentSummary = cleanText(product.fitmentSummary);
      const pFitments = (product.fitments || [])
        .map((f) => cleanText(`${f.make || ""} ${f.model || ""}`))
        .join(" ");
      const pAttributes = (product.attributes || [])
        .map((a) => cleanText(`${a.name || ""} ${a.value || ""}`))
        .join(" ");
      const pDesc = cleanText(`${product.shortDesc || ""} ${product.description || ""}`);
      const fullText = `${pName} ${pLine} ${pFitmentSummary} ${pFitments} ${pAttributes} ${pDesc}`;

      if (pBrandSlug === brandClean || pBrandName === brandClean || pBrandName.includes(brandClean)) {
        return true;
      }

      // GTI también aparece como versión de vehículo (Aveo GTI, Racer GTI).
      // En este filtro sólo deben entrar referencias cuya marca sea realmente GTI.
      if (brandClean === "gti") return false;

      return brandVariants.some((variant) => {
        const safeRegexStr = variant.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(`(?:^|[^a-z0-9])${safeRegexStr}(?:[^a-z0-9]|$)`, "i");
        return regex.test(fullText);
      });
    });
  }

  if (lineParam) {
    filtered = filtered.filter((product) => product.inventoryLine === lineParam);
  }

  if (makeParam || modelParam || vehicleParam) {
    filtered = filterProductsByVehicle(filtered, {
      make: makeParam,
      model: modelParam,
      vehicle: vehicleParam,
    });
  }

  if (partParam && PART_FILTERS[partParam]) {
    filtered = filtered.filter((product) => {
      const attributes = (product.attributes || []).map((attribute) => `${attribute.name || ""} ${attribute.value || ""}`).join(" ");
      const searchable = normalizeCatalogText(`${product.name} ${product.shortDesc || ""} ${product.description || ""} ${attributes}`);
      return PART_FILTERS[partParam].some((term) => searchable.includes(normalizeCatalogText(term)));
    });
  }

  if (searchQuery) {
    filtered = searchAndRankProducts(filtered, searchQuery);
  }

  return filtered;
}

// Índices inmutables calculados una vez por instancia del Worker. Antes se
// recorría el inventario completo 18 veces en cada solicitud del catálogo.
const fallbackCatalogBrands = Array.from(
  new Map(
    fallbackCatalogProducts
      .filter((product) => product.brand?.slug)
      .map((product) => [product.brand.slug, product.brand])
  ).values()
).sort((a, b) => a.name.localeCompare(b.name, "es"));

const brakeVehicleAvailability = (() => {
  const applications = gasolineBrakeApplications.map(({ brand }) => ({
    brand,
    normalizedBrand: normalizeCatalogText(brand),
    count: 0,
  }));
  const brakeProducts = filterFallbackCatalog({
    categoryParam: "frenos-y-suspension",
    brandParam: "",
    tipoParam: "",
    lineParam: "",
    vehicleParam: "",
    partParam: "",
    searchQuery: "",
  });

  for (const product of brakeProducts) {
    const attributes = (product.attributes || [])
      .map((attribute) => `${attribute.name || ""} ${attribute.value || ""}`)
      .join(" ");
    const searchable = normalizeCatalogText(
      `${product.name} ${product.shortDesc || ""} ${product.description || ""} ${attributes}`
    );
    for (const application of applications) {
      if (searchable.includes(application.normalizedBrand)) application.count += 1;
    }
  }

  return new Map(applications.map(({ brand, count }) => [brand, count]));
})();

export default async function Catalogo({ searchParams }) {
  const resolvedParams = await searchParams;
  const categoryParam = resolvedParams?.category === "partes-electricas"
    ? "electrico-y-encendido"
    : resolvedParams?.category;
  const brandParam = resolvedParams?.brand;
  const tipoParam = resolvedParams?.tipo;
  const lineParam = resolvedParams?.line;
  const makeParam = resolvedParams?.make;
  const modelParam = resolvedParams?.model;
  const vehicleParam = resolvedParams?.vehicle;
  const partParam = resolvedParams?.part;
  const searchQuery = resolvedParams?.search || resolvedParams?.q;
  const requestedPage = getPageNumber(resolvedParams?.page);
  const sortParam = ["recent", "price-asc", "price-desc"].includes(resolvedParams?.sort)
    ? resolvedParams.sort
    : "recent";

  const requiresPriceSort = sortParam.startsWith("price");

  let fetchedProducts = [];
  let totalProducts = 0;
  let brands = [];
  let gtiAvailabilitySummary = null;

  const applyFallbackCatalog = () => {
    let filtered = filterFallbackCatalog({ categoryParam, brandParam, tipoParam, lineParam, makeParam, modelParam, vehicleParam, partParam, searchQuery });
    if (brandParam === "gti") {
      const isAvailable = (product) => Boolean(product.inStock && Number(product.stock) > 0);
      const available = filtered.filter(isAvailable).length;
      gtiAvailabilitySummary = { available, quoteOnly: filtered.length - available };
      filtered = [...filtered].sort((left, right) => Number(isAvailable(right)) - Number(isAvailable(left)));
    } else if (
      categoryParam === "soportes-retenedores-y-guayas" ||
      partParam === "soportes" ||
      tipoParam === "soportes" ||
      (!searchQuery && lineParam === "SOPORTES")
    ) {
      filtered = sortSoportesByBrand(filtered);
    }
    totalProducts = filtered.length;
    fetchedProducts = requiresPriceSort
      ? filtered
      : filtered.slice((requestedPage - 1) * PAGE_SIZE, requestedPage * PAGE_SIZE);
    brands = fallbackCatalogBrands;
  };

  // INVENTARIO GENERAL es la única fuente de publicación pública. La base de
  // datos conserva usuarios, pedidos y favoritos, pero no puede reintroducir
  // productos ausentes del documento autorizado.
  applyFallbackCatalog();

  const currentPage = requestedPage;
  const totalPages = Math.max(1, Math.ceil(totalProducts / PAGE_SIZE));
  if (totalProducts > 0 && requestedPage > totalPages) {
    redirect(buildCatalogHref({
      category: categoryParam,
      brand: brandParam,
      tipo: tipoParam,
      line: lineParam,
      make: makeParam,
      model: modelParam,
      vehicle: vehicleParam,
      part: partParam,
      search: searchQuery,
      sort: sortParam,
      page: totalPages,
    }));
  }

  // Los favoritos se hidratan desde el navegador solo para usuarios autenticados.
  // Así la tienda pública no depende de una llamada remota para poder renderizar.
  const favoriteProductIds = [];

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
    "frenos-y-suspension": ["Frenos, dirección y suspensión para vehículos a gasolina", "Pastillas, discos, freno hidráulico, sensores ABS, amortiguación, rótulas, terminales, axiales, bieletas, bujes y tijeras con validación por vehículo."],
    "lubricantes-gasolina": ["Lubricantes gasolina y livianos", "Aceites sintéticos y minerales para motores a gasolina."],
    transmision: ["Cajas y transmisiones automotrices", "Transmisiones manuales, automáticas y CVT para vehículos de las principales marcas."],
    "electrico-y-encendido": ["PARTES ELÉCTRICAS", "Bobinas, sensores, motoventiladores, bujías y componentes seleccionados por referencia, motor y VIN."],
    "motor-y-distribucion": ["Motor y distribución", "Kits de distribución, correas, tensores, poleas y bombas de agua."],
    embrague: ["Embragues y clutch", "Kits de prensa, disco y rodamiento con validación por VIN."],
    "rodamientos-y-traccion": ["Rodamientos y tracción", "Rodamientos, cubos y componentes de rueda según eje y sistema ABS."],
    hidraulico: ["Aceites hidráulicos", "Fluidos para sistemas hidráulicos móviles e industriales."],
    coolant: ["Refrigerantes y coolant", "Refrigerantes de larga vida y anticongelantes para sistemas de enfriamiento."],
    "grasas-y-aditivos": ["Grasas y aditivos", "Protección para pasadores, bujes, rodamientos y aplicaciones de servicio severo."],
    radiadores: ["Radiadores y sistema de refrigeración", "Radiadores de aluminio y cobre, tapas presurizadas, termostatos y refrigerantes para autos y camiones."],
    urea: ["Urea automotriz (AdBlue / DEF)", "Solución para reducción de emisiones en sistemas SCR."],
    "mangueras-y-tubos": ["Mangueras y tubos automotrices", "Líneas de refrigeración, admisión, freno y combustible seleccionadas por medidas, posición y referencia OE."],
    "soportes-retenedores-y-guayas": ["Soportes de motor, caja y suspensión", "Soportes de motor, amortiguador y transmisión clasificados por marca (ADS, Eagle BHP, Vazlo) y retenedores con validación técnica."],
  };
  let [bannerTitle, bannerSubtitle] = banners[categoryParam] || [
    "Catálogo completo",
    "Repuestos, lubricantes y filtros para vehículos y maquinaria.",
  ];
  if (categoryParam === "filtros" && tipoParam) bannerSubtitle += ` Tipo: ${tipoParam}.`;
  if (vehicleParam) {
    bannerTitle = `${partParam ? `${partParam.replace(/-/g, " ")} para` : "Repuestos compatibles con"} ${vehicleParam}`;
    bannerSubtitle = "Resultados técnicos por aplicación vehicular. Confirma año, motor, versión, eje y VIN antes de comprar.";
  }
  if (brandParam) {
    const brandName = brands.find((brand) => brand.slug === brandParam)?.name || brandParam;
    bannerTitle = brandParam === "gti" ? "Catálogo GTI AUTOPARTS" : `Productos ${brandName}`;
    bannerSubtitle = brandParam === "gti"
      ? "Referencias con existencia primero; catálogo externo separado para cotización. Cada aplicación se confirma por referencia, VIN, transmisión, lado, estrías y ABS."
      : brandParam === "caterpillar"
      ? "Lubricantes y fluidos CAT seleccionados por relevancia técnica y presencia en el mercado colombiano."
      : `Productos disponibles de la marca ${brandName}.`;
  }

  if (lineParam) {
    bannerTitle = `Línea ${lineParam}`;
    bannerSubtitle = `Referencias con existencia clasificadas en la línea oficial ${lineParam} del inventario.`;
  }

  const sharedFilters = { brand: brandParam, line: lineParam, vehicle: vehicleParam, part: partParam, search: searchQuery, sort: sortParam };
  const categoryHref = (category, tipo) => buildCatalogHref({ ...sharedFilters, category, tipo });
  const pageHref = (page) => buildCatalogHref({
    category: categoryParam,
    brand: brandParam,
    tipo: tipoParam,
    line: lineParam,
    vehicle: vehicleParam,
    part: partParam,
    search: searchQuery,
    sort: sortParam,
    page,
  });

  const hasActiveFilters = !!(categoryParam || brandParam || searchQuery || tipoParam || lineParam || makeParam || modelParam || vehicleParam || partParam);
  const backHref = hasActiveFilters ? "/catalogo" : "/";

  const activePills = [];
  if (searchQuery) {
    activePills.push({
      label: `Búsqueda: "${searchQuery}"`,
      href: buildCatalogHref({ category: categoryParam, brand: brandParam, tipo: tipoParam, line: lineParam, make: makeParam, model: modelParam, vehicle: vehicleParam, part: partParam, sort: sortParam }),
    });
  }
  if (categoryParam) {
    activePills.push({
      label: `Categoría: ${categoryParam}`,
      href: buildCatalogHref({ brand: brandParam, search: searchQuery, line: lineParam, make: makeParam, model: modelParam, vehicle: vehicleParam, part: partParam, sort: sortParam }),
    });
  }
  if (brandParam) {
    const brandName = brands.find((b) => b.slug === brandParam)?.name || brandParam;
    activePills.push({
      label: `Marca: ${brandName}`,
      href: buildCatalogHref({ category: categoryParam, search: searchQuery, tipo: tipoParam, line: lineParam, make: makeParam, model: modelParam, vehicle: vehicleParam, part: partParam, sort: sortParam }),
    });
  }
  if (lineParam) {
    activePills.push({
      label: `Línea: ${lineParam}`,
      href: buildCatalogHref({ category: categoryParam, brand: brandParam, search: searchQuery, tipo: tipoParam, make: makeParam, model: modelParam, vehicle: vehicleParam, part: partParam, sort: sortParam }),
    });
  }
  if (makeParam) {
    activePills.push({
      label: `Auto Marca: ${makeParam}`,
      href: buildCatalogHref({ category: categoryParam, brand: brandParam, search: searchQuery, tipo: tipoParam, line: lineParam, model: modelParam, vehicle: vehicleParam, part: partParam, sort: sortParam }),
    });
  }
  if (modelParam) {
    activePills.push({
      label: `Auto Modelo: ${modelParam}`,
      href: buildCatalogHref({ category: categoryParam, brand: brandParam, search: searchQuery, tipo: tipoParam, line: lineParam, make: makeParam, vehicle: vehicleParam, part: partParam, sort: sortParam }),
    });
  }
  if (vehicleParam) {
    activePills.push({
      label: `Vehículo: ${vehicleParam}`,
      href: buildCatalogHref({ category: categoryParam, brand: brandParam, search: searchQuery, tipo: tipoParam, line: lineParam, part: partParam, sort: sortParam }),
    });
  }
  if (partParam) {
    activePills.push({
      label: `Repuesto: ${partParam.replace(/-/g, " ")}`,
      href: buildCatalogHref({ category: categoryParam, brand: brandParam, search: searchQuery, tipo: tipoParam, line: lineParam, make: makeParam, model: modelParam, vehicle: vehicleParam, sort: sortParam }),
    });
  }

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

  const catalogItemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": bannerTitle,
    "description": bannerSubtitle,
    "url": `${siteUrl}/catalogo`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": totalProducts,
      "itemListElement": products.slice(0, 24).map((product, index) => {
        const itemUrl = `${siteUrl}/producto/${product.slug || product.id}`;
        const itemImage = product.image || (product.images && product.images[0]?.url) || `${siteUrl}/logo.png`;
        const itemBrand = product.brand?.name || product.brand || "REMBERT";
        return {
          "@type": "ListItem",
          "position": (currentPage - 1) * PAGE_SIZE + index + 1,
          "name": product.name,
          "url": itemUrl,
          "item": {
            "@type": "Product",
            "name": product.name,
            "url": itemUrl,
            "image": itemImage.startsWith("http") ? itemImage : `${siteUrl}${itemImage}`,
            "sku": product.sku || product.id,
            "brand": {
              "@type": "Brand",
              "name": itemBrand,
            },
            ...(product.price > 0 ? {
              "offers": {
                "@type": "Offer",
                "priceCurrency": "COP",
                "price": product.price,
                "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
              }
            } : {})
          }
        };
      }),
    },
  };

  const structuredData = [breadcrumbJsonLd, catalogItemListJsonLd];

  return (
    <main className="main-container section catalog-layout">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <CatalogSidebar
        categoryParam={categoryParam}
        brandParam={brandParam}
        tipoParam={tipoParam}
        lineParam={lineParam}
        makeParam={makeParam}
        modelParam={modelParam}
        vehicleParam={vehicleParam}
        partParam={partParam}
        searchQuery={searchQuery}
        sortParam={sortParam}
      />
      <div className="catalog-content">
        <header className="catalog-banner">
          <h1>{bannerTitle}</h1>
          <p>{bannerSubtitle}</p>
        </header>

        {/* Selector Dinámico de Marca y Modelo de Autos */}
        <VehicleFilterSelector
          activeMake={makeParam}
          activeModel={modelParam}
          activeVehicle={vehicleParam}
          categoryParam={categoryParam}
          brandParam={brandParam}
          tipoParam={tipoParam}
          lineParam={lineParam}
          sortParam={sortParam}
        />

        {categoryParam === "electrico-y-encendido" && !brandParam && !searchQuery && (
          <section
            aria-label="PARTES ELÉCTRICAS"
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "3 / 1",
              minHeight: "180px",
              maxHeight: "430px",
              marginBottom: "1.5rem",
              overflow: "hidden",
              borderRadius: "18px",
              background: "#050505",
              border: "1px solid rgba(255, 212, 0, 0.45)",
              boxShadow: "0 14px 36px rgba(0, 0, 0, 0.2)",
            }}
          >
            <Image
              src="/catalogo-electricos-neon-rembert.webp"
              alt="Bujías, bobinas, cables y sensores automotrices sobre fondo neón amarillo REMBERT"
              fill
              priority
              sizes="(max-width: 900px) 100vw, 75vw"
              style={{ objectFit: "cover" }}
            />
          </section>
        )}

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

        {categoryParam === "frenos-y-suspension" && !brandParam && !searchQuery && !vehicleParam && !partParam && !lineParam && (
          <div className="catalog-priority-showcase">
            <VerkePriorityShowcase
              inventoryCount={inventoryLineSummary.find((entry) => entry.name === "AMORTIGUADORES")?.count || 0}
            />
          </div>
        )}

        {/* Píldoras de Filtros Activos con Botón de Limpiar */}
        {activePills.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.45rem", margin: "0 0 0.85rem" }}>
            <span style={{ fontSize: "0.78rem", color: "#64748B", fontWeight: "700" }}>Filtros activos:</span>
            {activePills.map((pill, idx) => (
              <Link
                key={idx}
                href={pill.href}
                style={{
                  background: "#FFFBE6",
                  border: "1px solid rgba(212, 160, 0, 0.4)",
                  borderRadius: "999px",
                  color: "#8C6B00",
                  fontSize: "0.76rem",
                  fontWeight: "700",
                  padding: "0.2rem 0.55rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  textDecoration: "none",
                }}
                title="Quitar este filtro"
              >
                <span>{pill.label}</span>
                <span style={{ fontSize: "0.72rem", fontWeight: "900", color: "#EF4444" }}>✕</span>
              </Link>
            ))}
            <Link
              href="/catalogo"
              style={{
                fontSize: "0.76rem",
                color: "#DC2626",
                fontWeight: "700",
                textDecoration: "underline",
                marginLeft: "0.2rem",
              }}
            >
              Limpiar todo
            </Link>
          </div>
        )}

        {brandParam === "gti" && gtiAvailabilitySummary && (
          <section
            aria-label="Disponibilidad del catálogo GTI AUTOPARTS"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "0.75rem",
              margin: "0 0 1rem",
            }}
          >
            <div style={{ border: "1px solid rgba(22, 163, 74, 0.45)", borderRadius: "12px", padding: "0.85rem 1rem", background: "rgba(22, 163, 74, 0.08)" }}>
              <strong style={{ display: "block", color: "#15803D", fontSize: "1.35rem" }}>{gtiAvailabilitySummary.available}</strong>
              <span style={{ fontWeight: "800" }}>referencias con existencia</span>
              <p style={{ margin: "0.3rem 0 0", fontSize: "0.8rem", color: "#475569" }}>Se muestran primero y conservan su inventario independiente.</p>
            </div>
            <div style={{ border: "1px solid rgba(202, 138, 4, 0.5)", borderRadius: "12px", padding: "0.85rem 1rem", background: "rgba(250, 204, 21, 0.09)" }}>
              <strong style={{ display: "block", color: "#A16207", fontSize: "1.35rem" }}>{gtiAvailabilitySummary.quoteOnly}</strong>
              <span style={{ fontWeight: "800" }}>sin existencia · consultar</span>
              <p style={{ margin: "0.3rem 0 0", fontSize: "0.8rem", color: "#475569" }}>Catálogo externo para cotización; una foto sólo se asigna si corresponde a la referencia exacta.</p>
              {gtiAvailabilitySummary.quoteOnly > 0 && !searchQuery && !categoryParam && !lineParam && !vehicleParam && !partParam && (
                <Link
                  href={`${pageHref(Math.floor(gtiAvailabilitySummary.available / PAGE_SIZE) + 1)}#productos`}
                  style={{ display: "inline-block", marginTop: "0.45rem", color: "#854D0E", fontWeight: "800", textDecoration: "underline" }}
                >
                  Ir a referencias para cotizar
                </Link>
              )}
            </div>
          </section>
        )}

        <div id="productos" className="catalog-toolbar">
          <p>Mostrando <strong>{firstProduct}-{lastProduct}</strong> de <strong>{totalProducts}</strong> producto(s)</p>
          <form action="/catalogo" method="get" className="catalog-sort-form">
            {categoryParam && <input type="hidden" name="category" value={categoryParam} />}
            {brandParam && <input type="hidden" name="brand" value={brandParam} />}
            {tipoParam && <input type="hidden" name="tipo" value={tipoParam} />}
            {lineParam && <input type="hidden" name="line" value={lineParam} />}
            {makeParam && <input type="hidden" name="make" value={makeParam} />}
            {modelParam && <input type="hidden" name="model" value={modelParam} />}
            {vehicleParam && <input type="hidden" name="vehicle" value={vehicleParam} />}
            {partParam && <input type="hidden" name="part" value={partParam} />}
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
          <CatalogPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalProducts={totalProducts}
            queryFilters={{
              category: categoryParam,
              brand: brandParam,
              tipo: tipoParam,
              line: lineParam,
              make: makeParam,
              model: modelParam,
              vehicle: vehicleParam,
              part: partParam,
              search: searchQuery,
              sort: sortParam,
            }}
          />
        )}

        {categoryParam === "frenos-y-suspension" && !brandParam && !searchQuery && !vehicleParam && !partParam && !lineParam && (
          <div className="catalog-secondary-showcase">
            <RowenPriorityShowcase />
          </div>
        )}

        {categoryParam === "frenos-y-suspension" && !brandParam && !searchQuery && !vehicleParam && !partParam && (
          <section className="filter-showcase brake-application-showcase" aria-labelledby="brake-applications-title">
            <div className="filter-showcase__heading">
              <div>
                <p className="filter-showcase__eyebrow">Catálogo para automóviles y pickups a gasolina</p>
                <h2 id="brake-applications-title">Encuentra frenos y suspensión por vehículo</h2>
              </div>
              <p>Explora la cobertura por marca y solicita la referencia exacta con los datos de tu vehículo. Confirmamos aplicación antes del despacho.</p>
            </div>
            <div className="vehicle-catalog-summary" aria-label="Cobertura del catálogo">
              <div><strong>{gasolineBrakeApplications.length}</strong><span>marcas cubiertas</span></div>
              <div><strong>5+</strong><span>familias por vehículo</span></div>
              <div><strong>VIN</strong><span>validación antes de compra</span></div>
              <div><strong>Colombia</strong><span>envíos nacionales</span></div>
            </div>
            <nav className="smart-parts-menu" aria-label="Buscar frenos, dirección y suspensión por tipo de repuesto">
              <strong>Buscar por repuesto:</strong>
              <div>
                {SMART_BRAKE_FAMILIES.map(([part, label]) => (
                  <Link
                    key={part}
                    href={`${buildCatalogHref({ category: "frenos-y-suspension", part })}#productos`}
                    className={partParam === part ? "is-active" : ""}
                    aria-current={partParam === part ? "page" : undefined}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </nav>
            <div className="filter-showcase__grid filter-showcase__grid--vehicles">
              {gasolineBrakeApplications.map(({ brand, logo, models, systems }) => {
                const availableCount = brakeVehicleAvailability.get(brand) || 0;
                const compatibilityQuery = `Hola Rembert, necesito confirmar un repuesto de frenos o suspensión para ${brand}. Modelo: ___ Año: ___ Motor: ___ VIN: ___`;
                return (
                <article key={brand} className="filter-showcase__card filter-showcase__card--application vehicle-application-card">
                  <div className="vehicle-application-card__header">
                    <div className="vehicle-application-card__logo">
                      <Image src={logo} alt={`Logo ${brand}`} width={92} height={52} />
                    </div>
                    <span>Gasolina</span>
                  </div>
                  <div className="filter-showcase__copy">
                    <h3>{brand}</h3>
                    <p><strong>Modelos:</strong> {models}</p>
                    <div className="vehicle-part-links" aria-label={`Repuestos disponibles para ${brand}`}>
                      <strong>Encuentra:</strong>
                      {systems.split(" · ").map((partName) => (
                        <Link
                          key={partName}
                          href={`${buildCatalogHref({ category: "frenos-y-suspension", vehicle: brand, part: filterSlug(partName) })}#productos`}
                        >
                          {partName}
                        </Link>
                      ))}
                    </div>
                    {availableCount > 0 ? (
                      <Link href={`${buildCatalogHref({ category: "frenos-y-suspension", vehicle: brand })}#productos`}>
                        Ver {availableCount} referencias disponibles <span aria-hidden="true">→</span>
                      </Link>
                    ) : (
                      <a
                        href={`https://wa.me/573508299233?text=${encodeURIComponent(compatibilityQuery)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Solicitar compatibilidad <span aria-hidden="true">→</span>
                      </a>
                    )}
                  </div>
                </article>
                );
              })}
            </div>
            <aside className="vehicle-fitment-cta" aria-label="Ayuda para confirmar compatibilidad">
              <div>
                <p className="filter-showcase__eyebrow">Compra segura</p>
                <h3>¿No encuentras tu modelo o no conoces la referencia?</h3>
                <p>Envíanos marca, modelo, año, motorización, versión y VIN. Para frenos también confirma eje delantero o trasero y si utiliza ABS.</p>
              </div>
              <a
                href="https://wa.me/573508299233?text=Hola%20Rembert%2C%20necesito%20confirmar%20un%20repuesto%20de%20frenos%20o%20suspensi%C3%B3n.%20Marca%3A%20___%20Modelo%3A%20___%20A%C3%B1o%3A%20___%20Motor%3A%20___%20VIN%3A%20___"
                target="_blank"
                rel="noopener noreferrer"
                className="vehicle-fitment-cta__button"
              >
                Confirmar por WhatsApp
              </a>
            </aside>
            <p className="vehicle-fitment-note">Las aplicaciones publicadas son una guía de búsqueda. La referencia final depende de VIN, año, motor, versión, eje, medidas y configuración ABS.</p>
          </section>
        )}
      </div>
    </main>
  );
}
