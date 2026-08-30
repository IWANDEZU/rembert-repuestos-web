import dieselImages from "@/data/diesel-images.json";
import { getVerifiedDynamikPhoto } from "@/data/dynamikLocalPhotoAssets";
import { getCiosaDynamikPhoto } from "@/data/dynamikCiosaPhotoAssets";
import { getDynamikSyntheticVisual, isDynamikSyntheticVisualCompatible } from "@/data/dynamikSyntheticVisuals";

const REFERENCE_FILTER_BRANDS = new Set(["donsson"]);

// Fotografías verificadas de la referencia o línea del fabricante.
const PRODUCT_IMAGE_OVERRIDES = {
  "1241": "/catalogo-varios/abrazadera-plastica-ancha-380x7-6-rembert.webp",

  "donsson-wfp2075": "/catalogo-filtros-donsson/donsson-wfp2075-coolant.png",
  "donsson-wfp-2075": "/catalogo-filtros-donsson/donsson-wfp2075-coolant.png",
  "donssonwfp2075": "/catalogo-filtros-donsson/donsson-wfp2075-coolant.png",
  "don-wfp2075": "/catalogo-filtros-donsson/donsson-wfp2075-coolant.png",
  "wfp2075": "/catalogo-filtros-donsson/donsson-wfp2075-coolant.png",
  "wfp-2075": "/catalogo-filtros-donsson/donsson-wfp2075-coolant.png",

  "donsson-hfp6510": "/catalogo-filtros-donsson/donsson-hfp6510-hidraulico.png",
  "donsson-hfp-6510": "/catalogo-filtros-donsson/donsson-hfp6510-hidraulico.png",
  "donssonhfp6510": "/catalogo-filtros-donsson/donsson-hfp6510-hidraulico.png",
  "don-hfp6510": "/catalogo-filtros-donsson/donsson-hfp6510-hidraulico.png",
  "hfp6510": "/catalogo-filtros-donsson/donsson-hfp6510-hidraulico.png",
  "hfp-6510": "/catalogo-filtros-donsson/donsson-hfp6510-hidraulico.png",

  "donsson-fsp1280": "/catalogo-filtros-donsson/donsson-fsp1280-separador.jpg",
  "donsson-fsp-1280": "/catalogo-filtros-donsson/donsson-fsp1280-separador.jpg",
  "donssonfsp1280": "/catalogo-filtros-donsson/donsson-fsp1280-separador.jpg",
  "don-fsp1280": "/catalogo-filtros-donsson/donsson-fsp1280-separador.jpg",
  "fsp1280": "/catalogo-filtros-donsson/donsson-fsp1280-separador.jpg",
  "fsp-1280": "/catalogo-filtros-donsson/donsson-fsp1280-separador.jpg",

  "donsson-fsp19727": "/catalogo-filtros-donsson/donsson-fsp19727-separador.jpg",
  "donsson-fsp-19727": "/catalogo-filtros-donsson/donsson-fsp19727-separador.jpg",
  "donssonfsp19727": "/catalogo-filtros-donsson/donsson-fsp19727-separador.jpg",
  "don-fsp19727": "/catalogo-filtros-donsson/donsson-fsp19727-separador.jpg",
  "fsp19727": "/catalogo-filtros-donsson/donsson-fsp19727-separador.jpg",
  "fsp-19727": "/catalogo-filtros-donsson/donsson-fsp19727-separador.jpg",

  "donsson-afp25544": "/catalogo-filtros-donsson/donsson-afp25544-aire.jpg",
  "donsson-afp-25544": "/catalogo-filtros-donsson/donsson-afp25544-aire.jpg",
  "donssonafp25544": "/catalogo-filtros-donsson/donsson-afp25544-aire.jpg",
  "don-afp25544": "/catalogo-filtros-donsson/donsson-afp25544-aire.jpg",
  "afp25544": "/catalogo-filtros-donsson/donsson-afp25544-aire.jpg",
  "afp-25544": "/catalogo-filtros-donsson/donsson-afp25544-aire.jpg",

  "donsson-afp25708": "/catalogo-filtros-donsson/donsson-afp25708-aire.jpg",
  "donsson-afp-25708": "/catalogo-filtros-donsson/donsson-afp25708-aire.jpg",
  "donssonafp25708": "/catalogo-filtros-donsson/donsson-afp25708-aire.jpg",
  "don-afp25708": "/catalogo-filtros-donsson/donsson-afp25708-aire.jpg",
  "afp25708": "/catalogo-filtros-donsson/donsson-afp25708-aire.jpg",
  "afp-25708": "/catalogo-filtros-donsson/donsson-afp25708-aire.jpg",

  "amortiguador-delantero-derecho-hyundai-tucson-ix35-kia-sportage-revolution": "/catalogo-frenos-suspension/amortiguador-delantero-derecho-hyundai-tucson-ix35-kia-sportage-revolution.png",
  "546612s000": "/catalogo-frenos-suspension/amortiguador-delantero-derecho-hyundai-tucson-ix35-kia-sportage-revolution.png",
  "54661-2s000": "/catalogo-frenos-suspension/amortiguador-delantero-derecho-hyundai-tucson-ix35-kia-sportage-revolution.png",

  "rodamiento-clutch-chevrolet-sail-n200-n300": "/catalogo-embrague/rodamiento-clutch-chevrolet-sail-n200-n300.png",
  "balinera-clutch-sail-n200-n300": "/catalogo-embrague/rodamiento-clutch-chevrolet-sail-n200-n300.png",
  "24512523": "/catalogo-embrague/rodamiento-clutch-chevrolet-sail-n200-n300.png",
  "24521039a": "/catalogo-embrague/rodamiento-clutch-chevrolet-sail-n200-n300.png",
  "24521039-a": "/catalogo-embrague/rodamiento-clutch-chevrolet-sail-n200-n300.png",
  "9023914": "/catalogo-embrague/rodamiento-clutch-chevrolet-sail-n200-n300.png",
  "24525897": "/catalogo-embrague/rodamiento-clutch-chevrolet-sail-n200-n300.png",

  "5768": "/catalogo-frenos-suspension/vazlo-5768-base-amortiguador-delantero-chevrolet-tracker-catalogo-blanco.webp",
  "407yzh5768": "/catalogo-frenos-suspension/vazlo-5768-base-amortiguador-delantero-chevrolet-tracker-catalogo-blanco.webp",
  "407-yzh-5768": "/catalogo-frenos-suspension/vazlo-5768-base-amortiguador-delantero-chevrolet-tracker-catalogo-blanco.webp",
  "yzh-5768": "/catalogo-frenos-suspension/vazlo-5768-base-amortiguador-delantero-chevrolet-tracker-catalogo-blanco.webp",
  "yzh-5768-base-amortiguador-delantero-chevrolet-tracker": "/catalogo-frenos-suspension/vazlo-5768-base-amortiguador-delantero-chevrolet-tracker-catalogo-blanco.webp",
};

