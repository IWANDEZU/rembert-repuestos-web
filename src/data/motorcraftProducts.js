const motorcraftImage = (file) => `/catalogo-motorcraft/${file}`;

const MOTORCRAFT_FILTER_CATALOG = "Motorcraft, catálogo de filtros: https://www.motorcraft.com/content/dam/ford-motorcraft/es_mx/inicio/ecatalog/pdf/Producto-Filtros.pdf";
const MOTORCRAFT_LUBRICANT_CATALOG = "Motorcraft, aplicaciones y capacidades de lubricación: https://www.motorcraft.com/content/dam/ford-motorcraft/es_mx/inicio/ecatalog/pdf/Producto-Lubricantes.pdf";
const MOTORCRAFT_CATALOG = "Motorcraft, catálogo oficial de productos: https://www.motorcraft.com/us/en_us/home/our-products.html/1000";

const slugify = (value) => String(value || "producto")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/(^-|-$)/g, "");

function motorcraftProduct({
  reference,
  name,
  category,
  image,
  imageNote,
  fitments,
  technicalSummary,
  source,
  requirements,
  fitmentStatus = "conditional",
}) {
  const id = `motorcraft-${slugify(reference)}`;
  const compatibility = fitments
    .map(({ make, model, years, engine }) => `${make} ${model}${years ? ` ${years}` : ""}${engine ? ` · ${engine}` : ""}`)
    .join("; ");

  return {
    id,
    name,
    slug: `${slugify(name)}-${slugify(reference)}`,
    category,
    brand: { name: "Motorcraft", slug: "motorcraft" },
    price: 0,
    sku: reference,
    referenceType: "manufacturer",
    fitmentStatus,
    fitments,
    fitmentSummary: `${reference}: ${compatibility}.`,
    fitmentRequirements: requirements,
    fitmentSource: source,
    shortDesc: `${technicalSummary} Aplicación por referencia Motorcraft; confirmar VIN antes del despacho.`,
    description: `${name}, referencia ${reference}. ${technicalSummary} Aplicaciones de catálogo: ${compatibility}. La venta se realiza bajo cotización y REMBERT confirma VIN, año, motor y referencia antes de despachar.`,
    image,
    images: [{ url: image, alt: `${name} Motorcraft ${reference}`, isMain: true }],
    imageStatus: "studio-reference-derived-watermarked",
    attributes: [
      { id: `${id}-reference`, name: "Referencia Motorcraft", value: reference },
      { id: `${id}-compatibility`, name: "Compatible con", value: compatibility },
      { id: `${id}-verification`, name: "Validación antes de comprar", value: requirements.join(" · ") },
      { id: `${id}-fitment-status`, name: "Estado de compatibilidad", value: fitmentStatus === "verified" ? "Aplicación verificada por referencia de catálogo" : "Aplicación orientativa: confirmar por VIN y catálogo vigente" },
      { id: `${id}-availability`, name: "Disponibilidad", value: "Por confirmar; producto publicado para cotización" },
      { id: `${id}-image`, name: "Imagen", value: imageNote },
      { id: `${id}-source`, name: "Fuente técnica", value: source },
    ],
    catalogApproval: "explicit-batch",
    inStock: false,
    stock: 0,
  };
}

