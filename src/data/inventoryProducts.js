import inventoryRows from "./inventory-stock.json";

const CATEGORY_RULES = [
  {
    slug: "filtros",
    name: "Filtros",
    image: "/filtro-aire-gasolina-catalogo.png",
    terms: ["FILTRO", "FILTRP", "PURIFICADOR AIRE", "ELEMENTO FILTRANTE"],
  },
  {
    slug: "frenos-y-suspension",
    name: "Frenos, Dirección y Suspensión",
    image: "/catalogo-frenos-suspension/direccion-suspension-familia.webp",
    terms: [
      "AMORTIGUADOR", "AMORTIGUADORES", "AMORT", "PASTILLA", "DISCO", "BANDA", "ZAPATA", "FRENO", "ESFERICA",
      "MUÑECO", "ROTULA", "TERMINAL", "TIJERA", "BUJE", "SUSP", "DIRECCION",
      "COLOMBINA", "PORTAMANGUETA", "BIELETA", "ESPIRAL", "GUARDAPOLVO",
      "BRAZO", "CHUPA", "CILINDRO RUEDA", "CIL FRENO", "ANTIRRUIDO", "MORDaza",
      "MORDASA", "CALIPER", "ESTABILIZADORA", "CREMALLERA VOLANTE", "GPOLVO",
      "G.POLVO", "G POLVO", "GUARDA POLVO", "GUARDAPLVO", "GUARD L/",
      "GUARD EJE", "PAT ", "TIJ ", "TEMINAL DIR", "TERM DIR", "LIGAS CALIPER",
      "LIGA CALIPER", "KIT LIGAS", "PIN ANTIRUIDO", "B/E ", "CAUCHO B/E",
    ],
  },
  {
    slug: "electrico-y-encendido",
    name: "Partes Eléctricas y Encendido",
    image: "/catalogo-electricos/encendido-rembert.webp",
    terms: [
      "BOBINA", "BUJIA", "SENSOR", "FUSIBLE", "FLASHER", "SUICHE", "SWITCH",
      "INSTALACION", "INSTAL ", "INST.", "ISNTALACION", "INST ", "PILA", "ALTERNADOR",
      "ARRANQUE", "ELECTR", "BOMBA ELEC", "RELAY", "CONECTOR", "CEBOLLA ENCENDIDO",
      "ACTUADOR", "INYECTOR", "INYETOR", "INYEC ", "KIT MICROS", "VAL IAC", "VALVULA IAC", "PERA ",
    ],
  },
  {
    slug: "radiadores",
    name: "Radiadores y Refrigeración",
    image: "/radiador-auto.jpg",
    terms: [
      "RADIADOR", "MOTOVENT", "TERMOSTATO", "REFRIGERANTE", "DEPOSITO AGUA",
      "TANQUE AGUA", "TANQUE RAD", "ENFRIADOR", "TAPA RADIADOR", "BOMBA AGUA",
      "BOMBA DE AGUA", "DEPOSITO AUX RAD", "DEPOSITO EXP", "DESPOSITO AGUA",
      "T.DEPOSITO LIQUIDO REFRIG", "TAPA TERMOST", "RAD ", "TE DISTRIBUCION AGUA", "DESGASIFICADOR",
    ],
  },
  {
    slug: "embrague",
    name: "Embrague",
    image: "/catalogo-ktx-osram/ktx-kit-embrague-familia.webp",
    terms: [
      "EMBRAG", "CLUTCH", "CLUT ", "CLUTH", "PRENSA", "BALIN CLUTCH", "COLLARIN",
      "BALIBOMBA", "BALI BOMBA", "BOMBA AUX", "BOMBA CLUT", "BOMBA PRINCIPAL",
      "CILIN BOMBA AUX EMB",
    ],
  },
  {
    slug: "transmision",
    name: "Cajas y Transmisión",
    image: "/transmision.png",
    terms: [
      "CAJA", "TRANSM", "SELECTOR CAMBIOS", "PALANCA CAMBIO", "PALANCA CAMBIOS",
      "REPARACION PALANCA", "REP P/CAMBIO", "T SELEC CAMBIO", "PIÑON VELOC",
      "PIÑON VEL", "TULIPA", "TRICETA", "HOMOCINET", "SEMIEJE", "DIFERENCIAL",
      "PLANETARIO", "SATELITE", "SINCRONISMO 3/4", "BRONCE 1RA", "BRONCE 3.4.5",
      "VALVULINA",
    ],
  },
  {
    slug: "rodamientos-y-traccion",
    name: "Rodamientos y Tracción",
    image: "/catalogo-nuevas-lineas/skf-kit-rodamiento-catalogo.png",
    terms: [
      "RODAM", "BALINERA", "BOCIN", "CUBO RUEDA", "PUNTA EJE", "PUNTA L/C",
      "PUNTA L/R", "PUNTA KIA", "EJE RUEDA", "EJE IZQ", "CRUCETA CARDAN",
      "PERNO RUEDA", "PERNO ESPARRAGO RUEDA", "PERNOS RUEDA", "TUERCA PERNO",
      "RD ", "RDE ",
    ],
  },
  {
    slug: "mangueras-y-tubos",
    name: "Mangueras y Tubos",
    image: "/catalogo-lineas/mangueras-tubos-rembert.webp",
    terms: ["MANGUERA", "MANG ", "MANGERA", "MAGUERA", "TUBO"],
  },
  {
    slug: "soportes-retenedores-y-guayas",
    name: "Soportes, Retenedores y Guayas",
    image: "/catalogo-lineas/soportes-retenedores-guayas-rembert.webp",
    terms: ["SOPORTE", "SOP ", "RETEN", "SELLO", "GUAYA"],
  },
  {
    slug: "combustible",
    name: "Combustible e Inyección",
    image: "/catalogo-electricos/combustible-refrigeracion-rembert.webp",
    terms: [
      "BOMBA GASOL", "GASOLINA", "COMBUSTIBLE", "FLOTADOR", "REGULADOR GASOL",
      "REGUL PRESION GASOL", "REGULADOR PRESION", "KIT MANTENIMIENTO INY",
      "LIGA ARO BOMBA GAS", "RIEL INYEC", "CHICLER", "CUERPO ACELERACION",
    ],
  },
  {
    slug: "lubricantes-gasolina",
    name: "Lubricantes y Fluidos",
    image: "/catalogo-mantenimiento/valvoline-high-performance-80w90-gl5.png",
    terms: ["ACEITE", "LIQUIDO FRENO", "LIGA FRENO", "GRASA"],
  },
  {
    slug: "carroceria-iluminacion",
    name: "Carrocería e Iluminación",
    image: "/catalogo-electricos/iluminacion-accesorios-rembert.webp",
    terms: ["FAROLA", "STOP ", "LAMPARA", "BOMBILLO", "COCUYO", "MANIJA", "ESPEJO"],
  },
  {
    slug: "motor-y-distribucion",
    name: "Motor y Distribución",
    image: "/catalogo-nuevas-lineas/gates-kit-distribucion-bomba-agua-catalogo.png",
    terms: [
      "CORREA", "EMPAQUE", "EMP ", "ANILLO", "PISTON", "PISTO ", "JGO PIS",
      "CASQ", "CASQUETE", "VALVULA", "VALV ", "VAL ", "MOTOR", "CIGÜEÑAL",
      "ARBOL", "ARVOL", "EJE LEVAS", "ELE LEVAS", "CULATA", "BIELA", "POLEA",
      "TENSOR", "RODILLO", "BOMBA ACEITE", "BALANCIN", "TAQUE", "KIT ORRING",
      "KIT C/TIEMPO", "KIT TIEMPO", "KIT CADENILLA", "KIT REPARTICION",
      "CADENA REPARTICION", "TAPA REPARTICION", "FLAUTA ESCAPE", "GORRO VALV",
      "TAPA REP ", "JGO TAPONES", "TAPON CARTER", "KIT ORING", "PIÑON CIG",
      "CIL MATIZ", "CILIDNRO", "CILINDRO MAZDA", "VALVILAS",
    ],
  },
];

