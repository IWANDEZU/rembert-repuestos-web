const gtiImage = (file) => `/catalogo-gti/${file}`;

const GTI_OFFICIAL_SOURCE = "GTI Autoparts / Dispartes Colombia: https://dispartes.com/gtiautoparts/";
const GTI_CATALOG_SOURCE = "Catálogo colombiano de puntas y ejes GTI: https://fliphtml5.com/spaxu/ahxl/REPUESTOS_PUNTAS_Y_EJES/";
const FAMILY_IMAGE = gtiImage("gti-linea-homocinetica-studio-v2.webp");

const exactImages = {
  "GTI01-028": {
    file: "gti01-028-tulipa-logan-sandero-studio-v2.webp",
    source: "Importadoras Asociadas Colombia, GTI01-028: https://www.importadorasasociadas.com/punta-eje-lado-caja-derecha-renault-logan-2006-2015-sandero-2009-2015-stepway-2009-2015-8084-gti01-028/p",
  },
  "GTI01-038": {
    file: "gti01-038-punta-eje-logan-sandero-studio-v2.webp",
    source: "Importadoras Asociadas Colombia, GTI01-038: https://www.importadorasasociadas.com/punta-eje-lado-rueda-renault-logan-2006-2015-sandero-2009-2015-stepway-2009-2015-7850-gti01-038/p",
  },
  "GTI01064": {
    file: "gti01-064-punta-eje-duster-studio-v2.webp",
    source: "Importadoras Asociadas Colombia, GTI01-064: https://www.importadorasasociadas.com/punta-eje-lado-rueda-renault-duster-2012-2021-8065-gti01-064/p",
  },
  "GTI01-102": {
    file: "gti01-102-punta-eje-logan-sandero-studio-v2.webp",
    source: "Mercado Libre Colombia, GTI01-102: https://www.mercadolibre.com.co/punta-eje-lado-rueda-renault-sandero-stepway-logan-23x22/up/MCOU3077976680",
  },
  "GTI04-128": {
    file: "gti04-128-punta-eje-spark-abs-studio-v2.webp",
    source: "Mercado Libre Colombia, GTI04-128: https://www.mercadolibre.com.co/punta-eje-lado-rueda-chevrolet-spark-cronos-23x21-con-abs-40/up/MCOU3301683684",
  },
};

const normalizeReference = (value) => String(value || "")
  .toUpperCase()
  .replace(/[^A-Z0-9]/g, "");

const exactImageFor = (sku) => {
  const key = Object.keys(exactImages).find((reference) => normalizeReference(reference) === normalizeReference(sku));
  return key ? exactImages[key] : null;
};

const productSlug = (value) => String(value || "producto")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/(^-|-$)/g, "");

