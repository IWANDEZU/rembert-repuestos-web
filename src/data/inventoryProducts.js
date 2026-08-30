import inventoryRows from "./inventory-stock.json" with { type: "json" };

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
    image: "/catalogo-frenos-suspension/soportes-bujes-suspension-familia.webp",
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
    image: "/catalogo-frenos-suspension/soportes-bujes-suspension-familia.webp",
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
  "PHC VALEO",
  "VICTOR REINZ",
  "CHEVROLET / EQUIPO ORIGINAL",
  "MANDO / EQUIPO ORIGINAL COREA",
  "ACDELCO",
  "ADS",
  "BOSCH",
  "CASTROL",
  "CHEVRON",
  "COFRE",
  "CORTECO",
  "CTR",
  "DAYCO",
  "DONSSON",
  "EAGLE BHP",
  "EAGLE",
  "GABRIEL",
  "GATES",
  "GLOBAL OIL",
  "GTI",
  "INA",
  "INCOLBEST",
  "KOREASTAR",
  "LIQUI MOLY",
  "LUK",
  "MANDO",
  "MAX POWER",
  "MOBIL",
  "MOBIS",
  "MONROE",
  "MOTUL",
  "NGK",
  "OSRAM",
  "PARTMO",
  "PETROIL",
  "ROWEN",
  "SAFETY",
  "SHELL",
  "SKF",
  "TERPEL",
  "TNK",
  "VALEO",
  "VALVOLINE",
  "VERKE",
  "WIX",
  "VAZLO",
  "555",
];

// Brand and application overrides are deliberately limited to inventory codes
// that were cross-checked against public Colombian catalogs or import records.
// A visual resemblance is never enough to assign a manufacturer or fitment.
const GTI06052_OVERRIDE = {
  manufacturerReference: "GTI06-052",
  name: "Eje homocinético izquierdo GTI — Kia Picanto I/II",
  brand: "GTI",
  image: "/catalogo-gti/gti-foto-real-pendiente-v1.webp",
  images: [
    {
      url: "/catalogo-gti/gti-foto-real-pendiente-v1.webp",
      alt: "Foto real pendiente del eje homocinético izquierdo GTI06-052 para Kia Picanto I/II",
      isMain: true,
    },
  ],
  imageAlt: "Foto real pendiente del eje homocinético izquierdo GTI06-052 para Kia Picanto I/II",
  shortDesc: "Eje homocinético izquierdo GTI06-052 · Kia Picanto I/II · inventario 24 × 25.",
  description: "Eje homocinético delantero izquierdo GTI06-052 para Kia Picanto I/II. El inventario REMBERT registra 24 × 25 y código interno 24110-02200. Confirmar VIN, generación, transmisión, estrías de ambos extremos, largo total y presencia de ABS antes del despacho. La foto real exacta continúa pendiente.",
  fitmentSummary: "GTI06-052: Kia Picanto I/II · eje delantero izquierdo · inventario 24 × 25; validar VIN, generación y medidas.",
  fitmentPosition: "Eje delantero izquierdo (LH)",
  fitmentRequirements: ["VIN", "generación y año", "transmisión", "estrías de ambos extremos", "largo total", "ABS", "etiqueta GTI06-052"],
  fitmentSource: "INVENTARIO GENERAL POR LINEAS, página 74, renglón 940 · GTI06-052 confirmada como marca GTI y eje homocinético izquierdo Kia Picanto I/II en catálogos colombianos",
  fitments: [
    {
      make: "Kia",
      model: "Picanto I / Picanto II",
      engine: "Confirmar por VIN",
      years: "Confirmar generación y año por VIN",
      position: "Eje delantero izquierdo (LH)",
    },
  ],
  attributes: [
    { name: "Referencia GTI", value: "GTI06-052" },
    { name: "Código interno REMBERT", value: "24110-02200" },
    { name: "Configuración de inventario", value: "24 × 25" },
    { name: "Estado de imagen", value: "Foto real exacta pendiente" },
  ],
  fitmentStatus: "conditional",
  imageStatus: "photo-pending",
  brandProof: "GTI · referencia exacta GTI06-052+ confirmada en catálogos colombianos de ejes homocinéticos",
};

