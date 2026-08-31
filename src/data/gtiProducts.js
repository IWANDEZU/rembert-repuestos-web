const gtiImage = (file) => `/catalogo-gti/${file}`;

const GTI_OFFICIAL_SOURCE = "GTI Autoparts / Dispartes Colombia: https://dispartes.com/gtiautoparts/";
const GTI_CATALOG_SOURCE = "Catálogo colombiano de puntas y ejes GTI: https://fliphtml5.com/spaxu/ahxl/REPUESTOS_PUNTAS_Y_EJES/";
// Honest empty state for references that still lack an exact, traceable photo.
// It contains no mechanical part, so it cannot be mistaken for the SKU.
const PENDING_PHOTO_IMAGE = gtiImage("gti-foto-real-pendiente-v1.webp");

const exactImages = {
  "GTI01-028": {
    realFile: "gti01-028-tulipa-caja-derecha-logan-sandero-stepway.webp",
    source: "Importadoras Asociadas Colombia, GTI01-028: https://www.importadorasasociadas.com/punta-eje-lado-caja-derecha-renault-logan-2006-2015-sandero-2009-2015-stepway-2009-2015-8084-gti01-028/p",
  },
  "GTI01-038": {
    realFile: "gti01-038-punta-eje-logan-sandero-stepway.webp",
    source: "Importadoras Asociadas Colombia, GTI01-038: https://www.importadorasasociadas.com/punta-eje-lado-rueda-renault-logan-2006-2015-sandero-2009-2015-stepway-2009-2015-7850-gti01-038/p",
  },
  "GTI01064": {
    realFile: "gti01-064-punta-eje-duster.webp",
    source: "Importadoras Asociadas Colombia, GTI01-064: https://www.importadorasasociadas.com/punta-eje-lado-rueda-renault-duster-2012-2021-8065-gti01-064/p",
  },
  "GTI01-102": {
    realFile: "gti01-102-punta-eje-logan-sandero-stepway.webp",
    source: "Mercado Libre Colombia, GTI01-102: https://www.mercadolibre.com.co/punta-eje-lado-rueda-renault-sandero-stepway-logan-23x22/up/MCOU3077976680",
  },
  "GTI04-128": {
    realFile: "gti04-128-punta-eje-spark-cronos-abs.webp",
    source: "Mercado Libre Colombia, GTI04-128: https://www.mercadolibre.com.co/punta-eje-lado-rueda-chevrolet-spark-cronos-23x21-con-abs-40/up/MCOU3301683684",
  },
  "GTI04-025": {
    realFile: "gti04-025-tulipa-spark-cronos-real-v2.png",
    source: "Imotriz Colombia, GTI04-025: https://www.imotriz.com/producto/3/GTI04-025-/Punta-Eje-L-C-Spark-Cronos-22X19- · Mercado Libre Colombia, GTI04-025+: https://www.mercadolibre.com.co/punta-eje-lado-caja-chevrolet-spark-cronos-22x19/up/MCOU3069953909 · catálogo colombiano GTI: https://dokument.pub/repuestos-puntas-y-ejes-flipbook-pdf.html",
  },
  "GTI04-035": {
    realFile: "gti04-035-punta-eje-optra-astra-real-v1.png",
    source: "Imotriz Colombia, GTI04-035: https://www.imotriz.com/producto/3/GTI04-035-/Punta-Eje-L-R-Optra-Astra-33X23- · Mercado Libre Colombia, GTI04-035+: https://www.mercadolibre.com.co/punta-eje-lado-rueda-chevrolet-optra-astra-33x23/up/MCOU3070621013",
  },
  "GTI04-001": {
    realFile: "gti04-001-punta-eje-corsa-real-v1.png",
    source: "Imotriz Colombia, GTI04-001: https://www.imotriz.com/producto/3/GTI04-001-/Punta-Eje-L-R-Corsa-1-3-1-4-1-6-22X28-",
  },
  "GTI04-024": {
    realFile: "gti04-024-tulipa-corsa-real-v1.png",
    source: "Imotriz Colombia, GTI04-024: https://www.imotriz.com/producto/3/GTI04-024-/Punta-Eje-L-C-Corsa-1-3-1-4-97-T-Korea-22X28- · Mercado Libre Colombia, GTI04-024+: https://www.mercadolibre.com.co/punta-eje-lado-caja-chevrolet-corsa-1300-1400-22x28/up/MCOU3318379333",
  },
  "GTI04-055": {
    realFile: "gti04-055-tulipa-spark-cronos-real-v1.png",
    source: "Imotriz Colombia, GTI04-055: https://www.imotriz.com/producto/3/GTI04-055-/PUNTA-EJE-L-C-CRONOS-21-DTS-SPARK-GT-BEAT-22x21- · catálogo colombiano GTI: https://fliphtml5.com/spaxu/ahxl/REPUESTOS_PUNTAS_Y_EJES/",
  },
  "GTI04-066": {
    realFile: "gti04-066-tulipa-spark-gt-foto-original-v1.jpg",
    source: "Mercado Libre Colombia, GTI04-066+, Chevrolet Spark GT lado caja 22 × 20 con triceta: https://www.mercadolibre.com.co/punta-eje-lado-caja-chevrolet-spark-gt-22x20/up/MCOU3072991660 · Imotriz Colombia, GTI04-066: https://www.imotriz.com/producto/3/GTI04-066-/Punta-Eje-L-C-Spark-Gt-22X20-",
  },
  "GTI04-088": {
    realFile: "gti04-088-tulipa-sail-real-v1.png",
    source: "Imotriz Colombia, GTI04-088: https://www.imotriz.com/producto/3/GTI04-088-/Punta-Eje-L-C-Sail-22X22- · Mercado Libre Colombia, GTI04-088+: https://www.mercadolibre.com.co/punta-eje-lado-caja-chevrolet-sail-22x22/up/MCOU3069949413",
  },
  "GTI04-090": {
    realFile: "gti04-090-tulipa-cobalt-real-v1.png",
    source: "Imotriz Colombia, GTI04-090: https://www.imotriz.com/producto/3/GTI04-090-/Punta-Eje-L-C-Cobalt-22X23- · catálogo colombiano GTI: https://dokument.pub/repuestos-puntas-y-ejes-flipbook-pdf.html",
  },
  "GTI04-112": {
    realFile: "gti04-112-punta-eje-onix-real-v1.png",
    source: "Imotriz Colombia, GTI04-112: https://www.imotriz.com/producto/3/GTI04-112-/Punta-Eje-L-R-Onix-1-4-Mecanico-25X22-",
  },
  "GTI04-111": {
    realFile: "gti04-111-tulipa-tracker-automatica-derecha-real-v1.jpg",
    source: "Imotriz Colombia, GTI04-111: https://www.imotriz.com/producto/ef2935cf047430308c0da018d6c52e71/gti04-111/punta-eje-l-c-der-tracker-automatica-34x23 · Mercado Libre Colombia, GTI04-111+: https://www.mercadolibre.com.co/punta-eje-lado-caja-chevrolet-tracker-automatica-derec-34x23/up/MCOU3070114303",
  },
  "GTI06-034": {
    realFile: "gti06-034-tulipa-rio-stylus-real-v1.png",
    source: "Imotriz Colombia, GTI06-034: https://www.imotriz.com/producto/3/GTI06-034-/Punta-Eje-L-C-Kia-Rio-Stylus-Alta-26X22- · catálogo colombiano GTI: https://dokument.pub/repuestos-puntas-y-ejes-flipbook-pdf.html",
  },
  "GTI06-038": {
    realFile: "gti06-038-tulipa-hyundai-vision-real-v1.png",
    source: "Imotriz Colombia, GTI06-038: https://www.imotriz.com/producto/3/GTI06-038-/Punta-Eje-L-C-Hd-Vision-25X22- · Mercado Libre Colombia, GTI06-038+: https://www.mercadolibre.com.co/punta-eje-lado-caja-para-hyundai-vision-25x22/up/MCOU3318617045 · catálogo colombiano GTI: https://dokument.pub/repuestos-puntas-y-ejes-flipbook-pdf.html",
  },
  "GTI06-031": {
    realFile: "gti06-031-tulipa-hyundai-i10-real-v1.png",
    source: "Imotriz Colombia, GTI06-031: https://www.imotriz.com/producto/3/GTI06-031-/Punta-Eje-L-C-Hd-I-10-25X20- · Mercado Libre Colombia, GTI06-031+: https://www.mercadolibre.com.co/punta-eje-lado-caja-para-hyundai-i10-25x20/up/MCOU3070417319",
  },
  "GTI06-032": {
    realFile: "gti06-032-punta-eje-hyundai-i10-real-v1.png",
    source: "Imotriz Colombia, GTI06-032: https://www.imotriz.com/producto/3/GTI06-032-/Punta-Eje-L-R-Hd-I-10-24X20-",
  },
  "GTI06-052": {
    realFile: "gti06-052-eje-homocinetico-picanto-real-v1.jpg",
    source: "Imotriz Colombia, GTI06-052: https://www.imotriz.com/producto/3/GTI06-052-/Eje-Homocinetico-Izq-Kia-Picanto-I-Ii-24X25- · fotografía directa del catálogo GTI: https://app.pedbox.co:7777/imagenes_catalogo/15/06I09077.png",
  },
  "GTI06-069": {
    realFile: "gti06-069-tulipa-grand-i10-real-v1.png",
    source: "Imotriz Colombia, GTI06-069: https://www.imotriz.com/producto/3/GTI06-069-/Punta-Eje-L-C-Hd-Grand-I-10-25X21- · Mercado Libre Colombia, GTI06-069+: https://www.mercadolibre.com.co/punta-eje-lado-caja-para-hyundai-grand-i10-25x21/up/MCOU3075535170",
  },
  "GTI06-014": {
    realFile: "gti06-014-tulipa-atos-real-v2.png",
    source: "Imotriz Colombia, GTI06-014: https://www.imotriz.com/producto/3/GTI06-014-/Punta-Eje-L-C-Hd-Atos-T-Th-22X20- · Repuesto.co, GTI06-014: https://repuesto.co/product/punta-eje-lado-caja-hyundai-atos-gti/ · Mercado Libre Colombia, GTI06-014+: https://www.mercadolibre.com.co/punta-eje-lado-caja-para-hyundai-atos-22x20-con-triceta/up/MCOU3070409263",
  },
  "GTI04-110": {
    realFile: "gti04-110-tulipa-tracker-izquierda-foto-original-v4.jpg",
    source: "Imotriz Colombia, GTI04-110, Tracker automática izquierda 27 × 23: https://www.imotriz.com/producto/b45102cb199ff393031587b15c0b8570/gti04-110/punta-eje-l-c-izq-tracker-automatica-27x23",
  },
  "GTI04-114": {
    realFile: "gti04-114-tulipa-onix-izquierda-foto-original-v4.jpg",
    source: "Mercado Libre Colombia, GTI04-114+, Onix 1.4 automático izquierdo 22 × 30: https://www.mercadolibre.com.co/punta-eje-lado-caja-chevrolet-onix-14-automatic-izqui-22x30/up/MCOU3072986060",
  },
  "GTI04-125": {
    realFile: "gti04-125-punta-eje-sonic-mecanico-foto-original-v1.jpg",
    source: "Mercado Libre Colombia, GTI04-125, Chevrolet Sonic mecánico lado rueda 25 × 31: https://www.mercadolibre.com.co/punta-eje-lado-rueda-chevrolet-sonic-mecanico-25x31/up/MCOU3526341184 · Imotriz Colombia, GTI04-125: https://www.imotriz.com/producto/3/gti04-125/Punta-Eje-L-R-Sonic-Mecanico-25X31-",
  },
  "GTI01-027": {
    realFile: "gti01-027-punta-eje-logan-real-v1.webp",
    source: "Mercado Libre Colombia, GTI01-027+: https://www.mercadolibre.com.co/punta-eje-lado-rueda-renault-logan-thc-21x21/up/MCOU3077907110",
  },
  "GTI01-092": {
    realFile: "gti01-092-punta-eje-kwid-fuente-v1.webp",
    webFile: "gti01-092-punta-eje-kwid-web-v1.webp",
    source: "Repuesto.co, GTI01-092: https://repuesto.co/product/punta-eje-lado-rueda-renault-kwid/ · Mercado Libre Colombia, GTI01-092+: https://www.mercadolibre.com.co/punta-eje-lado-rueda-renault-kwid-23x27/up/MCOU3077873202",
  },
  "GTI04-002": {
    realFile: "gti04-002-punta-eje-corsa-daewoo-real-v1.webp",
    source: "Mercado Libre Colombia, GTI04-002+: https://www.mercadolibre.com.co/punta-eje-lado-rueda-chevolet-corsa-todos-daewoo-racer-cielo/up/MCOU3075765136",
  },
  "GTI04-046": {
    realFile: "gti04-046-punta-eje-aveo-abs-real-v1.webp",
    source: "Mercado Libre Colombia, GTI04-046+: https://www.mercadolibre.com.co/punta-eje-lado-rueda-chevrolet-aveo-22x22-con-abs/up/MCOU3075790046",
  },
  "GTI04-141": {
    realFile: "gti04-141-punta-eje-spark-beat-abs-real-v1.webp",
    source: "Aldauto Colombia, SKU GTI04-141: https://aldauto.co/tienda/cat-repuestos/cat-repuestos-subcat-suspension/eje-lado-rueda-spark-gt-beat/",
  },
  "GTI06-001": {
    realFile: "gti06-001-punta-eje-accent-verna-real-v1.webp",
    source: "Mercado Libre Colombia, GTI06-001+: https://www.mercadolibre.com.co/punta-eje-lado-rueda-hyund-accent-verna-gyro-vision-25x22/up/MCOU3077329908",
  },
  "GTI06-003": {
    realFile: "gti06-003-punta-eje-atos-foto-original-v2.png",
    source: "Imotriz Colombia, GTI06-003, Hyundai Atos lado rueda 25 × 20: https://www.imotriz.com/producto/3/GTI06-003-/Punta-Eje-L-R-Hd-Atos-02-25X20- · Repuesto.co, GTI06-003: https://repuesto.co/product/punta-eje-lado-rueda-hyundai-atos-gti/",
  },
  "GTI06-081": {
    realFile: "gti06-081-punta-eje-eon-fuente-v1.webp",
    webFile: "gti06-081-punta-eje-eon-web-v1.webp",
    source: "Genuine Imports Colombia, GTI06-081: https://genuineimports.net/punta-eje-lado-rueda-eon-ref-gti06-081 · Imotriz Colombia, GTI06-081: https://www.imotriz.com/producto/10/GTI06-081-/Punta-De-Eje-L-R-Eon-Marca-Gti",
  },
  "GTI06-100": {
    realFile: "gti06-100-punta-eje-i25-rio-spice-abs-real-v1.webp",
    source: "Mercado Libre Colombia, GTI06-100+: https://www.mercadolibre.com.co/punta-eje-lado-rueda-para-hyundai-i25-kia-rio-spice-25x22/up/MCOU3077402082",
  },
};

