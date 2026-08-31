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
  const title = normalizeText(product?.name);
  // The product title is authoritative when it explicitly identifies a complete axle.
  // Do this before the broader short description: a generic "lado caja/rueda"
  // label must not turn a named eje homocinético into a single CV joint.
  if (/eje homocinetico|semieje|cv axle/.test(title)) return "cv-axle";

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
  if (/interconexion|interconeccion|intermedio|intermediate shaft/.test(text)) return "intermediate-shaft";
  if (/lado caja|inner cv|punta caja|(?:^|[^a-z0-9])l\s*\/\s*c(?:$|[^a-z0-9])/.test(text)) return "inner-cv-joint";
  if (/lado rueda|punta(?: de)? eje|punta|junta homocinetica|outer cv|(?:^|[^a-z0-9])l\s*\/\s*r(?:$|[^a-z0-9])/.test(text)) return "outer-cv-joint";
  if (/eje|semieje|flecha|cv axle/.test(text)) return "cv-axle";
  return "unknown";
}

export function inferProductLaterality(product) {
  const inferFromText = (text) => {
    const hasLeft = /\b(?:izq|izquierda|izquierdo|left)\b/.test(text);
    const hasRight = /\b(?:der|derecha|derecho|right)\b/.test(text);
    if (hasLeft && hasRight) return "either";
    if (/ambos lados|indistinto/.test(text)) return "either";
    if (hasLeft) return "left";
    if (hasRight) return "right";
    return "unknown";
  };

  const titleLaterality = inferFromText(normalizeText(product?.name));
  if (titleLaterality !== "unknown") return titleLaterality;

  return inferFromText(normalizeText([
    product?.name,
    product?.fitmentSummary,
    ...(Array.isArray(product?.fitments) ? product.fitments.map((fitment) => fitment?.position) : []),
  ].filter(Boolean).join(" ")));
}

export function inferProductAbs(product) {
  const title = normalizeText(product?.name);
  const hasExplicitNoAbs = (text) => /\b(?:sin|no|without)\s+(?:(?:anillo|aro|sensor)\s+)?abs\b/.test(text);
  const hasExplicitYesAbs = (text) => /\bcon\s+abs\b|\b(?:anillo|aro|sensor)\s+abs\b|\babs\s+\d+[a-z]*\b/.test(text);

  if (hasExplicitNoAbs(title)) return "no";
  if (hasExplicitYesAbs(title)) return "yes";

  const text = normalizeText([
    product?.name,
    product?.description,
    product?.fitmentSummary,
    ...(Array.isArray(product?.attributes) ? product.attributes.map((attribute) => `${attribute?.name} ${attribute?.value}`) : []),
  ].filter(Boolean).join(" "));
  if (hasExplicitNoAbs(text)) return "no";
  if (/\b(?:con|with)\s+abs\b|\b(?:sensor|aro|anillo)\s+abs\b/.test(text)) return "yes";
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
