const hoses = { name: "Mangueras y Tubos", slug: "mangueras-y-tubos" };
const mounts = { name: "Soportes, Retenedores y Guayas", slug: "soportes-retenedores-y-guayas" };

function lineFamily({ id, name, brand, sku, category, image, family, validation, source, description }) {
  return {
    id, name, slug: id, category,
    brand: { name: brand, slug: brand.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") },
    price: 0, sku, referenceType: "manufacturer-family", fitmentStatus: "family",
    fitmentSummary: `${family}; la referencia se confirma por vehículo y medidas, no por parecido visual.`,
    fitmentRequirements: validation.split(/[,;]+/).map((value) => value.trim()).filter(Boolean),
    fitmentSource: source,
    shortDesc: `${family}. Disponibilidad bajo cotización técnica.`,
    description,
    image, images: [{ url: image, alt: `${name}, familia de repuestos con marca de agua REMBERT`, isMain: true }],
    imageStatus: "ai-catalog-watermarked",
    attributes: [
      { id: `${id}-family`, name: "Familia", value: family },
      { id: `${id}-fitment`, name: "Compatible con", value: "Automóviles y pickups; confirmar aplicación por VIN, motor, posición y referencia OE" },
      { id: `${id}-validation`, name: "Validación obligatoria", value: validation },
      { id: `${id}-source`, name: "Fuente", value: source },
    ],
    inStock: false, stock: 0,
  };
}

export const inventoryLineProducts = [
  lineFamily({
    id: "gates-mangueras-refrigeracion-admision-familia", name: "Mangueras Gates — Refrigeración y Admisión", brand: "Gates", sku: "GATES-HOSE-COT", category: hoses,
    image: "/catalogo-lineas/mangueras-tubos-rembert.webp", family: "Mangueras moldeadas de refrigerante, calefacción y admisión",
    validation: "VIN, motor, diámetro interior, forma, longitud, conexiones, temperatura, referencia OE", source: "Gates Automotive Aftermarket — sistemas de mangueras",
    description: "Mangueras Gates para circulación de refrigerante, calefacción y aire de admisión. La geometría, el diámetro y la resistencia térmica deben corresponder al circuito original.",
  }),
  lineFamily({
    id: "tubos-mangueras-freno-combustible-familia", name: "Tubos y Mangueras de Freno / Combustible — Referencia OE", brand: "Cofre", sku: "LINE-HOSE-COT", category: hoses,
    image: "/catalogo-lineas/mangueras-tubos-rembert.webp", family: "Mangueras de freno, tubos rígidos y líneas de combustible",
    validation: "VIN, sistema, eje o posición, longitud, rosca, tipo de terminal, presión, combustible, referencia OE", source: "Línea técnica de frenos y conducción de fluidos; aplicación condicionada por referencia",
    description: "Líneas flexibles y rígidas para circuitos automotrices. En frenos y combustible no se admite sustitución por diámetro aproximado: presión, material, rosca y terminal son críticos.",
  }),
  lineFamily({
    id: "corteco-soportes-retenedores-familia", name: "Corteco Soportes de Motor y Retenedores", brand: "Corteco", sku: "CORTECO-MOUNT-SEAL-COT", category: mounts,
    image: "/catalogo-lineas/soportes-retenedores-guayas-rembert.webp", family: "Soportes de motor/caja y retenedores de aceite",
    validation: "VIN, motor, transmisión, posición, tipo hidráulico o sólido, diámetro interior/exterior, espesor, sentido de giro, OE", source: "Corteco Aftermarket — vibration control y sealing",
    description: "Soportes y sellos Corteco para control de vibración y estanqueidad. La posición del soporte y las dimensiones/labio del retenedor deben coincidir exactamente con la aplicación.",
  }),
  lineFamily({
    id: "aa-guayas-control-automotriz-familia", name: "A&A Guayas de Embrague, Acelerador y Freno", brand: "A&A", sku: "AA-CABLE-COT", category: mounts,
    image: "/catalogo-lineas/soportes-retenedores-guayas-rembert.webp", family: "Guayas de embrague, acelerador, selector y freno de estacionamiento",
    validation: "VIN, modelo, año, función, longitud total y funda, recorrido, terminales, lado, OE", source: "A&A Arneses y Gomas — línea de cables/guayas; validar referencia individual",
    description: "Guayas de mando mecánico. Longitud, recorrido, terminales y anclajes cambian entre versiones del mismo vehículo y deben verificarse antes del despacho.",
  }),
];