const VERIFIED_SKU_OVERRIDES = {
  "2411002200": GTI06052_OVERRIDE,
  "5768": {
    name: "Base de Amortiguador Delantero VAZLO 5768 — Chevrolet Tracker (RH/LH)",
    brand: "VAZLO",
    image: "/catalogo-frenos-suspension/vazlo-5768-base-amortiguador-delantero-chevrolet-tracker-catalogo-blanco.webp",
    images: [
      {
        url: "/catalogo-frenos-suspension/vazlo-5768-base-amortiguador-delantero-chevrolet-tracker-catalogo-blanco.webp",
        alt: "Fotografía real de base de amortiguador delantera VAZLO 5768 para Chevrolet Tracker; código físico 407-YZH-5768",
        isMain: true,
      },
      {
        url: "/catalogo-frenos-suspension/vazlo-5768-base-amortiguador-delantero-chevrolet-tracker-reverso-catalogo-blanco.webp",
        alt: "Reverso de caucho y buje central de la base de amortiguador VAZLO 5768 para Chevrolet Tracker",
        isMain: false,
      },
    ],
    imageAlt: "Fotografía real de base de amortiguador delantera VAZLO 5768 para Chevrolet Tracker; código físico 407-YZH-5768",
    shortDesc: "Base / soporte de amortiguador delantero VAZLO 5768 · Chevrolet Tracker (RH/LH) · código físico 407-YZH-5768.",
    description: "Base o soporte superior de amortiguador delantero (strut mount / copela) marca VAZLO con código físico 407-YZH-5768 para Chevrolet Tracker (1.8L Ecotec y Turbo). Fabricada con caucho vulcanizado y copela de acero estampado con garantía de 1 año o 20.000 km. Diseñada para aislar vibraciones, ruidos de rodadura y brindar sujeción estructural a la suspensión McPherson. Aplica indistintamente para lado derecho (RH) e izquierdo (LH).",
    fitmentSummary: "407-YZH-5768 / 5768: Chevrolet Tracker (2013–2019 / 2020+) · Eje delantero (RH/LH) · Cruces OE 95227628 / 95015324 / 26298703.",
    fitmentPosition: "Eje delantero · Lado derecho (RH) e izquierdo (LH)",
    fitmentRequirements: ["VIN", "año de fabricación", "motorización (1.8L / Turbo)", "lado bilateral RH/LH", "referencia OE o muestra física"],
    fitmentSource: "Marca VAZLO confirmada por REMBERT; código físico 407-YZH-5768 en la pieza suministrada; descripción del INVENTARIO GENERAL renglón 284; cruces técnicos de suspensión",
    fitments: [
      {
        make: "Chevrolet",
        model: "Tracker / Trax (1ra Generación)",
        engine: "1.8L Ecotec Gasolina FWD / AWD",
        years: "2013–2019",
        position: "Eje delantero · Derecho (RH) e Izquierdo (LH)",
      },
      {
        make: "Chevrolet",
        model: "Tracker Turbo (2da Generación)",
        engine: "1.2L Turbo Ecotec",
        years: "2020–2024",
        position: "Eje delantero · Derecho (RH) e Izquierdo (LH)",
      },
      {
        make: "Chevrolet",
        model: "Sonic / Spin / Cobalt",
        engine: "1.6L / 1.8L Gasolina",
        years: "2012–2018",
        position: "Eje delantero · Bilateral (confirmar OE)",
      },
    ],
    attributes: [
      { name: "Tipo de producto", value: "Base / soporte superior de amortiguador delantero (Strut Mount / Copela)" },
      { name: "Código grabado en pieza", value: "407-YZH-5768" },
      { name: "Código de inventario", value: "5768 (código interno / proveedor *804210*)" },
      { name: "Marca comercial", value: "VAZLO (confirmada por REMBERT)" },
      { name: "Garantía de fabricante", value: "1 año o 20.000 km (especificada en empaque original)" },
      { name: "Posición y montaje", value: "Eje delantero · Compatible lado derecho (RH) y lado izquierdo (LH)" },
      { name: "Cruces OE de referencia", value: "95227628 · 95015324 · 95943131 · 26298703 · 13502180 · 95142646" },
      { name: "Vehículos compatibles", value: "Chevrolet Tracker 1.8L (2013–2019) y Tracker Turbo (2020+)" },
    ],
    marketBenchmark: "Precio REMBERT $130.989 COP; mercado colombiano observado: $95.000–$145.000 COP por unidad",
    fitmentStatus: "verified",
    imageStatus: "real-product-photo",
    imagePresentation: "catalog-white-background",
    brandProof: "VAZLO · marca confirmada por REMBERT; la pieza real conserva el código físico 407-YZH-5768",
  },
  "96586886": {
    brand: "ROWEN",
    image: "/catalogo-rowen/rowen-amortiguadores-macpherson-empaque-real.webp",
    imageAlt: "Fotografía real de amortiguadores Rowen con empaque rojo; referencia visual de familia",
    shortDesc: "Amortiguador delantero derecho Rowen · Chevrolet Aveo / Sail · referencia 96586886.",
    description: "Amortiguador delantero derecho Rowen referencia 96586886 para aplicaciones Chevrolet Aveo / Sail. Confirmar año, versión, plataforma, anclajes, diámetro de vástago y VIN antes del despacho.",
    fitmentSummary: "Chevrolet Aveo / Sail · delantero derecho · confirmar año, versión y VIN.",
    fitmentPosition: "Delantero derecho",
    fitmentSource: "Referencia Rowen 96586886 contrastada con publicación comercial colombiana de amortiguación",
    marketBenchmark: "REMBERT $198.314; comparable Rowen observado: $145.000 por unidad. Revisar costo y margen antes de ajustar",
  },
  "96424027": {
    brand: "ROWEN",
    image: "/catalogo-rowen/rowen-amortiguadores-macpherson-empaque-real.webp",
    imageAlt: "Fotografía real de amortiguadores Rowen con su empaque rojo; imagen de familia de producto",
    shortDesc: "Amortiguador trasero Rowen · Chevrolet Spark / Spark Cronos · referencia 96424027.",
    description: "Amortiguador trasero Rowen referencia 96424027 para aplicaciones Chevrolet Spark y Spark Cronos. La posición por lado, generación, año y montaje final deben validarse con VIN y con la pieza desmontada antes del despacho.",
    fitmentSummary: "Chevrolet Spark / Spark Cronos · eje trasero · confirmar generación, año y VIN.",
    fitmentPosition: "Eje trasero",
    fitmentSource: "Referencia Rowen 96424027 verificada en registros de importación colombianos y contrastada con publicaciones comerciales nacionales",
    marketBenchmark: "REMBERT $90.250; comparables observados: $85.000 por unidad y $155.000–$180.000 por juego",
  },
  "333723": {
    brand: "ROWEN",
    image: "/catalogo-rowen/rowen-amortiguadores-macpherson-empaque-real.webp",
    imageAlt: "Fotografía real de amortiguadores Rowen con su empaque rojo; imagen de familia de producto",
    shortDesc: "Amortiguador delantero derecho Rowen · Renault Twingo 16V · referencia 333723.",
    description: "Amortiguador delantero derecho Rowen referencia 333723 para aplicaciones Renault Twingo 16V. Confirmar año, versión, lado, diámetro de vástago, anclajes y VIN antes del despacho.",
    fitmentSummary: "Renault Twingo 16V · delantero derecho · confirmar año, versión y VIN.",
    fitmentPosition: "Delantero derecho",
    fitmentSource: "Referencia Rowen 333723 contrastada con catálogo comercial colombiano de amortiguación",
    marketBenchmark: "REMBERT $220.894 por unidad; mercado observado: $130.000–$220.300 por unidad y $229.890–$330.000 por juego",
  },
  "348018": {
    brand: "ROWEN",
    image: "/catalogo-rowen/rowen-amortiguadores-macpherson-empaque-real.webp",
    imageAlt: "Fotografía real de amortiguadores Rowen con empaque rojo; referencia visual de familia",
    shortDesc: "Amortiguador trasero Rowen · Mazda 2 / Ford Fiesta 2010+ · referencia 348018.",
    description: "Amortiguador trasero Rowen referencia 348018 para aplicaciones Mazda 2 / Ford Fiesta desde 2010 según publicación colombiana. Confirmar generación, carrocería, suspensión, anclajes y VIN antes del despacho.",
    fitmentSummary: "Mazda 2 / Ford Fiesta 2010+ · eje trasero · confirmar generación y VIN.",
    fitmentPosition: "Eje trasero",
    fitmentSource: "Referencia Rowen 348018-CH contrastada con publicación colombiana y catálogo técnico de aplicación Mazda 2",
    marketBenchmark: "REMBERT $166.848 por unidad; juego Rowen observado a $272.792. Comparar solo después de confirmar cantidad y referencia",
  },
  "333494": {
    brand: "ROWEN",
    image: "/catalogo-rowen/rowen-amortiguadores-macpherson-empaque-real.webp",
    imageAlt: "Fotografía real de amortiguadores Rowen con empaque rojo; referencia visual de familia",
    shortDesc: "Amortiguador delantero derecho Rowen · Mazda 2 2008–2015 · referencia 333494.",
    description: "Amortiguador delantero derecho Rowen referencia 333494 para Mazda 2 2008–2015. Confirmar año, generación, motor, lado, anclajes y VIN; la referencia pareja habitual es 333495, cuya marca en inventario todavía no está demostrada.",
    fitmentSummary: "Mazda 2 2008–2015 · delantero derecho · confirmar año, lado y VIN.",
    fitmentPosition: "Delantero derecho",
    fitmentSource: "Referencia Rowen 333494-CH contrastada con publicación colombiana; posición y años apoyados por catálogos técnicos",
    marketBenchmark: "REMBERT $226.784 por unidad; publicación Rowen consultada sin precio vigente comparable",
  },
  "3430045": {
    brand: "ROWEN",
    image: "/catalogo-rowen/rowen-amortiguadores-macpherson-empaque-real.webp",
    imageAlt: "Fotografía real de amortiguadores Rowen con empaque rojo; referencia visual de familia",
    shortDesc: "Amortiguador trasero Rowen · Mazda 2 Skyactiv 2016–2023 · referencia 3430045.",
    description: "Amortiguador trasero Rowen referencia 3430045 para Mazda 2 Skyactiv 2016–2023. La publicación comercial lo ofrece como juego derecho/izquierdo; el precio REMBERT corresponde a la unidad registrada. Confirmar año, suspensión, anclajes y VIN.",
    fitmentSummary: "Mazda 2 Skyactiv 2016–2023 · eje trasero · confirmar año y VIN.",
    fitmentPosition: "Eje trasero",
    fitmentSource: "Referencia Rowen 3430045-CH contrastada con publicación colombiana; años apoyados por catálogo técnico",
    marketBenchmark: "REMBERT $185.551 por unidad; publicación Rowen consultada sin precio vigente comparable",
  },
  "96535431": {
    name: "Soporte Motor Derecho Chevrolet Aveo 1.4 / 1.6 — 96535431",
    brand: "Marca según empaque",
    image: "/banco-imagenes/soportes-motor/chevrolet-kia/chevrolet-aveo-soporte-derecho-96535431-referencial.png",
    images: [{
      url: "/banco-imagenes/soportes-motor/chevrolet-kia/chevrolet-aveo-soporte-derecho-96535431-referencial.png",
      alt: "Recreación digital referencial de soporte de motor derecho Chevrolet Aveo 96535431",
      isMain: true,
    }],
    imageAlt: "Recreación digital referencial de soporte de motor derecho Chevrolet Aveo 96535431",
    imageStatus: "generated-reference-image",
    imageDisclosure: "Recreación digital referencial de la pieza; confirmar referencia física antes de comprar o instalar.",
    shortDesc: "Soporte motor derecho para Chevrolet Aveo 1.4 / 1.6 · referencia 96535431.",
    description: "Soporte de motor derecho para Chevrolet Aveo 1.4 / 1.6, identificado por la referencia 96535431 registrada en INVENTARIO GENERAL. La geometría de anclajes y la versión del motor deben confirmarse por VIN o muestra física antes del despacho.",
    fitmentSummary: "Chevrolet Aveo 1.4 / 1.6 · soporte de motor derecho (RH) · referencia 96535431.",
    fitmentPosition: "Motor · lado derecho (RH)",
    fitmentRequirements: ["VIN", "año", "motor 1.4 / 1.6", "posición derecha", "referencia 96535431 o muestra física"],
    fitmentSource: "INVENTARIO GENERAL, renglón 2615 · Catálogo Star Parts Colombia: soporte motor derecho Chevrolet Aveo, referencia 96535431",
    fitments: [{
      make: "Chevrolet",
      model: "Aveo",
      engine: "1.4L / 1.6L",
      years: "Confirmar por VIN y generación",
      position: "Motor · lado derecho (RH)",
    }],
    attributes: [
      { name: "Referencia", value: "96535431" },
      { name: "Posición", value: "Motor · derecho (RH)" },
      { name: "Estado de imagen", value: "Recreación digital referencial, no fotografía oficial" },
    ],
    fitmentStatus: "verified-by-oe",
    brandProof: "Marca no identificada en el renglón de inventario; la aplicación se sustenta por la referencia exacta 96535431",
  },
  "218102V000": {
    name: "Soporte Motor Derecho Kia Rio Spice / Hyundai i25 1.2 — 21810-2V000",
    brand: "Marca según empaque",
    image: "/banco-imagenes/soportes-motor/chevrolet-kia/kia-rio-spice-soporte-derecho-21810-2v000-referencial.png",
    images: [{
      url: "/banco-imagenes/soportes-motor/chevrolet-kia/kia-rio-spice-soporte-derecho-21810-2v000-referencial.png",
      alt: "Recreación digital referencial de soporte de motor derecho Kia Rio Spice 21810-2V000",
      isMain: true,
    }],
    imageAlt: "Recreación digital referencial de soporte de motor derecho Kia Rio Spice 21810-2V000",
    imageStatus: "generated-reference-image",
    imageDisclosure: "Recreación digital referencial de la pieza; confirmar referencia física antes de comprar o instalar.",
    shortDesc: "Soporte motor derecho para Kia Rio Spice / Hyundai i25 1.2 · referencia 21810-2V000.",
    description: "Soporte de motor derecho para Kia Rio Spice y Hyundai i25 1.2, identificado por la referencia 21810-2V000 registrada en INVENTARIO GENERAL. Verificar VIN, cilindrada, caja y puntos de anclaje antes de la compra.",
    fitmentSummary: "Kia Rio Spice / Hyundai i25 1.2 · soporte de motor derecho (RH) · referencia 21810-2V000.",
    fitmentPosition: "Motor · lado derecho (RH)",
    fitmentRequirements: ["VIN", "año", "motor 1.2", "transmisión", "posición derecha", "referencia 21810-2V000 o muestra física"],
    fitmentSource: "INVENTARIO GENERAL, renglón 2619 · Catálogo Star Parts Colombia: soporte motor derecho Kia Rio Spice / Cerato Pro, referencia 21810-2V000",
    fitments: [
      { make: "Kia", model: "Rio Spice", engine: "1.2L", years: "Confirmar por VIN", position: "Motor · lado derecho (RH)" },
      { make: "Hyundai", model: "i25", engine: "1.2L", years: "Confirmar por VIN", position: "Motor · lado derecho (RH)" },
    ],
    attributes: [
      { name: "Referencia", value: "21810-2V000" },
      { name: "Posición", value: "Motor · derecho (RH)" },
      { name: "Estado de imagen", value: "Recreación digital referencial, no fotografía oficial" },
    ],
    fitmentStatus: "verified-by-oe",
    brandProof: "Marca no identificada en el renglón de inventario; la aplicación se sustenta por la referencia exacta 21810-2V000",
  },
};

