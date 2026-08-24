import inventoryRows from "./inventory-stock.json" with { type: "json" };

const CATEGORY_RULES = [
  {
    slug: "filtros",
    name: "Filtros",
    image: "/filtro-aire-gasolina-catalogo.webp",
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
    image: "/radiador-auto.webp",
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
    image: "/transmision.webp",
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
    image: "/catalogo-nuevas-lineas/skf-kit-rodamiento-catalogo.webp",
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
    image: "/catalogo-mantenimiento/valvoline-high-performance-80w90-gl5.webp",
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
    image: "/catalogo-nuevas-lineas/gates-kit-distribucion-bomba-agua-catalogo.webp",
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
    slug: "transmision", name: "Cajas y Transmisión", image: "/transmision.webp",
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
    image: "/catalogo-siliconas-automotrices/victor-reinz-reinzosil-70ml-original.webp",
  },
  FAROLA: {
    slug: "carroceria-iluminacion", name: "Carrocería e Iluminación",
    image: "/catalogo-electricos/iluminacion-accesorios-rembert.webp",
  },
  FILTRO: {
    slug: "filtros", name: "Filtros", image: "/filtros-gasolina-render-catalogo.webp",
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
    image: "/catalogo-mantenimiento/valvoline-high-performance-80w90-gl5.webp",
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
    slug: "radiadores", name: "Radiadores y Refrigeración", image: "/radiador-auto.webp",
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
  "555",
];

// Brand and application overrides are deliberately limited to inventory codes
// that were cross-checked against public Colombian catalogs or import records.
// A visual resemblance is never enough to assign a manufacturer or fitment.
const VERIFIED_SKU_OVERRIDES = {
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
};

// Some inventory rows use a generic stock code (for example, "CERAMICA")
// shared by unrelated applications. Those cases must be keyed by the audited
// report row, never by SKU, so one fitment cannot leak into another product.
const VERIFIED_ROW_OVERRIDES = {
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
    image: "/catalogo-ads/ads-actuador-iac-kia-rio-space.webp",
    imageAlt: "Actuador de control de aire en ralentí IAC marca ADS para aplicación Kia Rio Space / Hyundai i25",
    shortDesc: "Actuador IAC ADS para control de ralentí · aplicación registrada Kia Rio Space / Hyundai i25 · validar OEM y conector.",
    description: "Actuador o válvula IAC ADS encargado de dosificar el aire de bypass del cuerpo de aceleración para estabilizar las RPM en ralentí, especialmente durante el arranque en frío y los cambios de carga. La aplicación figura en el inventario REMBERT para Kia Rio Space / Hyundai i25, pero debe confrontarse la referencia OEM, la forma y el pinout del conector, la separación de los dos pernos y el cuerpo de aceleración antes de instalar. No sustituye un cuerpo de aceleración electrónico con control de ralentí integrado.",
    fitmentSummary: "Kia Rio Space / Hyundai i25 gasolina · aplicación condicionada a OEM, cuerpo de aceleración y conector multipin.",
    fitmentPosition: "Cuerpo de aceleración / control de ralentí",
    fitmentRequirements: ["VIN", "año", "motor y cilindraje", "referencia OEM grabada", "forma y pinout del conector", "separación de los dos pernos"],
    fitmentSource: "Marca ADS visible en la fotografía suministrada por REMBERT; aplicación Kia Rio Space / Hyundai i25 declarada en inventario. Catálogos comerciales colombianos relacionan la familia 35150-22600G con aplicaciones Kia/Hyundai, pero el cruce OEM de esta unidad debe confirmarse en la pieza o el empaque",
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
      { name: "Cruce orientativo", value: "Familia Kia/Hyundai 35150-22600G; no vender como equivalencia exacta sin confrontar la pieza" },
    ],
    marketBenchmark: "Precio REMBERT $176.185 COP; referencias IAC Kia/Hyundai observadas en Colombia aproximadamente entre $152.999 y $179.999, comparables solo después de confirmar OEM y conector",
    fitmentStatus: "conditional",
    imageStatus: "ai-catalog-watermarked",
    brandProof: "ADS · marca confirmada en la fotografía real suministrada por REMBERT; imagen principal recreada para catálogo y marcada con REMBERT",
  },
  "606": {
    name: "Caja de dirección ADS 56500-07000 — Kia Picanto I (SA)",
    brand: "ADS",
    image: "/catalogo-ads/ads-56500-07000-caja-direccion-kia-picanto.webp",
    imageAlt: "Caja de dirección ADS 56500-07000 con empaque para Kia Picanto I SA",
    shortDesc: "Cremallera de dirección ADS 56500-07000 · Kia Picanto I (SA) 1.0 / 1.1, 2004–2011.",
    description: "Caja o cremallera de dirección ADS con cruce OE 56500-07000 para Kia Picanto I plataforma SA/BA. Catálogos técnicos cruzan esta referencia con Picanto 1.0 y 1.1 entre 2004 y 2011; algunas fuentes también listan 1.1 CRDi. No se publicita como Hyundai i10 porque ese cruce no quedó respaldado por una fuente técnica primaria. Confirmar VIN, guía izquierda, tipo de asistencia, longitud y anclajes antes del despacho.",
    fitmentSummary: "Kia Picanto I (SA/BA) 1.0 / 1.1, 2004–2011 · referencia OE 56500-07000 · confirmar VIN y sistema de dirección.",
    fitmentPosition: "Sistema de dirección · cremallera / caja",
    fitmentRequirements: ["VIN", "año", "motor", "plataforma SA/BA", "guía izquierda", "tipo de asistencia", "longitud", "anclajes"],
    fitmentSource: "Cruce OE 56500-07000 validado en catálogos técnicos para Kia Picanto I SA/BA 1.0 y 1.1 2004–2011; la mención Hyundai i10 del inventario no se considera aplicación confirmada",
    fitments: [{ make: "Kia", model: "Picanto I (SA / BA)", engine: "1.0 / 1.1 gasolina; 1.1 CRDi solo bajo confirmación", years: "2004–2011", position: "Dirección · cremallera / caja" }],
    attributes: [
      { name: "Referencia OE", value: "56500-07000" },
      { name: "Aplicación respaldada", value: "Kia Picanto I (SA/BA) 2004–2011" },
      { name: "Restricción", value: "No ofrecer para Hyundai i10 sin cruce de catálogo o VIN" },
      { name: "Imagen", value: "Recreación de catálogo con empaque ADS y sello REMBERT" },
    ],
    fitmentStatus: "verified-by-oe",
    imageStatus: "ai-catalog-watermarked",
    brandProof: "ADS · marca declarada en inventario REMBERT; referencia OE verificada por catálogos técnicos",
  },
  "776": {
    name: "Brazo axial ADS 56540-1S000 — Hyundai HB20",
    brand: "ADS",
    image: "/catalogo-ads/ads-56540-1s000-brazo-axial-hyundai-hb20.webp",
    imageAlt: "Brazo axial ADS 56540-1S000 con empaque para Hyundai HB20",
    shortDesc: "Articulación axial interior ADS 56540-1S000 · Hyundai HB20 2012–2019 · ambos lados.",
    description: "Brazo axial interior ADS 56540-1S000 para Hyundai HB20. El catálogo técnico ZF/TRW cruza el OE 56540-1S000 con HB20 2012–2019 y posición derecha/izquierda; el producto se debe vender por esta referencia, no por el nombre incompleto 'colombina'. Confirmar VIN, versión de dirección, longitud y roscas antes del despacho.",
    fitmentSummary: "Hyundai HB20 2012–2019 · brazo axial interior derecho o izquierdo · OE 56540-1S000.",
    fitmentPosition: "Dirección · articulación axial interior · ambos lados",
    fitmentRequirements: ["VIN", "año", "motor 1.0 o 1.6", "tipo de dirección", "longitud", "roscas", "OE 56540-1S000"],
    fitmentSource: "ZF/TRW Aftermarket: JAR1638 para Hyundai HB20 2012–2019, derecha/izquierda, OE 56540-1S000; Viemar 680539K confirma la familia",
    fitments: [{ make: "Hyundai", model: "HB20", engine: "1.0 / 1.6 según versión", years: "2012–2019", position: "Dirección · axial interior · derecho o izquierdo" }],
    attributes: [
      { name: "Referencia ADS / OE", value: "56540-1S000" },
      { name: "Cruces técnicos", value: "TRW JAR1638 · Viemar 680539 / 680539K" },
      { name: "Posición", value: "Derecha o izquierda" },
      { name: "Imagen", value: "Recreación de catálogo con empaque ADS y sello REMBERT" },
    ],
    fitmentStatus: "verified-by-oe",
    imageStatus: "ai-catalog-watermarked",
    brandProof: "ADS · marca declarada en inventario REMBERT; OE y aplicación verificados en catálogo técnico",
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

function manufacturerFor(name) {
  const normName = normalize(name);
  const manufacturer = EXPLICIT_MANUFACTURERS.find((candidate) => {
    const normCandidate = normalize(candidate);
    const regex = new RegExp(`(?:^|[^A-Z0-9])${normCandidate}(?:[^A-Z0-9]|$)`, "i");
    return regex.test(normName);
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
    : manufacturerFor(row.n);
  const displayName = verifiedOverride?.name || expandInventoryName(row.n);
  const id = `inventario-${row.i}-${slugify(row.c)}`;
  const stock = stockValue(row.s);
  const sourceLabel = `INVENTARIO GENERAL · página ${row.g} · renglón ${row.i} · línea ${row.l || "SIN LINEA"} verificada en página ${row.h || "—"} del informe por líneas`;

  return {
    id,
    slug: `${slugify(displayName).slice(0, 72)}-${slugify(row.c)}`,
    name: displayName,
    sourceName: row.n,
    sku: row.c,
    referenceType: MANUFACTURER_VERIFIED_STATUSES.has(
      verifiedOverride?.fitmentStatus,
    )
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
    image: verifiedOverride?.image || category.image,
    images: [{
      url: verifiedOverride?.image || category.image,
      alt: verifiedOverride?.imageAlt || `Imagen referencial de la línea ${category.name} para ${displayName}`,
      isMain: true,
    }],
    imageStatus: verifiedOverride
      ? verifiedOverride.imageStatus || "verified-brand-family-reference"
      : row.l && row.l !== "SIN LINEA"
      ? "inventory-line-real-reference"
      : "inventory-family-reference",
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
