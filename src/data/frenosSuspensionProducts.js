const category = { name: "Frenos y Suspensión", slug: "frenos-y-suspension" };
const images = {
  steering: "/catalogo-frenos-suspension/direccion-suspension-familia.webp",
  mounts: "/catalogo-frenos-suspension/soportes-bujes-suspension-familia.webp",
  hydraulic: "/catalogo-frenos-suspension/freno-hidraulico-familia.webp",
  sensors: "/catalogo-frenos-suspension/sensores-freno-familia.webp",
};
const groups = {
  general: ["Chevrolet, Renault, Kia, Hyundai, Nissan, Toyota, Mazda, Ford y Volkswagen", "automóviles, SUV y camionetas livianas a gasolina de alta circulación en Colombia"],
  chevrolet: ["Chevrolet", "Spark, Spark GT, Beat, Sail, Aveo, Optra, Onix y Tracker"],
  renaultKorean: ["Renault, Kia y Hyundai", "Logan, Sandero, Stepway, Duster, Picanto, Rio, Sportage, i10, Accent y Tucson"],
};

function product({ id, name, brand = "Multimarca", sku, image, group = groups.general, system, position, description, checks, source }) {
  return {
    id, name, slug: id, category,
    brand: { name: brand, slug: brand.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") },
    price: 0, sku,
    shortDesc: `${system}; selección técnica por VIN y muestra.`,
    description: `${description} Compatible de forma orientativa con ${group[0]}: ${group[1]}. La referencia cambia por año, motor, versión y sistema instalado; se cotiza después de validar VIN, placa o muestra física.`,
    image,
    images: [{ url: image, alt: `${name} — representación de familia`, isMain: true }],
    attributes: [
      { id: `${id}-system`, name: "Sistema", value: system },
      { id: `${id}-position`, name: "Posición", value: position },
      { id: `${id}-fuel`, name: "Combustible", value: "Automóviles, SUV y camionetas livianas a gasolina" },
      { id: `${id}-brands`, name: "Marcas compatibles", value: group[0] },
      { id: `${id}-models`, name: "Modelos compatibles", value: group[1] },
      { id: `${id}-checks`, name: "Validar antes de comprar", value: checks },
      { id: `${id}-source`, name: "Fuente técnica", value: source },
      { id: `${id}-image`, name: "Imagen", value: "Representación neutral de familia; no identifica una referencia específica" },
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
  }),
  product({
    id: "moog-rotula-suspension-delantera-gasolina", name: "Rótula de Suspensión Delantera MOOG — Referencia según Vehículo", brand: "MOOG", sku: "MOOG-BALL-JOINT-COT", image: images.steering,
    system: "Suspensión delantera — rótula inferior o superior", position: "Delantera; inferior o superior",
    description: "Articulación esférica entre la mangueta y el brazo de suspensión.",
    checks: "VIN, posición, montaje prensado/atornillado, diámetro del cono y material de mangueta", source: "Catálogo oficial MOOG de rótulas de suspensión",
  }),
  product({
    id: "moog-terminal-direccion-exterior-gasolina", name: "Terminal de Dirección Exterior MOOG — Referencia según Vehículo", brand: "MOOG", sku: "MOOG-TIE-ROD-END-COT", image: "/catalogo-frenos-suspension/moog-terminal-direccion-empaque-catalogo.webp",
    system: "Dirección — terminal exterior", position: "Delantera izquierda o derecha",
    description: "Terminal articulado que transmite el movimiento de la cremallera a la mangueta.",
    checks: "VIN, lado, longitud, paso de rosca, diámetro del cono y tipo de cremallera", source: "Catálogo oficial MOOG de rótulas de dirección",
  }),
  product({
    id: "moog-axial-direccion-interior-gasolina", name: "Axial de Dirección Interior MOOG — Referencia según Vehículo", brand: "MOOG", sku: "MOOG-INNER-TIE-ROD-COT", image: "/catalogo-frenos-suspension/moog-rotula-axial-empaque-catalogo.webp",
    system: "Dirección — rótula axial interior", position: "Delantera izquierda o derecha",
    description: "Articulación interior que conecta la cremallera con el terminal exterior.",
    checks: "VIN, fabricante de cremallera, largo total y roscas interior/exterior", source: "Catálogo oficial MOOG de rótulas axiales",
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
  }),
];
