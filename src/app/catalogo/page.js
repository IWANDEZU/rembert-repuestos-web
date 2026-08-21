import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import CatalogGridWithModal from "@/components/CatalogGridWithModal";
import CatalogSidebar from "@/components/CatalogSidebar";
import { buildCatalogHref } from "@/lib/catalogUtils";
import { siteUrl } from "@/lib/site";
import { products as fallbackCatalogProducts } from "@/lib/products";

export const dynamic = "force-dynamic";
const PAGE_SIZE = 24;
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
};

const SMART_BRAKE_FAMILIES = [
  ["pastillas", "Pastillas"], ["discos", "Discos"], ["bandas", "Bandas y zapatas"],
  ["campanas", "Campanas"], ["mordazas", "Mordazas"], ["bombas", "Bombas maestras"],
  ["cilindros", "Cilindros de rueda"], ["mangueras", "Mangueras"], ["servofrenos", "Servofrenos"],
  ["cables", "Cables de estacionamiento"], ["amortiguadores", "Amortiguadores"], ["resortes", "Resortes"],
  ["rotulas", "Rótulas"], ["terminales", "Terminales"], ["axiales", "Axiales"],
  ["bieletas", "Bieletas"], ["bujes", "Bujes"], ["brazos", "Tijeras y brazos"],
  ["rodamientos", "Cubos y rodamientos"], ["sensores", "Sensores ABS"], ["guardapolvos", "Guardapolvos"],
];

function filterSlug(value = "") {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function normalizeCatalogText(value = "") {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export async function generateMetadata({ searchParams }) {
  const resolvedParams = await searchParams;
  const categoryParam = resolvedParams?.category;
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
    const brandName = brandParam.charAt(0).toUpperCase() + brandParam.slice(1);
    title = `${titularPrincipal} - ${brandName}`;
    description = `Catálogo oficial de repuestos automotrices para ${brandName} y todas las marcas en Barrancabermeja. Filtros y piezas originales en Rembert Repuestos BCA.`;
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

function filterFallbackCatalog({ categoryParam, brandParam, tipoParam, vehicleParam, partParam, searchQuery }) {
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

  if (vehicleParam) {
    const vehicle = normalizeCatalogText(vehicleParam);
    filtered = filtered.filter((product) => {
      const attributes = (product.attributes || []).map((attribute) => `${attribute.name || ""} ${attribute.value || ""}`).join(" ");
      return normalizeCatalogText(`${product.name} ${product.shortDesc || ""} ${product.description || ""} ${attributes}`).includes(vehicle);
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
  const vehicleParam = resolvedParams?.vehicle;
  const partParam = resolvedParams?.part;
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


  if (vehicleParam) {
    conditions.push({
      OR: [
        { name: { contains: vehicleParam } },
        { description: { contains: vehicleParam } },
        { shortDesc: { contains: vehicleParam } },
        { attributes: { some: { value: { contains: vehicleParam } } } },
      ],
    });
  }

  if (partParam && PART_FILTERS[partParam]) {
    conditions.push({
      OR: PART_FILTERS[partParam].flatMap((term) => [
        { name: { contains: term } },
        { description: { contains: term } },
        { shortDesc: { contains: term } },
        { attributes: { some: { value: { contains: term } } } },
      ]),
    });
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
    const filtered = filterFallbackCatalog({ categoryParam, brandParam, tipoParam, vehicleParam, partParam, searchQuery });
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
      getServerSession(),
    ]);
    fetchedProducts = dbProducts;
    totalProducts = dbTotal;
    brands = dbBrands;
    session = dbSession;

    // Estas líneas se administran en el catálogo versionado para que los
    // productos validados no desaparezcan cuando la BD tenga inventario parcial.
    const codeManagedCategories = new Set(["mantenimiento", "coolant", "transmision", "frenos-y-suspension"]);
    if (dbTotal === 0 || codeManagedCategories.has(categoryParam)) applyFallbackCatalog();
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
      vehicle: vehicleParam,
      part: partParam,
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
    bannerTitle = `Productos ${brandName}`;
    bannerSubtitle = brandParam === "caterpillar"
      ? "Lubricantes y fluidos CAT seleccionados por relevancia técnica y presencia en el mercado colombiano."
      : `Productos disponibles de la marca ${brandName}.`;
  }

  const sharedFilters = { brand: brandParam, vehicle: vehicleParam, part: partParam, search: searchQuery, sort: sortParam };
  const categoryHref = (category, tipo) => buildCatalogHref({ ...sharedFilters, category, tipo });
  const pageHref = (page) => buildCatalogHref({
    category: categoryParam,
    brand: brandParam,
    tipo: tipoParam,
    vehicle: vehicleParam,
    part: partParam,
    search: searchQuery,
    sort: sortParam,
    page,
  });

  const hasActiveFilters = !!(categoryParam || brandParam || searchQuery || tipoParam || vehicleParam || partParam);
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

        {categoryParam === "frenos-y-suspension" && !brandParam && !searchQuery && !vehicleParam && !partParam && (
          <section className="filter-showcase" aria-labelledby="brake-applications-title">
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
              {gasolineBrakeApplications.map(({ brand, logo, models, systems }) => (
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
                    <Link href={`${buildCatalogHref({ category: "frenos-y-suspension", vehicle: brand })}#productos`}>
                      Ver productos compatibles <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </article>
              ))}
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

        <div id="productos" className="catalog-toolbar">
          <p>Mostrando <strong>{firstProduct}-{lastProduct}</strong> de <strong>{totalProducts}</strong> producto(s)</p>
          <form action="/catalogo" method="get" className="catalog-sort-form">
            {categoryParam && <input type="hidden" name="category" value={categoryParam} />}
            {brandParam && <input type="hidden" name="brand" value={brandParam} />}
            {tipoParam && <input type="hidden" name="tipo" value={tipoParam} />}
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
