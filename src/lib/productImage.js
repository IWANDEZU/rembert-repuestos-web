import dieselImages from "@/data/diesel-images.json";

const REFERENCE_FILTER_BRANDS = new Set(["donsson"]);

// Fotografías verificadas de la referencia o línea del fabricante.
const PRODUCT_IMAGE_OVERRIDES = {
  "1241": "/catalogo-varios/abrazadera-plastica-ancha-380x7-6-rembert.webp",

  "donsson-wfp2075": "/catalogo-filtros-donsson/donsson-wfp2075-coolant.webp",
  "donsson-wfp-2075": "/catalogo-filtros-donsson/donsson-wfp2075-coolant.webp",
  "donssonwfp2075": "/catalogo-filtros-donsson/donsson-wfp2075-coolant.webp",
  "don-wfp2075": "/catalogo-filtros-donsson/donsson-wfp2075-coolant.webp",
  "wfp2075": "/catalogo-filtros-donsson/donsson-wfp2075-coolant.webp",
  "wfp-2075": "/catalogo-filtros-donsson/donsson-wfp2075-coolant.webp",

  "donsson-hfp6510": "/catalogo-filtros-donsson/donsson-hfp6510-hidraulico.webp",
  "donsson-hfp-6510": "/catalogo-filtros-donsson/donsson-hfp6510-hidraulico.webp",
  "donssonhfp6510": "/catalogo-filtros-donsson/donsson-hfp6510-hidraulico.webp",
  "don-hfp6510": "/catalogo-filtros-donsson/donsson-hfp6510-hidraulico.webp",
  "hfp6510": "/catalogo-filtros-donsson/donsson-hfp6510-hidraulico.webp",
  "hfp-6510": "/catalogo-filtros-donsson/donsson-hfp6510-hidraulico.webp",

  "donsson-fsp1280": "/catalogo-filtros-donsson/donsson-fsp1280-separador.webp",
  "donsson-fsp-1280": "/catalogo-filtros-donsson/donsson-fsp1280-separador.webp",
  "donssonfsp1280": "/catalogo-filtros-donsson/donsson-fsp1280-separador.webp",
  "don-fsp1280": "/catalogo-filtros-donsson/donsson-fsp1280-separador.webp",
  "fsp1280": "/catalogo-filtros-donsson/donsson-fsp1280-separador.webp",
  "fsp-1280": "/catalogo-filtros-donsson/donsson-fsp1280-separador.webp",

  "donsson-fsp19727": "/catalogo-filtros-donsson/donsson-fsp19727-separador.webp",
  "donsson-fsp-19727": "/catalogo-filtros-donsson/donsson-fsp19727-separador.webp",
  "donssonfsp19727": "/catalogo-filtros-donsson/donsson-fsp19727-separador.webp",
  "don-fsp19727": "/catalogo-filtros-donsson/donsson-fsp19727-separador.webp",
  "fsp19727": "/catalogo-filtros-donsson/donsson-fsp19727-separador.webp",
  "fsp-19727": "/catalogo-filtros-donsson/donsson-fsp19727-separador.webp",

  "donsson-afp25544": "/catalogo-filtros-donsson/donsson-afp25544-aire.webp",
  "donsson-afp-25544": "/catalogo-filtros-donsson/donsson-afp25544-aire.webp",
  "donssonafp25544": "/catalogo-filtros-donsson/donsson-afp25544-aire.webp",
  "don-afp25544": "/catalogo-filtros-donsson/donsson-afp25544-aire.webp",
  "afp25544": "/catalogo-filtros-donsson/donsson-afp25544-aire.webp",
  "afp-25544": "/catalogo-filtros-donsson/donsson-afp25544-aire.webp",

  "donsson-afp25708": "/catalogo-filtros-donsson/donsson-afp25708-aire.webp",
  "donsson-afp-25708": "/catalogo-filtros-donsson/donsson-afp25708-aire.webp",
  "donssonafp25708": "/catalogo-filtros-donsson/donsson-afp25708-aire.webp",
  "don-afp25708": "/catalogo-filtros-donsson/donsson-afp25708-aire.webp",
  "afp25708": "/catalogo-filtros-donsson/donsson-afp25708-aire.webp",
  "afp-25708": "/catalogo-filtros-donsson/donsson-afp25708-aire.webp",

  "amortiguador-delantero-derecho-hyundai-tucson-ix35-kia-sportage-revolution": "/catalogo-frenos-suspension/amortiguador-delantero-derecho-hyundai-tucson-ix35-kia-sportage-revolution.webp",
  "546612s000": "/catalogo-frenos-suspension/amortiguador-delantero-derecho-hyundai-tucson-ix35-kia-sportage-revolution.webp",
  "54661-2s000": "/catalogo-frenos-suspension/amortiguador-delantero-derecho-hyundai-tucson-ix35-kia-sportage-revolution.webp",

  "rodamiento-clutch-chevrolet-sail-n200-n300": "/catalogo-embrague/rodamiento-clutch-chevrolet-sail-n200-n300.webp",
  "balinera-clutch-sail-n200-n300": "/catalogo-embrague/rodamiento-clutch-chevrolet-sail-n200-n300.webp",
  "24512523": "/catalogo-embrague/rodamiento-clutch-chevrolet-sail-n200-n300.webp",
  "24521039a": "/catalogo-embrague/rodamiento-clutch-chevrolet-sail-n200-n300.webp",
  "24521039-a": "/catalogo-embrague/rodamiento-clutch-chevrolet-sail-n200-n300.webp",
  "9023914": "/catalogo-embrague/rodamiento-clutch-chevrolet-sail-n200-n300.webp",
  "24525897": "/catalogo-embrague/rodamiento-clutch-chevrolet-sail-n200-n300.webp",
};