// The line names come directly from INVENTARIO GENERAL POR LINEAS. Images are
// real catalog photographs already held by REMBERT. They are representative
// of the product family unless an exact-code editorial image exists.
const LINE_PRESENTATION = {
  AMORTIGUADORES: {
    slug: "frenos-y-suspension", name: "Frenos, Dirección y Suspensión",
    image: "/catalogo-proveedores/gabriel-amortiguador-automovil-referencia-vin.jpg",
  },
  BUJES: {
    slug: "frenos-y-suspension", name: "Frenos, Dirección y Suspensión",
    image: "/catalogo-frenos-suspension/soportes-bujes-suspension-familia.webp",
  },
  CAJA: {
    slug: "transmision", name: "Cajas y Transmisión", image: "/transmision.png",
  },
  CHASIS: {
    slug: "frenos-y-suspension", name: "Frenos, Dirección y Suspensión",
    image: "/catalogo-frenos-suspension/direccion-suspension-familia.webp",
  },
  CORREAS: {
    slug: "motor-y-distribucion", name: "Motor y Distribución",
    image: "/catalogo-marcas-watermarked/gates-kit-distribucion-bomba-agua-catalogo.webp",
  },
  DIRECCION: {
    slug: "frenos-y-suspension", name: "Frenos, Dirección y Suspensión",
    image: "/catalogo-frenos-suspension/moog-rotula-axial-empaque-catalogo.webp",
  },
  ELECTRICOS: {
    slug: "electrico-y-encendido", name: "Partes Eléctricas y Encendido",
    image: "/catalogo-electricos/encendido-rembert.webp",
  },
  EMBRAGUE: {
    slug: "embrague", name: "Embrague",
    image: "/catalogo-electricos/phc-valeo-kit-embrague-rembert.webp",
  },
  EMPAQUES: {
    slug: "motor-y-distribucion", name: "Motor y Distribución",
    image: "/catalogo-siliconas-automotrices/victor-reinz-reinzosil-70ml-original.png",
  },
  FAROLA: {
    slug: "carroceria-iluminacion", name: "Carrocería e Iluminación",
    image: "/catalogo-electricos/iluminacion-accesorios-rembert.webp",
  },
  FILTRO: {
    slug: "filtros", name: "Filtros", image: "/filtros-gasolina-render-catalogo.png",
  },
  FRENO: {
    slug: "frenos-y-suspension", name: "Frenos, Dirección y Suspensión",
    image: "/catalogo-frenos-suspension/freno-hidraulico-familia.webp",
  },
  GUARDAPOLVO: {
    slug: "frenos-y-suspension", name: "Frenos, Dirección y Suspensión",
    image: "/catalogo-frenos-suspension/moog-guardapolvos-direccion-empaque-catalogo.webp",
  },
  GUAYAS: {
    slug: "soportes-retenedores-y-guayas", name: "Soportes, Retenedores y Guayas",
    image: "/catalogo-lineas/soportes-retenedores-guayas-rembert.webp",
  },
  LUBRICANTES: {
    slug: "lubricantes-gasolina", name: "Lubricantes y Fluidos",
    image: "/catalogo-mantenimiento/valvoline-high-performance-80w90-gl5.png",
  },
  MANGUERAS: {
    slug: "mangueras-y-tubos", name: "Mangueras y Tubos",
    image: "/catalogo-lineas/mangueras-tubos-rembert.webp",
  },
  MOTOR: {
    slug: "motor-y-distribucion", name: "Motor y Distribución",
    image: "/catalogo-marcas-watermarked/gates-kit-distribucion-bomba-agua-catalogo.webp",
  },
  MOTOVENTILADORES: {
    slug: "radiadores", name: "Radiadores y Refrigeración", image: "/radiador-auto.jpg",
  },
  PASTILLAS: {
    slug: "frenos-y-suspension", name: "Frenos, Dirección y Suspensión",
    image: "/catalogo-frenos/bosch-pastillas-familia.webp",
  },
  RETENEDORES: {
    slug: "soportes-retenedores-y-guayas", name: "Soportes, Retenedores y Guayas",
    image: "/catalogo-lineas/soportes-retenedores-guayas-rembert.webp",
  },
  RODAMIENTOS: {
    slug: "rodamientos-y-traccion", name: "Rodamientos y Tracción",
    image: "/catalogo-marcas-watermarked/skf-kit-rodamiento-catalogo.webp",
  },
  SOPORTES: {
    slug: "soportes-retenedores-y-guayas", name: "Soportes, Retenedores y Guayas",
    image: "/catalogo-frenos-suspension/soportes-bujes-suspension-familia.webp",
  },
  SUSPENSION: {
    slug: "frenos-y-suspension", name: "Frenos, Dirección y Suspensión",
    image: "/catalogo-frenos-suspension/direccion-suspension-familia.webp",
  },
  TUBOS: {
    slug: "mangueras-y-tubos", name: "Mangueras y Tubos",
    image: "/catalogo-lineas/mangueras-tubos-rembert.webp",
  },
};

