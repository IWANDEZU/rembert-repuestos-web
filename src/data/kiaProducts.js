const kiaImage = (file) => `/catalogo-kia/${file}`;
const suspension = { name: "Frenos y Suspensión", slug: "frenos-y-suspension" };
const electrical = { name: "PARTES ELÉCTRICAS", slug: "electrico-y-encendido" };
const image = (file, alt) => ({ url: kiaImage(file), alt, isMain: true });

// Las aplicaciones "verified" tienen referencia de fabricante. Las familias
// requieren VIN/OE y nunca se ofrecen como una pieza universal.
export const kiaProducts = [
  {
    id: "tnk-tkx109-axial-kia-picanto-all-new", name: "Axial TNK TKX109 — Kia Picanto All New Taxi", slug: "tnk-tkx109-axial-kia-picanto-all-new", category: suspension,
    brand: { name: "TNK", slug: "tnk" }, price: 0, sku: "TKX109", referenceType: "manufacturer", fitmentStatus: "verified",
    fitments: [{ make: "Kia", model: "Picanto All New Taxi", engine: "según versión", years: "2017 en adelante", position: "Dirección · axial interior, ambos lados" }],
    fitmentSummary: "TNK TKX109: Kia Picanto All New Taxi, 2017 en adelante; axial interior para ambos lados.", fitmentRequirements: ["VIN", "año", "versión", "medida de roscas", "referencia OE"],
    fitmentSource: "TNK Colombia — TKX109; OE 56540G6000; longitud 197 mm; roscas M16x1.5 (caja) y M14x1.5 (terminal). Precio público consultado: $49.300 COP.",
    shortDesc: "Axial interior de dirección para Picanto All New Taxi.", description: "Axial TNK TKX109 para Kia Picanto All New Taxi desde 2017. Longitud 197 mm, rosca de caja M16x1.5 y rosca de terminal M14x1.5. Confirma VIN y OE 56540G6000 antes del despacho.",
    image: kiaImage("tnk-tkx109-kia-picanto-all-new.jpg"), images: [image("tnk-tkx109-kia-picanto-all-new.jpg", "Axial TNK TKX109 Kia Picanto All New Taxi")], imageStatus: "ai-catalog-watermarked",
    attributes: [{ id: "tkx109-ref", name: "Referencia", value: "TKX109" }, { id: "tkx109-oe", name: "OE", value: "56540G6000" }, { id: "tkx109-size", name: "Medidas", value: "197 mm · M16x1.5 / M14x1.5" }, { id: "tkx109-position", name: "Posición", value: "Axial interior · ambos lados" }, { id: "tkx109-fitment", name: "Compatible con", value: "Kia Picanto All New Taxi 2017+" }, { id: "tkx109-price", name: "Precio público TNK consultado", value: "$49.300 COP · no confirma precio ni inventario REMBERT" }], inStock: false, stock: 0,
  },
  {
    id: "tnk-thx049-axial-kia-picanto-ion", name: "Axial TNK THX049 — Kia Picanto Ion / Eko Taxi", slug: "tnk-thx049-axial-kia-picanto-ion-eko-taxi", category: suspension,
    brand: { name: "TNK", slug: "tnk" }, price: 0, sku: "THX049", referenceType: "manufacturer", fitmentStatus: "verified",
    fitments: [{ make: "Kia", model: "Picanto Ion / Eko Taxi", engine: "según versión", years: "2011–2017", position: "Dirección · axial interior, ambos lados" }],
    fitmentSummary: "TNK THX049: Kia Picanto Ion / Eko Taxi 2011–2017; axial interior para ambos lados.", fitmentRequirements: ["VIN", "año", "versión", "roscas", "longitud", "referencia OE"],
    fitmentSource: "TNK Colombia — THX049; OE 577241Y000; longitud 211 mm; roscas M14x1.5. Precio público consultado: $57.800 COP.",
    shortDesc: "Axial interior para Picanto Ion y Eko Taxi.", description: "Axial TNK THX049 para Kia Picanto Ion y Eko Taxi 2011–2017. Longitud 211 mm y roscas M14x1.5. Validar VIN y OE 577241Y000 antes de instalar.",
    image: kiaImage("tnk-thx049-kia-picanto-ion.jpg"), images: [image("tnk-thx049-kia-picanto-ion.jpg", "Axial de dirección TNK THX049 Kia Picanto Ion")], imageStatus: "ai-catalog-watermarked",
    attributes: [{ id: "thx049-ref", name: "Referencia", value: "THX049" }, { id: "thx049-oe", name: "OE", value: "577241Y000" }, { id: "thx049-size", name: "Medidas", value: "211 mm · M14x1.5 / M14x1.5" }, { id: "thx049-position", name: "Posición", value: "Axial interior · ambos lados" }, { id: "thx049-fitment", name: "Compatible con", value: "Kia Picanto Ion / Eko Taxi 2011–2017" }, { id: "thx049-price", name: "Precio público TNK consultado", value: "$57.800 COP · no confirma precio ni inventario REMBERT" }], inStock: false, stock: 0,
  },
  {
    id: "tnk-thc074-terminal-derecho-kia-picanto-ion", name: "Terminal de Dirección Derecho TNK THC074 — Kia Picanto Ion / Eko Taxi", slug: "tnk-thc074-terminal-derecho-kia-picanto-ion-eko-taxi", category: suspension,
    brand: { name: "TNK", slug: "tnk" }, price: 0, sku: "THC074TNK", referenceType: "manufacturer", fitmentStatus: "conditional",
    fitments: [{ make: "Kia", model: "Picanto Ion / Eko Taxi", engine: "según versión", years: "confirmar por VIN", position: "Dirección · terminal exterior derecho" }],
    fitmentSummary: "TNK THC074: Kia Picanto Ion / Eko Taxi; terminal exterior del lado derecho. El año exacto se confirma por VIN.", fitmentRequirements: ["VIN", "año", "versión", "lado derecho", "roscas", "referencia TNK"],
    fitmentSource: "TNK Colombia — categoría oficial de terminales: THC074 para Kia Picanto Ion / Eko Taxi, lado derecho. El inventario REMBERT registra el código THC074TNK.",
    shortDesc: "Terminal exterior derecho para Picanto Ion y Eko Taxi.", description: "Terminal de dirección exterior TNK THC074 para Kia Picanto Ion y Eko Taxi, lado derecho. La fuente TNK consultada no especifica un rango de años; confirma VIN, año, versión y roscas antes de instalar.",
    image: "/catalogo-tnk/tnk-thc074-terminal-derecho-kia-picanto-ion.webp", images: [{ url: "/catalogo-tnk/tnk-thc074-terminal-derecho-kia-picanto-ion.webp", alt: "Terminal derecho TNK THC074 Kia Picanto Ion con empaque oficial", isMain: true }], imageStatus: "official-catalog-watermarked",
    attributes: [{ id: "thc074-ref", name: "Referencia TNK", value: "THC074" }, { id: "thc074-stock-code", name: "Código inventario REMBERT", value: "THC074TNK" }, { id: "thc074-position", name: "Posición", value: "Terminal exterior · lado derecho" }, { id: "thc074-fitment", name: "Compatible con", value: "Kia Picanto Ion / Eko Taxi · año por VIN" }, { id: "thc074-price", name: "Precio público TNK consultado", value: "$71.400 COP · REMBERT aplica precio real de inventario" }], inStock: false, stock: 0,
  },
  {
    id: "ctr-cl0846l-link-kia-seltos-hybrid", name: "Bieleta Delantera Izquierda CTR CL0846L — Kia Seltos Hybrid", slug: "ctr-cl0846l-bieleta-delantera-izquierda-kia-seltos-hybrid", category: suspension,
    brand: { name: "CTR", slug: "ctr" }, price: 0, sku: "CL0846L", referenceType: "manufacturer", fitmentStatus: "verified",
    fitments: [{ make: "Kia", model: "Seltos Hybrid", engine: "híbrido", years: "2021–2022", position: "Suspensión delantera · lado izquierdo" }], fitmentSummary: "CTR CL0846L: Kia Seltos Hybrid 2021–2022; bieleta delantera izquierda.", fitmentRequirements: ["VIN", "año", "motorización híbrida", "lado", "referencia OE"], fitmentSource: "CTR Aftermarket — catálogo S&S; OE 55530Q5000.",
    shortDesc: "Bieleta estabilizadora delantera izquierda para Seltos Hybrid.", description: "Bieleta estabilizadora delantera izquierda CTR CL0846L para Kia Seltos Hybrid 2021–2022. La aplicación es específica para motorización híbrida; confirmar VIN y OE 55530Q5000.",
    image: kiaImage("gti-kia-tijera-suspension-referencia-vin.jpg"), images: [image("gti-kia-tijera-suspension-referencia-vin.jpg", "Bieleta CTR CL0846L Kia Seltos Hybrid")], imageStatus: "ai-catalog-watermarked",
    attributes: [{ id: "cl0846l-ref", name: "Referencia", value: "CL0846L" }, { id: "cl0846l-oe", name: "OE", value: "55530Q5000" }, { id: "cl0846l-position", name: "Posición", value: "Delantera izquierda" }, { id: "cl0846l-fitment", name: "Compatible con", value: "Kia Seltos Hybrid 2021–2022" }], inStock: false, stock: 0,
  },
  {
    id: "ctr-gv0347-buje-tijera-kia-soul-am", name: "Buje de Tijera Delantera CTR GV0347 — Kia Soul AM", slug: "ctr-gv0347-buje-tijera-delantera-kia-soul-am", category: suspension,
    brand: { name: "CTR", slug: "ctr" }, price: 0, sku: "GV0347", referenceType: "manufacturer", fitmentStatus: "verified",
    fitments: [{ make: "Kia", model: "Soul (AM)", engine: "según catálogo CTR", years: "2008–2013", position: "Suspensión delantera · buje de tijera inferior" }], fitmentSummary: "CTR GV0347: Kia Soul AM 2008–2013; buje de tijera inferior delantera.", fitmentRequirements: ["VIN", "año", "lado", "número de pieza OE", "medidas del brazo"], fitmentSource: "CTR Aftermarket — Bush Catalogue 2020; OE 54551-2K000.",
    shortDesc: "Buje de brazo/tijera inferior delantero para Soul AM.", description: "Buje CTR GV0347 para brazo o tijera inferior delantera de Kia Soul AM 2008–2013. Confirma VIN, lado y OE 54551-2K000 antes del despacho.",
    image: kiaImage("gti-kia-tijera-suspension-referencia-vin.jpg"), images: [image("gti-kia-tijera-suspension-referencia-vin.jpg", "Buje CTR GV0347 Kia Soul AM")], imageStatus: "ai-catalog-watermarked",
    attributes: [{ id: "gv0347-ref", name: "Referencia", value: "GV0347" }, { id: "gv0347-oe", name: "OE", value: "54551-2K000" }, { id: "gv0347-position", name: "Posición", value: "Tijera inferior delantera" }, { id: "gv0347-fitment", name: "Compatible con", value: "Kia Soul AM 2008–2013" }], inStock: false, stock: 0,
  },
  {
    id: "rowen-3602-ch-pastillas-kia-picanto-all-new", name: "Pastillas Cerámicas Rowen 3602-CH — Kia Picanto All New 1.2", slug: "rowen-3602-ch-pastillas-ceramicas-kia-picanto-all-new", category: suspension,
    brand: { name: "Rowen", slug: "rowen" }, price: 104800, sku: "3602-CH", referenceType: "manufacturer", fitmentStatus: "verified",
    fitments: [{ make: "Kia", model: "Picanto All New / Xtreme / X-Line", engine: "1.2", years: "según versión", position: "Frenos · eje delantero" }], fitmentSummary: "Rowen 3602-CH: Kia Picanto All New, Xtreme y X-Line 1.2; pastillas delanteras cerámicas.", fitmentRequirements: ["VIN", "motor 1.2", "año", "eje delantero", "forma de pastilla", "sistema de freno"], fitmentSource: "Autofrenos Colombia — Pastillas Kia Picanto All New Cerámica, ref. 3602-CH. Precio público consultado: $104.800 COP.",
    shortDesc: "Pastillas cerámicas delanteras para Picanto 1.2.", description: "Juego de pastillas cerámicas Rowen 3602-CH para Kia Picanto All New, Xtreme y X-Line con motor 1.2. Aplicación delantera. Verificar VIN y sistema de freno antes de comprar.",
    image: kiaImage("rowen-3602-ch-pastillas-kia-picanto-all-new.jpg"), images: [image("rowen-3602-ch-pastillas-kia-picanto-all-new.jpg", "Pastillas cerámicas Rowen 3602-CH Kia Picanto All New")], imageStatus: "ai-catalog-watermarked",
    attributes: [{ id: "rowen3602-ref", name: "Referencia", value: "3602-CH" }, { id: "rowen3602-material", name: "Composición", value: "Cerámica" }, { id: "rowen3602-position", name: "Posición", value: "Eje delantero" }, { id: "rowen3602-fitment", name: "Compatible con", value: "Kia Picanto All New / Xtreme / X-Line 1.2" }], inStock: true, stock: 1,
  },
  {
    id: "kmx-punta-eje-kia-picanto-morning", name: "Punta de Eje KMX — Kia Picanto / Morning", slug: "kmx-punta-eje-kia-picanto-morning-2005-2011", category: suspension,
    brand: { name: "KMX", slug: "kmx" }, price: 95900, sku: "KMX-PICANTO-AXLE", referenceType: "supplier-catalog", fitmentStatus: "conditional",
    fitments: [{ make: "Kia", model: "Picanto / Morning", engine: "según versión", years: "2005–2011", position: "Tracción · punta de eje, confirmar lado y ABS" }], fitmentSummary: "KMX: punta de eje para Kia Picanto / Morning 2005–2011; validar lado, estrías y ABS.", fitmentRequirements: ["VIN", "año", "motor", "lado", "número de estrías", "ABS", "referencia OE"], fitmentSource: "Listado comercial colombiano KMX para Kia Picanto / Morning 2005–2011. Precio público consultado: $95.900 COP; confirmar referencia de fabricante.",
    shortDesc: "Punta de eje KMX para cotización de Picanto/Morning.", description: "Punta de eje KMX para Kia Picanto y Morning 2005–2011. Por seguridad, confirma VIN, lado, número de estrías y presencia de ABS: una punta de eje no debe venderse por fotografía.",
    image: kiaImage("kmx-kia-picanto-morning-punta-eje.jpg"), images: [image("kmx-kia-picanto-morning-punta-eje.jpg", "Punta de eje KMX Kia Picanto Morning")], imageStatus: "ai-catalog-watermarked",
    attributes: [{ id: "kmxaxle-fitment", name: "Compatible con", value: "Kia Picanto / Morning 2005–2011 · validar por VIN" }, { id: "kmxaxle-position", name: "Posición", value: "Tracción · confirmar lado y ABS" }, { id: "kmxaxle-status", name: "Estado", value: "Aplicación condicionada por estrías y ABS" }], inStock: false, stock: 0,
  },
  {
    id: "kmx-bobina-encendido-kia-referencia-vin", name: "Bobina de Encendido KMX — Kia por Referencia OE", slug: "kmx-bobina-encendido-kia-referencia-vin", category: electrical,
    brand: { name: "KMX", slug: "kmx" }, price: 0, sku: "KMX-IGN-COIL-COT", referenceType: "internal-quote", fitmentStatus: "family",
    fitmentSummary: "Familia KMX de componentes eléctricos; cotizar bobina de Kia exclusivamente por VIN, código de motor y OE.", fitmentRequirements: ["VIN", "modelo", "año", "código de motor", "número de bobinas", "conector", "referencia OE"], fitmentSource: "KMX / Castel Motors Colombia — línea eléctrica con bobinas de encendido; sin referencia KIA individual publicada para asignar aplicación exacta.",
    shortDesc: "Bobina KMX para cotizar por VIN y referencia OE.", description: "Bobina de encendido KMX para vehículos Kia. La forma externa no confirma compatibilidad: identifica el código de motor, conector y referencia OE antes de solicitarla.",
    image: kiaImage("kmx-kia-bobina-encendido-referencia-vin.jpg"), images: [image("kmx-kia-bobina-encendido-referencia-vin.jpg", "Bobina de encendido KMX para Kia por VIN")], imageStatus: "ai-catalog-watermarked",
    attributes: [{ id: "kmxcoil-category", name: "Categoría", value: "PARTES ELÉCTRICAS" }, { id: "kmxcoil-fitment", name: "Compatible con", value: "Kia · únicamente con VIN, motor y referencia OE" }, { id: "kmxcoil-status", name: "Estado", value: "Familia de producto: cotización obligatoria" }], inStock: false, stock: 0,
  },
  {
    id: "gabriel-amortiguador-kia-referencia-vin", name: "Amortiguador Gabriel — Kia por VIN", slug: "gabriel-amortiguador-kia-referencia-vin", category: suspension,
    brand: { name: "Gabriel", slug: "gabriel" }, price: 0, sku: "GAB-KIA-SHOCK-COT", referenceType: "internal-quote", fitmentStatus: "family",
    fitmentSummary: "Familia Gabriel de amortiguadores; seleccionar por VIN, eje, anclajes y recorrido.", fitmentRequirements: ["VIN", "modelo", "año", "eje", "lado", "anclajes", "longitud", "referencia OE"], fitmentSource: "Gabriel Colombia — línea de amortiguadores y suspensión; referencia KIA exacta pendiente de VIN.",
    shortDesc: "Amortiguador Gabriel cotizable por VIN de Kia.", description: "Amortiguador Gabriel para cotización de Kia. La aplicación cambia por plataforma, eje y tipo de anclaje; no debe instalarse sin validar la referencia por VIN.",
    image: kiaImage("gabriel-kia-amortiguador-referencia-vin.jpg"), images: [image("gabriel-kia-amortiguador-referencia-vin.jpg", "Amortiguador Gabriel para Kia por VIN")], imageStatus: "ai-catalog-watermarked",
    attributes: [{ id: "gabk-category", name: "Categoría", value: "Frenos y Suspensión" }, { id: "gabk-fitment", name: "Compatible con", value: "Kia · confirmar modelo, eje y anclajes por VIN" }, { id: "gabk-status", name: "Estado", value: "Familia de producto: cotización obligatoria" }], inStock: false, stock: 0,
  },
  {
    id: "gti-tijera-kia-referencia-vin", name: "Tijera de Suspensión GTI — Kia por VIN", slug: "gti-tijera-suspension-kia-referencia-vin", category: suspension,
    brand: { name: "GTI", slug: "gti" }, price: 0, sku: "GTI-KIA-CTRL-ARM-COT", referenceType: "internal-quote", fitmentStatus: "family",
    fitmentSummary: "Familia GTI de suspensión para Kia; la tijera depende de plataforma, lado, bujes y rótula.", fitmentRequirements: ["VIN", "modelo", "año", "lado", "tracción", "bujes", "rótula", "referencia OE"], fitmentSource: "GTI Autoparts / Dispartes Colombia — línea de suspensión y dirección; sin referencia KIA individual verificable publicada.",
    shortDesc: "Tijera GTI para cotización por VIN de Kia.", description: "Tijera de suspensión GTI para vehículos Kia. Confirmar VIN, lado, tracción, bujes y rótula integrada antes de vender; no es una pieza universal.",
    image: kiaImage("gti-kia-tijera-suspension-referencia-vin.jpg"), images: [image("gti-kia-tijera-suspension-referencia-vin.jpg", "Tijera de suspensión GTI Kia por VIN")], imageStatus: "ai-catalog-watermarked",
    attributes: [{ id: "gtikia-fitment", name: "Compatible con", value: "Kia · confirmar plataforma y lado por VIN" }, { id: "gtikia-status", name: "Estado", value: "Familia de producto: cotización obligatoria" }], inStock: false, stock: 0,
  },
];
