export const products = [
  {
    id: "aceite-sintetico-15w40",
    name: "Aceite Sintético 15W-40 Heavy Duty",
    category: "Lubricantes",
    brand: "Mobil",
    price: 120.00,
    description: "Aceite de motor diesel de alto rendimiento que ayuda a prolongar la vida útil del motor en las aplicaciones más severas fuera de carretera.",
    image: "https://via.placeholder.com/400x300?text=Aceite+15W-40",
    features: [
      "Protección contra el desgaste",
      "Control de depósitos",
      "Estabilidad térmica"
    ],
    inStock: true,
  },
  {
    id: "filtro-aire-hd-200",
    name: "Filtro de Aire HD-200",
    category: "Filtros",
    brand: "Donaldson",
    price: 45.50,
    description: "Filtro de aire de alta eficiencia diseñado específicamente para maquinaria agrícola y de construcción en ambientes polvorientos.",
    image: "https://via.placeholder.com/400x300?text=Filtro+Aire+HD-200",
    features: [
      "Retención de polvo del 99.9%",
      "Mayor flujo de aire",
      "Larga duración"
    ],
    inStock: true,
  },
  {
    id: "grasa-litio-extrema-presion",
    name: "Grasa de Litio EP-2",
    category: "Grasas",
    brand: "Chevron",
    price: 85.00,
    description: "Grasa de extrema presión multiuso para rodamientos de ruedas y chasis en equipos pesados.",
    image: "https://via.placeholder.com/400x300?text=Grasa+EP-2",
    features: [
      "Resistencia al agua",
      "Protección contra la corrosión",
      "Soporta cargas pesadas"
    ],
    inStock: false,
  }
];

export function getProductById(id) {
  return products.find(p => p.id === id);
}
