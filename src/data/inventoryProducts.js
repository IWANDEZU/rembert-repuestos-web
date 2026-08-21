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
      "AMORT", "PASTILLA", "DISCO", "BANDA", "ZAPATA", "FRENO", "ESFERICA",
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

const EXPLICIT_MANUFACTURERS = [
  "ACDELCO", "BOSCH", "CORTeco", "DAYCO", "GATES", "INA", "KOREASTAR",
  "MOBIS", "SKF", "VALEO", "VICTOR REINZ", "WIX",
];

const normalize = (value = "") => String(value)
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toUpperCase();

const slugify = (value = "") => normalize(value)
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/(^-|-$)/g, "");

function categoryFor(name) {
  const searchable = normalize(name);
  return CATEGORY_RULES.find((category) => (
    category.terms.some((term) => searchable.includes(normalize(term)))
  )) || {
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
  const category = categoryFor(row.n);
  const brand = manufacturerFor(row.n);
  const id = `inventario-${row.i}-${slugify(row.c)}`;
  const stock = stockValue(row.s);
  const sourceLabel = `INVENTARIO GENERAL · página ${row.g} · renglón ${row.i}`;

  return {
    id,
    slug: `${slugify(row.n).slice(0, 72)}-${slugify(row.c)}`,
    name: row.n,
    sku: row.c,
    referenceType: "inventory",
    category: { name: category.name, slug: category.slug },
    brand,
    price: row.p,
    stock,
    inStock: stock > 0,
    shortDesc: `Referencia ${row.c} · ${stock} unidad${stock === 1 ? "" : "es"} registrada${stock === 1 ? "" : "s"} en inventario.`,
    description: `${row.n}. Referencia interna o fabricante ${row.c}. La aplicación vehicular se conserva exactamente como aparece en el inventario y debe confirmarse por VIN, año, motor, versión y muestra antes del despacho.`,
    image: category.image,
    images: [{
      url: category.image,
      alt: `Imagen referencial de la línea ${category.name} para ${row.n}`,
      isMain: true,
    }],
    imageStatus: "inventory-family-reference",
    fitmentStatus: "inventory-listed",
    fitmentSummary: `Aplicación registrada: ${row.n}`,
    fitmentRequirements: ["VIN", "año", "motor", "versión", "muestra o referencia desmontada"],
    fitmentSource: sourceLabel,
    fitments: [{
      make: "Aplicación indicada en inventario",
      model: row.n,
      years: "Confirmar por VIN",
      position: category.name,
    }],
    attributes: [
      { id: `${id}-code`, name: "Código de inventario", value: row.c },
      { id: `${id}-application`, name: "Aplicación registrada", value: row.n },
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
