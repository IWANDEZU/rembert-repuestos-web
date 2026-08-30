import { dynamikCiosaCatalogRefs } from "./dynamikCiosaCatalogRefs.generated.js";

const slugify = (value) => String(value || "")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/(^-|-$)/g, "");

const productTypeFor = (reference) => {
  if (reference.subgroup === "JUEGO DE EMBRAGUES") return "Kit de Embrague";
  if (reference.subgroup === "DISCOS DE FRENO") return "Disco de Freno";
  if (reference.subgroup === "ACCESORIOS DE FRENADO") return "Accesorio de Freno";
  if (/\bzapata(?:s)?\b|\btambor\b/i.test(reference.description)) return "Zapatas de Freno";
  return "Pastillas de Freno";
};

const categoryFor = (reference) => reference.subgroup === "JUEGO DE EMBRAGUES"
  ? { name: "Embrague y Transmisión", slug: "embrague-y-transmision" }
  : { name: "Frenos y Suspensión", slug: "frenos-y-suspension" };

const requirementsFor = (reference) => {
  if (reference.subgroup === "JUEGO DE EMBRAGUES") {
    return [
      "VIN o placa",
      "marca, modelo, año, motor y versión",
      "tipo y código de transmisión",
      "diámetro del disco",
      "cantidad y diámetro de estrías",
      "tipo de collarín y contenido del kit",
      `NPC exacto ${reference.sku}`,
    ];
  }
  if (reference.subgroup === "DISCOS DE FRENO") {
    return [
      "VIN o placa",
      "marca, modelo, año, motor y versión",
      "eje o posición",
      "diámetro exterior, espesor y altura",
      "diámetro de centro y perforaciones",
      "disco sólido o ventilado",
      `NPC exacto ${reference.sku}`,
    ];
  }
  if (reference.subgroup === "ACCESORIOS DE FRENADO") {
    return ["tipo de líquido o sistema", "procedimiento del fabricante", `NPC exacto ${reference.sku}`];
  }
  return [
    "VIN o placa",
    "marca, modelo, año, motor y versión",
    "eje o posición",
    "sistema y cáliper de freno",
    "forma, largo, alto y espesor",
    "herrajes o accesorios incluidos",
    `NPC exacto ${reference.sku}`,
  ];
};

const optionalAttributesFor = (reference, idPrefix) => [
  reference.canonicalNpc && {
    id: `${idPrefix}-canonical-npc`,
    name: "NPC canónico de contraste",
    value: reference.canonicalNpc,
  },
  reference.position && {
    id: `${idPrefix}-position`,
    name: "Posición publicada",
    value: reference.position,
  },
  reference.formula && {
    id: `${idPrefix}-formula`,
    name: "Formulación",
    value: reference.formula,
  },
  reference.fmsi && {
    id: `${idPrefix}-fmsi`,
    name: "Código de forma / FMSI",
    value: reference.fmsi,
  },
  reference.diameterMm && {
    id: `${idPrefix}-diameter`,
    name: "Diámetro publicado",
    value: `${reference.diameterMm} mm`,
  },
  reference.splines && {
    id: `${idPrefix}-splines`,
    name: "Estrías publicadas",
    value: String(reference.splines),
  },
  ...(reference.specifications || []).map((specification, index) => ({
    id: `${idPrefix}-spec-${index + 1}`,
    name: specification.name,
    value: specification.value,
  })),
  ...(reference.supplementalSpecifications || []).map((specification, index) => ({
    id: `${idPrefix}-supplemental-spec-${index + 1}`,
    name: `Dato complementario Ciosa México · ${specification.name}`,
    value: specification.value,
  })),
  reference.supplementalSourceUrl && {
    id: `${idPrefix}-supplemental-source`,
    name: "Fuente de datos complementarios",
    value: reference.supplementalSourceUrl,
  },
].filter(Boolean);

export const dynamikCiosaCompleteProducts = dynamikCiosaCatalogRefs.map((reference) => {
  const productType = productTypeFor(reference);
  const idPrefix = `dynamik-ciosa-${slugify(reference.sku)}`;
  const officialDescription = String(reference.description || "").trim();
  const provenanceDisclosure = reference.dataQuality === "ciosa-co-broken-detail-listing-only"
    ? " Ciosa Colombia publica esta tarjeta y NPC, pero su ficha de detalle está vacía; los campos no publicados se muestran expresamente como tales y no se inventan."
    : "";
  const supplementalDisclosure = reference.supplementalSourceUrl
    ? " Las especificaciones marcadas como complementarias provienen de la ficha del mismo NPC en Ciosa México y conservan su fuente separada."
    : "";

  return {
    id: idPrefix,
    name: `${productType} Dynamik ${reference.sku} — ${officialDescription}`,
    slug: `${slugify(productType)}-dynamik-${slugify(reference.sku)}`,
    category: categoryFor(reference),
    brand: { name: "Dynamik", slug: "dynamik" },
    price: 0,
    stock: 0,
    inStock: false,
    catalogApproval: "explicit-batch",
    catalogBatch: "dynamik-ciosa-complete-catalog-20260830",
    sku: reference.sku,
    referenceType: "official-catalog",
    fitmentStatus: "conditional",
    fitments: [],
    fitmentSummary: `Dynamik ${reference.sku}: ${officialDescription}. Confirmar la aplicación por VIN y las características físicas antes de cotizar o instalar.`,
    fitmentRequirements: requirementsFor(reference),
    fitmentSource: `CIOSA Autopartes Colombia, ficha oficial Dynamik NPC ${reference.sku}: ${reference.sourceUrl}.${provenanceDisclosure}${supplementalDisclosure}`,
    officialSourceUrl: reference.sourceUrl,
    canonicalSourceUrl: reference.canonicalSourceUrl || null,
    shortDesc: `${productType} Dynamik ${reference.sku} · ficha Ciosa Colombia · precio bajo cotización.`,
    description: `${productType} Dynamik referencia ${reference.sku}. Descripción oficial Ciosa: ${officialDescription}. Esta ficha conserva el NPC, sistema, grupo, subgrupo y especificaciones publicadas; la compatibilidad final exige validar VIN, versión, posición y geometría antes de comprar o instalar.${provenanceDisclosure}${supplementalDisclosure} La fotografía física exacta sólo se habilita después de vincularla y validarla contra este mismo NPC.`,
    image: null,
    images: [],
    imageStatus: "pending-real-photo",
    imageDisclosure: "Fotografía física exacta de esta referencia pendiente de validación; no se muestra una caja, diagrama ni pieza genérica.",
    attributes: [
      { id: `${idPrefix}-npc`, name: "NPC", value: reference.sku },
      { id: `${idPrefix}-official-description`, name: "Descripción oficial Ciosa", value: officialDescription },
      { id: `${idPrefix}-system`, name: "Sistema", value: reference.system },
      { id: `${idPrefix}-subgroup`, name: "Subgrupo", value: reference.subgroup },
      { id: `${idPrefix}-group`, name: "Grupo", value: reference.group },
      ...optionalAttributesFor(reference, idPrefix),
      { id: `${idPrefix}-source`, name: "Fuente técnica", value: reference.sourceUrl },
      { id: `${idPrefix}-photo`, name: "Estado de fotografía", value: "Fotografía física exacta pendiente de validación" },
    ],
  };
});

export default dynamikCiosaCompleteProducts;
