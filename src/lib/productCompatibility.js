const VERIFIED_ATTRIBUTE_NAMES = ["aplicaciones verificadas", "compatibilidad verificada"];
const ORIENTATIVE_ATTRIBUTE_NAMES = [
  "cobertura orientativa", "vehículos orientativos", "vehiculos orientativos",
  "modelos orientativos", "marcas orientativas", "familia de vehículos", "familia de vehiculos",
];

const normalize = (value) => String(value || "").trim();
const normalizeName = (value) => normalize(value).toLowerCase();

function getAttributes(product) {
  return (Array.isArray(product?.attributes) ? product.attributes : [])
    .map((attribute) => ({ name: normalizeName(attribute?.name), value: normalize(attribute?.value) }))
    .filter((attribute) => attribute.name && attribute.value);
}

function findAttribute(attributes, names) {
  return attributes.find((attribute) => names.includes(attribute.name))?.value || "";
}

export function isInternalQuoteReference(productOrSku) {
  const sku = typeof productOrSku === "string" ? productOrSku : productOrSku?.sku;
  const referenceType = typeof productOrSku === "object" ? productOrSku?.referenceType : "";
  return referenceType === "internal-quote" || /(?:^|[-_])COT$/i.test(normalize(sku));
}

function getCategoryFallback(product) {
  const categorySlug = product?.category?.slug || product?.category;
  if (categorySlug === "filtros") return "La aplicación depende del motor, medidas, rosca y referencia OE del filtro instalado.";
  if (["frenos-y-suspension", "liquido-frenos"].includes(categorySlug)) return "La aplicación depende de VIN, año, motor, versión, eje, lado, ABS y medidas del sistema.";
  if (["electrico-y-encendido", "motor-y-distribucion", "embrague", "rodamientos-y-traccion"].includes(categorySlug)) return "La aplicación depende de VIN, año, código de motor, transmisión y referencia OE desmontada.";
  if (["coolant", "mantenimiento", "transmision", "lubricantes-gasolina", "grasas-y-aditivos", "siliconas"].includes(categorySlug)) return "Usar únicamente si la ficha técnica del vehículo admite esta especificación y presentación.";
  return "Confirma marca, modelo, año, motor, versión y VIN antes de comprar.";
}

/** Devuelve un estado técnico, nunca una promesa comercial genérica. */
export function getProductFitment(product) {
  const attributes = getAttributes(product);
  const explicitStatus = normalizeName(product?.fitmentStatus);
  const internalQuote = isInternalQuoteReference(product);
  const fitments = Array.isArray(product?.fitments) ? product.fitments.filter(Boolean) : [];
  const verifiedAttribute = findAttribute(attributes, VERIFIED_ATTRIBUTE_NAMES);
  const orientativeAttribute = findAttribute(attributes, ORIENTATIVE_ATTRIBUTE_NAMES);
  const validation = findAttribute(attributes, ["validación obligatoria", "validacion obligatoria", "validación", "validacion"]);

  let status = "conditional";
  if (internalQuote || explicitStatus === "family") status = "family";
  else if (explicitStatus === "verified" && fitments.length > 0) status = "verified";
  else if (explicitStatus === "conditional") status = "conditional";
  else if (fitments.length > 0 && !internalQuote) status = "verified";

  const labels = {
    verified: "Aplicación verificada por referencia",
    conditional: "Compatibilidad condicionada",
    family: "Aplicaciones por confirmar",
  };

  let summary = normalize(product?.fitmentSummary);
  if (!summary && status === "verified") {
    summary = verifiedAttribute || fitments
      .map((item) => [item.make, item.model, item.engine, item.years].filter(Boolean).join(" "))
      .join(" · ");
  }
  if (!summary && status === "family") {
    summary = orientativeAttribute
      ? `Cobertura orientativa: ${orientativeAttribute}. No corresponde a una única referencia.`
      : "Familia disponible en múltiples referencias; no corresponde a una pieza universal.";
  }
  if (!summary) summary = getCategoryFallback(product);

  const requirements = Array.isArray(product?.fitmentRequirements)
    ? product.fitmentRequirements.filter(Boolean)
    : validation ? validation.split(/[,;]+/).map((item) => item.trim()).filter(Boolean) : [];

  return {
    status,
    label: labels[status],
    summary,
    fitments,
    requirements,
    source: normalize(product?.fitmentSource) || findAttribute(attributes, ["fuente técnica", "fuente técnica/comercial", "fuente tecnica", "fuente"]),
    referenceLabel: product?.referenceType === "manufacturer"
      ? "Referencia fabricante"
      : internalQuote ? "Código de cotización REMBERT" : "Código de producto REMBERT",
    isVerified: status === "verified",
  };
}

export function getProductCompatibility(product) {
  return getProductFitment(product).summary;
}

export function getProductReferenceLabel(product) {
  return getProductFitment(product).referenceLabel;
}