const EXPLICIT_MANUFACTURERS = [
  "ACDELCO", "BOSCH", "CORTeco", "DAYCO", "GATES", "INA", "KOREASTAR",
  "MOBIS", "SKF", "VALEO", "VERKE", "VICTOR REINZ", "WIX",
];

const normalize = (value = "") => String(value)
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toUpperCase();

const slugify = (value = "") => normalize(value)
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/(^-|-$)/g, "");

// Editorial normalization for the abbreviated descriptions exported by the
// point-of-sale report. Replacements are deliberately contextual: the source
// wording is retained in attributes and never used to infer an unlisted SKU.
function expandInventoryName(value = "") {
  return String(value)
    .replace(/\bAMORT\.?\b/gi, "AMORTIGUADOR")
    .replace(/\bAMORTIGUADOR\s+DEL\b/gi, "AMORTIGUADOR DELANTERO")
    .replace(/\bTRAS\b/gi, "TRASERO")
    .replace(/\bLH\b/g, "IZQUIERDO (LH)")
    .replace(/\bRH\b/g, "DERECHO (RH)")
    .replace(/\bDER\b/g, "DERECHO")
    .replace(/\bIZQ\b/g, "IZQUIERDO")
    .replace(/\bDIR\b/g, "DIRECCIÓN")
    .replace(/\bINF\b/g, "INFERIOR")
    .replace(/\bSUP\b/g, "SUPERIOR")
    .replace(/^EMP\b/i, "EMPAQUE")
    .replace(/^SOP\b/i, "SOPORTE")
    .replace(/^MANG\.?\b/i, "MANGUERA")
    .replace(/\b(?:MAGUERA|MANGERA)\b/gi, "MANGUERA")
    .replace(/\bRAD\b/g, "RADIADOR")
    .replace(/\bGPOLVO\b|\bG\s+POLVO\b|\bGUARDA\s+POLVO\b/gi, "GUARDAPOLVO")
    .replace(/\bTEMINAL\b/gi, "TERMINAL")
    .replace(/\bHYU\b|\bHUY\b|\bHYNDAY\b/g, "HYUNDAI")
    .replace(/\bCHEV\b/g, "CHEVROLET")
    .replace(/\bSYM\b/g, "SYMBOL")
    .replace(/\bMEG\b/g, "MEGANE")
    .replace(/\bTACSON\b/g, "TUCSON")
    .replace(/\bFIERTA\b/g, "FIESTA")
    .replace(/\bKIWD\b/g, "KWID")
    .replace(/^CIL(?=\s+(?:FRENO|MATIZ|SPARK))\b/i, "CILINDRO")
    .replace(/\b(\d+)\s+CIL\b/g, "$1 CILINDROS")
    .replace(/\bMULT\s+ADMS?\b/g, "MÚLTIPLE DE ADMISIÓN")
    .replace(/\bMULT\s+ESC\b/g, "MÚLTIPLE DE ESCAPE")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function categoryFor(name, inventoryLine) {
  const searchable = normalize(name);
  const technicalMatch = CATEGORY_RULES.find((category) => (
    category.terms.some((term) => searchable.includes(normalize(term)))
  ));
  if (technicalMatch) return technicalMatch;
  const linePresentation = LINE_PRESENTATION[normalize(inventoryLine)];
  if (linePresentation) return linePresentation;
  return {
    slug: "repuestos-varios",
    name: "Otros Repuestos en Inventario",
    image: "/logo.png",
  };
}

function manufacturerFor(name) {
  const searchable = normalize(name);
  const manufacturer = EXPLICIT_MANUFACTURERS.find((candidate) => (
    searchable.includes(normalize(candidate))
  ));
  const label = manufacturer || "Marca según empaque";
  return { name: label, slug: slugify(label) };
}

function stockValue(value) {
  return Number.isInteger(value) ? value : Number(value);
}

export const inventoryProducts = inventoryRows.map((row) => {
  const category = categoryFor(row.n, row.l);
  const brand = manufacturerFor(row.n);
  const displayName = expandInventoryName(row.n);
  const id = `inventario-${row.i}-${slugify(row.c)}`;
  const stock = stockValue(row.s);
  const sourceLabel = `INVENTARIO GENERAL · página ${row.g} · renglón ${row.i} · línea ${row.l || "SIN LINEA"} verificada en página ${row.h || "—"} del informe por líneas`;

  return {
    id,
    slug: `${slugify(displayName).slice(0, 72)}-${slugify(row.c)}`,
    name: displayName,
    sourceName: row.n,
    sku: row.c,
    referenceType: "inventory",
    inventoryLine: row.l || "SIN LINEA",
    category: { name: category.name, slug: category.slug },
    brand,
    price: row.p,
    stock,
    inStock: stock > 0,
    shortDesc: `Referencia ${row.c} · ${stock} unidad${stock === 1 ? "" : "es"} registrada${stock === 1 ? "" : "s"} en inventario.`,
    description: `${displayName}. Referencia interna o fabricante ${row.c}. La aplicación vehicular se conserva exactamente como aparece en el inventario y debe confirmarse por VIN, año, motor, versión y muestra antes del despacho.`,
    image: category.image,
    images: [{
      url: category.image,
      alt: `Imagen referencial de la línea ${category.name} para ${displayName}`,
      isMain: true,
    }],
    imageStatus: row.l && row.l !== "SIN LINEA"
      ? "inventory-line-real-reference"
      : "inventory-family-reference",
    fitmentStatus: "inventory-listed",
    fitmentSummary: `Aplicación registrada: ${displayName}`,
    fitmentRequirements: ["VIN", "año", "motor", "versión", "muestra o referencia desmontada"],
    fitmentSource: sourceLabel,
    fitments: [{
      make: "Aplicación indicada en inventario",
      model: displayName,
      years: "Confirmar por VIN",
      position: category.name,
    }],
    attributes: [
      { id: `${id}-code`, name: "Código de inventario", value: row.c },
      { id: `${id}-application`, name: "Aplicación registrada", value: row.n },
      { id: `${id}-editorial`, name: "Descripción normalizada", value: displayName },
      { id: `${id}-line`, name: "Línea de inventario", value: row.l || "SIN LINEA" },
      { id: `${id}-stock`, name: "Existencia registrada", value: String(stock) },
      { id: `${id}-source`, name: "Fuente", value: sourceLabel },
      { id: `${id}-validation`, name: "Validación obligatoria", value: "Confirmar VIN, año, motor, versión y muestra antes del despacho" },
      { id: `${id}-image`, name: "Imagen", value: "Referencia visual de la línea; el producto se identifica por código y descripción" },
    ],
  };
});

export const inventoryCategorySummary = CATEGORY_RULES.map(({ slug, name }) => ({
  slug,
  name,
  count: inventoryProducts.filter((product) => product.category.slug === slug).length,
})).filter((category) => category.count > 0);

export const inventoryLineSummary = Array.from(
  inventoryProducts.reduce((lines, product) => {
    const line = product.inventoryLine || "SIN LINEA";
    lines.set(line, (lines.get(line) || 0) + 1);
    return lines;
  }, new Map())
).map(([name, count]) => ({ name, count }))
  .sort((a, b) => a.name.localeCompare(b.name, "es"));