// Some inventory rows use a generic stock code (for example, "CERAMICA")
// shared by unrelated applications. Those cases must be keyed by the audited
// report row, never by SKU, so one fitment cannot leak into another product.
const VERIFIED_ROW_OVERRIDES = {
  "284": {
    name: "Base de Amortiguador Delantero VAZLO 5768 — Chevrolet Tracker (RH/LH)",
    brand: "VAZLO",
    image: "/catalogo-frenos-suspension/vazlo-5768-base-amortiguador-delantero-chevrolet-tracker-catalogo-blanco.webp",
    images: [
      {
        url: "/catalogo-frenos-suspension/vazlo-5768-base-amortiguador-delantero-chevrolet-tracker-catalogo-blanco.webp",
        alt: "Fotografía real de base de amortiguador delantera VAZLO 5768 para Chevrolet Tracker; código físico 407-YZH-5768",
        isMain: true,
      },
      {
        url: "/catalogo-frenos-suspension/vazlo-5768-base-amortiguador-delantero-chevrolet-tracker-reverso-catalogo-blanco.webp",
        alt: "Reverso de caucho y buje central de la base de amortiguador VAZLO 5768 para Chevrolet Tracker",
        isMain: false,
      },
    ],
    imageAlt: "Fotografía real de base de amortiguador delantera VAZLO 5768 para Chevrolet Tracker; código físico 407-YZH-5768",
    shortDesc: "Base / soporte de amortiguador delantero VAZLO 5768 · Chevrolet Tracker (RH/LH) · código físico 407-YZH-5768.",
    description: "Base o soporte superior de amortiguador delantero (strut mount / copela) marca VAZLO con código físico 407-YZH-5768 para Chevrolet Tracker (1.8L Ecotec y Turbo). Fabricada con caucho vulcanizado y copela de acero estampado con garantía de 1 año o 20.000 km. Diseñada para aislar vibraciones, ruidos de rodadura y brindar sujeción estructural a la suspensión McPherson. Aplica indistintamente para lado derecho (RH) e izquierdo (LH).",
    fitmentSummary: "407-YZH-5768 / 5768: Chevrolet Tracker (2013–2019 / 2020+) · Eje delantero (RH/LH) · Cruces OE 95227628 / 95015324 / 26298703.",
    fitmentPosition: "Eje delantero · Lado derecho (RH) e izquierdo (LH)",
    fitmentRequirements: ["VIN", "año de fabricación", "motorización (1.8L / Turbo)", "lado bilateral RH/LH", "referencia OE o muestra física"],
    fitmentSource: "Marca VAZLO confirmada por REMBERT; código físico 407-YZH-5768 en la pieza suministrada; descripción del INVENTARIO GENERAL renglón 284; cruces técnicos de suspensión",
    fitments: [
      {
        make: "Chevrolet",
        model: "Tracker / Trax (1ra Generación)",
        engine: "1.8L Ecotec Gasolina FWD / AWD",
        years: "2013–2019",
        position: "Eje delantero · Derecho (RH) e Izquierdo (LH)",
      },
      {
        make: "Chevrolet",
        model: "Tracker Turbo (2da Generación)",
        engine: "1.2L Turbo Ecotec",
        years: "2020–2024",
        position: "Eje delantero · Derecho (RH) e Izquierdo (LH)",
      },
      {
        make: "Chevrolet",
        model: "Sonic / Spin / Cobalt",
        engine: "1.6L / 1.8L Gasolina",
        years: "2012–2018",
        position: "Eje delantero · Bilateral (confirmar OE)",
      },
    ],
    attributes: [
      { name: "Tipo de producto", value: "Base / soporte superior de amortiguador delantero (Strut Mount / Copela)" },
      { name: "Código grabado en pieza", value: "407-YZH-5768" },
      { name: "Código de inventario", value: "5768 (código interno / proveedor *804210*)" },
      { name: "Marca comercial", value: "VAZLO (confirmada por REMBERT)" },
      { name: "Garantía de fabricante", value: "1 año o 20.000 km (especificada en empaque original)" },
      { name: "Posición y montaje", value: "Eje delantero · Compatible lado derecho (RH) y lado izquierdo (LH)" },
      { name: "Cruces OE de referencia", value: "95227628 · 95015324 · 95943131 · 26298703 · 13502180 · 95142646" },
      { name: "Vehículos compatibles", value: "Chevrolet Tracker 1.8L (2013–2019) y Tracker Turbo (2020+)" },
    ],
    marketBenchmark: "Precio REMBERT $130.989 COP; mercado colombiano observado: $95.000–$145.000 COP por unidad",
    fitmentStatus: "verified",
    imageStatus: "real-product-photo",
    imagePresentation: "catalog-white-background",
    brandProof: "VAZLO · marca confirmada por REMBERT; la pieza real conserva el código físico 407-YZH-5768",
  },
  "3": {
    name: "Abrazadera plástica ancha 380 × 7,6 mm",
    brand: "Marca según empaque",
    image: "/catalogo-varios/abrazadera-plastica-ancha-380x7-6-rembert.webp",
    imageAlt: "Abrazaderas plásticas anchas negras de aproximadamente 380 por 7,6 milímetros con marca REMBERT",
    shortDesc: "Brida plástica ancha de uso universal · medida aproximada 380 × 7,6 mm · para organizar y sujetar cableado o mangueras livianas.",
    description: "Abrazadera o brida plástica ancha de uso universal, registrada en inventario como 38 × 7,6. Se representa como una correa dentada con cabezal de cierre, destinada a organizar y sujetar mazos de cables, fundas y mangueras livianas. No es un filtro, una abrazadera metálica de manguera ni una pieza con compatibilidad exclusiva para un modelo de vehículo. Antes de vender se deben confirmar la longitud física, el ancho, el diámetro máximo de cierre y las condiciones de temperatura del punto de instalación.",
    fitmentSummary: "Uso universal en automóviles y camionetas, condicionado a la medida requerida y al entorno de instalación.",
    fitmentPosition: "Sujeción auxiliar de cableado, fundas o mangueras livianas",
    fitmentRequirements: ["longitud física", "ancho de 7,6 mm", "diámetro del mazo", "temperatura y exposición del montaje"],
    fitmentSource: "Descripción literal del INVENTARIO GENERAL; aplicación universal determinada por dimensión, no por marca o modelo de vehículo",
    fitments: [
      {
        make: "Universal",
        model: "Automóviles y camionetas",
        years: "Todos, según medida y condiciones de montaje",
        position: "Sujeción auxiliar; no usar como abrazadera presurizada",
      },
    ],
    attributes: [
      { name: "Tipo de producto", value: "Abrazadera / brida plástica ancha" },
      { name: "Medida de inventario", value: "38 × 7,6; confirmar si corresponde a 380 × 7,6 mm" },
      { name: "Aplicación", value: "Organización y sujeción auxiliar de cableado, fundas o mangueras livianas" },
      { name: "Restricción", value: "No sustituye abrazaderas metálicas en circuitos presurizados o de alta temperatura" },
    ],
    marketBenchmark: "Precio REMBERT $290 COP por unidad; presentación y cantidad por empaque pendientes de confirmación",
    fitmentStatus: "universal-by-dimension",
    imageStatus: "generated-product-reference",
    brandProof: "Marca por confirmar en empaque; imagen de referencia identificada con sello REMBERT",
  },
  "5": {
    name: "Actuador IAC ADS — Kia Rio Space / Hyundai i25",
    brand: "ADS",
    image: "/catalogo-ads/ads-l0301622-actuador-iac-foto-real-v1.webp",
    imageAlt: "Fotografía real del actuador IAC ADS L0301622 completo con etiqueta ADS visible",
    shortDesc: "Actuador IAC ADS para control de ralentí · aplicación registrada Kia Rio Space / Hyundai i25 · validar OEM y conector.",
    description: "Actuador o válvula IAC ADS encargado de dosificar el aire de bypass del cuerpo de aceleración para estabilizar las RPM en ralentí, especialmente durante el arranque en frío y los cambios de carga. La aplicación figura en el inventario REMBERT para Kia Rio Space / Hyundai i25, pero debe confrontarse la referencia OEM, la forma y el pinout del conector, la separación de los dos pernos y el cuerpo de aceleración antes de instalar. No sustituye un cuerpo de aceleración electrónico con control de ralentí integrado.",
    fitmentSummary: "Kia Rio Space / Hyundai i25 gasolina · aplicación condicionada a OEM, cuerpo de aceleración y conector multipin.",
    fitmentPosition: "Cuerpo de aceleración / control de ralentí",
    fitmentRequirements: ["VIN", "año", "motor y cilindraje", "referencia OEM grabada", "forma y pinout del conector", "separación de los dos pernos"],
    fitmentSource: "Marca ADS visible en la fotografía real suministrada por REMBERT; aplicación Kia Rio Space / Hyundai i25 declarada únicamente por el inventario. El cruce 35150-22600 consultado corresponde a otras aplicaciones Hyundai/Kia y no se publica como equivalencia de esta unidad",
    fitments: [
      {
        make: "Kia",
        model: "Rio Space / Rio Spice (denominación comercial por confirmar)",
        engine: "Gasolina · cilindraje por confirmar",
        years: "Confirmar por VIN y OEM",
        position: "Cuerpo de aceleración / control de ralentí",
      },
      {
        make: "Hyundai",
        model: "i25 / Accent (aplicación indicada en inventario)",
        engine: "Gasolina · sistema por confirmar",
        years: "Confirmar por VIN y OEM",
        position: "Cuerpo de aceleración / control de ralentí",
      },
    ],
    attributes: [
      { name: "Tipo de componente", value: "Actuador / válvula de control de aire en ralentí (IAC)" },
      { name: "Función", value: "Estabiliza las RPM regulando el aire de bypass en ralentí" },
      { name: "Montaje visible", value: "Brida de dos pernos y conector eléctrico multipin" },
      { name: "Código adicional del inventario", value: "1121224 · código interno, no confirmado como OEM" },
      { name: "Cruce OEM", value: "No establecido; confrontar el código grabado, el conector y el cuerpo de aceleración" },
    ],
    marketBenchmark: "Precio REMBERT $176.185 COP; referencias IAC Kia/Hyundai observadas en Colombia aproximadamente entre $152.999 y $179.999, comparables solo después de confirmar OEM y conector",
    fitmentStatus: "conditional",
    imageStatus: "real-source-photo",
    imageDisclosure: "Foto real ADS",
    brandProof: "ADS · marca confirmada directamente en la etiqueta de la fotografía real suministrada por REMBERT",
  },
  "606": {
    name: "Caja de dirección ADS 56500-07000 — Kia Picanto I (SA)",
    brand: "ADS",
    image: "/catalogo-ads/ads-56500-07000-caja-direccion-web-v2.webp",
    imageAlt: "Cremallera de dirección mecánica o asistida eléctricamente 56500-07000 completa para Kia Picanto I, sin tuberías hidráulicas",
    shortDesc: "Cremallera de dirección ADS 56500-07000 · tipo mecánico/EPS, sin tuberías hidráulicas · Kia Picanto I 2004–2011.",
    description: "Caja o cremallera de dirección ADS con cruce OE 56500-07000 para Kia Picanto I plataforma SA. Las fuentes técnicas muestran una cremallera mecánica o asistida por columna eléctrica, con torre de piñón y sin tuberías hidráulicas; la imagen hidráulica anterior era incorrecta. No se publicita para Hyundai i10 porque ese cruce no quedó respaldado. Confirmar VIN, guía izquierda, tipo de asistencia, longitud y anclajes antes del despacho.",
    fitmentSummary: "Kia Picanto I (SA) 1.0 / 1.1, 2004–2011 · cremallera mecánica/EPS sin tuberías hidráulicas · OE 56500-07000.",
    fitmentPosition: "Sistema de dirección · cremallera / caja",
    fitmentRequirements: ["VIN", "año", "motor", "plataforma SA", "guía izquierda", "dirección mecánica/EPS", "longitud", "anclajes"],
    fitmentSource: "HG Auto Part, LongWind/TCNR, MaxCar y IMFRISA cruzan OE 56500-07000 con Kia Picanto/Morning SA 2004–2011 y muestran configuración mecánica, sin circuito hidráulico",
    fitments: [{ make: "Kia", model: "Picanto I / Morning (SA)", engine: "1.0 / 1.1 según versión", years: "2004–2011", position: "Dirección · cremallera mecánica/EPS" }],
    attributes: [
      { name: "Referencia OE", value: "56500-07000" },
      { name: "Aplicación respaldada", value: "Kia Picanto I / Morning (SA) 2004–2011" },
      { name: "Configuración", value: "Mecánica/EPS · sin tuberías hidráulicas" },
      { name: "Restricción", value: "No ofrecer para Hyundai i10 sin cruce de catálogo o VIN" },
      { name: "Imagen", value: "Versión web fiel a fotografía de la referencia OE exacta; cremallera completa sobre fondo blanco" },
    ],
    fitmentStatus: "verified-by-oe",
    imageStatus: "source-grounded-web-image",
    imageDisclosure: "Versión web fiel a foto OE exacta",
    brandProof: "ADS · marca declarada en inventario REMBERT; geometría y aplicación verificadas por la referencia OE exacta en fuentes técnicas independientes",
  },
  "776": {
    name: "Brazo axial ADS 56540-1S000 — Hyundai HB20",
    brand: "ADS",
    image: "/catalogo-ads/ads-56540-1s000-brazo-axial-web-v2.webp",
    imageAlt: "Brazo axial 56540-1S000 completo para Hyundai HB20 con vástago negro, carcasa plateada y capuchón rojo",
    shortDesc: "Articulación axial interior ADS 56540-1S000 · Hyundai HB20 2012–2019 · ambos lados.",
    description: "Brazo axial interior ADS 56540-1S000 para Hyundai HB20. El catálogo técnico ZF/TRW cruza el OE 56540-1S000 con HB20 2012–2019 y posición derecha/izquierda; el producto se debe vender por esta referencia, no por el nombre incompleto 'colombina'. Confirmar VIN, versión de dirección, longitud y roscas antes del despacho.",
    fitmentSummary: "Hyundai HB20 2012–2019 · brazo axial interior derecho o izquierdo · OE 56540-1S000.",
    fitmentPosition: "Dirección · articulación axial interior · ambos lados",
    fitmentRequirements: ["VIN", "año", "motor 1.0 o 1.6", "tipo de dirección", "longitud", "roscas", "OE 56540-1S000"],
    fitmentSource: "iMotriz confirma marca ADS y referencia 56540-1S000 para HB20; ZF/TRW cruza OE 56540-1S000 con JAR1638 para HB20 2012–2019 en ambos lados; la fotografía OE exacta confirma la geometría",
    fitments: [{ make: "Hyundai", model: "HB20", engine: "1.0 / 1.6 según versión", years: "2012–2019", position: "Dirección · axial interior · derecho o izquierdo" }],
    attributes: [
      { name: "Referencia ADS / OE", value: "56540-1S000" },
      { name: "Cruces técnicos", value: "TRW JAR1638 · Viemar 680539 / 680539K" },
      { name: "Posición", value: "Derecha o izquierda" },
      { name: "Imagen", value: "Versión web fiel a fotografía de la referencia OE exacta; producto completo y sin empaque" },
    ],
    fitmentStatus: "verified-by-oe",
    imageStatus: "source-grounded-web-image",
    imageDisclosure: "Versión web fiel a foto OE exacta",
    brandProof: "ADS · marca confirmada en publicación comercial; OE, aplicación y geometría contrastados con catálogo técnico y fotografía real de la referencia exacta",
  },
  "1883": {
    brand: "ROWEN",
    image: "/catalogo-rowen/rowen-pastillas-ceramicas-referencia-familia.webp",
    imageAlt: "Referencia visual de familia de pastillas cerámicas Rowen; confirmar geometría exacta antes del despacho",
    shortDesc: "Pastillas delanteras cerámicas Rowen · Chevrolet Aveo / Optra · aplicación registrada en inventario.",
    description: "Juego de pastillas delanteras cerámicas Rowen registrado para Chevrolet Aveo / Optra. El código de inventario es genérico y no sustituye la referencia del fabricante: confirmar año, versión, forma de la pastilla, sistema de freno, mordaza y VIN antes del despacho.",
    fitmentSummary: "Chevrolet Aveo / Optra · eje delantero · compatibilidad literal del inventario; confirmar geometría y VIN.",
    fitmentPosition: "Freno delantero",
    fitmentSource: "Marca y aplicación declaradas en INVENTARIO GENERAL; la familia Rowen 7668-CH publicada en Colombia respalda la aplicación Aveo/Optra, pero no se equipara al código genérico del inventario",
    marketBenchmark: "REMBERT $107.993; comparables Aveo/Optra observados entre $80.750 y $107.993, sujetos a formulación y referencia exacta",
    fitmentStatus: "inventory-listed",
    imageStatus: "inventory-brand-family-reference",
    brandProof: "ROWEN · marca declarada en el renglón de inventario; referencia fabricante por confirmar",
  },
  "1943": {
    brand: "ROWEN",
    image: "/catalogo-rowen/rowen-pastillas-ceramicas-referencia-familia.webp",
    imageAlt: "Referencia visual de familia de pastillas cerámicas Rowen; confirmar geometría exacta antes del despacho",
    shortDesc: "Pastillas cerámicas Rowen · Mazda 2 / Ford Fiesta 2010+ · aplicación registrada en inventario.",
    description: "Juego de pastillas cerámicas Rowen registrado para Mazda 2 / Ford Fiesta desde 2010. Como el inventario no conserva una referencia fabricante inequívoca, se debe confirmar eje, año, versión, forma de la pastilla, sistema de freno, mordaza y VIN antes del despacho.",
    fitmentSummary: "Mazda 2 / Ford Fiesta 2010+ · posición por confirmar · compatibilidad literal del inventario; validar geometría y VIN.",
    fitmentPosition: "Posición por confirmar",
    fitmentSource: "Marca y aplicación declaradas en INVENTARIO GENERAL; sin referencia Rowen inequívoca para cruce externo",
    marketBenchmark: "REMBERT $115.000; no se compara precio sin una referencia fabricante exacta",
    fitmentStatus: "inventory-listed",
    imageStatus: "inventory-brand-family-reference",
    brandProof: "ROWEN · marca declarada en el renglón de inventario; referencia fabricante por confirmar",
  },
  "940": GTI06052_OVERRIDE,
};

