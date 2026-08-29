import prioritariosData from "../data/catalogo-prioridad-diesel.json" with { type: "json" };
import { cleanText, cleanAlphaNum, getSynonymsForToken, STOP_WORDS } from "./searchEngine.js";

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

function scoreDieselProduct(p, rawQuery) {
  if (!rawQuery || !rawQuery.trim()) return { matches: true, score: 0 };

  const queryClean = cleanText(rawQuery);
  const queryAlpha = cleanAlphaNum(rawQuery);

  const refClean = cleanText(p.reference);
  const refAlpha = cleanAlphaNum(p.reference);
  const nameClean = cleanText(p.name);
  const brandClean = cleanText(p.brandName);
  const subtypeClean = cleanText(p.subtype);
  const vehicleClean = cleanText(p.vehicle);
  const engineClean = cleanText(p.engine);

  const oeTexts = (p.oe || []).map(cleanText).join(" ");
  const oeAlpha = (p.oe || []).map(cleanAlphaNum).join(" ");
  const crossTexts = (p.cross_references || []).map(cleanText).join(" ");
  const crossAlpha = (p.cross_references || []).map(cleanAlphaNum).join(" ");

  const allSearchable = `${refClean} ${nameClean} ${brandClean} ${subtypeClean} ${vehicleClean} ${engineClean} ${oeTexts} ${crossTexts}`;
  const allAlpha = `${refAlpha} ${cleanAlphaNum(nameClean)} ${oeAlpha} ${crossAlpha}`;

  let score = 0;

  // 1. Coincidencia exacta de referencia o código alfanumérico
  if (queryAlpha.length >= 3) {
    if (refAlpha === queryAlpha) {
      return { matches: true, score: 5000 };
    }
    if (oeAlpha.includes(queryAlpha) || crossAlpha.includes(queryAlpha)) {
      score += 3500;
    }
    if (refAlpha.includes(queryAlpha) || queryAlpha.includes(refAlpha)) {
      score += 3000;
    }
  }

  // 2. Coincidencia exacta de texto
  if (refClean === queryClean) {
    score += 4000;
  } else if (refClean.includes(queryClean)) {
    score += 2500;
  }

  // 3. Multi-token matching
  const allRawTokens = queryClean.split(/\s+/).filter(Boolean);
  const significantTokens = allRawTokens.filter((t) => !STOP_WORDS.has(t) && t.length >= 2);
  const tokensToEvaluate = significantTokens.length > 0 ? significantTokens : allRawTokens;

  let matchedTokensCount = 0;

  for (const token of tokensToEvaluate) {
    const tokenAlpha = cleanAlphaNum(token);
    const synonyms = getSynonymsForToken(token);

    let tokenMatched = false;

    for (const syn of synonyms) {
      const synClean = cleanText(syn);
      const synAlpha = cleanAlphaNum(syn);

      if (
        allSearchable.includes(synClean) ||
        (synAlpha.length >= 3 && allAlpha.includes(synAlpha))
      ) {
        tokenMatched = true;
        break;
      }
    }

    if (tokenMatched) {
      matchedTokensCount++;
      score += 200;
    }
  }

  const tokenCoverage = matchedTokensCount / tokensToEvaluate.length;

  if (tokensToEvaluate.length === 1) {
    if (matchedTokensCount === 0 && score === 0) return { matches: false, score: 0 };
  } else {
    // Requerir que coincidan todos los tokens significativos
    if (matchedTokensCount < tokensToEvaluate.length && score < 2500) {
      return { matches: false, score: 0 };
    }
  }

  if (tokenCoverage === 1) {
    score += 800;
  }

  return { matches: score > 0, score };
}

/**
 * Búsqueda y Filtrado Especializado
 */
export function filterPrioridadDieselProducts({ query, category, brand, vehicle, photoStatus }) {
  let list = getPrioridadDieselProducts();

  if (category && category !== "todas") {
    const catLower = cleanText(category);
    list = list.filter((p) => cleanText(p.categorySlug).includes(catLower) || cleanText(p.categoryName).includes(catLower));
  }

  if (brand && brand !== "todas") {
    const brandLower = cleanText(brand);
    list = list.filter((p) => cleanText(p.brandSlug).includes(brandLower) || cleanText(p.brandName).includes(brandLower));
  }

  if (vehicle && vehicle !== "todos") {
    const vehLower = cleanText(vehicle);
    list = list.filter((p) => cleanText(p.vehicle).includes(vehLower));
  }

  if (photoStatus && photoStatus !== "todos") {
    if (photoStatus === "lista") {
      list = list.filter((p) => p.has_photo);
    } else if (photoStatus === "pendiente") {
      list = list.filter((p) => !p.has_photo);
    }
  }

  if (query && query.trim() !== "") {
    const scored = [];
    for (const p of list) {
      const { matches, score } = scoreDieselProduct(p, query);
      if (matches) {
        scored.push({ p, score });
      }
    }
    scored.sort((a, b) => b.score - a.score);
    return scored.map((item) => item.p);
  }

  return list;
}
