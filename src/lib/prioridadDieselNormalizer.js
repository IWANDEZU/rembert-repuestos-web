import prioritariosData from "../data/catalogo-prioridad-diesel.json";

/**
 * Capa de Normalización para la Colección "Filtros y Suspensión Diésel"
 * Lee `src/data/catalogo-prioridad-diesel.json` como única fuente de verdad.
 */
export const copFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export function getPrioridadDieselProducts() {
  const rawProducts = prioritariosData.products || [];

  return rawProducts.map((item, index) => {
    const isImageReady =
      item.image_status === "lista" &&
      item.image_exact === true &&
      Boolean(item.web_image);

    const formattedPrice = copFormatter.format(item.price_cop || 0);

    const altText = `${item.subtype || "Repuesto"} ${item.brand} ${item.reference} para ${item.vehicle}`;

    return {
      id: `prioridad-${index}-${item.reference.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}`,
      reference: item.reference, // Conservado exactamente como aparece en JSON
      brandName: item.brand,
      brandSlug: item.brand ? item.brand.toLowerCase().replace(/[^a-z0-9]/g, "-") : "varias",
      categoryName: item.category,
      categorySlug: item.category ? item.category.toLowerCase().replace(/[^a-z0-9]/g, "-") : "general",
      subtype: item.subtype || "",
      vehicle: item.vehicle || "",
      engine: item.engine || "",
      position: item.position || "",
      specifications: item.specifications || {},
      oe: Array.isArray(item.oe) ? item.oe : [],
      cross_references: Array.isArray(item.cross_references) ? item.cross_references : [],
      gtin: item.gtin || "",
      price_cop: item.price_cop || 0,
      formattedPrice,
      price_policy: "Precio sugerido, sujeto a disponibilidad y confirmación",
      fitment_note: item.fitment_note || "Confirma compatibilidad por VIN, código de motor, año y tracción antes de comprar o instalar.",
      image_status: item.image_status,
      image_exact: item.image_exact,
      has_photo: isImageReady,
      web_image: isImageReady ? item.web_image : null,
      metadata_sidecar: item.metadata_sidecar || null,
      altText,
      isPriorityDiesel: true,
      // Adaptabilidad a estructura universal de producto
      name: `${item.subtype} ${item.brand} ${item.reference}`,
      slug: `prioridad-${item.reference.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}`,
      description: `Aplicación: ${item.vehicle}. Motor: ${item.engine}. Posición: ${item.position}. Referencia: ${item.reference}.`,
      shortDesc: `${item.subtype} - ${item.vehicle}`,
      price: item.price_cop || 0,
      brand: item.brand,
      category: item.category,
      images: isImageReady ? [{ url: item.web_image, alt: altText }] : [],
    };
  });
}

/**
 * Búsqueda y Filtrado Especializado
 */
export function filterPrioridadDieselProducts({ query, category, brand, vehicle, photoStatus }) {
  let list = getPrioridadDieselProducts();

  if (category && category !== "todas") {
    const catLower = category.toLowerCase();
    list = list.filter((p) => p.categorySlug.includes(catLower) || p.categoryName.toLowerCase().includes(catLower));
  }

  if (brand && brand !== "todas") {
    const brandLower = brand.toLowerCase();
    list = list.filter((p) => p.brandSlug.includes(brandLower) || p.brandName.toLowerCase().includes(brandLower));
  }

  if (vehicle && vehicle !== "todos") {
    const vehLower = vehicle.toLowerCase();
    list = list.filter((p) => p.vehicle.toLowerCase().includes(vehLower));
  }

  if (photoStatus && photoStatus !== "todos") {
    if (photoStatus === "lista") {
      list = list.filter((p) => p.has_photo);
    } else if (photoStatus === "pendiente") {
      list = list.filter((p) => !p.has_photo);
    }
  }

  if (query && query.trim() !== "") {
    const q = query.trim().toLowerCase();
    list = list.filter((p) => {
      // 1. Referencia exact/partial
      const refMatch = p.reference.toLowerCase().includes(q);
      // 2. Marca / Subtipo / Nombre
      const nameMatch = p.name.toLowerCase().includes(q) || p.brandName.toLowerCase().includes(q) || p.subtype.toLowerCase().includes(q);
      // 3. OE Numbers
      const oeMatch = p.oe.some((oeCode) => oeCode.toLowerCase().includes(q));
      // 4. Cruces
      const crossMatch = p.cross_references.some((crossCode) => crossCode.toLowerCase().includes(q));
      // 5. Vehículo o motor
      const vehMatch = p.vehicle.toLowerCase().includes(q) || p.engine.toLowerCase().includes(q);

      return refMatch || nameMatch || oeMatch || crossMatch || vehMatch;
    });
  }

  return list;
}
