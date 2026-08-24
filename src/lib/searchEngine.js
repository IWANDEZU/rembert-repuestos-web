/**
 * Motor de búsqueda optimizado para Rembert Repuestos BCA
 * Búsqueda inteligente por marcas, referencias OE / fabricante, modelos y compatibilidades.
 */

export function cleanText(str = "") {
  return String(str || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function cleanAlphaNum(str = "") {
  return String(str || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

/**
 * Normaliza sinónimos automotrices comunes y abreviaturas
 */
export function expandSearchSynonyms(query = "") {
  return String(query)
    .replace(/\bCHEV\b/gi, "CHEVROLET")
    .replace(/\bHYU\b|\bHUY\b|\bHYNDAY\b/gi, "HYUNDAI")
    .replace(/\bSYM\b/gi, "SYMBOL")
    .replace(/\bMEG\b/gi, "MEGANE")
    .replace(/\bTACSON\b/gi, "TUCSON")
    .replace(/\bFIERTA\b/gi, "FIESTA")
    .replace(/\bKIWD\b/gi, "KWID")
    .replace(/\bAMORT\.?\b/gi, "AMORTIGUADOR")
    .replace(/\bBALIN\b|\bBALINERA\b|\bCOLLARIN\b/gi, "RODAMIENTO CLUTCH EMBRAGUE")
    .replace(/\bPAST\b|\bPASTILLAS?\b/gi, "PASTILLA FRENO")
    .replace(/\bFILT\b|\bFILTROS?\b/gi, "FILTRO")
    .replace(/\bRAD\b|\bRADIADORES?\b/gi, "RADIADOR");
}

/**
 * Evalúa la coincidencia de un producto contra una consulta de búsqueda
 * Retorna { matches: boolean, score: number }
 */
export function scoreProductSearch(product, rawQuery) {
  if (!rawQuery || !rawQuery.trim()) {
    return { matches: true, score: 0 };
  }

  const queryClean = cleanText(rawQuery);
  const queryAlpha = cleanAlphaNum(rawQuery);
  const expandedQuery = cleanText(expandSearchSynonyms(rawQuery));

  // 1. Extraer todos los campos del producto
  const name = cleanText(product.name);
  const sku = cleanText(product.sku);
  const brandName = cleanText(product.brand?.name);
  const brandSlug = cleanText(product.brand?.slug);
  const categoryName = cleanText(product.category?.name);
  const categorySlug = cleanText(product.category?.slug);
  const line = cleanText(product.inventoryLine);
  const shortDesc = cleanText(product.shortDesc);
  const desc = cleanText(product.description);
  const fitmentSummary = cleanText(product.fitmentSummary);

  const fitmentTexts = (product.fitments || [])
    .map((f) => cleanText(`${f.make || ""} ${f.model || ""} ${f.engine || ""} ${f.years || ""} ${f.position || ""}`))
    .join(" ");

  const attributeTexts = (product.attributes || [])
    .map((a) => cleanText(`${a.name || ""} ${a.value || ""}`))
    .join(" ");

  const allSearchable = `${name} ${sku} ${brandName} ${brandSlug} ${categoryName} ${categorySlug} ${line} ${fitmentSummary} ${fitmentTexts} ${attributeTexts} ${shortDesc} ${desc}`;

  // Extraer todos los códigos alfanuméricos del producto (SKUs, OEs, referencias)
  const skuAlpha = cleanAlphaNum(product.sku);
  const allAlpha = cleanAlphaNum(`${product.sku} ${name} ${attributeTexts}`);

  let score = 0;

  // --- MATCH POR REFERENCIA EXACTA / SKU ---
  if (queryAlpha.length >= 3) {
    if (skuAlpha === queryAlpha) {
      score += 1500; // Coincidencia exacta de SKU
    } else if (skuAlpha.includes(queryAlpha)) {
      score += 1000;
    } else if (allAlpha.includes(queryAlpha)) {
      score += 750; // Coincidencia en número OE / referencia cruzada
    }
  }

  // --- MATCH POR NOMBRE O MARCA EXACTA ---
  if (name === queryClean) {
    score += 1200;
  } else if (name.includes(queryClean)) {
    score += 500;
  }

  if (brandName === queryClean || brandSlug === queryClean) {
    score += 600;
  } else if (brandName.includes(queryClean)) {
    score += 350;
  }

  // --- MATCH POR TOKENS (MULTI-PALABRA Y SINÓNIMOS) ---
  const queryTokens = queryClean.split(/\s+/).filter((t) => t.length >= 2);
  const expandedTokens = expandedQuery.split(/\s+/).filter((t) => t.length >= 2);

  if (queryTokens.length > 0) {
    let matchedTokensCount = 0;
    for (const qToken of queryTokens) {
      const qTokenAlpha = cleanAlphaNum(qToken);
      const directMatch = allSearchable.includes(qToken) || (qTokenAlpha.length >= 3 && allAlpha.includes(qTokenAlpha));
      
      if (directMatch) {
        matchedTokensCount++;
        score += 120;
      } else {
        // Verificar si coincide algún sinónimo
        const synonymMatch = expandedTokens.some((sToken) => {
          const sTokenAlpha = cleanAlphaNum(sToken);
          return allSearchable.includes(sToken) || (sTokenAlpha.length >= 3 && allAlpha.includes(sTokenAlpha));
        });
        if (synonymMatch) {
          matchedTokensCount++;
          score += 80;
        }
      }
    }

    if (matchedTokensCount === queryTokens.length) {
      score += 250 + queryTokens.length * 60;

      // Bono si coincide en Marca o Modelo
      if (brandName.includes(queryTokens[0]) || brandSlug.includes(queryTokens[0])) {
        score += 100;
      }
      if (fitmentTexts.includes(queryTokens[0]) || fitmentSummary.includes(queryTokens[0])) {
        score += 100;
      }
    } else if (matchedTokensCount > 0 && queryTokens.length > 1) {
      // Coincidencia parcial con puntaje proporcional
      score += matchedTokensCount * 50;
    }
  }

  return { matches: score > 0, score };
}

/**
 * Filtra y ordena un listado de productos por relevancia de búsqueda
 */
export function searchAndRankProducts(products = [], query = "") {
  if (!query || !query.trim()) return products;

  const scored = [];
  for (const product of products) {
    const { matches, score } = scoreProductSearch(product, query);
    if (matches) {
      scored.push({ product, score });
    }
  }

  // Ordenar por puntaje de mayor a menor
  scored.sort((a, b) => b.score - a.score);
  return scored.map((item) => item.product);
}