// Índice de imágenes verificadas del catálogo técnico diésel
const DIESEL_CATALOG_IMAGES = new Map(Object.entries(dieselImages || {}));

const GENERIC_PLACEHOLDER_IMAGES = new Set([
  "/filtro-aceite.jpg",
  "/filtro-aire.png",
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

export function isDynamikProduct(product) {
  const brand = normalize(product?.brand?.slug || product?.brand?.name || product?.brand);
  return brand === "dynamik";
}

const getCompatibleSyntheticVisual = (product) => {
  const visual = getDynamikSyntheticVisual(product?.sku);
  return isDynamikSyntheticVisualCompatible(product, visual) ? visual : null;
};

const getDynamikApprovedViews = (product) => (
  getVerifiedDynamikPhoto(product?.sku)?.views
  || getCiosaDynamikPhoto(product?.sku)?.views
  || getCompatibleSyntheticVisual(product)?.views
  || []
);

const getDynamikLocalPhoto = (product) => (
  getVerifiedDynamikPhoto(product?.sku)?.main?.url
  || getCiosaDynamikPhoto(product?.sku)?.main?.url
  || getCompatibleSyntheticVisual(product)?.main?.url
  || null
);

export function hasDynamikCatalogGallery(product) {
  return isDynamikProduct(product) && getDynamikApprovedViews(product).length > 0;
}

export function getDynamikCatalogGallery(product) {
  if (!hasDynamikCatalogGallery(product)) return [];
  return getDynamikApprovedViews(product);
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

  // Dynamik prioriza una fotografía física verificada. Una ilustración
  // sintética solo puede mostrarse si pertenece a la misma familia del producto
  // (pastilla, disco o kit de embrague); así una pieza de embrague o un cable
  // nunca puede aparecer en la ficha de una pastilla.
  if (isDynamikProduct(product)) {
    return getDynamikLocalPhoto(product);
  }

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

  // 3. Imagen propia almacenada en BD / Inventario
  const storedImage = product?.images?.[0]?.url || product?.image;
  if (storedImage && !GENERIC_PLACEHOLDER_IMAGES.has(storedImage)) {
    const isSkfImage = storedImage.toLowerCase().includes("skf");
    const isSkfProduct =
      normalize(product.brand?.slug || product.brand?.name || product.brand).includes("skf") ||
      normalize(product.name).includes("skf") ||
      normalize(product.sku || "").includes("skf");

    // Si la imagen tiene la marca SKF pero el producto no es SKF (ej: ejes GTI, rodamientos genéricos),
    // asignamos la imagen correcta correspondiente a su tipo de componente.
    if (isSkfImage && !isSkfProduct) {
      const normName = normalize(product.name);
      if (
        normName.includes("eje") ||
        normName.includes("homocinet") ||
        normName.includes("triceta") ||
        normName.includes("tulipa") ||
        normName.includes("punta") ||
        normName.includes("semieje")
      ) {
        return "/catalogo-gti/gti-linea-homocinetica-studio-v2.webp";
      }
      return "/catalogo-frenos-suspension/soportes-bujes-suspension-familia.webp";
    }

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