function gtiProduct({
  sku,
  name,
  make,
  model,
  years = "Confirmar por VIN y catálogo GTI vigente",
  engine = "Según versión",
  position,
  splines = "Confirmar contra la pieza desmontada",
  transmission = "Confirmar por VIN",
  abs = "Confirmar por VIN y corona/sensor",
  status = "conditional",
  source = "",
  note = "",
}) {
  const exactImage = exactImageFor(sku);
  const image = exactImage ? gtiImage(exactImage.file) : FAMILY_IMAGE;
  const id = `gti-${productSlug(sku)}-${productSlug(model)}`;
  const requirements = [
    "VIN",
    "año",
    "motor",
    "transmisión",
    "lado de montaje",
    "estrías internas y externas",
    "diámetro del sello",
    "ABS y número de dientes de corona",
  ];

  return {
    id,
    name,
    slug: productSlug(`${sku}-${name}`),
    category: { name: "Rodamientos y Tracción", slug: "rodamientos-y-traccion" },
    brand: { name: "GTI", slug: "gti" },
    price: 0,
    sku,
    referenceType: "manufacturer",
    fitmentStatus: status,
    fitments: [{ make, model, engine, years, position }],
    fitmentSummary: `${sku}: ${make} ${model} · ${position} · ${years}.`,
    fitmentRequirements: requirements,
    fitmentSource: `${GTI_OFFICIAL_SOURCE} · ${GTI_CATALOG_SOURCE}${exactImage ? ` · ${exactImage.source}` : ""}${source ? ` · ${source}` : ""}`,
    shortDesc: `${position} GTI para ${make} ${model}. Compatibilidad sujeta a referencia, estrías, transmisión y ABS.`,
    description: `${name}. Aplicación registrada para ${make} ${model}; ${years}. Configuración: ${splines}; transmisión: ${transmission}; ABS: ${abs}. ${note} Antes del despacho REMBERT valida VIN, número de parte, posición y medidas: una junta homocinética no se debe vender por semejanza visual.`,
    image,
    images: [{
      url: image,
      alt: `${name} ${sku}${exactImage ? " con kit y empaque GTI" : " — imagen de familia GTI"}`,
      isMain: true,
    }],
    imageStatus: exactImage ? "studio-reference-derived-watermarked" : "studio-family-watermarked",
    attributes: [
      { id: `${id}-reference`, name: "Referencia GTI", value: sku },
      { id: `${id}-compatibility`, name: "Compatible con", value: `${make} ${model} · ${years}` },
      { id: `${id}-position`, name: "Posición", value: position },
      { id: `${id}-splines`, name: "Estrías / configuración", value: splines },
      { id: `${id}-transmission`, name: "Transmisión", value: transmission },
      { id: `${id}-abs`, name: "ABS", value: abs },
      { id: `${id}-verification`, name: "Validación obligatoria", value: "VIN, etiqueta GTI, lado, medidas, estrías y ABS antes de instalar" },
      {
        id: `${id}-image`,
        name: "Imagen",
        value: exactImage
          ? "Composición de estudio basada en la fotografía verificada de la referencia, con empaque GTI y marca REMBERT"
          : "Composición de familia GTI con marca REMBERT; no demuestra la referencia exacta",
      },
    ],
    inStock: false,
    stock: 0,
  };
}

