import quoteCatalog from "./gti-quote-catalog.json" with { type: "json" };

const GTI_OFFICIAL_SOURCE = "GTI Autoparts / Dispartes Colombia: https://dispartes.com/gtiautoparts/";
const GTI_EXTERNAL_CATALOG_SOURCE = "Catálogo histórico colombiano GTI (FJMB): https://dokument.pub/repuestos-puntas-y-ejes-flipbook-pdf.html";
const PENDING_EXACT_PHOTO = "/catalogo-gti/gti-foto-real-pendiente-v1.webp";

const slugify = (value) => String(value || "producto")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/(^-|-$)/g, "");

const productFamily = (description) => {
  const text = String(description || "").toUpperCase();
  if (text.includes("PUNTA EJE L/R")) return "Punta de eje · lado rueda";
  if (text.includes("PUNTA EJE L/C")) return "Punta de eje · lado caja";
  if (text.includes("EJE HOMOCINETICO")) return "Eje homocinético";
  if (text.includes("TRICETA")) return "Triceta";
  if (text.includes("G/POLVO")) return "Guardapolvo de eje";
  if (text.includes("INTERCONECCION")) return "Eje de interconexión";
  return "Componente de transmisión";
};

const productPosition = (description) => {
  const text = String(description || "").toUpperCase();
  const side = text.includes("IZQ.") || text.includes(" IZQ ")
    ? " · izquierdo"
    : text.includes("DER.") || text.includes(" DER ")
      ? " · derecho"
      : "";

  if (text.includes("L/R")) return `Eje · lado rueda${side}`;
  if (text.includes("L/C")) return `Eje · lado caja${side}`;
  if (text.includes("EJE HOMOCINETICO")) return `Eje homocinético${side}`;
  if (text.includes("TRICETA")) return "Transmisión · triceta";
  return `Transmisión${side}`;
};

const productCategory = (description) => String(description || "").toUpperCase().includes("L/R")
  ? { name: "Rodamientos y Tracción", slug: "rodamientos-y-traccion" }
  : { name: "Transmisiones", slug: "transmision" };

export const gtiQuoteCatalogProducts = quoteCatalog.map(({ reference, description, sourceUrl }) => {
  const id = `gti-cotizacion-${slugify(reference)}`;
  const family = productFamily(description);
  const position = productPosition(description);

  return {
    id,
    slug: `gti-${slugify(reference)}-${slugify(description).slice(0, 72)}`,
    name: `${description} — ${reference}`,
    category: productCategory(description),
    brand: { name: "GTI", slug: "gti" },
    price: 0,
    stock: 0,
    inStock: false,
    availabilityLabel: "Sin existencia · consultar",
    sku: reference,
    referenceType: "manufacturer",
    fitmentStatus: "conditional",
    catalogApproval: "explicit-batch",
    fitments: [],
    fitmentSummary: `${reference}: ${description}. Referencia de catálogo externo; sin existencia confirmada, consultar.`,
    fitmentRequirements: [
      "referencia GTI exacta",
      "VIN",
      "año",
      "motor",
      "transmisión",
      "lado de montaje",
      "estrías internas y externas",
      "ABS y número de dientes de corona cuando aplique",
    ],
    fitmentSource: `${GTI_OFFICIAL_SOURCE} · ${GTI_EXTERNAL_CATALOG_SOURCE} · Registro extraído de ${sourceUrl}`,
    shortDesc: `${family} GTI · ${position} · sin existencia, consultar.`,
    description: `${description}. Referencia externa ${reference} incorporada para cotización. No figura con existencia positiva en el inventario vigente de REMBERT: consulta precio y disponibilidad. La aplicación debe confirmarse por referencia, VIN, transmisión, lado, estrías y ABS. La fotografía exacta permanece pendiente; no se muestra una pieza genérica ni una geometría inventada.`,
    image: PENDING_EXACT_PHOTO,
    images: [{
      url: PENDING_EXACT_PHOTO,
      alt: `Foto exacta pendiente para ${reference}: ${description}; no se usa una pieza genérica`,
      isMain: true,
    }],
    imageStatus: "photo-pending",
    imageDisclosure: "Foto exacta pendiente · sin imagen genérica",
    attributes: [
      { id: `${id}-reference`, name: "Referencia GTI", value: reference },
      { id: `${id}-catalog-description`, name: "Descripción de catálogo", value: description },
      { id: `${id}-family`, name: "Familia", value: family },
      { id: `${id}-position`, name: "Posición orientativa", value: position },
      { id: `${id}-availability`, name: "Estado", value: "Sin existencia · consultar" },
      { id: `${id}-verification`, name: "Validación obligatoria", value: "Referencia GTI, VIN, año, motor, transmisión, lado, estrías y ABS" },
      { id: `${id}-image`, name: "Imagen", value: "Foto exacta pendiente; no se publica una pieza parecida, genérica o generada sin fuente trazable" },
    ],
  };
});
