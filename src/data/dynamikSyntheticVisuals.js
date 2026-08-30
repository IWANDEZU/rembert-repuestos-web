// Visuales generados bajo petición del usuario cuando no existe una fotografía
// física verificable. Nunca se consideran evidencia de compatibilidad ni se
// mezclan con las fotos reales del manifiesto de trazabilidad.
const CLUTCH_KIT_SKUS = new Set([
  "DNK19234000", "DNK19305600", "DNK20312700", "DNK20332833",
  "DNK21302200", "DNK22314900", "DNK22315033", "DNK22321800",
  "DNK22322733", "DNK22350633", "DNK23340633", "DNK23355900",
  "DNK23370934",
]);

// Recreaciones solicitadas por el usuario a partir de un cruce de referencia
// exacto. Cada SKU entra aquí únicamente después de comprobar FMSI/geometría
// contra otra marca y contra la ficha técnica Ciosa.
const CROSS_BRAND_RECREATION_SKUS = new Set([
  "DNK7365D484SM",
  "DNK7370D490SM",
  "DNK7482D602SM",
  "DNK7540D660SM",
]);

const getComponentFamily = (sku) => {
  if (CLUTCH_KIT_SKUS.has(sku)) return "clutch-kit";
  if (sku === "DYNAMIK-BRAKE-DISCS-COT") return "brake-disc";
  return "brake-pad";
};

const createGeneratedReference = (sku, assetUrl, source = null) => {
  const url = assetUrl || `/catalogo-dynamik/ilustraciones-generadas/${sku.toLowerCase()}-ilustracion-sintetica.png`;
  const alt = `Ilustración sintética de referencia para Dynamik ${sku}`;

  return {
    sku,
    componentFamily: getComponentFamily(sku),
    imageStatus: "generated-reference-image",
    imageDisclosure: source
      ? `Recreación referencial Dynamik basada en el cruce exacto ${source.crossReference}; no es una fotografía física del producto. Confirmar NPC, VIN, sistema de freno y geometría antes de comprar o instalar.`
      : "Ilustración sintética de referencia; no es una fotografía física verificada. Confirmar NPC, VIN, sistema de freno y geometría antes de comprar o instalar.",
    sourceUrl: source?.url || null,
    crossReference: source?.crossReference || null,
    main: { url, alt },
    views: [{
      url,
      alt,
      label: "Ilustración IA · no verificada",
      isMain: true,
      synthetic: true,
    }],
  };
};