export const gtiProducts = [
  gtiProduct({ sku: "GTI-038", name: "Tulipa lado caja GTI — Hyundai Vision / Kia Sephia", make: "Hyundai / Kia", model: "Accent Vision / Sephia", position: "Eje delantero · lado caja", splines: "Referencia interna de inventario 1012531; contar estrías", note: "La denominación Vision puede variar por mercado." }),
  gtiProduct({ sku: "GTI01-004", name: "Punta lado caja GTI — Renault R9 / R12 / R18 / Twingo 8V", make: "Renault", model: "R9 / R12 / R18 / Twingo 8V", position: "Eje delantero · lado caja", splines: "23 externas × 22 internas · sistema con triceta", transmission: "Manual", status: "verified", source: "Publicación colombiana GTI01-004+: https://articulo.mercadolibre.com.co/MCO-1878977823-punta-eje-lado-caja-renaultr9-r12-r18-twingo8v-triceta-23x22-_JM", note: "Aplicación y medidas contrastadas con una publicación colombiana de la referencia GTI01-004+." }),
  gtiProduct({ sku: "GTI01-016", name: "Punta lado rueda GTI — Renault Clio II / Symbol", make: "Renault", model: "Clio II / Symbol", position: "Eje delantero · lado rueda", splines: "30 dientes; confirmar pin y medidas", abs: "Con ABS; confirmar corona", note: "No confundir con GTI01-017: el diseño y el pin cambian." }),
  gtiProduct({ sku: "GTI01-017", name: "Punta lado rueda GTI — Renault Mégane", make: "Renault", model: "Mégane", position: "Eje delantero · lado rueda", splines: "30 dientes · pin externo", note: "Existen catálogos antiguos con descripciones distintas para este código; la etiqueta y el VIN son obligatorios." }),
  gtiProduct({ sku: "GTI01-027", name: "Punta lado rueda GTI — Renault Logan", make: "Renault", model: "Logan", position: "Eje delantero · lado rueda", splines: "21 dientes · pin interno" }),
  gtiProduct({ sku: "GTI01-028", name: "Tulipa lado caja derecha GTI — Renault Logan / Sandero / Stepway", make: "Renault", model: "Logan / Sandero / Stepway", years: "Logan 2006–2015 · Sandero/Stepway 2009–2015", engine: "1.4 / 1.6 gasolina", position: "Eje delantero · lado caja derecho", splines: "23 × 21 según inventario; confirmar físicamente", transmission: "Manual; confirmar versión", status: "verified" }),
  gtiProduct({ sku: "GTI01-038", name: "Punta lado rueda GTI — Renault Logan / Sandero / Stepway", make: "Renault", model: "Logan / Sandero / Stepway", years: "Logan 2006–2015 · Sandero/Stepway 2009–2015", engine: "1.4 / 1.6 gasolina", position: "Eje delantero · lado rueda, izquierdo o derecho", splines: "23 × 21 según inventario; confirmar físicamente", status: "verified" }),
  gtiProduct({ sku: "GTI01064", name: "Punta lado rueda GTI — Renault Duster", make: "Renault", model: "Duster", years: "2012–2021", position: "Eje delantero · lado rueda", splines: "35 dientes según inventario; confirmar interior/exterior", status: "verified" }),
  gtiProduct({ sku: "GTI01-092", name: "Punta lado rueda GTI — Renault Kwid", make: "Renault", model: "Kwid", position: "Eje delantero · lado rueda", splines: "23 × 27" }),
  gtiProduct({ sku: "GTI01-093", name: "Tulipa lado caja GTI — Renault Kwid", make: "Renault", model: "Kwid", position: "Eje delantero · lado caja", splines: "23 × 27" }),
  gtiProduct({ sku: "GTI01-102", name: "Punta lado rueda GTI — Renault Logan / Sandero / Stepway", make: "Renault", model: "Logan / Sandero / Stepway", position: "Eje delantero · lado rueda", splines: "23 externas × 22 internas", transmission: "Manual", status: "verified" }),

  gtiProduct({ sku: "GTI03-003", name: "Punta lado rueda GTI — Kia Rio Stylus 1.5", make: "Kia", model: "Rio Stylus", engine: "1.5 gasolina", position: "Eje delantero · lado rueda", splines: "22 dientes · pin interno" }),
  gtiProduct({ sku: "GTI03-072", name: "Punta lado rueda GTI — Mazda 2", make: "Mazda", model: "Mazda 2", position: "Eje delantero · lado rueda", splines: "25 × 39" }),

  gtiProduct({ sku: "GTI04-001", name: "Punta lado rueda GTI — Chevrolet Corsa", make: "Chevrolet", model: "Corsa", engine: "1.3 / 1.4 / 1.6 gasolina", position: "Eje delantero · lado rueda", splines: "28 dientes" }),
  gtiProduct({ sku: "GTI04-002", name: "Punta lado rueda GTI — Chevrolet Corsa / Daewoo Racer, Cielo y Lanos", make: "Chevrolet / Daewoo", model: "Corsa / Racer / Cielo / Lanos", position: "Eje delantero · lado rueda", splines: "Confirmar estrías y pin por vehículo" }),
  gtiProduct({ sku: "GTI04-024", name: "Tulipa lado caja GTI — Chevrolet Corsa", make: "Chevrolet", model: "Corsa", engine: "1.3 / 1.4 gasolina", position: "Eje delantero · lado caja", splines: "Configuración Corea; contar estrías", transmission: "Manual; confirmar" }),
  gtiProduct({ sku: "GTI04-025", name: "Tulipa lado caja GTI — Chevrolet Spark / Spark Cronos", make: "Chevrolet", model: "Spark / Spark Cronos", position: "Eje delantero · lado caja", splines: "22 × 19" }),
  gtiProduct({ sku: "GTI04-035", name: "Punta lado rueda GTI — Chevrolet Optra / Astra", make: "Chevrolet", model: "Optra / Astra", position: "Eje delantero · lado rueda", splines: "23 dientes según catálogo GTI; confirmar medidas" }),
  gtiProduct({ sku: "GTI04-046", name: "Punta lado rueda GTI — Chevrolet Aveo Korea con ABS", make: "Chevrolet", model: "Aveo de origen Corea", position: "Eje delantero · lado rueda", splines: "22 × 22", abs: "Con ABS; confirmar cantidad de dientes" }),
  gtiProduct({ sku: "GTI04-055", name: "Tulipa lado caja GTI — Chevrolet Spark / Spark Cronos", make: "Chevrolet", model: "Spark / Spark Cronos", position: "Eje delantero · lado caja", splines: "21 dientes" }),
  gtiProduct({ sku: "GTI04-066", name: "Tulipa lado caja GTI — Chevrolet Spark GT", make: "Chevrolet", model: "Spark GT", position: "Eje delantero · lado caja", splines: "Confirmar estrías y diámetro de sello" }),
  gtiProduct({ sku: "GTI04-088", name: "Tulipa lado caja GTI — Chevrolet Sail", make: "Chevrolet", model: "Sail", position: "Eje delantero · lado caja", splines: "22 × 22" }),
  gtiProduct({ sku: "GTI04-089", name: "Punta lado rueda GTI — Chevrolet Cobalt / Taxi Elite", make: "Chevrolet", model: "Cobalt / Taxi Elite", position: "Eje delantero · lado rueda", splines: "Confirmar por etiqueta y VIN" }),
  gtiProduct({ sku: "GTI04-090", name: "Tulipa lado caja GTI — Chevrolet Cobalt", make: "Chevrolet", model: "Cobalt", position: "Eje delantero · lado caja", splines: "Confirmar por etiqueta y VIN" }),
  gtiProduct({ sku: "GTI04-110", name: "Tulipa lado caja izquierda GTI — Chevrolet Tracker automática", make: "Chevrolet", model: "Tracker", position: "Eje delantero · lado caja izquierdo", splines: "27 × 23", transmission: "Automática" }),
  gtiProduct({ sku: "GTI04-111", name: "Tulipa lado caja derecha GTI — Chevrolet Tracker automática", make: "Chevrolet", model: "Tracker", position: "Eje delantero · lado caja derecho", splines: "34 × 23", transmission: "Automática" }),
  gtiProduct({ sku: "GTI04-112", name: "Punta lado rueda GTI — Chevrolet Onix 1.4 mecánico", make: "Chevrolet", model: "Onix", engine: "1.4 gasolina", position: "Eje delantero · lado rueda", splines: "25 × 22", transmission: "Manual" }),
  gtiProduct({ sku: "GTI04-114", name: "Tulipa lado caja izquierda GTI — Chevrolet Onix 1.4 automático", make: "Chevrolet", model: "Onix", engine: "1.4 gasolina", position: "Eje delantero · lado caja izquierdo", splines: "22 × 30", transmission: "Automática" }),
  gtiProduct({ sku: "GTI04-125", name: "Punta lado rueda GTI — Chevrolet Sonic mecánico", make: "Chevrolet", model: "Sonic", position: "Eje delantero · lado rueda", splines: "Confirmar conteo y sello", transmission: "Manual" }),
  gtiProduct({ sku: "GTI04-128", name: "Punta lado rueda GTI — Chevrolet Spark / Spark Cronos con ABS", make: "Chevrolet", model: "Spark / Spark Cronos", years: "Aplicación de inventario 2018; confirmar año exacto", position: "Eje delantero · lado rueda", splines: "23 externas × 21 internas", abs: "Corona ABS de 40 dientes", status: "verified" }),
  gtiProduct({ sku: "GTI04-141", name: "Punta lado rueda GTI — Chevrolet Spark GT / Beat con ABS", make: "Chevrolet", model: "Spark GT / Beat", position: "Eje delantero · lado rueda", splines: "Confirmar estrías", abs: "Con ABS; validar corona por año" }),
  gtiProduct({ sku: "GTI04-161", name: "Punta lado rueda GTI — Chevrolet Tracker Turbo / Onix Turbo", make: "Chevrolet", model: "Tracker 1.2 Turbo / Onix 1.0 Turbo", position: "Eje delantero · lado rueda", splines: "Confirmar por VIN", transmission: "Manual" }),
  gtiProduct({ sku: "GTI04-D01", name: "Punta lado rueda GTI — Chevrolet Corsa", make: "Chevrolet", model: "Corsa", position: "Eje delantero · lado rueda", splines: "28 dientes" }),

  gtiProduct({ sku: "GTI06-001", name: "Punta lado rueda GTI — Hyundai Accent / Verna / Gyro / Vision / i25", make: "Hyundai", model: "Accent / Verna / Gyro / Vision / i25", position: "Eje delantero · lado rueda", splines: "22 dientes · pin interno" }),
  gtiProduct({ sku: "GTI06-003", name: "Punta lado rueda GTI — Hyundai Atos", make: "Hyundai", model: "Atos", position: "Eje delantero · lado rueda", splines: "20 dientes" }),
  gtiProduct({ sku: "GTI06-012", name: "Punta lado rueda GTI — Kia Cerato / Forte", make: "Kia", model: "Cerato / Forte", position: "Eje delantero · lado rueda", splines: "22 × 27" }),
  gtiProduct({ sku: "GTI06-014", name: "Tulipa lado caja GTI — Hyundai Atos", make: "Hyundai", model: "Atos", position: "Eje delantero · lado caja", splines: "20 dientes" }),
  gtiProduct({ sku: "GTI06-032", name: "Punta lado rueda GTI — Hyundai i10", make: "Hyundai", model: "i10", position: "Eje delantero · lado rueda", splines: "Confirmar estrías" }),
  gtiProduct({ sku: "GTI06-034", name: "Tulipa lado caja GTI — Kia Rio Stylus", make: "Kia", model: "Rio Stylus", position: "Eje delantero · lado caja", splines: "22 dientes" }),
  gtiProduct({ sku: "GTI06-037", name: "Tulipa lado caja GTI — Kia Rio Xcite / Cerato / Forte / Hyundai i25", make: "Kia / Hyundai", model: "Rio Xcite / Cerato 1.6 / Forte / i25", position: "Eje delantero · lado caja", splines: "Confirmar por versión" }),
  gtiProduct({ sku: "GTI06-038", name: "Tulipa lado caja GTI — Hyundai Accent Vision", make: "Hyundai", model: "Accent Vision", position: "Eje delantero · lado caja", splines: "25 × 22 según inventario" }),
  gtiProduct({ sku: "GTI06-069", name: "Tulipa lado caja GTI — Hyundai Grand i10", make: "Hyundai", model: "Grand i10", position: "Eje delantero · lado caja", splines: "Confirmar estrías y transmisión" }),
  gtiProduct({ sku: "GTI06-081", name: "Punta lado rueda GTI — Hyundai Eon", make: "Hyundai", model: "Eon", position: "Eje delantero · lado rueda", splines: "24 × 19" }),
  gtiProduct({ sku: "GTI06-082", name: "Tulipa lado caja GTI — Hyundai Eon", make: "Hyundai", model: "Eon", position: "Eje delantero · lado caja", splines: "22 × 19" }),
  gtiProduct({ sku: "GTI06-100", name: "Punta lado rueda GTI — Hyundai i25 / Kia Rio Spice con ABS", make: "Hyundai / Kia", model: "i25 / Rio Spice", position: "Eje delantero · lado rueda", splines: "25 × 22", abs: "Con ABS; inventario menciona corona de 44 dientes" }),
  gtiProduct({ sku: "GTI06031", name: "Tulipa lado caja GTI — Hyundai i10", make: "Hyundai", model: "i10", position: "Eje delantero · lado caja", splines: "Confirmar estrías y transmisión" }),
  gtiProduct({ sku: "GTI106-092", name: "Tulipa lado caja GTI — Kia Picanto All New 1.2", make: "Kia", model: "Picanto All New", engine: "1.2 gasolina", position: "Eje delantero · lado caja", splines: "25 × 21" }),
];
