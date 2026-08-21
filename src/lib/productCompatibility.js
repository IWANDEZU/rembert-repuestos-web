const compatibilityAttributeNames = [
  "modelos compatibles",
  "modelos orientativos",
  "vehículos orientativos",
  "vehiculos orientativos",
  "marcas compatibles",
  "compatibilidad",
  "aplicaciones",
  "modelos",
  "marcas",
];

export function getProductCompatibility(product) {
  const attributes = Array.isArray(product?.attributes) ? product.attributes : [];
  const normalizedAttributes = attributes.map((attribute) => ({
    name: String(attribute?.name || "").trim().toLowerCase(),
    value: String(attribute?.value || "").trim(),
  }));

  for (const expectedName of compatibilityAttributeNames) {
    const match = normalizedAttributes.find(
      (attribute) => attribute.name === expectedName && attribute.value
    );
    if (match) return match.value;
  }

  const categorySlug = product?.category?.slug || product?.category;
  if (categorySlug === "filtros") {
    return "Automóviles, SUV y pickups; confirmar motor, medidas y referencia del filtro instalado.";
  }
  if (["frenos-y-suspension", "liquido-frenos"].includes(categorySlug)) {
    return "Automóviles, SUV y pickups; confirmar VIN, año, versión, eje, sistema ABS y medidas.";
  }
  if (["electrico-y-encendido", "motor-y-distribucion", "embrague", "rodamientos-y-traccion"].includes(categorySlug)) {
    return "Automóviles y pickups; confirmar VIN, año, código de motor y referencia desmontada.";
  }
  if (["coolant", "mantenimiento", "transmision", "lubricantes-gasolina", "grasas-y-aditivos", "siliconas"].includes(categorySlug)) {
    return "Vehículos cuya ficha técnica admita esta especificación; confirmar manual, motor y sistema.";
  }

  return "Automóviles y pickups; confirmar marca, modelo, año, motor, versión y VIN antes de comprar.";
}