const normalize = (value = "") => String(value)
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toUpperCase();

const MANUFACTURER_VERIFIED_STATUSES = new Set([
  "verified",
  "verified-by-oe",
  "cross-reference-verified",
]);

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
    .replace(/\bCLUCTH\b/gi, "CLUTCH")
    .replace(/\bBALINERA CLUTCH SAIL\b/gi, "RODAMIENTO CLUTCH CHEVROLET SAIL / N200 / N300")
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

// "GTI" is also a vehicle trim (for example Aveo GTI or Racer GTI).  A brand
// must not be inferred from that text alone: GTI's actual stock references in
// this inventory use the GTI01/03/04/06/106 families (with or without hyphens).
function isGtiManufacturerReference(sku = "") {
  const normalizedSku = normalize(sku).replace(/[^A-Z0-9]/g, "");
  return /^GTI(?:0[1-9]|1[0-9])/.test(normalizedSku);
}

function manufacturerFor(name, sku = "") {
  const normText = `${normalize(name)} ${normalize(sku)}`;
  const manufacturer = EXPLICIT_MANUFACTURERS.find((candidate) => {
    if (candidate === "GTI") return isGtiManufacturerReference(sku);
    const normCandidate = normalize(candidate);
    const regex = new RegExp(`(?:^|[^A-Z0-9])${normCandidate}(?:[^A-Z]|$)`, "i");
    return regex.test(normText);
  });
  const label = manufacturer || "Marca según empaque";
  return { name: label, slug: slugify(label) };
}

