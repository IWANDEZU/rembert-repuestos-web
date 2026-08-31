/**
 * Motor de búsqueda optimizado y de alta precisión para Rembert Repuestos BCA
 * Búsqueda inteligente por marcas, referencias OE / fabricante / SKU, modelos y compatibilidades.
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
 * Palabras vacías en español que no aportan relevancia en búsquedas compuestas
 */
export const STOP_WORDS = new Set([
  "de", "del", "la", "el", "los", "las", "en", "y", "o", "para", "con", "sin", "un", "una", "unos", "unas", "por", "al", "todos", "todas"
]);

/**
 * Diccionario de equivalencias y sinónimos automotrices por término
 */
export const AUTOMOTIVE_SYNONYMS = {
  // Fabricantes de Vehículos y Modelos
  "chev": ["chevrolet", "chevy", "gm"],
  "chevy": ["chevrolet", "gm"],
  "cherolet": ["chevrolet"],
  "acdelco": ["acdelco", "chevrolet", "gm"],
  "hyu": ["hyundai"],
  "huy": ["hyundai"],
  "hynday": ["hyundai"],
  "hiunday": ["hyundai"],
  "sym": ["symbol"],
  "meg": ["megane"],
  "tacson": ["tucson"],
  "tucon": ["tucson"],
  "fierta": ["fiesta"],
  "kiwd": ["kwid"],
  "dimax": ["dmax", "d-max", "luv"],
  "dmax": ["dimax", "d-max", "luv"],
  "bt50": ["bt-50"],
  "sparkgt": ["spark gt"],
  "sandero": ["sandero", "stepway"],

  // Componentes de Suspensión y Dirección
  "amort": ["amortiguador", "amortiguadores", "strut", "puntal", "shock"],
  "amortiguador": ["amortiguador", "amortiguadores", "strut", "puntal", "shock"],
  "amortiguadores": ["amortiguador", "amortiguadores", "strut", "puntal", "shock"],
  "strut": ["strut", "struts", "amortiguador", "amortiguadores", "puntal"],
  "puntal": ["puntal", "amortiguador", "strut"],
  "rotula": ["rotula", "rotulas", "ball joint"],
  "rotulas": ["rotula", "rotulas", "ball joint"],
  "terminal": ["terminal", "terminales", "terminal direccion"],
  "terminales": ["terminal", "terminales", "terminal direccion"],
  "axial": ["axial", "axiales", "rotula axial", "terminal axial"],
  "axiales": ["axial", "axiales", "rotula axial", "terminal axial"],
  "bieleta": ["bieleta", "bieletas", "estabilizadora", "link", "tirante"],
  "bieletas": ["bieleta", "bieletas", "estabilizadora", "link", "tirante"],
  "buje": ["buje", "bujes", "silentblock", "bushing"],
  "bujes": ["buje", "bujes", "silentblock", "bushing"],
  "tijera": ["tijera", "tijeras", "brazo suspension", "control arm"],
  "tijeras": ["tijera", "tijeras", "brazo suspension", "control arm"],
  "guardapolvo": ["guardapolvo", "guardapolvos", "fuelle", "bota"],
  "guardapolvos": ["guardapolvo", "guardapolvos", "fuelle", "bota"],

  // Sistema de Frenos
  "past": ["pastilla", "pastillas", "pastilla freno"],
  "pastilla": ["pastilla", "pastillas", "pad", "pads"],
  "pastillas": ["pastilla", "pastillas", "pad", "pads"],
  "zapata": ["zapata", "zapatas", "banda", "bandas"],
  "zapatas": ["zapata", "zapatas", "banda", "bandas"],
  "banda": ["banda", "bandas", "zapata", "zapatas"],
  "bandas": ["banda", "bandas", "zapata", "zapatas"],
  "disco": ["disco", "discos", "rotor"],
  "discos": ["disco", "discos", "rotor"],
  "campana": ["campana", "campanas", "tambor", "tambores"],
  "campanas": ["campana", "campanas", "tambor", "tambores"],

  // Rodamientos y Embrague
  "balin": ["balinera", "balineras", "rodamiento", "cojinete"],
  "balinera": ["balinera", "balineras", "rodamiento", "rodamientos", "cojinete", "cubo"],
  "balineras": ["balinera", "balineras", "rodamiento", "rodamientos", "cojinete", "cubo"],
  "rodamiento": ["rodamiento", "rodamientos", "balinera", "balineras", "cojinete", "bearing", "cubo"],
  "rodamientos": ["rodamiento", "rodamientos", "balinera", "balineras", "cojinete", "bearing", "cubo"],
  "collarin": ["collarin", "balinera", "rodamiento clutch", "balinera clutch"],
  "clutch": ["clutch", "embrague", "prensa", "disco clutch", "repset"],
  "embrague": ["embrague", "clutch", "prensa", "disco embrague", "repset"],
  "repset": ["repset", "luk", "clutch", "embrague", "kit clutch"],

  // Filtración y Refrigeración
  "filt": ["filtro", "filtros"],
  "filtro": ["filtro", "filtros", "filter"],
  "filtros": ["filtro", "filtros", "filter"],
  "rad": ["radiador", "radiadores"],
  "radiador": ["radiador", "radiadores", "panal radiador"],
  "radiadores": ["radiador", "radiadores", "panal radiador"],
  "intercooler": ["intercooler", "post enfriador", "enfriador"],

  // Encendido y Distribución
  "bujia": ["bujia", "bujias", "spark plug"],
  "bujias": ["bujia", "bujias", "spark plug"],
  "correa": ["correa", "correas", "banda", "bandas", "distribucion", "poly-v", "gates"],
  "correas": ["correa", "correas", "banda", "bandas", "distribucion", "poly-v", "gates"],

  // Fluidos y Químicos
  "liquido": ["liquido", "liquidos", "fluido", "fluidos", "dot3", "dot4", "dot 3", "dot 4"],
  "refrigerante": ["refrigerante", "refrigerantes", "coolant", "anticongelante", "dex-cool"],
  "coolant": ["coolant", "refrigerante", "anticongelante"],
  "silicona": ["silicona", "siliconas", "sellante", "sellantes", "rtv", "reinzosil", "victor reinz"],
  "reinzosil": ["reinzosil", "victor reinz", "silicona", "sellante"],
};

