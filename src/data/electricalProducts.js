const electrical = { name: "PARTES ELÉCTRICAS", slug: "electrico-y-encendido" };

const images = {
  charge: "/catalogo-electricos/carga-arranque-rembert.webp",
  ignition: "/catalogo-electricos/encendido-rembert.webp",
  sensors: "/catalogo-electricos/sensores-gestion-motor-rembert.webp",
  fuelCooling: "/catalogo-electricos/combustible-refrigeracion-rembert.webp",
  accessories: "/catalogo-electricos/iluminacion-accesorios-rembert.webp",
};

const coverage = "Chevrolet, Renault, Nissan, Toyota, Kia, Hyundai, Mazda, Ford, Volkswagen, Seat, Skoda, Peugeot, Citroën, Fiat, Jeep, Dodge y pickups, según la referencia del fabricante";

function electricalFamily({ id, name, brand, sku, image, family, validation, source, description }) {
  return {
    id,
    name,
    slug: id,
    category: electrical,
    brand: { name: brand, slug: brand.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") },
    price: 0,
    sku,
    referenceType: "manufacturer-family",
    fitmentStatus: "family",
    fitmentSummary: `${family}. La aplicación exacta cambia por vehículo y número OE; no es una pieza universal.`,
    fitmentRequirements: validation.split(/[,;]+/).map((item) => item.trim()).filter(Boolean),
    fitmentSource: source,
    shortDesc: `${family}. Cotización y disponibilidad por referencia.`,
    description: `${description} Cobertura orientativa para ${coverage}. El despacho se confirma únicamente después de cruzar VIN, datos técnicos y referencia OE.` ,
    image,
    images: [{ url: image, alt: `${name}, imagen de familia con marca de agua REMBERT`, isMain: true }],
    imageStatus: "ai-catalog-watermarked",
    attributes: [
      { id: `${id}-family`, name: "Familia", value: family },
      { id: `${id}-coverage`, name: "Compatible con", value: coverage },
      { id: `${id}-validation`, name: "Validación obligatoria", value: validation },
      { id: `${id}-source`, name: "Fuente técnica", value: source },
      { id: `${id}-image`, name: "Imagen", value: "Representación de familia; forma, empaque y contenido cambian según el SKU confirmado." },
    ],
    inStock: false,
    stock: 0,
  };
}

export const electricalProducts = [
  electricalFamily({
    id: "wai-alternadores-familia-colombia", name: "Alternadores WAI — Referencia según Vehículo", brand: "WAI", sku: "WAI-ALT-COT", image: images.charge,
    family: "Alternadores nuevos y componentes de carga", validation: "VIN, marca, modelo, año, motor, amperaje, polea, conector, montaje, referencia OE",
    source: "WAI Global / distribución aftermarket colombiana", description: "Alternadores para recuperar la carga del sistema de 12 V. Deben coincidir amperaje, regulación, polea, fijaciones y conectores.",
  }),
  electricalFamily({
    id: "wai-motores-arranque-familia-colombia", name: "Motores de Arranque WAI — Referencia según Vehículo", brand: "WAI", sku: "WAI-STR-COT", image: images.charge,
    family: "Motores de arranque y solenoides", validation: "VIN, marca, modelo, año, motor, voltaje, número de dientes, giro, montaje, referencia OE",
    source: "WAI Global / distribución aftermarket colombiana", description: "Arranques para automóviles y pickups. Piñón, sentido de giro, potencia y patrón de fijación deben corresponder al motor y transmisión.",
  }),
  electricalFamily({
    id: "bosch-alternadores-arranques-familia", name: "Bosch Alternadores y Arranques — Referencia OE", brand: "Bosch", sku: "BOSCH-ROTATING-COT", image: images.charge,
    family: "Alternadores, motores de arranque y reguladores", validation: "VIN, motor, transmisión, voltaje, amperaje o potencia, polea o piñón, conector, OE",
    source: "Bosch Automotive Aftermarket — piezas eléctricas", description: "Máquinas eléctricas Bosch para carga y puesta en marcha, disponibles como unidades completas o referencias de servicio según aplicación.",
  }),
  electricalFamily({
    id: "denso-alternadores-familia", name: "Alternadores DENSO — Referencia según Vehículo", brand: "DENSO", sku: "DENSO-ALT-COT", image: images.charge,
    family: "Alternadores de equipo original y aftermarket", validation: "VIN, código de motor, amperaje, polea, BSS/LIN, conector, fijaciones, OE",
    source: "DENSO Aftermarket Europe — Alternators", description: "Alternadores DENSO con diseño específico por plataforma. En vehículos modernos también debe validarse el protocolo de comunicación del regulador.",
  }),
  electricalFamily({
    id: "denso-motores-arranque-familia", name: "Motores de Arranque DENSO — Referencia según Vehículo", brand: "DENSO", sku: "DENSO-STR-COT", image: images.charge,
    family: "Motores de arranque convencionales y reducción", validation: "VIN, código de motor, transmisión, potencia, dientes, giro, fijación, OE",
    source: "DENSO Aftermarket — Starters", description: "Arranques DENSO para aplicaciones específicas; el mismo modelo puede usar unidades distintas por motor, caja o fecha de producción.",
  }),
  electricalFamily({
    id: "ngk-bujias-encendido-familia", name: "Bujías NGK — Cobre, Platino e Iridio", brand: "NGK", sku: "NGK-SPARK-COT", image: images.ignition,
    family: "Bujías de encendido para motores a gasolina", validation: "VIN, código de motor, referencia NGK, rosca, alcance, asiento, grado térmico, calibración",
    source: "Buscador oficial de productos NGK/NTK", description: "Bujías NGK convencionales y de metales preciosos. Grado térmico, longitud de rosca y asiento incorrectos pueden dañar el motor.",
  }),
  electricalFamily({
    id: "ngk-bobinas-encendido-familia", name: "Bobinas de Encendido NGK — Referencia por Motor", brand: "NGK", sku: "NGK-COIL-COT", image: images.ignition,
    family: "Bobinas tipo lápiz, bloque y distribuidor", validation: "VIN, código de motor, cilindro, conector, número de pines, longitud, OE",
    source: "NGK Ignition Coils / buscador oficial NGK/NTK", description: "Bobinas para suministrar alta tensión a las bujías. La forma parecida no garantiza compatibilidad eléctrica ni de montaje.",
  }),
  electricalFamily({
    id: "ngk-cables-encendido-familia", name: "Cables y Capuchones NGK — Juego por Motor", brand: "NGK", sku: "NGK-WIRE-COT", image: images.ignition,
    family: "Juegos de cables, terminales y capuchones de encendido", validation: "VIN, motor, número de cilindros, bobina o distribuidor, longitudes, terminales, OE",
    source: "Buscador oficial de productos NGK/NTK", description: "Cables resistivos y terminales diseñados para el recorrido y sistema de ignición de cada motor.",
  }),
  electricalFamily({
    id: "denso-bobinas-encendido-familia", name: "Bobinas de Encendido DENSO — Referencia OE", brand: "DENSO", sku: "DENSO-COIL-COT", image: images.ignition,
    family: "Bobinas de encendido directas y conjuntos", validation: "VIN, motor, conector, número de pines, longitud, resistencia o señal, OE",
    source: "DENSO Aftermarket — Ignition Coils", description: "Bobinas DENSO para aplicaciones de encendido controlado electrónicamente, seleccionadas por referencia y motor.",
  }),
  electricalFamily({
    id: "ntk-sondas-lambda-familia", name: "Sondas Lambda NTK — Antes y Después del Catalizador", brand: "NTK", sku: "NTK-O2-COT", image: images.sensors,
    family: "Sensores de oxígeno convencionales, calefactados y banda ancha", validation: "VIN, motor, norma de emisiones, posición, número de cables, conector, longitud, OE",
    source: "NTK Vehicle Electronics — Sondas Lambda", description: "Sondas para control de mezcla y diagnóstico del catalizador. Debe distinguirse sensor anterior y posterior, tecnología y conector.",
  }),
  electricalFamily({
    id: "ntk-sensores-maf-map-familia", name: "Sensores MAF y MAP NTK — Gestión de Aire", brand: "NTK", sku: "NTK-AIR-COT", image: images.sensors,
    family: "Caudalímetros MAF y sensores de presión MAP", validation: "VIN, motor, aspiración o turbo, conector, pines, rango de presión, carcasa, OE",
    source: "NTK Vehicle Electronics — Air Mass Meter y MAP", description: "Sensores para calcular carga y masa de aire. Un rango o calibración incorrectos generan mezcla, consumo y fallas de diagnóstico.",
  }),
  electricalFamily({
    id: "ntk-sensores-posicion-rpm-familia", name: "Sensores CKP y CMP NTK — Cigüeñal y Árbol de Levas", brand: "NTK", sku: "NTK-POS-COT", image: images.sensors,
    family: "Sensores de posición y velocidad del motor", validation: "VIN, motor, CKP o CMP, posición, tipo inductivo o Hall, conector, longitud, OE",
    source: "NTK Vehicle Electronics — sensores de velocidad y posición", description: "Sensores de sincronización de cigüeñal y árbol de levas; no son intercambiables aunque compartan apariencia.",
  }),
  electricalFamily({
    id: "bosch-sensores-inyeccion-familia", name: "Sensores e Inyección Bosch — Referencia según Motor", brand: "Bosch", sku: "BOSCH-EFI-COT", image: images.sensors,
    family: "Sensores de motor, módulos, bombas e inyectores", validation: "VIN, código de motor, sistema de inyección, presión, caudal, conector, posición, OE",
    source: "Bosch Automotive Aftermarket — piezas de inyección y sensores", description: "Componentes Bosch para gestión electrónica de motores a gasolina. Cada referencia corresponde a una calibración y sistema determinados.",
  }),
  electricalFamily({
    id: "denso-sensores-gestion-motor-familia", name: "Sensores DENSO — Lambda, MAF, MAP, CKP y CMP", brand: "DENSO", sku: "DENSO-SENSOR-COT", image: images.sensors,
    family: "Sensores de emisiones, aire, presión y posición", validation: "VIN, motor, posición, señal, rango, conector, número de pines, referencia OE",
    source: "DENSO Aftermarket — Engine Management Systems", description: "Portafolio DENSO de sensores para control de motor y emisiones, seleccionado por aplicación del fabricante.",
  }),
  electricalFamily({
    id: "denso-bombas-combustible-familia", name: "Bombas de Combustible DENSO — Módulo o Bomba", brand: "DENSO", sku: "DENSO-FUEL-COT", image: images.fuelCooling,
    family: "Bombas eléctricas y módulos de combustible", validation: "VIN, motor, combustible, presión, caudal, tanque, aforador, conector, OE",
    source: "DENSO Aftermarket — Fuel Pumps", description: "Bombas y módulos de alimentación. Presión, caudal, aforador y geometría deben coincidir con el sistema del vehículo.",
  }),
  electricalFamily({
    id: "valeo-electroventiladores-motores-familia", name: "Valeo Electroventiladores y Motores de Limpiaparabrisas", brand: "Valeo", sku: "VALEO-MOTOR-COT", image: images.fuelCooling,
    family: "Motores, electroventiladores y conjuntos de limpiaparabrisas", validation: "VIN, modelo, año, motor, diámetro, potencia, conector, aspas, sentido de giro, OE",
    source: "Valeo Service / catálogo PHC Valeo Aftermarket", description: "Actuadores eléctricos Valeo para refrigeración y visibilidad. Diámetro, potencia, giro, varillaje y control electrónico cambian según vehículo.",
  }),
  electricalFamily({
    id: "hella-reles-bocinas-familia", name: "HELLA Relés, Bocinas y Componentes de Señalización", brand: "HELLA", sku: "HELLA-12V-COT", image: images.accessories,
    family: "Relés automotrices, bocinas y señalización de 12 V", validation: "voltaje, amperaje, terminales, diagrama, montaje, frecuencia o tono, homologación, OE",
    source: "HELLA Aftermarket — Electrical & Electronics", description: "Relés y dispositivos de señalización. Un relé debe coincidir en tensión, corriente, patillaje y función; no se reemplaza solo por tamaño.",
  }),
  electricalFamily({
    id: "flosser-bombillos-fusibles-familia", name: "Flösser Bombillos, Fusibles y Relés — 12 V", brand: "Flösser", sku: "FLOSSER-12V-COT", image: images.accessories,
    family: "Bombillos halógenos, fusibles, relés y accesorios eléctricos", validation: "tipo de base, voltaje, potencia, color homologado, amperaje, formato, ubicación, OE",
    source: "Flösser Germany / distribución aftermarket colombiana", description: "Consumibles eléctricos para iluminación y protección de circuitos. Base, potencia y amperaje deben conservar la especificación del vehículo.",
  }),
];
