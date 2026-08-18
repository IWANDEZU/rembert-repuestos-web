const REFERENCE_FILTER_BRANDS = new Set(["donsson", "partmo"]);

// Fotografías verificadas de la referencia o línea del fabricante. Estas rutas
// tienen prioridad sobre la tarjeta de referencia para evitar reutilizar una
// imagen de otro filtro.
const PRODUCT_IMAGE_OVERRIDES = {
  "donsson-wfp2075": "/catalogo-filtros-donsson/donsson-wfp2075-coolant.png",
  "donsson-hfp6510": "/catalogo-filtros-donsson/donsson-hfp6510-hidraulico.png",
  "partmo-a1402": "/catalogo-filtros-web/partmo-linea-tradicional-a58-a1402-a14616.jpg",
  "partmo-a14616": "/catalogo-filtros-web/partmo-linea-tradicional-a58-a1402-a14616.jpg",
  "partmo-a58": "/catalogo-filtros-web/partmo-linea-tradicional-a58-a1402-a14616.jpg",
};

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
  const storedImage = product?.images?.[0]?.url || product?.image || "/logo.png";

  const verifiedImage = PRODUCT_IMAGE_OVERRIDES[product?.slug];
  if (verifiedImage) return verifiedImage;

  if (!usesReferenceFilterImage(product)) return storedImage;

  const filterType = getFilterType(product.name);
  if (filterType === "aire") {
    const normalizedName = normalize(product.name);
    const isRadial = ["cilindrico", "pesado", "primario", "secundario", "radial"].some((term) => normalizedName.includes(term));
    return isRadial
      ? "/catalogo-filtros-tipos/filtro-aire-radial.webp"
      : "/catalogo-filtros-tipos/filtro-aire-panel.webp";
  }

  if (FILTER_TYPE_IMAGES[filterType]) return FILTER_TYPE_IMAGES[filterType];

  const brand = normalize(product.brand?.slug || product.brand?.name || product.brand);
  const reference = product.sku || product.slug || "filtro";
  const params = new URLSearchParams({
    brand,
    reference,
    type: filterType,
  });

  return `/api/imagen-referencia?${params.toString()}`;
}