// Estas versiones aisladas se derivaron de fotografías reales, pero el
// procesamiento visual puede modificar contornos, omitir componentes o crear
// duplicaciones. Con la política de identidad 100 %, no se publican: la ficha
// vuelve al estado pendiente hasta contar con una foto directa y limpia.
const WITHDRAWN_DERIVED_IMAGES = new Set([
  "GTI01-092",
  "GTI06-081",
]);

const normalizeReference = (value) => String(value || "")
  .toUpperCase()
  .replace(/[^A-Z0-9]/g, "");

const exactImageFor = (sku) => {
  const normalizedSku = normalizeReference(sku);
  if ([...WITHDRAWN_DERIVED_IMAGES].some((reference) => normalizeReference(reference) === normalizedSku)) {
    return null;
  }
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
  price = 0,
  stock = 0,
  inventoryNumber = "",
}) {
  const exactImage = exactImageFor(sku);
  const hasSourceGroundedWebImage = Boolean(exactImage?.webFile);
  const image = exactImage
    ? gtiImage(exactImage.webFile || exactImage.realFile)
    : PENDING_PHOTO_IMAGE;
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
    price: Number(price) || 0,
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
      alt: exactImage
        ? hasSourceGroundedWebImage
          ? `Versión web de ${name} ${sku}, creada desde una fotografía exacta de la referencia`
          : `Fotografía real de referencia de ${name} ${sku}; validar etiqueta y medidas antes de despachar`
        : `Foto real pendiente para la referencia GTI ${sku}; no se muestra una pieza genérica`,
      isMain: true,
    }],
    imageStatus: exactImage
      ? hasSourceGroundedWebImage
        ? "source-grounded-web-image"
        : "real-source-photo"
      : "photo-pending",
    imageDisclosure: exactImage
      ? hasSourceGroundedWebImage
        ? "Versión web desde foto exacta - validar medidas"
        : "Foto de referencia - validar etiqueta y medidas"
      : "Foto real pendiente - sin imagen genérica",
    attributes: [
      { id: `${id}-reference`, name: "Referencia GTI", value: sku },
      { id: `${id}-compatibility`, name: "Compatible con", value: `${make} ${model} · ${years}` },
      { id: `${id}-position`, name: "Posición", value: position },
      { id: `${id}-splines`, name: "Estrías / configuración", value: splines },
      { id: `${id}-transmission`, name: "Transmisión", value: transmission },
      { id: `${id}-abs`, name: "ABS", value: abs },
      ...(inventoryNumber ? [{ id: `${id}-inventory`, name: "Número en listado por líneas", value: inventoryNumber }] : []),
      { id: `${id}-verification`, name: "Validación obligatoria", value: "VIN, etiqueta GTI, lado, medidas, estrías y ABS antes de instalar" },
      {
        id: `${id}-image`,
        name: "Imagen",
        value: exactImage
          ? hasSourceGroundedWebImage
            ? "Versión web de una pieza completa, basada en fotografía trazable de la referencia exacta; validar etiqueta GTI, medidas y aplicación antes de vender"
            : "Fotografía externa de la referencia exacta; validar etiqueta GTI, medidas y aplicación antes de vender"
          : "Foto real pendiente; la ficha no muestra un repuesto genérico ni una geometría generada",
      },
    ],
    inStock: Number(stock) > 0,
    stock: Number(stock) || 0,
  };
}