export const motorcraftProducts = [
  motorcraftProduct({
    reference: "FA-1884",
    name: "Filtro de aire de motor Motorcraft FA-1884",
    category: { name: "Filtros", slug: "filtros" },
    image: motorcraftImage("motorcraft-fa-1884-filtro-aire-rembert.webp"),
    imageNote: "Composición de estudio basada en la referencia y empaque Motorcraft FA-1884, con marca REMBERT.",
    fitments: [
      { make: "Ford", model: "Explorer", years: "según año y motorización de catálogo", engine: "Confirmar por VIN", position: "Admisión de motor" },
      { make: "Ford", model: "Flex", years: "según año y motorización de catálogo", engine: "Confirmar por VIN", position: "Admisión de motor" },
      { make: "Ford", model: "Taurus", years: "según año y motorización de catálogo", engine: "Confirmar por VIN", position: "Admisión de motor" },
    ],
    technicalSummary: "Elemento filtrante de aire para proteger el sistema de admisión; no se intercambia por apariencia o dimensiones aproximadas.",
    source: MOTORCRAFT_FILTER_CATALOG,
    requirements: ["VIN", "año", "motor", "referencia del filtro instalado", "medidas del alojamiento"],
  }),
  motorcraftProduct({
    reference: "FL-2062",
    name: "Filtro de aceite de motor Motorcraft FL-2062",
    category: { name: "Filtros", slug: "filtros" },
    image: motorcraftImage("motorcraft-fl-2062-filtro-aceite-rembert.webp"),
    imageNote: "Composición de estudio basada en la referencia y empaque Motorcraft FL-2062 / FT4Z-6731-A, con marca REMBERT.",
    fitments: [
      { make: "Ford", model: "F-150 / Edge / Police", years: "2018 en adelante según versión", engine: "2.7 L EcoBoost", position: "Lubricación de motor" },
      { make: "Ford", model: "Explorer / Explorer ST / Police Utility", years: "según catálogo", engine: "3.0 L EcoBoost", position: "Lubricación de motor" },
      { make: "Lincoln", model: "MKX / Continental / MKZ / Nautilus / Aviator", years: "según catálogo", engine: "2.7 L o 3.0 L EcoBoost según modelo", position: "Lubricación de motor" },
    ],
    technicalSummary: "Filtro tipo cartucho para motores Ford y Lincoln seleccionados; referencia de servicio Motorcraft FL-2062 y equivalente Ford FT4Z-6731-A.",
    source: MOTORCRAFT_LUBRICANT_CATALOG,
    requirements: ["VIN", "año", "modelo", "motor exacto", "referencia Ford/Motorcraft"],
    fitmentStatus: "verified",
  }),
  motorcraftProduct({
    reference: "SP-578",
    name: "Bujía de encendido Motorcraft SP-578",
    category: { name: "PARTES ELÉCTRICAS", slug: "electrico-y-encendido" },
    image: motorcraftImage("motorcraft-sp-578-bujia-rembert.webp"),
    imageNote: "Composición de estudio basada en la bujía y empaque Motorcraft SP-578, con marca REMBERT.",
    fitments: [
      { make: "Ford", model: "Edge", years: "2021; confirmar extensión de años por VIN", engine: "2.0 L EcoBoost", position: "Sistema de encendido" },
    ],
    technicalSummary: "Bujía de encendido Motorcraft; grado térmico, luz y torque dependen del código de motor y de la calibración del vehículo.",
    source: MOTORCRAFT_CATALOG,
    requirements: ["VIN", "año", "motor", "calibración", "referencia de bujía retirada", "luz especificada por Ford"],
  }),
  motorcraftProduct({
    reference: "FP-89",
    name: "Filtro de cabina Motorcraft FP-89",
    category: { name: "Filtros", slug: "filtros" },
    image: motorcraftImage("motorcraft-fp-89-filtro-cabina-rembert.webp"),
    imageNote: "Fotografía de estudio del elemento filtrante FP-89 con marca REMBERT; la imagen no presenta un empaque oficial verificable.",
    fitments: [
      { make: "Ford", model: "Explorer / Explorer ST", years: "según año y versión", engine: "Todas las motorizaciones compatibles según catálogo", position: "Habitáculo / climatización" },
      { make: "Lincoln", model: "Aviator", years: "según año y versión", engine: "Todas las motorizaciones compatibles según catálogo", position: "Habitáculo / climatización" },
    ],
    technicalSummary: "Elemento filtrante del aire de habitáculo; confirmar geometría, año y versión del sistema HVAC.",
    source: MOTORCRAFT_FILTER_CATALOG,
    requirements: ["VIN", "año", "modelo", "versión del climatizador", "referencia del filtro retirado"],
  }),
];