function stockValue(value) {
  return Number.isInteger(value) ? value : Number(value);
}

export const inventoryProducts = inventoryRows.map((row) => {
  const category = categoryFor(row.n, row.l);
  const normalizedSku = normalize(row.c).replace(/[^A-Z0-9]/g, "");
  const verifiedOverride = VERIFIED_ROW_OVERRIDES[String(row.i)] || VERIFIED_SKU_OVERRIDES[normalizedSku];
  const brand = verifiedOverride
    ? { name: verifiedOverride.brand, slug: slugify(verifiedOverride.brand) }
    : manufacturerFor(row.n, row.c);
  const displayName = verifiedOverride?.name || expandInventoryName(row.n);
  const id = `inventario-${row.i}-${slugify(row.c)}`;
  const stock = stockValue(row.s);
  const sourceLabel = `INVENTARIO GENERAL · página ${row.g} · renglón ${row.i} · línea ${row.l || "SIN LINEA"} verificada en página ${row.h || "—"} del informe por líneas`;

  const normName = normalize(row.n);
  const normSku = normalize(row.c);

  let productImage = verifiedOverride?.image;
  if (!productImage) {
    if (brand.slug === "skf" || normName.includes("SKF") || normSku.includes("SKF")) {
      productImage = "/catalogo-marcas-watermarked/skf-kit-rodamiento-catalogo.webp";
    } else if (brand.slug === "gti" && isGtiManufacturerReference(row.c)) {
      productImage = "/catalogo-gti/gti-foto-real-pendiente-v1.webp";
    } else if (brand.slug === "tnk" || normName.includes("TNK") || normSku.startsWith("TNK")) {
      productImage = "/catalogo-tnk/tnk-tol4882-link-toyota-hilux-fortuner.webp";
    } else if (brand.slug === "verke" || normName.includes("VERKE")) {
      productImage = "/catalogo-verke/verke-amortiguador-con-empaque-real.webp";
    } else if (brand.slug === "rowen" || normName.includes("ROWEN")) {
      productImage = "/catalogo-rowen/rowen-pastillas-ceramicas-referencia-familia.webp";
    } else if (brand.slug === "gabriel" || normName.includes("GABRIEL")) {
      productImage = "/catalogo-prioridad-diesel/suspension--gabriel--usa79356-a--toyota-hilux-2-7-2-8-rwd-y-4wd.jpg";
    } else if (brand.slug === "wix" || normName.includes("WIX")) {
      productImage = "/catalogo-filtros-tipos/filtro-aceite.webp";
    } else if (brand.slug === "mann-filter" || normName.includes("MANN")) {
      productImage = "/catalogo-prioridad-diesel/filtros--mann-filter--w-712-83--toyota-hilux-fortuner-2-8-diesel-1gd-ftv.jpg";
    } else {
      productImage = category.image;
    }
  }

  return {
    id,
    slug: `${slugify(displayName).slice(0, 72)}-${slugify(row.c)}`,
    name: displayName,
    sourceName: row.n,
    sku: verifiedOverride?.manufacturerReference || row.c,
    referenceType: verifiedOverride?.manufacturerReference
      ? "manufacturer"
      : MANUFACTURER_VERIFIED_STATUSES.has(verifiedOverride?.fitmentStatus)
      ? "manufacturer"
      : "inventory",
    inventoryLine: row.l || "SIN LINEA",
    category: { name: category.name, slug: category.slug },
    brand,
    price: row.p,
    stock,
    inStock: stock > 0,
    shortDesc: verifiedOverride?.shortDesc || `Referencia ${row.c} · ${stock} unidad${stock === 1 ? "" : "es"} registrada${stock === 1 ? "" : "s"} en inventario.`,
    description: verifiedOverride?.description || `${displayName}. Referencia interna o fabricante ${row.c}. La aplicación vehicular se conserva exactamente como aparece en el inventario y debe confirmarse por VIN, año, motor, versión y muestra antes del despacho.`,
    image: productImage,
    images: verifiedOverride?.images?.length
      ? verifiedOverride.images
      : [{
        url: productImage,
        alt: verifiedOverride?.imageAlt || (brand.slug === "gti" && isGtiManufacturerReference(row.c)
          ? `Foto exacta pendiente para la referencia GTI ${row.c}; no se muestra una pieza genérica`
          : `Imagen referencial de la línea ${category.name} para ${displayName}`),
        isMain: true,
      }],
    imageStatus: verifiedOverride
      ? verifiedOverride.imageStatus || "verified-brand-family-reference"
      : brand.slug === "gti" && isGtiManufacturerReference(row.c)
      ? "photo-pending"
      : "inventory-family-reference",
    imageDisclosure: verifiedOverride?.imageDisclosure || (brand.slug === "gti" && isGtiManufacturerReference(row.c)
      ? "Foto exacta pendiente · sin imagen genérica"
      : ""),
    fitmentStatus: verifiedOverride?.fitmentStatus || (verifiedOverride ? "cross-reference-verified" : "inventory-listed"),
    fitmentSummary: verifiedOverride?.fitmentSummary || `Aplicación registrada: ${displayName}`,
    fitmentRequirements: verifiedOverride?.fitmentRequirements || ["VIN", "año", "motor", "versión", "muestra o referencia desmontada"],
    fitmentSource: verifiedOverride ? `${sourceLabel} · ${verifiedOverride.fitmentSource}` : sourceLabel,
    fitments: verifiedOverride?.fitments?.length ? verifiedOverride.fitments : [{
      make: "Aplicación indicada en inventario",
      model: displayName,
      years: "Confirmar por VIN",
      position: verifiedOverride?.fitmentPosition || category.name,
    }],
    attributes: [
      { id: `${id}-code`, name: "Código de inventario", value: row.c },
      { id: `${id}-application`, name: "Aplicación registrada", value: row.n },
      { id: `${id}-editorial`, name: "Descripción normalizada", value: displayName },
      { id: `${id}-line`, name: "Línea de inventario", value: row.l || "SIN LINEA" },
      { id: `${id}-stock`, name: "Existencia registrada", value: String(stock) },
      { id: `${id}-source`, name: "Fuente", value: sourceLabel },
      ...(verifiedOverride ? [
        { id: `${id}-brand-proof`, name: "Marca verificada", value: verifiedOverride.brandProof || `${verifiedOverride.brand} · cruce exacto por referencia ${row.c}` },
        { id: `${id}-market`, name: "Referencia de mercado", value: verifiedOverride.marketBenchmark },
      ] : []),
      ...(verifiedOverride?.attributes || []).map((attribute, index) => ({
        id: `${id}-verified-${index + 1}`,
        name: attribute.name,
        value: attribute.value,
      })),
      { id: `${id}-validation`, name: "Validación obligatoria", value: "Confirmar VIN, año, motor, versión y muestra antes del despacho" },
      {
        id: `${id}-image`,
        name: "Imagen",
        value: verifiedOverride?.imageStatus === "real-product-photo"
          ? "Fotografía real del producto suministrada por REMBERT; confirmar la referencia grabada antes del despacho"
          : brand.slug === "gti" && isGtiManufacturerReference(row.c)
          ? "Foto exacta pendiente; no se publica una pieza parecida, genérica o generada sin fuente trazable"
          : "Referencia visual de la línea; el producto se identifica por código y descripción",
      },
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