const dynamikSyntheticVisuals = Object.freeze({
  DNKOE26275860CK: createGeneratedReference("DNKOE26275860CK", "/catalogo-dynamik/ilustraciones-generadas/dnkoe26275860ck-ilustracion-sintetica-v2.png"),
  DNKOE26275860LM: createGeneratedReference("DNKOE26275860LM", "/catalogo-dynamik/ilustraciones-generadas/dnkoe26275860lm-ilustracion-sintetica-v1.png"),
  DNKOE410602596LM: createGeneratedReference("DNKOE410602596LM", "/catalogo-dynamik/ilustraciones-generadas/dnkoe410602596lm-ilustracion-sintetica-v1.png"),
  "DYNAMIK-BRAKE-PADS-COT": createGeneratedReference("DYNAMIK-BRAKE-PADS-COT", "/catalogo-dynamik/dynamik-pastillas-familia-referencial-v1.png"),
  "DYNAMIK-BRAKE-DISCS-COT": createGeneratedReference("DYNAMIK-BRAKE-DISCS-COT", "/catalogo-dynamik/dynamik-disco-freno-familia-referencial-v1.png"),
  DNK000TY21D: createGeneratedReference("DNK000TY21D", "/catalogo-dynamik/dynamik-dnk000ty21d-toyota-corolla-referencial-v1.png"),
  DNK29231LM: createGeneratedReference("DNK29231LM", "/catalogo-dynamik/dynamik-dnk29231lm-iveco-daily-referencial-v1.png"),
  DK18017GMS: createGeneratedReference("DK18017GMS", "/catalogo-dynamik/dynamik-dk18017gms-mazda-cx5-referencial-v1.png"),
  DNK7228D333SM: createGeneratedReference("DNK7228D333SM", "/catalogo-dynamik/dynamik-dnk7228d333sm-nissan-frontier-referencial-v1.png"),
  DNK7234D340LM: createGeneratedReference("DNK7234D340LM", "/catalogo-dynamik/dynamik-dnk7234d340lm-audi-volkswagen-referencial-v1.png"),
  DNK7247D356SM: createGeneratedReference("DNK7247D356SM", "/catalogo-dynamik/dynamik-dnk7247d356sm-toyota-corolla-referencial-v1.png"),
  DNK7289D400SM: createGeneratedReference("DNK7289D400SM", "/catalogo-dynamik/dynamik-dnk7289d400sm-mazda-626-mx6-referencial-v1.png"),
  DNK7937D1033LM: createGeneratedReference("DNK7937D1033LM", "/catalogo-dynamik/dynamik-dnk7937d1033lm-chevrolet-referencial-v1.png"),
  DNK8258D1148SM: createGeneratedReference("DNK8258D1148SM", "/catalogo-dynamik/dynamik-dnk8258d1148sm-hyundai-atos-referencial-v1.png"),
  DNK7417D535SM: createGeneratedReference("DNK7417D535SM", "/catalogo-dynamik/dynamik-dnk7417d535sm-mitsubishi-lancer-referencial-v1.png"),
  DNK7435D556LM: createGeneratedReference("DNK7435D556LM", "/catalogo-dynamik/dynamik-dnk7435d556lm-chevrolet-vitara-referencial-v1.png"),
  DNK7435D556SM: createGeneratedReference("DNK7435D556SM", "/catalogo-dynamik/dynamik-dnk7435d556sm-chevrolet-vitara-referencial-v1.png"),
  DNK7694D821SD: createGeneratedReference("DNK7694D821SD", "/catalogo-dynamik/dynamik-dnk7694d821sd-dodge-ram-referencial-v1.png"),
  DNK7697D1732SD: createGeneratedReference("DNK7697D1732SD", "/catalogo-dynamik/dynamik-dnk7697d1732sd-hino-isuzu-referencial-v1.png"),
  DNK7742D867SM: createGeneratedReference("DNK7742D867SM", "/catalogo-dynamik/dynamik-dnk7742d867sm-mitsubishi-montero-referencial-v1.png"),
  DNK19234000: createGeneratedReference("DNK19234000"),
  DNK19305600: createGeneratedReference("DNK19305600"),
  DNK20312700: createGeneratedReference("DNK20312700"),
  DNK20332833: createGeneratedReference("DNK20332833"),
  DNK21302200: createGeneratedReference("DNK21302200"),
  DNK22314900: createGeneratedReference("DNK22314900"),
  DNK22315033: createGeneratedReference("DNK22315033"),
  DNK22321800: createGeneratedReference("DNK22321800"),
  DNK22322733: createGeneratedReference("DNK22322733"),
  DNK22350633: createGeneratedReference("DNK22350633"),
  DNK23340633: createGeneratedReference("DNK23340633"),
  DNK23355900: createGeneratedReference("DNK23355900"),
  DNK23370934: createGeneratedReference("DNK23370934"),
  DNK7104D281SM: createGeneratedReference("DNK7104D281SM"),
  DNK7112D188SM: createGeneratedReference("DNK7112D188SM"),
  DNK7138D217SM: createGeneratedReference("DNK7138D217SM"),
  DNK7183D569SM: createGeneratedReference("DNK7183D569SM"),
  DNK7365D484SM: createGeneratedReference(
    "DNK7365D484SM",
    "/catalogo-dynamik/ilustraciones-generadas/dnk7365d484sm-ilustracion-sintetica.png",
    { crossReference: "FMSI 7365-D484 · Raybestos SGD484C", url: "https://a-premium.com/product/raybestos-brake-pad-sgd484c" }
  ),
  DNK7370D490SM: createGeneratedReference(
    "DNK7370D490SM",
    "/catalogo-dynamik/ilustraciones-generadas/dnk7370d490sm-ilustracion-sintetica.png",
    { crossReference: "FMSI 7370-D490 · Brembo P 16 010", url: "https://www.bremboparts.com/europe/en/catalogue/pad/P_16_010" }
  ),
  DNK7388D509SM: createGeneratedReference("DNK7388D509SM"),
  DNK7482D602SM: createGeneratedReference(
    "DNK7482D602SM",
    "/catalogo-dynamik/ilustraciones-generadas/dnk7482d602sm-ilustracion-sintetica.png",
    { crossReference: "FMSI 7482-D602 · Raybestos PGD602", url: "https://a-premium.com/product/raybestos-brake-pad-pgd602" }
  ),
  DNK7540D660SM: createGeneratedReference(
    "DNK7540D660SM",
    "/catalogo-dynamik/ilustraciones-generadas/dnk7540d660sm-ilustracion-sintetica-v2.png",
    { crossReference: "FMSI 7540-D660 · Brembo P 79 001 · WVA 21142", url: "https://www.bremboparts.com/europe/en/catalogue/pad/P_79_001" }
  ),
  DNK7545AD667SM: createGeneratedReference("DNK7545AD667SM"),
  DNK7550D670SM: createGeneratedReference("DNK7550D670SM"),
  DNK7556D676SM: createGeneratedReference("DNK7556D676SM"),
  DNK7557D677SM: createGeneratedReference("DNK7557D677SM"),
  DNK7575D701SM: createGeneratedReference("DNK7575D701SM"),
  DNK7586D580SM: createGeneratedReference("DNK7586D580SM"),
  DNK7593D726SM: createGeneratedReference("DNK7593D726SM"),
});

export const getDynamikSyntheticVisual = (sku) => dynamikSyntheticVisuals[String(sku || "").trim().toUpperCase()] || null;

export const isDynamikSyntheticVisualCompatible = (product, visual) => {
  if (!product || !visual) return false;
  const sku = String(product.sku || "").toUpperCase();
  // Una referencia física solo puede usar una recreación cuando su cruce
  // geométrico fue validado y existe un archivo exclusivo para ese NPC.
  if (!sku.endsWith("-COT") && !CROSS_BRAND_RECREATION_SKUS.has(sku)) return false;
  const name = String(product.name || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  if (visual.componentFamily === "brake-pad") return name.includes("pastill");
  if (visual.componentFamily === "brake-disc") return name.includes("disco");
  if (visual.componentFamily === "clutch-kit") return name.includes("embrague");
  return false;
};

export default dynamikSyntheticVisuals;
