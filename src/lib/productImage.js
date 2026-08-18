import dieselCatalog from "@/data/catalogo-filtros-diesel.json";

const REFERENCE_FILTER_BRANDS = new Set(["donsson", "partmo"]);

// Fotografías verificadas de la referencia o línea del fabricante.
const PRODUCT_IMAGE_OVERRIDES = {
  "donsson-wfp2075": "/catalogo-filtros-donsson/donsson-wfp2075-coolant.png",
  "donsson-hfp6510": "/catalogo-filtros-donsson/donsson-hfp6510-hidraulico.png",
  "donsson-fsp1280": "/catalogo-filtros-donsson/donsson-fsp1280-separador.jpg",
  "donsson-fsp19727": "/catalogo-filtros-donsson/donsson-fsp19727-separador.jpg",
  "donsson-afp25544": "/catalogo-filtros-donsson/donsson-afp25544-aire.jpg",
  "donsson-afp25708": "/catalogo-filtros-donsson/donsson-afp25708-aire.jpg",
  "partmo-a1402": "/catalogo-filtros-web/partmo-linea-tradicional-a58-a1402-a14616.jpg",
  "partmo-a14616": "/catalogo-filtros-web/partmo-linea-tradicional-a58-a1402-a14616.jpg",
  "partmo-a58": "/catalogo-filtros-web/partmo-linea-tradicional-a58-a1402-a14616.jpg",
};

// Índice de imágenes verificadas del catálogo técnico diésel
const DIESEL_CATALOG_IMAGES = new Map();
if (Array.isArray(dieselCatalog)) {
  for (const item of dieselCatalog) {
    if (item.image && item.status === "ready") {
      if (item.id) {
        DIESEL_CATALOG_IMAGES.set(item.id.toLowerCase(), item.image);
        DIESEL_CATALOG_IMAGES.set(item.id.toLowerCase().replace(/[-_]/g, ""), item.image);
      }
      if (item.sku) {
        DIESEL_CATALOG_IMAGES.set(item.sku.toLowerCase().replace(/[-_]/g, ""), item.image);
      }
      if (item.reference) {
        DIESEL_CATALOG_IMAGES.set(item.reference.toLowerCase().replace(/[-_]/g, ""), item.image);
      }
    }
  }
}

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

export function getFilterType(name = "") {
  const normalizedName = normalize(name);

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
  const sku = product?.sku ? String(product.sku).toLowerCase().replace(/[-_]/g, "") : "";

  // 1. Fotografías verificadas manuales
  if (slug && PRODUCT_IMAGE_OVERRIDES[slug]) {
    return PRODUCT_IMAGE_OVERRIDES[slug];
  }

  // 2. Imagen extraída del catálogo técnico diésel (139 imágenes individuales)
  const dieselImage =
    DIESEL_CATALOG_IMAGES.get(slug) ||
    DIESEL_CATALOG_IMAGES.get(cleanSlug) ||
    (sku ? DIESEL_CATALOG_IMAGES.get(sku) : null);
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