/**
 * Normaliza sinónimos automotrices en una frase completa
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
    .replace(/\bBALIN\b|\bBALINERA\b/gi, "RODAMIENTO BALINERA")
    .replace(/\bPAST\b/gi, "PASTILLAS")
    .replace(/\bFILT\b/gi, "FILTRO")
    .replace(/\bRAD\b/gi, "RADIADOR");
}

/**
 * Stemming básico en español para unificar formas singulares y plurales
 */
export function stemSpanish(word = "") {
  if (word.length <= 3) return word;
  if (word.endsWith("ces")) return word.slice(0, -3) + "z";
  if (word.endsWith("es") && !word.endsWith("tes") && !word.endsWith("des") && !word.endsWith("res")) {
    return word.slice(0, -2);
  }
  if (word.endsWith("s") && !word.endsWith("is") && !word.endsWith("us") && !word.endsWith("os")) {
    return word.slice(0, -1);
  }
  return word;
}

/**
 * Obtiene los sinónimos y variaciones para un token específico
 */
export function getSynonymsForToken(token = "") {
  const synonyms = new Set([token]);
  const stem = stemSpanish(token);
  synonyms.add(stem);

  if (AUTOMOTIVE_SYNONYMS[token]) {
    for (const s of AUTOMOTIVE_SYNONYMS[token]) synonyms.add(s);
  }
  if (AUTOMOTIVE_SYNONYMS[stem]) {
    for (const s of AUTOMOTIVE_SYNONYMS[stem]) synonyms.add(s);
  }

  return Array.from(synonyms);
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
  const nameAlpha = cleanAlphaNum(product.name);
  const allAlpha = cleanAlphaNum(`${product.sku} ${product.name} ${attributeTexts}`);

  let score = 0;

  // --- MATCH POR REFERENCIA EXACTA / SKU / CÓDIGO OE ---
  if (queryAlpha.length >= 3) {
    if (skuAlpha === queryAlpha) {
      return { matches: true, score: 5000 }; // Coincidencia exacta de SKU
    } else if (skuAlpha.length >= 4 && (skuAlpha.includes(queryAlpha) || queryAlpha.includes(skuAlpha))) {
      score += 2500;
    } else if (allAlpha.length >= 4 && allAlpha.includes(queryAlpha)) {
      score += 2000; // Coincidencia en número OE / referencia cruzada
    }
  }

  // --- MATCH POR NOMBRE O FRASE EXACTA ---
  if (name === queryClean) {
    score += 3000;
  } else if (name.includes(queryClean)) {
    score += 1500;
  }

  if (brandName === queryClean || brandSlug === queryClean) {
    score += 1000;
  }

  // --- MATCH POR TOKENS SIGNIFICATIVOS ---
  const allRawTokens = queryClean.split(/\s+/).filter(Boolean);
  const significantTokens = allRawTokens.filter((t) => !STOP_WORDS.has(t) && t.length >= 2);
  const tokensToEvaluate = significantTokens.length > 0 ? significantTokens : allRawTokens;

  let matchedTokensCount = 0;
  let nameTokensCount = 0;

  for (const token of tokensToEvaluate) {
    const tokenAlpha = cleanAlphaNum(token);
    const synonyms = getSynonymsForToken(token);

    let tokenMatched = false;
    let inName = false;
    let inFitment = false;

    for (const syn of synonyms) {
      const synClean = cleanText(syn);
      const synAlpha = cleanAlphaNum(syn);

      if (name.includes(synClean) || (synAlpha.length >= 3 && nameAlpha.includes(synAlpha))) {
        tokenMatched = true;
        inName = true;
        break;
      }

      if (fitmentSummary.includes(synClean) || fitmentTexts.includes(synClean)) {
        tokenMatched = true;
        inFitment = true;
        break;
      }

      if (
        allSearchable.includes(synClean) ||
        (synAlpha.length >= 3 && allAlpha.includes(synAlpha)) ||
        brandName.includes(synClean) ||
        categoryName.includes(synClean)
      ) {
        tokenMatched = true;
        break;
      }
    }

    if (tokenMatched) {
      matchedTokensCount++;
      score += 150;
      if (inName) {
        nameTokensCount++;
        score += 100;
      }
      if (inFitment) {
        score += 120; // Bonificación de compatibilidad vehicular exacta
      }
    }
  }

  const tokenCoverage = matchedTokensCount / tokensToEvaluate.length;

  // Filtrado de falsos positivos según la longitud de consulta
  if (tokensToEvaluate.length === 1) {
    if (matchedTokensCount === 0 && score === 0) return { matches: false, score: 0 };
  } else if (tokensToEvaluate.length <= 3) {
    // Para consultas de 2 o 3 palabras significativas, exigir coincidencia de todos los tokens
    if (matchedTokensCount < tokensToEvaluate.length && score < 2000) {
      return { matches: false, score: 0 };
    }
  } else {
    // Para consultas largas (4+ palabras), exigir al menos 75% de cobertura
    if (tokenCoverage < 0.75 && score < 2000) {
      return { matches: false, score: 0 };
    }
  }

  // Bonificación por cobertura completa
  if (tokenCoverage === 1) {
    score += 500 + tokensToEvaluate.length * 100;
    if (nameTokensCount === tokensToEvaluate.length) {
      score += 400;
    }
  }

  // Bonificación de prioridad para marca ADS en búsquedas de soportes (soportes de motor primero)
  if (score > 0 && queryClean.includes("soporte")) {
    const isSoporte = name.includes("soporte") || categorySlug.includes("soporte") || line.includes("soporte");
    if (isSoporte) {
      if (brandSlug === "ads" || brandName === "ads") {
        score += 4500; // Prioridad #1 para soportes ADS
      } else if (brandSlug && brandSlug !== "marca-segun-empaque") {
        score += 800; // Marcas reconocidas
      }
      if (name.includes("soporte motor") || name.includes("soporte de motor") || name.includes("soporte hidraulico") || name.includes("soporte caja")) {
        score += 400;
      }
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
