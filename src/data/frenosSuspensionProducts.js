const category = { name: "Frenos y Suspensión", slug: "frenos-y-suspension" };
const images = {
  steering: "/catalogo-frenos-suspension/direccion-suspension-familia.webp",
  mounts: "/catalogo-frenos-suspension/soportes-bujes-suspension-familia.webp",
  hydraulic: "/catalogo-frenos-suspension/freno-hidraulico-familia.webp",
  sensors: "/catalogo-frenos-suspension/sensores-freno-familia.webp",
};
const groups = {
  general: ["Chevrolet, Renault, Nissan, Toyota, Kia, Hyundai, Volkswagen, Mazda, Ford, Suzuki, Honda, Mitsubishi, Peugeot, SEAT, Skoda, Daihatsu, Daewoo y BMW", "automóviles, SUV y pickups livianas a gasolina; la referencia exacta depende del vehículo"],
  chevrolet: ["Chevrolet", "Spark, Spark GT, Beat, Sail, Aveo, Optra, Onix y Tracker"],
  renaultKorean: ["Renault, Kia y Hyundai", "Logan, Sandero, Stepway, Duster, Picanto, Rio, Sportage, i10, Accent y Tucson"],
};

function product({ id, name, brand = "Multimarca", sku, image, group = groups.general, system, position, description, checks, source, marketRange }) {
  return {
    id, name, slug: id, category,
    brand: { name: brand, slug: brand.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") },
    price: 0, sku,
    shortDesc: `${system}; selección técnica por VIN y muestra.${marketRange ? ` Mercado colombiano observado: ${marketRange}.` : ""}`,
    description: `${description} Compatible con ${group[0]} (${group[1]}). Cotización por VIN y muestra.`,
    image,
    images: [{ url: image, alt: name, isMain: true }],
    attributes: [
      { id: `${id}-system`, name: "Sistema", value: system },
      { id: `${id}-position`, name: "Posición", value: position },
      { id: `${id}-brands`, name: "Marcas", value: group[0] },
      { id: `${id}-checks`, name: "Validación", value: checks },
      ...(marketRange ? [{ id: `${id}-market`, name: "Precio orientativo Colombia", value: `${marketRange}. No es precio de venta; cambia por referencia, marca y proveedor.` }] : []),
      ...(source ? [{ id: `${id}-source`, name: "Fuente técnica/comercial", value: source }] : []),
    ],
    inStock: false,
    stock: 0,
  };
}

export const frenosSuspensionProducts = [
  product({
    id: "moog-tijera-inferior-completa-gasolina", name: "Tijera Inferior Completa MOOG — Referencia según Vehículo", brand: "MOOG", sku: "MOOG-CTRL-ARM-COT", image: "/catalogo-frenos-suspension/moog-tijera-empaque-catalogo.webp",
    system: "Suspensión delantera — brazo de control o tijera completa", position: "Delantera izquierda o derecha",
    description: "Conjunto de brazo de control con bujes y rótula cuando la aplicación lo incluye.",
    checks: "VIN, lado, diámetro de rótula, anclajes, tipo de buje y rótula integrada", source: "Catálogo oficial MOOG de trapecios, rótulas y silentblocs",
    marketRange: "$153.000–$520.000 COP por unidad, según vehículo y contenido",
  }),
  product({
    id: "moog-rotula-suspension-delantera-gasolina", name: "Rótula de Suspensión Delantera MOOG — Referencia según Vehículo", brand: "MOOG", sku: "MOOG-BALL-JOINT-COT", image: images.steering,
    system: "Suspensión delantera — rótula inferior o superior", position: "Delantera; inferior o superior",
    description: "Articulación esférica entre la mangueta y el brazo de suspensión.",
    checks: "VIN, posición, montaje prensado/atornillado, diámetro del cono y material de mangueta", source: "Catálogo oficial MOOG de rótulas de suspensión",
    marketRange: "$45.000–$180.000 COP por unidad",
  }),
  product({
    id: "moog-terminal-direccion-exterior-gasolina", name: "Terminal de Dirección Exterior MOOG — Referencia según Vehículo", brand: "MOOG", sku: "MOOG-TIE-ROD-END-COT", image: "/catalogo-frenos-suspension/moog-terminal-direccion-empaque-catalogo.webp",
    system: "Dirección — terminal exterior", position: "Delantera izquierda o derecha",
    description: "Terminal articulado que transmite el movimiento de la cremallera a la mangueta.",
    checks: "VIN, lado, longitud, paso de rosca, diámetro del cono y tipo de cremallera", source: "Catálogo oficial MOOG de rótulas de dirección",
    marketRange: "$45.000–$160.000 COP por unidad",
  }),
  product({
    id: "moog-axial-direccion-interior-gasolina", name: "Axial de Dirección Interior MOOG — Referencia según Vehículo", brand: "MOOG", sku: "MOOG-INNER-TIE-ROD-COT", image: "/catalogo-frenos-suspension/moog-rotula-axial-empaque-catalogo.webp",
    system: "Dirección — rótula axial interior", position: "Delantera izquierda o derecha",
    description: "Articulación interior que conecta la cremallera con el terminal exterior.",
    checks: "VIN, fabricante de cremallera, largo total y roscas interior/exterior", source: "Catálogo oficial MOOG de rótulas axiales",
    marketRange: "$55.000–$190.000 COP por unidad",
  }),
  product({
    id: "moog-guardapolvos-cremallera-direccion-gasolina", name: "Kit Guardapolvos de Cremallera de Dirección MOOG — Referencia según Vehículo", brand: "MOOG", sku: "MOOG-RACK-GAITER-COT", image: "/catalogo-frenos-suspension/moog-guardapolvos-direccion-empaque-catalogo.webp",
    system: "Dirección — fuelles o guardapolvos de cremallera", position: "Cremallera de dirección; juego izquierdo y derecho cuando aplica",
    description: "Kit de protección para la unión entre la cremallera y el axial; según aplicación puede incluir fuelles, abrazaderas y grasa.",
    checks: "VIN, diámetro de cremallera y axial, longitudes, número de fuelles, abrazaderas y contenido del kit", source: "MOOG — Steering Rack Gaiter Kits",
  }),
  product({
    id: "moog-bieleta-estabilizadora-gasolina", name: "Bieleta de Barra Estabilizadora MOOG — Referencia según Vehículo", brand: "MOOG", sku: "MOOG-LINK-STAB-COT", image: images.steering,
    system: "Suspensión — barra estabilizadora", position: "Delantera o trasera; izquierda o derecha",
    description: "Enlace articulado para controlar el balanceo y eliminar holguras de la estabilizadora.",
    checks: "VIN, eje, lado, longitud entre centros, terminales y orientación", source: "Catálogo oficial MOOG de varillas estabilizadoras",
  }),
  product({
    id: "moog-bujes-tijera-suspension-gasolina", name: "Bujes de Tijera y Suspensión MOOG — Juego según Vehículo", brand: "MOOG", sku: "MOOG-BUSHING-KIT-COT", image: images.mounts,
    system: "Suspensión — silentblocs y bujes de brazo de control", position: "Delantera o trasera",
    description: "Bujes elastoméricos que aíslan vibración y conservan la posición del brazo bajo carga.",
    checks: "VIN, eje, brazo, diámetro interior/exterior, ancho y orientación", source: "Catálogo oficial MOOG de silentblocs y kits de reparación",
    marketRange: "$35.700–$160.000 COP según buje o juego",
  }),
  product({
    id: "gabriel-soporte-amortiguador-rodamiento-gasolina", name: "Soporte de Amortiguador con Rodamiento — Referencia según Vehículo", brand: "Gabriel", sku: "GAB-STRUT-MOUNT-COT", image: images.mounts,
    system: "Suspensión — soporte superior, copela y rodamiento", position: "Delantera izquierda o derecha",
    description: "Soporte superior para puntal McPherson; el contenido puede incluir copela, rodamiento, arandelas y separadores.",
    checks: "VIN, amortiguador, pernos, diámetro de vástago y contenido del kit", source: "Gabriel de Colombia — amortiguadores y partes de suspensión",
  }),
  product({
    id: "gabriel-guardapolvo-tope-amortiguador-gasolina", name: "Kit Guardapolvo y Tope de Amortiguador — Referencia según Vehículo", brand: "Gabriel", sku: "GAB-DUST-BOOT-COT", image: images.mounts,
    system: "Suspensión — protección de vástago y tope de compresión", position: "Delantera o trasera",
    description: "Protege el vástago de contaminación y limita el recorrido extremo del amortiguador.",
    checks: "VIN, eje, diámetro de vástago, longitud de guardapolvo y diseño del tope", source: "Gabriel de Colombia — partes de suspensión",
    marketRange: "$45.000–$140.000 COP por kit",
  }),
  product({
    id: "bomba-freno-maestra-chevrolet-gasolina", name: "Bomba Maestra de Freno — Chevrolet Gasolina", sku: "BRK-MASTER-CHEV-COT", image: images.hydraulic, group: groups.chevrolet,
    system: "Freno hidráulico — cilindro maestro", position: "Compartimiento del motor, junto al servofreno",
    description: "Bomba maestra para generar presión en los circuitos hidráulicos; varía con ABS, salidas y depósito.",
    checks: "VIN, ABS, diámetro del pistón, salidas, roscas, brida y depósito", source: "Catálogos Bosch/ACDelco y equivalencias OE",
  }),
  product({
    id: "bomba-freno-maestra-renault-kia-hyundai-gasolina", name: "Bomba Maestra de Freno — Renault, Kia y Hyundai Gasolina", sku: "BRK-MASTER-RKH-COT", image: images.hydraulic, group: groups.renaultKorean,
    system: "Freno hidráulico — cilindro maestro", position: "Compartimiento del motor, junto al servofreno",
    description: "Bomba maestra seleccionada por configuración hidráulica; no intercambiar versiones con y sin ABS sin validar.",
    checks: "VIN, ABS, pistón, depósito, brida, salidas y roscas", source: "Catálogos Bosch y equivalencias OE",
  }),
  product({
    id: "cilindro-rueda-freno-trasero-gasolina", name: "Cilindro de Rueda para Freno Trasero de Campana", sku: "BRK-WHEEL-CYL-COT", image: images.hydraulic,
    system: "Freno hidráulico — cilindro de rueda", position: "Eje trasero izquierdo o derecho",
    description: "Cilindro que acciona las zapatas dentro de la campana; conviene revisar ambos lados y las bandas.",
    checks: "VIN, diámetro interno, anclaje, purgador, rosca de entrada y lado", source: "Catálogos Bosch/Cofre y equivalencias OE",
  }),
  product({
    id: "manguera-freno-flexible-gasolina", name: "Manguera Flexible de Freno — Referencia según Vehículo", sku: "BRK-HOSE-COT", image: images.hydraulic,
    system: "Freno hidráulico — línea flexible", position: "Delantera o trasera; izquierda o derecha",
    description: "Línea flexible reforzada entre la tubería rígida y la mordaza o cilindro móvil.",
    checks: "VIN, eje, lado, longitud, roscas, soportes y terminales", source: "Catálogo del fabricante y equivalencia OE; no seleccionar solo por longitud",
  }),
  product({
    id: "sensor-abs-rueda-gasolina", name: "Sensor ABS de Velocidad de Rueda — Referencia según Vehículo", sku: "ABS-WHEEL-SENSOR-COT", image: images.sensors,
    system: "Freno electrónico — sensor de velocidad ABS", position: "Delantera o trasera; izquierda o derecha",
    description: "Mide la velocidad de rueda para ABS, control de tracción y estabilidad cuando el vehículo los equipa.",
    checks: "VIN, posición, activo/pasivo, conector, cable, fijaciones y aro reluctor", source: "Catálogo Bosch Automotive Aftermarket y equivalencias OE",
  }),
  product({
    id: "kit-reparacion-mordaza-freno-gasolina", name: "Kit de Reparación de Mordaza de Freno — Referencia según Vehículo", sku: "BRK-CALIPER-KIT-COT", image: images.hydraulic,
    system: "Freno de disco — reparación de mordaza o caliper", position: "Delantera o trasera",
    description: "Juego de sellos y guardapolvos; exige inspeccionar pistón, cilindro y guías antes de reutilizar la mordaza.",
    checks: "VIN, fabricante de mordaza, eje, diámetro/cantidad de pistones y contenido", source: "Catálogo de reparación del fabricante de la mordaza",
  }),
  product({
    id: "campana-freno-trasera-gasolina", name: "Campana de Freno Trasera — Referencia según Vehículo", sku: "BRK-DRUM-COT", image: "/tambor.webp",
    system: "Freno mecánico/hidráulico — campana trasera", position: "Eje trasero",
    description: "Campana para aplicaciones con zapatas; algunas versiones integran cubo, rodamiento o aro ABS.",
    checks: "VIN, diámetro interior, altura, perforación, centro, rodamiento y aro ABS", source: "Catálogos Fras-le/Incolbest y equivalencias OE",
    marketRange: "$205.000–$355.800 COP el par en compactos; otras aplicaciones varían",
  }),
  product({
    id: "pastillas-freno-traseras-gasolina", name: "Pastillas de Freno Traseras — Referencia según Vehículo", brand: "Incolbest / Bosch / Fras-le", sku: "BRK-REAR-PAD-COT", image: "/incolbest-pastillas-menu.webp",
    system: "Freno de disco — pastillas traseras", position: "Eje trasero",
    description: "Juego de pastillas para vehículos con freno de disco trasero; algunas versiones incorporan avisador o sensor de desgaste.",
    checks: "VIN, año, motor, eje, fabricante de mordaza, forma FMSI, espesor y sensor", source: "Catálogos Incolbest, Bosch y Fras-le; referencia comercial Azupartes Renault Megane",
    marketRange: "$60.000–$180.000 COP por juego",
  }),
  product({
    id: "mordaza-caliper-freno-completa-gasolina", name: "Mordaza o Caliper de Freno Completo — Referencia según Vehículo", sku: "BRK-CALIPER-COT", image: images.hydraulic,
    system: "Freno de disco — mordaza completa", position: "Delantera o trasera; izquierda o derecha",
    description: "Conjunto de mordaza que aloja pistón y pastillas; puede venderse con o sin soporte, guías y motor eléctrico de estacionamiento.",
    checks: "VIN, eje, lado, diámetro y cantidad de pistones, soporte, purgador, freno eléctrico y fabricante", source: "Catálogos Bosch Automotive Aftermarket y Brake Pak Colombia",
    marketRange: "$180.000–$850.000 COP por unidad",
  }),
  product({
    id: "kit-guias-pasadores-mordaza-gasolina", name: "Kit de Guías y Pasadores de Mordaza — Referencia según Vehículo", sku: "BRK-CALIPER-SLIDE-COT", image: images.hydraulic,
    system: "Freno de disco — guías, pasadores y guardapolvos", position: "Mordaza delantera o trasera",
    description: "Kit para recuperar el deslizamiento controlado de la mordaza flotante cuando las guías presentan corrosión, juego o bloqueo.",
    checks: "VIN, fabricante de mordaza, eje, diámetro, longitud, rosca y contenido del kit", source: "Oferta Brake Pak Colombia y catálogos de reparación de mordaza",
    marketRange: "$35.900–$79.800 COP por kit",
  }),
  product({
    id: "servofreno-booster-vacio-gasolina", name: "Servofreno o Booster de Vacío — Referencia según Vehículo", sku: "BRK-BOOSTER-COT", image: images.hydraulic,
    system: "Asistencia de freno — servofreno por vacío", position: "Mamparo del compartimiento del motor",
    description: "Multiplica el esfuerzo del pedal mediante vacío; no incluye bomba maestra salvo que la referencia indique conjunto completo.",
    checks: "VIN, diámetro, patrón de pernos, longitud de vástagos, válvula, bomba compatible y sistema de asistencia", source: "Brake Pak / Disbrake Colombia; precios publicados para Chevrolet Spark",
    marketRange: "$327.900–$520.000 COP por unidad en compactos",
  }),
  product({
    id: "cable-freno-estacionamiento-gasolina", name: "Cable de Freno de Estacionamiento — Referencia según Vehículo", sku: "BRK-PARK-CABLE-COT", image: images.hydraulic,
    system: "Freno de estacionamiento — cable mecánico", position: "Central, izquierdo o derecho según diseño",
    description: "Transmite el accionamiento de la palanca o pedal a las ruedas traseras; algunos vehículos utilizan varios tramos.",
    checks: "VIN, carrocería, longitud, terminales, soportes, lado y cantidad de cables", source: "Catálogos de freno Bosch y equivalencias OE",
    marketRange: "$55.000–$220.000 COP por tramo",
  }),
  product({
    id: "resorte-helicoidal-suspension-gasolina", name: "Resorte Helicoidal de Suspensión — Referencia según Vehículo", brand: "Gabriel / Multimarca", sku: "SUS-COIL-SPRING-COT", image: images.mounts,
    system: "Suspensión — resorte helicoidal", position: "Delantero o trasero; venta por unidad o par según referencia",
    description: "Elemento elástico que sostiene la carga y determina altura de marcha; debe emparejarse por eje y especificación.",
    checks: "VIN, eje, carrocería, motor, carga, diámetro de alambre, altura y código de color", source: "Catálogos de suspensión Gabriel y equivalencias OE",
    marketRange: "$120.000–$420.000 COP por unidad",
  }),
  product({
    id: "cubo-rodamiento-rueda-abs-gasolina", name: "Cubo y Rodamiento de Rueda con/sin ABS — Referencia según Vehículo", brand: "MOOG / SKF / FAG", sku: "HUB-BEARING-COT", image: images.sensors,
    system: "Rodamiento y cubo de rueda", position: "Delantero o trasero; izquierda o derecha",
    description: "Conjunto que soporta la rueda; según aplicación integra brida, rodamiento, sensor o aro magnético ABS.",
    checks: "VIN, eje, tracción, perforación, diámetro, estrías, sensor ABS y aro magnético", source: "MOOG — rodamientos de rueda; catálogos SKF/FAG",
    marketRange: "$140.000–$650.000 COP por unidad",
  }),
];