export const gtiProducts = [
  gtiProduct({ sku: "GTI-038", name: "Tulipa lado caja GTI — Hyundai Vision · código por confirmar", make: "Hyundai", model: "Accent Vision", position: "Eje delantero · lado caja", splines: "Referencia interna de inventario 1012531; contar estrías", note: "GTI-038 no se normaliza automáticamente a GTI06-038 sin foto de etiqueta. La aplicación y el número de estrías requieren validación física antes del despacho." }),
  gtiProduct({ sku: "GTI01-004", name: "Punta lado caja GTI — Renault R9 / R12 / R18 / Twingo 8V", make: "Renault", model: "R9 / R12 / R18 / Twingo 8V", position: "Eje delantero · lado caja", splines: "23 externas × 22 internas · sistema con triceta", transmission: "Manual", status: "verified", source: "Publicación colombiana GTI01-004+: https://articulo.mercadolibre.com.co/MCO-1878977823-punta-eje-lado-caja-renaultr9-r12-r18-twingo8v-triceta-23x22-_JM", note: "Aplicación y medidas contrastadas con una publicación colombiana de la referencia GTI01-004+." }),
  gtiProduct({ sku: "GTI01-016", name: "Punta lado rueda GTI — Renault Clio II / Symbol", make: "Renault", model: "Clio II / Symbol", position: "Eje delantero · lado rueda", splines: "30 dientes; confirmar pin y medidas", abs: "Con ABS; confirmar corona", note: "No confundir con GTI01-017: el diseño y el pin cambian." }),
  gtiProduct({ sku: "GTI01-017", name: "Punta lado rueda GTI — Renault Mégane / Clio II", make: "Renault", model: "Mégane / Clio II", position: "Eje delantero · lado rueda", splines: "21 externas × 30 internas", abs: "Con ABS; corona de 44 dientes según publicación GTI", note: "La etiqueta, la corona ABS y el VIN son obligatorios antes del despacho." }),
  gtiProduct({ sku: "GTI01-027", name: "Punta lado rueda GTI — Renault Logan", make: "Renault", model: "Logan", position: "Eje delantero · lado rueda", splines: "21 externas × 21 internas · pin interno", status: "verified" }),
  gtiProduct({ sku: "GTI01-028", name: "Tulipa lado caja derecha GTI — Renault Logan / Sandero / Stepway", make: "Renault", model: "Logan / Sandero / Stepway", years: "Logan 2006–2015 · Sandero/Stepway 2009–2015", engine: "1.4 / 1.6 gasolina", position: "Eje delantero · lado caja derecho", splines: "23 × 21 según inventario; confirmar físicamente", transmission: "Manual; confirmar versión", status: "verified" }),
  gtiProduct({ sku: "GTI01-038", name: "Punta lado rueda GTI — Renault Logan / Sandero / Stepway", make: "Renault", model: "Logan / Sandero / Stepway", years: "Logan 2006–2015 · Sandero/Stepway 2009–2015", engine: "1.4 / 1.6 gasolina", position: "Eje delantero · lado rueda, izquierdo o derecho", splines: "23 × 21 según inventario; confirmar físicamente", status: "verified" }),
  gtiProduct({ sku: "GTI01064", name: "Punta lado rueda GTI — Renault Duster", make: "Renault", model: "Duster", years: "2012–2021", position: "Eje delantero · lado rueda", splines: "35 dientes según inventario; confirmar interior/exterior", status: "verified" }),
  gtiProduct({ sku: "GTI01-092", name: "Punta lado rueda GTI — Renault Kwid", make: "Renault", model: "Kwid", position: "Eje delantero · lado rueda", splines: "23 × 27" }),
  gtiProduct({ sku: "GTI01-093", name: "Tulipa lado caja GTI — Renault Kwid", make: "Renault", model: "Kwid", position: "Eje delantero · lado caja", splines: "23 × 27" }),
  gtiProduct({ sku: "GTI01-102", name: "Punta lado rueda GTI — Renault Logan / Sandero / Stepway", make: "Renault", model: "Logan / Sandero / Stepway", position: "Eje delantero · lado rueda", splines: "23 externas × 22 internas", transmission: "Manual", status: "verified" }),

  gtiProduct({ sku: "GTI03-003", name: "Punta lado rueda GTI — Mazda 323 / Kia Rio Stylus 1.5", make: "Mazda / Kia", model: "Mazda 323 / Rio Stylus", engine: "1.5 gasolina según aplicación", position: "Eje delantero · lado rueda", splines: "24 externas × 22 internas · pin interno", source: "Mercado Libre Colombia, GTI03-003+: https://www.mercadolibre.com.co/punta-eje-lado-rueda-mazda-323-k-rio-15-stylus-p-int-24x22/up/MCOU3434170592 · Imotriz Colombia, GTI03-003: https://www.imotriz.com/producto/3/GTI03-003-/Punta-Eje-L-R-M323-T-Ntn-Kia-Rio-1-5-Stylus-Pin-Interno-24X22-", note: "La fuente comercial antigua que abrevia 22 DTS no distingue ambas estrías; las fichas exactas actuales declaran 24 × 22 y pin interno." }),
  gtiProduct({ sku: "GTI03-072", name: "Punta lado rueda GTI — Mazda 2", make: "Mazda", model: "Mazda 2 1.5", years: "2008–2015 según cruce 818223; confirmar VIN", position: "Eje delantero · lado rueda", splines: "25 externas × 29 internas · pin interno", source: "Imotriz Colombia, GTI03-072: https://www.imotriz.com/producto/b0548b0e32556e40470822a922d31352/gti03-072/punta-eje-l-r-mazda-2-25x29 · GSP 818223: https://www.autodoc.parts/gsp/10264482 · Molpartes Colombia 818223: https://molpartes.com.co/shop/71818223-punta-eje-lr-25x29x54-fd-906-mazda-2-15-2008-2015-pi-118132", note: "El SKU GTI03-072 cruza con 818223; las fichas coinciden en 25 externas × 29 internas y pin interno." }),

  gtiProduct({ sku: "GTI04-001", name: "Punta lado rueda GTI — Chevrolet Corsa", make: "Chevrolet", model: "Corsa", engine: "1.3 / 1.4 / 1.6 gasolina", position: "Eje delantero · lado rueda", splines: "28 dientes" }),
  gtiProduct({ sku: "GTI04-002", name: "Punta lado rueda GTI — Chevrolet Corsa / Daewoo Racer, Cielo y Lanos", make: "Chevrolet / Daewoo", model: "Corsa / Racer / Cielo / Lanos", position: "Eje delantero · lado rueda", splines: "22 externas × 30 internas", status: "verified" }),
  gtiProduct({ sku: "GTI04-024", name: "Tulipa lado caja GTI — Chevrolet Corsa", make: "Chevrolet", model: "Corsa", engine: "1.3 / 1.4 gasolina", position: "Eje delantero · lado caja", splines: "Configuración Corea; contar estrías", transmission: "Manual; confirmar" }),
  gtiProduct({ sku: "GTI04-025", name: "Tulipa lado caja GTI — Chevrolet Spark / Spark Cronos", make: "Chevrolet", model: "Spark / Spark Cronos", position: "Eje delantero · lado caja", splines: "22 × 19" }),
  gtiProduct({ sku: "GTI04-035", name: "Punta lado rueda GTI — Chevrolet Optra / Astra", make: "Chevrolet", model: "Optra / Astra", position: "Eje delantero · lado rueda", splines: "23 dientes según catálogo GTI; confirmar medidas" }),
  gtiProduct({ sku: "GTI04-046", name: "Punta lado rueda GTI — Chevrolet Aveo Korea con ABS", make: "Chevrolet", model: "Aveo de origen Corea", position: "Eje delantero · lado rueda", splines: "22 externas × 22 internas", abs: "Con ABS; corona de 47 dientes según publicación GTI", status: "verified" }),
  gtiProduct({ sku: "GTI04-055", name: "Tulipa lado caja GTI — Chevrolet Spark / Spark Cronos", make: "Chevrolet", model: "Spark / Spark Cronos", position: "Eje delantero · lado caja", splines: "21 dientes" }),
  gtiProduct({ sku: "GTI04-066", name: "Tulipa lado caja GTI — Chevrolet Spark GT", make: "Chevrolet", model: "Spark GT", position: "Eje delantero · lado caja", splines: "22 externas × 20 internas", status: "verified" }),
  gtiProduct({ sku: "GTI04-088", name: "Tulipa lado caja GTI — Chevrolet Sail", make: "Chevrolet", model: "Sail", position: "Eje delantero · lado caja", splines: "22 × 22" }),
  gtiProduct({ sku: "GTI04-089", name: "Punta lado rueda GTI — Chevrolet Cobalt / Taxi Elite", make: "Chevrolet", model: "Cobalt / Taxi Elite / Tracker 1.8 según mercado", position: "Eje delantero · lado rueda", splines: "23 externas × 25 internas", source: "Imotriz Colombia, GTI04-089: https://www.imotriz.com/producto/1b53a9df54af140a5cd22ed417fc6810/gti04-089/punta-de-eje-l-r-cobalt-tracker-1800-cc-23x25-marca-gti" }),
  gtiProduct({ sku: "GTI04-090", name: "Tulipa lado caja GTI — Chevrolet Cobalt", make: "Chevrolet", model: "Cobalt", position: "Eje delantero · lado caja", splines: "Confirmar por etiqueta y VIN" }),
  gtiProduct({ sku: "GTI04-110", name: "Tulipa lado caja izquierda GTI — Chevrolet Tracker automática", make: "Chevrolet", model: "Tracker", position: "Eje delantero · lado caja izquierdo", splines: "27 × 23", transmission: "Automática" }),
  gtiProduct({ sku: "GTI04-111", name: "Tulipa lado caja derecha GTI — Chevrolet Tracker automática", make: "Chevrolet", model: "Tracker", position: "Eje delantero · lado caja derecho", splines: "34 × 23", transmission: "Automática" }),
  gtiProduct({ sku: "GTI04-112", name: "Punta lado rueda GTI — Chevrolet Onix 1.4 mecánico", make: "Chevrolet", model: "Onix", engine: "1.4 gasolina", position: "Eje delantero · lado rueda", splines: "25 × 22", transmission: "Manual" }),
  gtiProduct({ sku: "GTI04-114", name: "Tulipa lado caja izquierda GTI — Chevrolet Onix 1.4 automático", make: "Chevrolet", model: "Onix", engine: "1.4 gasolina", position: "Eje delantero · lado caja izquierdo", splines: "22 × 30", transmission: "Automática" }),
  gtiProduct({ sku: "GTI04-125", name: "Punta lado rueda GTI — Chevrolet Sonic mecánico", make: "Chevrolet", model: "Sonic", position: "Eje delantero · lado rueda", splines: "25 externas × 31 internas", transmission: "Manual", status: "verified" }),
  gtiProduct({ sku: "GTI04-128", name: "Punta lado rueda GTI — Chevrolet Spark / Spark Cronos con ABS", make: "Chevrolet", model: "Spark / Spark Cronos", years: "Aplicación de inventario 2018; confirmar año exacto", position: "Eje delantero · lado rueda", splines: "23 externas × 21 internas", abs: "Corona ABS de 40 dientes", status: "verified" }),
  gtiProduct({ sku: "GTI04-141", name: "Punta lado rueda GTI — Chevrolet Spark GT / Beat con ABS", make: "Chevrolet", model: "Spark GT / Beat", position: "Eje delantero · lado rueda", splines: "Confirmar estrías", abs: "Con ABS; validar corona por año" }),
  gtiProduct({ sku: "GTI04-161", name: "Punta lado rueda GTI — Chevrolet Tracker Turbo / Onix Turbo", make: "Chevrolet", model: "Tracker 1.2 Turbo / Onix 1.0 Turbo", position: "Eje delantero · lado rueda", splines: "33 externas × 22 internas · pin interno", transmission: "Manual", source: "Imotriz Colombia, GTI04-161: https://www.imotriz.com/producto/3/gti04-161/Punta-Eje-L-R-Tracker-Turbo-1-2-Onix-Turbo-1-0-Mecanico-33X22- · Mercado Libre Colombia, GTI04-161+: https://www.mercadolibre.com.co/punta-eje-lado-rueda-chevro-tracker-turbo--onix-turbo-33x22/up/MCOU3541704938" }),
  gtiProduct({ sku: "GTI04-D01", name: "Punta lado rueda GTI — Chevrolet Corsa · identidad por confirmar", make: "Chevrolet", model: "Corsa; confirmar por etiqueta", position: "Eje delantero · lado rueda", splines: "El inventario registra 28 dientes sin indicar el extremo; contar estrías internas y externas", note: "El código GTI04-D01 y el cruce interno 772531 requieren validación física. No equiparar automáticamente con otra referencia GTI de Corsa." }),

  gtiProduct({ sku: "GTI06-001", name: "Punta lado rueda GTI — Hyundai Accent / Verna / Gyro / Vision / i25", make: "Hyundai", model: "Accent / Verna / Gyro / Vision / i25", position: "Eje delantero · lado rueda", splines: "25 externas × 22 internas · pin interno", status: "verified" }),
  gtiProduct({ sku: "GTI06-003", name: "Punta lado rueda GTI — Hyundai Atos", make: "Hyundai", model: "Atos", years: "2002 en adelante según catálogo; confirmar mercado", position: "Eje delantero · lado rueda", splines: "25 externas × 20 internas", status: "verified" }),
  gtiProduct({ sku: "GTI06-012", name: "Punta lado rueda GTI — Kia Cerato / Forte", make: "Kia", model: "Cerato / Forte", position: "Eje delantero · lado rueda", splines: "22 × 27" }),
  gtiProduct({ sku: "GTI06-014", name: "Tulipa lado caja GTI — Hyundai Atos", make: "Hyundai", model: "Atos", years: "2005–2011 según fuente comercial; confirmar VIN", position: "Eje delantero · lado caja", splines: "22 externas × 20 internas · retén 35 mm" }),
  gtiProduct({ sku: "GTI06-032", name: "Punta lado rueda GTI — Hyundai i10", make: "Hyundai", model: "i10", position: "Eje delantero · lado rueda", splines: "Confirmar estrías" }),
  gtiProduct({ sku: "GTI06-034", name: "Tulipa lado caja GTI — Kia Rio Stylus", make: "Kia", model: "Rio Stylus", position: "Eje delantero · lado caja", splines: "22 dientes" }),
  gtiProduct({ sku: "GTI06-037", name: "Junta homocinética lado caja GTI — Kia Rio Xcite / Cerato / Forte / Hyundai i25", make: "Kia / Hyundai", model: "Rio Xcite / Cerato 1.6 / Forte / i25", position: "Eje delantero · lado caja", splines: "25 externas × 22 internas", source: "Imotriz Colombia, GTI06-037: https://www.imotriz.com/producto/3/GTI06-037-/Punta-Eje-L-C-Kia-Rio-Xcite-Cerato-1-6-Forte-Hd-I-25-25X22-", note: "La ficha y la fotografía exactas muestran el kit interior con triceta, fuelle y accesorios. La recreación conserva ese alcance y se publica como referencia generada, no como fotografía GTI." }),
  gtiProduct({ sku: "GTI06-038", name: "Tulipa lado caja GTI — Hyundai Accent Vision", make: "Hyundai", model: "Accent Vision", position: "Eje delantero · lado caja", splines: "25 × 22 según inventario" }),
  gtiProduct({ sku: "GTI06-052", name: "Eje homocinético izquierdo GTI — Kia Picanto I/II", make: "Kia", model: "Picanto I / Picanto II", years: "Confirmar generación y año por VIN", position: "Eje delantero · izquierdo", splines: "24 × 25 según inventario REMBERT; confirmar ambos extremos y largo total", price: 453748, stock: 1, inventoryNumber: "2936", source: "Inventario General por Líneas REMBERT, página 74, corte 21 de agosto de 2026 · Comercializadora FJMB, GTI06-052+: https://fabiangrestrepo.wixsite.com/comerfjmb/product-page/eje-homocinetico-izq-kia-picanto-i-ii", note: "El inventario registra una unidad. La fotografía real exacta sigue pendiente; no sustituirla por un eje genérico de Picanto." }),
  gtiProduct({ sku: "GTI06-069", name: "Tulipa lado caja GTI — Hyundai Grand i10", make: "Hyundai", model: "Grand i10", position: "Eje delantero · lado caja", splines: "Confirmar estrías y transmisión" }),
  gtiProduct({ sku: "GTI06-081", name: "Punta lado rueda GTI — Hyundai Eon", make: "Hyundai", model: "Eon", position: "Eje delantero · lado rueda", splines: "24 × 19" }),
  gtiProduct({ sku: "GTI06-082", name: "Tulipa lado caja GTI — Hyundai Eon", make: "Hyundai", model: "Eon", position: "Eje delantero · lado caja", splines: "22 × 19" }),
  gtiProduct({ sku: "GTI06-100", name: "Punta lado rueda GTI — Hyundai i25 / Kia Rio Spice con ABS", make: "Hyundai / Kia", model: "i25 / Rio Spice", position: "Eje delantero · lado rueda", splines: "25 externas × 22 internas", abs: "Con ABS · corona de 44 dientes", status: "verified" }),
  gtiProduct({ sku: "GTI06-031", name: "Tulipa lado caja GTI — Hyundai i10", make: "Hyundai", model: "i10", position: "Eje delantero · lado caja", splines: "Confirmar estrías y transmisión", note: "Referencia normalizada desde GTI06031 del inventario interno." }),
  gtiProduct({ sku: "GTI106-092", name: "Junta homocinética lado caja GTI — Kia Picanto All New 1.2", make: "Kia", model: "Picanto All New", years: "2019 en adelante según catálogo GTI06-092; confirmar por VIN", engine: "1.2 gasolina", position: "Eje delantero · lado caja", splines: "25 externas × 21 internas", source: "Imotriz Colombia, GTI06-092: https://www.imotriz.com/producto/3/GTI06-092-/PUNTA-EJE-L-C-KIA-PICANTO-ALL-NEW-1-2-2019-25x21-", note: "GTI106-092 es el alias del inventario REMBERT; el cruce comercial exacto es GTI06-092. La foto fuente muestra la junta ensamblada, fuelle, abrazaderas y seguros." }),
];