// Índice de imágenes verificadas del catálogo técnico diésel
const DIESEL_CATALOG_IMAGES = new Map(Object.entries(dieselImages || {}));

const GENERIC_PLACEHOLDER_IMAGES = new Set([
  "/filtro-aceite.webp",
  "/filtro-aire.webp",
  "/logo.png",
]);

const FILTER_TYPE_IMAGES = {
  aceite: "/catalogo-filtros-tipos/filtro-aceite.webp",
  combustible: "/catalogo-filtros-tipos/filtro-combustible.webp",
  separador: "/catalogo-filtros-tipos/filtro-separador-agua-combustible.webp",
  cabina: "/catalogo-filtros-tipos/filtro-habitaculo-cabina.webp",
};

function normalize(value = "") {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function getFilterType(name = "") {
  const normalizedName = normalize(name);

  // This fallback is exclusively for filters. Previously every unknown
  // product defaulted to an oil-filter image, which produced false photos
  // for clamps, bearings and other inventory families.
  if (!normalizedName.includes("filtro") && !normalizedName.includes("filter")) {
    return null;
  }

  if (normalizedName.includes("cabina")) return "cabina";
  if (normalizedName.includes("refrigerante") || normalizedName.includes("coolant")) return "refrigerante";
  if (normalizedName.includes("hidraul")) return "hidraulico";
  if (normalizedName.includes("separador")) return "separador";
  if (normalizedName.includes("combustible")) return "combustible";
  if (normalizedName.includes("aire")) return "aire";
  return "aceite";
}

export function usesReferenceFilterImage(product) {
  if (!product) return false;

  const brand = normalize(product.brand?.slug || product.brand?.name || product.brand);
  return REFERENCE_FILTER_BRANDS.has(brand) && normalize(product.name).includes("filtro");
}

export function getProductDisplayImage(product) {
  if (!product) return "/logo.png";

  const slug = product?.slug ? String(product.slug).toLowerCase() : "";
  const cleanSlug = slug.replace(/[-_]/g, "");
  const rawSku = product?.sku ? String(product.sku).toLowerCase() : "";
  const cleanSku = rawSku.replace(/[-_]/g, "");

  // 1. Fotografías verificadas manuales
  if (slug && PRODUCT_IMAGE_OVERRIDES[slug]) return PRODUCT_IMAGE_OVERRIDES[slug];
  if (cleanSlug && PRODUCT_IMAGE_OVERRIDES[cleanSlug]) return PRODUCT_IMAGE_OVERRIDES[cleanSlug];
  if (rawSku && PRODUCT_IMAGE_OVERRIDES[rawSku]) return PRODUCT_IMAGE_OVERRIDES[rawSku];
  if (cleanSku && PRODUCT_IMAGE_OVERRIDES[cleanSku]) return PRODUCT_IMAGE_OVERRIDES[cleanSku];

  // 2. Imagen extraída del catálogo técnico diésel (139 imágenes individuales)
  const dieselImage =
    DIESEL_CATALOG_IMAGES.get(slug) ||
    DIESEL_CATALOG_IMAGES.get(cleanSlug) ||
    (cleanSku ? DIESEL_CATALOG_IMAGES.get(cleanSku) : null);
  if (dieselImage) {
    return dieselImage;
  }

  // 3. Imagen propia almacenada en BD (si no es un placeholder genérico obsoleto)
  const storedImage = product?.images?.[0]?.url || product?.image;
  if (storedImage && !GENERIC_PLACEHOLDER_IMAGES.has(storedImage)) {
    return storedImage;
  }

  // 4. Si es de una marca sin foto física, generar ficha técnica personalizada con el SKU / referencia
  if (usesReferenceFilterImage(product)) {
    const filterType = getFilterType(product.name);
    const brand = normalize(product.brand?.slug || product.brand?.name || product.brand);
    const reference = product.sku || product.slug || "filtro";
    const params = new URLSearchParams({
      brand,
      reference,
      type: filterType,
    });
    return `/api/imagen-referencia?${params.toString()}`;
  }

  // 5. Fallback por tipo o imagen almacenada
  const filterType = getFilterType(product.name);
  if (FILTER_TYPE_IMAGES[filterType]) {
    return FILTER_TYPE_IMAGES[filterType];
  }

  return storedImage || "/logo.png";
}

