const clutch = { name: "Embrague", slug: "embrague" };
const image = "/catalogo-electricos/phc-valeo-kit-embrague-rembert.webp";

function phcProduct({ id, name, sku, fitments, summary, requirements, source, price = 0 }) {
  return {
    id, name, slug: id, category: clutch,
    brand: { name: "PHC Valeo", slug: "phc-valeo" },
    price, sku, referenceType: "manufacturer", fitmentStatus: "conditional",
    fitments, fitmentSummary: summary, fitmentRequirements: requirements,
    fitmentSource: source,
    shortDesc: "Kit de embrague con disco, prensa y balinera según referencia.",
    description: "Kit PHC Valeo para transmisión manual. El contenido puede variar por referencia. Antes del despacho se debe cruzar número PHC Valeo, OE, VIN, motor, diámetro, estrías y tipo de balinera; no se vende por semejanza de caja o fotografía.",
    image, images: [{ url: image, alt: `${name} con empaque PHC Valeo y marca de agua REMBERT`, isMain: true }],
    imageStatus: "ai-catalog-watermarked",
    attributes: [
      { id: `${id}-ref`, name: "Referencia", value: sku },
      { id: `${id}-content`, name: "Contenido", value: "Disco, prensa y balinera según la configuración del kit" },
      { id: `${id}-compatible`, name: "Compatible con", value: summary },
      { id: `${id}-validation`, name: "Validación", value: requirements.join(", ") },
      { id: `${id}-source`, name: "Fuente", value: source },
    ],
    inStock: false, stock: 0,
  };
}

export const phcValeoProducts = [
  phcProduct({
    id: "phc-valeo-dwk-040b-chevrolet-aveo", name: "Kit de Embrague PHC Valeo DWK-040B — Chevrolet Aveo 1.4 / 1.6", sku: "DWK-040B", price: 327600,
    fitments: [{ make: "Chevrolet", model: "Aveo", engine: "1.4 / 1.6 gasolina", years: "según VIN y mercado", position: "Transmisión manual" }],
    summary: "Chevrolet Aveo 1.4 y 1.6 con transmisión manual; confirmar VIN, motor y OE.",
    requirements: ["VIN", "motor 1.4 o 1.6", "transmisión manual", "diámetro 215 mm", "24 estrías", "OE"],
    source: "PHC Valeo DWK-040B; ficha comercial colombiana Repuesto.co (disco DW-37, prensa DWC-41, balinera 90251210).",
  }),
  phcProduct({
    id: "phc-valeo-hdk-062b-atos-picanto-i10-eon", name: "Kit de Embrague PHC Valeo HDK-062B — Atos, Picanto, i10 y Eon", sku: "HDK-062B",
    fitments: [{ make: "Hyundai / Kia", model: "Atos / Picanto Morning / i10 / Eon", engine: "0.8 / 1.0 / 1.1 según aplicación", years: "según VIN y catálogo", position: "Transmisión manual" }],
    summary: "Hyundai Atos, i10 y Eon; Kia Picanto/Morning, únicamente cuando el catálogo PHC Valeo cruza HDK-062B.",
    requirements: ["VIN", "marca", "modelo", "año", "motor", "caja manual", "OE", "referencia desmontada"],
    source: "Catálogo PHC Valeo Colombia / listado de aplicación HDK-062B; validar corte de producción.",
  }),
  phcProduct({
    id: "phc-valeo-hdk-180b-picanto-ion-rio-i10", name: "Kit de Embrague PHC Valeo HDK-180B — Picanto Ion, Rio 1.25 e i10 1.2", sku: "HDK-180B",
    fitments: [{ make: "Kia / Hyundai", model: "Picanto Ion / Rio / i10", engine: "1.2 / 1.25 gasolina", years: "según VIN y catálogo", position: "Transmisión manual" }],
    summary: "Kia Picanto Ion y Rio 1.25; Hyundai i10 1.2, sujeto a VIN, año y versión de caja.",
    requirements: ["VIN", "motor", "año", "código de caja", "diámetro", "estrías", "OE"],
    source: "Catálogo PHC Valeo Colombia / aplicación HDK-180B.",
  }),
  phcProduct({
    id: "phc-valeo-hdk-204b-kia-hyundai", name: "Kit de Embrague PHC Valeo HDK-204B — Kia/Hyundai 1.4–1.6", sku: "HDK-204B",
    fitments: [{ make: "Kia / Hyundai", model: "Rio UB / Forte / Cerato / Soul / Accent i25 / Elantra / Veloster", engine: "1.4 / 1.6 gasolina según versión", years: "según VIN y catálogo", position: "Transmisión manual" }],
    summary: "Familia Kia Rio UB, Forte/Cerato y Soul; Hyundai Accent i25, Elantra y Veloster, solo tras cruce de VIN/caja.",
    requirements: ["VIN", "modelo", "año", "motor", "código de caja", "diámetro", "estrías", "OE"],
    source: "Catálogo PHC Valeo Colombia / aplicación HDK-204B.",
  }),
  phcProduct({
    id: "phc-valeo-isk-089b-dmax-2-5", name: "Kit de Embrague PHC Valeo ISK-089B — Chevrolet D-Max 2.5", sku: "ISK-089B",
    fitments: [{ make: "Chevrolet / Isuzu", model: "D-Max", engine: "2.5 4JA1 diésel", years: "2005–2014, confirmar VIN", position: "Transmisión manual" }],
    summary: "Chevrolet/Isuzu D-Max 2.5 4JA1 2005–2014 con caja manual, sujeto a VIN y OE.",
    requirements: ["VIN", "motor 4JA1", "año", "tracción", "código de caja", "diámetro", "estrías", "OE"],
    source: "Catálogo PHC Valeo Colombia / aplicación ISK-089B.",
  }),
];
