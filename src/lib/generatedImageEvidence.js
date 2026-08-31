const clean = (value) => String(value ?? "").trim();

const normalizeText = (value) => clean(value)
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase();

export const GENERATED_IMAGE_BRANDS = Object.freeze(new Set(["ads", "gti"]));

export const normalizeImageEvidenceKey = (value) => clean(value)
  .toUpperCase()
  .replace(/[^A-Z0-9]/g, "");

export function productBrandSlug(product) {
  return normalizeText(product?.brand?.slug || product?.brand?.name || product?.brand)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function inferProductPartFamily(product) {
  const text = normalizeText([
    product?.name,
    product?.shortDesc,
    product?.category?.name,
    product?.category?.slug,
  ].filter(Boolean).join(" "));

  if (/tijera|parrilla|bandeja|brazo de suspension|control arm|wishbone/.test(text)) return "control-arm";
  if (/rotula|ball joint/.test(text)) return "ball-joint";
  if (/soporte.*(?:motor|hidraulic)|engine mount|mounting/.test(text)) return "engine-mount";
  if (/guardapolvo|fuelle|cv boot/.test(text)) return "cv-boot";
  if (/triceta|tripode|tripod/.test(text)) return "tripod-joint";
  if (/tulipa|copa lado caja|cv tulip/.test(text)) return "inner-cv-tulip";
  if (/interconexion|intermedio|intermediate shaft/.test(text)) return "intermediate-shaft";
  if (/lado caja|l\/c|inner cv|punta caja/.test(text)) return "inner-cv-joint";
  if (/lado rueda|l\/r|punta(?: de)? eje|punta|junta homocinetica|outer cv/.test(text)) return "outer-cv-joint";
  if (/eje|semieje|flecha|cv axle/.test(text)) return "cv-axle";
  return "unknown";
}

export function inferProductLaterality(product) {
  const text = normalizeText([
    product?.name,
    product?.fitmentSummary,
    ...(Array.isArray(product?.fitments) ? product.fitments.map((fitment) => fitment?.position) : []),
  ].filter(Boolean).join(" "));
  if (/izquierda.*derecha|derecha.*izquierda|ambos lados|left.*right|right.*left|indistinto/.test(text)) return "either";
  if (/izquierda|izquierdo|left|lado izq/.test(text)) return "left";
  if (/derecha|derecho|right|lado der/.test(text)) return "right";
  return "unknown";
}

export function inferProductAbs(product) {
  const text = normalizeText([
    product?.name,
    product?.description,
    product?.fitmentSummary,
    ...(Array.isArray(product?.attributes) ? product.attributes.map((attribute) => `${attribute?.name} ${attribute?.value}`) : []),
  ].filter(Boolean).join(" "));
  if (/sin abs|no abs|without abs/.test(text)) return "no";
  if (/con abs|sensor abs|aro abs|with abs/.test(text)) return "yes";
  return "unknown";
}

export function buildGeneratedImageCompatibility(product, explicit = {}) {
  const requirements = Array.isArray(product?.fitmentRequirements)
    ? product.fitmentRequirements.map(clean).filter(Boolean)
    : [];
  return {
    partFamily: explicit.partFamily || inferProductPartFamily(product),
    laterality: explicit.laterality || inferProductLaterality(product),
    abs: explicit.abs || inferProductAbs(product),
    componentScope: "primary-component-only",
    includedComponents: [explicit.partFamily || inferProductPartFamily(product)],
    fitmentStatus: clean(product?.fitmentStatus || "conditional") || "conditional",
    requirements,
  };
}

export function isGeneratedImageOverrideCompatible(product, override) {
  if (override?.imageStatus !== "generated-reference-image") return true;
  const expectedBrand = productBrandSlug(product);
  if (!GENERATED_IMAGE_BRANDS.has(expectedBrand)) return true;

  const record = override?.sourceRecord;
  if (!record || record.brandSlug !== expectedBrand) return false;
  if (record.skuKey !== normalizeImageEvidenceKey(product?.sku)) return false;

  const expectedFamily = inferProductPartFamily(product);
  const compatibility = record.compatibility;
  if (!compatibility || compatibility.componentScope !== "primary-component-only") return false;
  if (!expectedFamily || expectedFamily === "unknown" || compatibility.partFamily !== expectedFamily) return false;

  const expectedLaterality = inferProductLaterality(product);
  if (expectedLaterality !== "unknown" && compatibility.laterality !== expectedLaterality) return false;

  const expectedAbs = inferProductAbs(product);
  if (expectedAbs !== "unknown" && compatibility.abs !== expectedAbs) return false;
  return true;
}
