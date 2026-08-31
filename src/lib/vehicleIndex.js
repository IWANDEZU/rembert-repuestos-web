/**
 * Índice de Marcas y Modelos de Vehículos para Rembert Repuestos BCA
 * Optimizado para filtrado ultra rápido O(1) y búsqueda inteligente de compatibilidades.
 */

import { cleanText, cleanAlphaNum } from "./searchEngine";

export const VEHICLE_MAKES = [
  {
    slug: "chevrolet",
    name: "Chevrolet",
    logo: "/logos/autos/chevrolet.svg",
    popular: true,
    models: [
      { slug: "sail", name: "Sail", synonyms: ["sail", "chevy sail"] },
      { slug: "spark", name: "Spark", synonyms: ["spark", "spark lt", "spark 1.0", "spark cronos", "spark life"] },
      { slug: "spark-gt", name: "Spark GT", synonyms: ["spark gt", "sparkgt", "spark 1.2"] },
      { slug: "onix", name: "Onix", synonyms: ["onix", "onix turbo", "onix sedan", "onix hatchback"] },
      { slug: "aveo", name: "Aveo", synonyms: ["aveo", "aveo emotion", "aveo five", "aveo family", "aveo gti", "aveo actv"] },
      { slug: "optra", name: "Optra", synonyms: ["optra", "optra 1.4", "optra 1.8", "optra limited", "optra advance"] },
      { slug: "tracker", name: "Tracker", synonyms: ["tracker", "tracker turbo"] },
      { slug: "n200", name: "N200", synonyms: ["n200", "n-200"] },
      { slug: "n300", name: "N300", synonyms: ["n300", "n-300", "n300 max", "n300 move"] },
      { slug: "d-max", name: "D-Max / Luv", synonyms: ["dmax", "d-max", "dimax", "luv dmax", "luv d-max", "luv 1600", "luv 2000", "luv 2300"] },
      { slug: "corsa", name: "Corsa", synonyms: ["corsa", "corsa evolution", "corsa active", "corsa wind", "chevy"] },
      { slug: "cruze", name: "Cruze", synonyms: ["cruze"] },
      { slug: "captiva", name: "Captiva", synonyms: ["captiva", "captiva sport", "captiva 2.4", "captiva 3.0", "captiva 3.6"] },
      { slug: "sonic", name: "Sonic", synonyms: ["sonic", "sonic 1.6"] },
      { slug: "chevette", name: "Chevette", synonyms: ["chevette"] },
      { slug: "monza", name: "Monza", synonyms: ["monza"] },
      { slug: "sprint", name: "Sprint", synonyms: ["sprint"] },
      { slug: "swift", name: "Swift", synonyms: ["swift", "swift 1.0", "swift 1.3", "swift 1.6", "twin cam"] },
      { slug: "alto", name: "Alto", synonyms: ["alto"] },
      { slug: "esteem", name: "Esteem", synonyms: ["esteem", "chevy esteem"] },
    ],
  },
  {
    slug: "renault",
    name: "Renault",
    logo: "/logos/autos/renault.svg",
    popular: true,
    models: [
      { slug: "duster", name: "Duster", synonyms: ["duster", "duster 1.6", "duster 2.0", "duster 4x4", "duster 4x2", "duster oroch"] },
      { slug: "sandero", name: "Sandero", synonyms: ["sandero", "sandero rs", "sandero dynamique"] },
      { slug: "logan", name: "Logan", synonyms: ["logan", "logan familier", "logan dynamique"] },
      { slug: "stepway", name: "Stepway", synonyms: ["stepway", "sandero stepway"] },
      { slug: "kwid", name: "Kwid", synonyms: ["kwid", "kiwd", "kwid 1.0", "kwid outsider"] },
      { slug: "clio", name: "Clio", synonyms: ["clio", "clio 1", "clio 2", "clio campus", "clio style", "clio rs"] },
      { slug: "megane", name: "Megane", synonyms: ["megane", "megane 1", "megane 2", "megane ii", "megane odeon", "meg"] },
      { slug: "symbol", name: "Symbol", synonyms: ["symbol", "symbol 1", "symbol 2", "symbol alize", "sym"] },
      { slug: "twingo", name: "Twingo", synonyms: ["twingo", "twingo 8v", "twingo 16v"] },
      { slug: "scenic", name: "Scenic", synonyms: ["scenic", "scenic 1", "scenic 2", "grand scenic"] },
      { slug: "kangoo", name: "Kangoo", synonyms: ["kangoo", "kangoo express"] },
      { slug: "captur", name: "Captur", synonyms: ["captur"] },
      { slug: "oroch", name: "Oroch", synonyms: ["oroch", "duster oroch"] },
      { slug: "r9", name: "R9 / R19 / R21", synonyms: ["r9", "r-9", "renault 9", "r19", "r-19", "renault 19", "r21", "r-21", "renault 21", "r12"] },
      { slug: "koleos", name: "Koleos", synonyms: ["koleos"] },
      { slug: "fluence", name: "Fluence", synonyms: ["fluence"] },
      { slug: "master", name: "Master / Trafic", synonyms: ["master", "trafic"] },
    ],
  },
  {
    slug: "toyota",
    name: "Toyota",
    logo: "/logos/autos/toyota.svg",
    popular: true,
    models: [
      { slug: "hilux", name: "Hilux", synonyms: ["hilux", "hilux vigo", "hilux revo", "hilux 2.4", "hilux 2.7", "hilux 2.8", "hilux 3.0", "hilux 4x4", "hilux 4x2", "hilux d4d", "hilux 1kd", "hilux 2kd"] },
      { slug: "fortuner", name: "Fortuner", synonyms: ["fortuner", "fortuner 2.7", "fortuner 3.0", "fortuner 4.0", "sw4"] },
      { slug: "corolla", name: "Corolla", synonyms: ["corolla", "corolla cross", "corolla 1.6", "corolla 1.8", "corolla 2.0"] },
      { slug: "prado", name: "Prado", synonyms: ["prado", "prado vx", "prado tx", "prado txl", "prado sumo", "prado 90", "prado 120", "prado 150"] },
      { slug: "land-cruiser", name: "Land Cruiser", synonyms: ["land cruiser", "landcruiser", "fj", "fj40", "fj70", "fj80", "serie 70", "serie 80", "serie 200", "macho", "burbuja"] },
      { slug: "rav4", name: "RAV4", synonyms: ["rav4", "rav 4", "rav-4"] },
      { slug: "yaris", name: "Yaris", synonyms: ["yaris", "yaris cross"] },
      { slug: "etios", name: "Etios", synonyms: ["etios"] },
      { slug: "4runner", name: "4Runner", synonyms: ["4runner", "4 runner", "4-runner"] },
      { slug: "rush", name: "Rush", synonyms: ["rush"] },
      { slug: "hiace", name: "Hiace", synonyms: ["hiace"] },
    ],
  },
  {
    slug: "kia",
    name: "Kia",
    logo: "/logos/autos/kia.svg",
    popular: true,
    models: [
      { slug: "picanto", name: "Picanto", synonyms: ["picanto", "picanto 1.0", "picanto 1.1", "picanto 1.25", "picanto all new", "picanto gt line", "morning"] },
      { slug: "picanto-ion", name: "Picanto Ion", synonyms: ["picanto ion", "ion", "picanto r", "picanto xtreme"] },
      { slug: "rio", name: "Rio", synonyms: ["rio", "rio xcite", "rio stylus", "rio spice", "rio scross", "rio 1.4", "rio 1.6", "rio all new"] },
      { slug: "sportage", name: "Sportage", synonyms: ["sportage", "sportage revolution", "sportage pro", "sportage fq", "sportage sl", "sportage ql", "new sportage", "sportage 4x2", "sportage 4x4"] },
      { slug: "cerato", name: "Cerato", synonyms: ["cerato", "cerato forte", "cerato pro", "cerato koup", "cerato vivro"] },
      { slug: "soul", name: "Soul", synonyms: ["soul", "soul 1.6", "soul 2.0"] },
      { slug: "sonet", name: "Sonet", synonyms: ["sonet"] },
      { slug: "sephia", name: "Sephia", synonyms: ["sephia"] },
      { slug: "sorento", name: "Sorento", synonyms: ["sorento", "sorento radison", "sorento xm"] },
      { slug: "carens", name: "Carens", synonyms: ["carens", "carens rondo"] },
      { slug: "k2700", name: "K2700 / K2500", synonyms: ["k2700", "k2500", "k-2700", "k-2500", "pregio"] },
    ],
  },
  {
    slug: "hyundai",
    name: "Hyundai",
    logo: "/logos/autos/hyundai.svg",
    popular: true,
    models: [
      { slug: "tucson", name: "Tucson", synonyms: ["tucson", "tucson ix35", "tucson ix-35", "tucson tl", "tucson 2.0", "tucson 2.4", "tucson 4x2", "tucson 4x4", "tacson", "tucon"] },
      { slug: "accent", name: "Accent", synonyms: ["accent", "accent verna", "accent gyro", "accent vision", "accent prime", "accent web", "accent 1.3", "accent 1.5"] },
      { slug: "i10", name: "i10 / Grand i10", synonyms: ["i10", "i-10", "grand i10", "grand i-10", "i10 1.1", "i10 1.2"] },
      { slug: "i25", name: "i25 / i30", synonyms: ["i25", "i-25", "i30", "i-30"] },
      { slug: "elantra", name: "Elantra", synonyms: ["elantra", "elantra hd", "elantra md", "elantra supreme", "avante"] },
      { slug: "santa-fe", name: "Santa Fe", synonyms: ["santa fe", "santafe", "grand santa fe"] },
      { slug: "getz", name: "Getz", synonyms: ["getz", "getz 1.4", "getz 1.6"] },
      { slug: "atos", name: "Atos", synonyms: ["atos", "atos prime", "atos taxi", "santro"] },
      { slug: "creta", name: "Creta", synonyms: ["creta", "creta grand"] },
      { slug: "h1", name: "H1 / H100", synonyms: ["h1", "h-1", "h100", "h-100", "starex", "porter"] },
      { slug: "eon", name: "Eon", synonyms: ["eon"] },
      { slug: "hb20", name: "HB20", synonyms: ["hb20", "hb20s", "hb20x", "graviti"] },
    ],
  },
  {
    slug: "mazda",
    name: "Mazda",
    logo: "/logos/autos/mazda.svg",
    popular: true,
    models: [
      { slug: "mazda-2", name: "Mazda 2", synonyms: ["mazda 2", "mazda2", "m2", "mazda 2 skyactiv", "demio"] },
      { slug: "mazda-3", name: "Mazda 3", synonyms: ["mazda 3", "mazda3", "m3", "mazda 3 all new", "mazda 3 skyactiv", "axela"] },
      { slug: "mazda-6", name: "Mazda 6", synonyms: ["mazda 6", "mazda6", "m6", "atenza"] },
      { slug: "bt-50", name: "BT-50", synonyms: ["bt50", "bt-50", "bt 50", "bt-50 pro"] },
      { slug: "cx-3", name: "CX-3 / CX-30", synonyms: ["cx-3", "cx3", "cx 3", "cx-30", "cx30", "cx 30"] },
      { slug: "cx-5", name: "CX-5", synonyms: ["cx-5", "cx5", "cx 5"] },
      { slug: "323", name: "323 / Allegro", synonyms: ["323", "allegro", "323 hs", "323 he", "323 ns", "323 ne", "323 coupe"] },
      { slug: "626", name: "626 / Matsuri", synonyms: ["626", "matsuri", "626 l", "626 glx", "626 asahi", "mileniun"] },
      { slug: "b2200", name: "B2200 / B2600", synonyms: ["b2200", "b2600", "b-2200", "b-2600", "serie b"] },
    ],
  },
  {
    slug: "nissan",
    name: "Nissan",
    logo: "/logos/autos/nissan.svg",
    popular: true,
    models: [
      { slug: "march", name: "March", synonyms: ["march", "micra"] },
      { slug: "versa", name: "Versa", synonyms: ["versa", "versa v-drive"] },
      { slug: "sentra", name: "Sentra", synonyms: ["sentra", "sentra b13", "sentra b14", "sentra b15", "sentra b16", "sentra b17", "b13", "tsuru"] },
      { slug: "tiida", name: "Tiida", synonyms: ["tiida", "tiida sedan", "tiida hatchback", "tiida 1.8"] },
      { slug: "kicks", name: "Kicks", synonyms: ["kicks"] },
      { slug: "qashqai", name: "Qashqai", synonyms: ["qashqai"] },
      { slug: "x-trail", name: "X-Trail", synonyms: ["x-trail", "xtrail", "x trail", "x-trail t30", "x-trail t31", "x-trail t32"] },
      { slug: "frontier", name: "Frontier / Navara / NP300", synonyms: ["frontier", "navara", "np300", "np 300", "d21", "d22", "d40", "d23"] },
      { slug: "urvan", name: "Urvan", synonyms: ["urvan", "nv350", "e24", "e25", "e26"] },
      { slug: "patrol", name: "Patrol / Pathfinder", synonyms: ["patrol", "pathfinder", "y60", "y61", "r50", "r51"] },
      { slug: "almera", name: "Almera", synonyms: ["almera"] },
    ],
  },
  {
    slug: "ford",
    name: "Ford",
    logo: "/logos/autos/ford.svg",
    popular: true,
    models: [
      { slug: "fiesta", name: "Fiesta", synonyms: ["fiesta", "fiesta titanium", "fiesta se", "fiesta supercharger", "fiesta power", "fiesta max", "fiesta move", "fierta"] },
      { slug: "ecosport", name: "EcoSport", synonyms: ["ecosport", "eco sport", "ecosport 1.6", "ecosport 2.0", "ecosport 4x2", "ecosport 4x4"] },
      { slug: "ranger", name: "Ranger", synonyms: ["ranger", "ranger 2.2", "ranger 2.5", "ranger 3.2", "ranger xlt", "ranger xls", "ranger 4x4"] },
      { slug: "focus", name: "Focus", synonyms: ["focus", "focus 2.0"] },
      { slug: "escape", name: "Escape", synonyms: ["escape", "escape 2.0", "escape 2.5", "escape 3.0", "escape ecoboost", "escape hybrid"] },
      { slug: "explorer", name: "Explorer", synonyms: ["explorer", "explorer 4.0", "explorer 4.6", "explorer 3.5", "eddie bauer"] },
      { slug: "f-150", name: "F-150 / Fortaleza", synonyms: ["f-150", "f150", "f 150", "fortaleza", "lobo", "triton"] },
      { slug: "edge", name: "Edge", synonyms: ["edge"] },
      { slug: "festiva", name: "Festiva / Laser", synonyms: ["festiva", "laser"] },
    ],
  },
  {
    slug: "volkswagen",
    name: "Volkswagen",
    logo: "/logos/autos/volkswagen.svg",
    popular: true,
    models: [
      { slug: "gol", name: "Gol", synonyms: ["gol", "gol g1", "gol g2", "gol g3", "gol g4", "gol g5", "gol g6", "gol 1.6", "gol 1.8"] },
      { slug: "voyage", name: "Voyage", synonyms: ["voyage", "voyage 1.6"] },
      { slug: "fox", name: "Fox / CrossFox / SpaceFox", synonyms: ["fox", "crossfox", "spacefox"] },
      { slug: "saveiro", name: "Saveiro", synonyms: ["saveiro"] },
      { slug: "polo", name: "Polo / Virtus", synonyms: ["polo", "virtus", "polo track", "polo gts"] },
      { slug: "jetta", name: "Jetta / Bora / Vento", synonyms: ["jetta", "bora", "vento", "jetta clasico", "jetta mk4", "jetta mk5", "jetta mk6", "jetta gli"] },
      { slug: "golf", name: "Golf", synonyms: ["golf", "golf mk3", "golf mk4", "golf mk5", "golf mk7", "golf gti"] },
      { slug: "t-cross", name: "T-Cross / Nivus / Taos", synonyms: ["t-cross", "tcross", "nivus", "taos", "tiguan"] },
      { slug: "amarok", name: "Amarok", synonyms: ["amarok", "amarok 2.0", "amarok v6"] },
      { slug: "transporter", name: "Transporter / Crafter / Kombi", synonyms: ["transporter", "crafter", "kombi", "t4", "t5", "t6", "panel"] },
    ],
  },
  {
    slug: "suzuki",
    name: "Suzuki",
    logo: "/logos/autos/suzuki.svg",
    popular: false,
    models: [
      { slug: "swift", name: "Swift", synonyms: ["swift", "swift dzire", "swift hybrid"] },
      { slug: "alto", name: "Alto / Celerio", synonyms: ["alto", "celerio", "alto 800", "alto k10"] },
      { slug: "vitara", name: "Vitara / Grand Vitara", synonyms: ["vitara", "grand vitara", "grand vitara sz", "grand nomade"] },
      { slug: "jimny", name: "Jimny / Samurai / SJ410", synonyms: ["jimny", "samurai", "sj410", "sj413"] },
      { slug: "s-cross", name: "S-Cross / Baleno / Ertiga", synonyms: ["s-cross", "scross", "baleno", "ertiga", "ignis"] },
    ],
  },
  {
    slug: "mitsubishi",
    name: "Mitsubishi",
    logo: "/logos/autos/mitsubishi.svg",
    popular: false,
    models: [
      { slug: "lancer", name: "Lancer", synonyms: ["lancer", "lancer touring", "lancer glx", "lancer 1.6", "lancer 2.0"] },
      { slug: "montero", name: "Montero / Nativa", synonyms: ["montero", "montero pajero", "montero hard top", "montero dakar", "montero mitsubishi", "nativa"] },
      { slug: "l200", name: "L200 / Sportero", synonyms: ["l200", "l-200", "sportero", "triton"] },
      { slug: "outlander", name: "Outlander / ASX", synonyms: ["outlander", "asx", "mirage"] },
    ],
  },
  {
    slug: "honda",
    name: "Honda",
    logo: "/logos/autos/honda.svg",
    popular: false,
    models: [
      { slug: "civic", name: "Civic", synonyms: ["civic", "civic ex", "civic lx", "civic si"] },
      { slug: "cr-v", name: "CR-V / HR-V", synonyms: ["cr-v", "crv", "cr v", "hr-v", "hrv", "hr v"] },
      { slug: "accord", name: "Accord / Fit / City", synonyms: ["accord", "fit", "city", "pilot"] },
    ],
  },
  {
    slug: "peugeot",
    name: "Peugeot",
    logo: "/logos/autos/peugeot.svg",
    popular: false,
    models: [
      { slug: "206", name: "206 / 207 / 208", synonyms: ["206", "207", "208", "208 active", "208 allure"] },
      { slug: "301", name: "301 / 306 / 307 / 308", synonyms: ["301", "306", "307", "308"] },
      { slug: "405", name: "405 / 406 / 407", synonyms: ["405", "406", "407"] },
      { slug: "2008", name: "2008 / 3008 / Partner", synonyms: ["2008", "3008", "5008", "partner", "boxer"] },
    ],
  },
  {
    slug: "citroen",
    name: "Citroën",
    logo: "/logos/autos/citroen.svg",
    popular: false,
    models: [
      { slug: "c3", name: "C3 / C4 / C-Elysee", synonyms: ["c3", "c4", "c-elysee", "c elysee", "c3 aircross", "c4 cactus", "berlingo"] },
    ],
  },
  {
    slug: "fiat",
    name: "Fiat",
    logo: "/logos/autos/fiat.svg",
    popular: false,
    models: [
      { slug: "palio", name: "Palio / Siena / Strada", synonyms: ["palio", "siena", "strada", "weekend", "adventure"] },
      { slug: "uno", name: "Uno / Premio / Fiorino", synonyms: ["uno", "uno fire", "premio", "fiorino", "147"] },
      { slug: "mobi", name: "Mobi / Argo / Cronos", synonyms: ["mobi", "argo", "cronos", "pulse", "toro", "ducato"] },
    ],
  },
  {
    slug: "daewoo",
    name: "Daewoo",
    logo: "/logos/autos/daewoo.svg",
    popular: false,
    models: [
      { slug: "cielo", name: "Cielo / Espero / Racer", synonyms: ["cielo", "espero", "racer", "nexia"] },
      { slug: "lanos", name: "Lanos / Nubira / Leganza", synonyms: ["lanos", "nubira", "leganza"] },
      { slug: "matiz", name: "Matiz / Tico / Damas", synonyms: ["matiz", "tico", "damas", "labo"] },
    ],
  },
  {
    slug: "bmw",
    name: "BMW",
    logo: "/logos/autos/bmw.svg",
    popular: false,
    models: [
      { slug: "serie-3", name: "Serie 3 / Serie 1 / Serie 5", synonyms: ["serie 3", "serie 1", "serie 5", "e36", "e46", "e90", "f30"] },
      { slug: "x1", name: "X1 / X3 / X5", synonyms: ["x1", "x3", "x5"] },
    ],
  },
  {
    slug: "mercedes",
    name: "Mercedes-Benz",
    logo: "/logos/autos/mercedes.svg",
    popular: false,
    models: [
      { slug: "sprinter", name: "Sprinter / Vito", synonyms: ["sprinter", "vito"] },
      { slug: "clase-c", name: "Clase C / Clase A / Clase E", synonyms: ["clase c", "clase a", "clase e", "c180", "c200", "glc", "gla"] },
    ],
  },
];

// Mapa indexado O(1) de marcas de vehículos
const MAKE_BY_SLUG = new Map();
const ALL_MODELS_BY_MAKE = new Map();

for (const make of VEHICLE_MAKES) {
  MAKE_BY_SLUG.set(make.slug, make);
  const modelsMap = new Map();
  for (const model of make.models) {
    modelsMap.set(model.slug, model);
  }
  ALL_MODELS_BY_MAKE.set(make.slug, modelsMap);
}

/**
 * Retorna todas las marcas de vehículos disponibles
 */
export function getVehicleMakes() {
  return VEHICLE_MAKES;
}

/**
 * Retorna los modelos disponibles para una marca
 */
export function getModelsForMake(makeSlug) {
  const make = MAKE_BY_SLUG.get(makeSlug);
  return make ? make.models : [];
}

/**
 * Busca si un producto coincide con una marca y/o modelo de vehículo
 */
export function matchProductVehicle(product, { makeSlug, modelSlug, rawVehicleText }) {
  if (!product) return false;

  const pName = cleanText(product.name);
  const pDesc = cleanText(`${product.shortDesc || ""} ${product.description || ""}`);
  const pFitmentSummary = cleanText(product.fitmentSummary);
  const pLine = cleanText(product.inventoryLine);

  const pFitments = (product.fitments || [])
    .map((f) => cleanText(`${f.make || ""} ${f.model || ""} ${f.engine || ""} ${f.years || ""}`))
    .join(" ");

  const pAttributes = (product.attributes || [])
    .map((a) => cleanText(`${a.name || ""} ${a.value || ""}`))
    .join(" ");

  const fullSearchable = `${pName} ${pDesc} ${pFitmentSummary} ${pLine} ${pFitments} ${pAttributes}`;
  const fullAlpha = cleanAlphaNum(fullSearchable);

  // 1. Si viene texto libre de vehículo (ej: "chevrolet sail", "duster", "hilux")
  if (rawVehicleText) {
    const rawClean = cleanText(rawVehicleText);
    const rawAlpha = cleanAlphaNum(rawVehicleText);
    if (!rawClean) return true;

    const rawTokens = rawClean.split(/\s+/).filter(Boolean);
    const allTokensMatch = rawTokens.every((token) => {
      const tokenAlpha = cleanAlphaNum(token);
      return fullSearchable.includes(token) || (tokenAlpha.length >= 3 && fullAlpha.includes(tokenAlpha));
    });
    if (allTokensMatch) return true;
  }

  // 2. Si viene marca de auto
  if (makeSlug) {
    const makeObj = MAKE_BY_SLUG.get(makeSlug);
    if (!makeObj) return false;

    const makeNameClean = cleanText(makeObj.name);
    const hasMake = fullSearchable.includes(makeSlug) || fullSearchable.includes(makeNameClean);

    // 3. Si además viene modelo de auto
    if (modelSlug) {
      const modelsMap = ALL_MODELS_BY_MAKE.get(makeSlug);
      const modelObj = modelsMap?.get(modelSlug);

      if (modelObj) {
        const modelNameClean = cleanText(modelObj.name);
        const synonyms = modelObj.synonyms || [modelObj.name];

        for (const syn of synonyms) {
          const synClean = cleanText(syn);
          const synAlpha = cleanAlphaNum(syn);

          // Si el sinónimo del modelo tiene 4+ caracteres o ya tenemos la marca presente
          if (hasMake && (fullSearchable.includes(synClean) || (synAlpha.length >= 3 && fullAlpha.includes(synAlpha)))) {
            return true;
          }

          // Modelos distintivos como 'duster', 'sail', 'tucson', 'hilux' coinciden incluso si no dice explícitamente la marca
          if (synClean.length >= 4 && !["golf", "fox", "city", "fit", "rio", "march", "edge"].includes(synClean)) {
            if (fullSearchable.includes(synClean) || fullAlpha.includes(synAlpha)) {
              return true;
            }
          }
        }
        return false;
      }
    }

    return hasMake;
  }

  return true;
}

/**
 * Filtra una lista de productos por marca y/o modelo de vehículo
 */
export function filterProductsByVehicle(products = [], filterOptions = {}) {
  const { make, model, vehicle } = filterOptions;
  if (!make && !model && !vehicle) return products;

  return products.filter((product) =>
    matchProductVehicle(product, {
      makeSlug: make,
      modelSlug: model,
      rawVehicleText: vehicle,
    })
  );
}

/**
 * Extrae marca y modelo reconocidos de una consulta de búsqueda
 * Ej: "pastillas para chevrolet sail 1.4" -> { make: "chevrolet", model: "sail", cleanQuery: "pastillas 1.4" }
 */
export function extractVehicleFromQuery(query = "") {
  if (!query || !query.trim()) {
    return { make: null, model: null, vehicleName: null, remainingQuery: query };
  }

  const queryClean = cleanText(query);
  let recognizedMake = null;
  let recognizedModel = null;
  let recognizedVehicleName = null;

  for (const make of VEHICLE_MAKES) {
    const makeNameClean = cleanText(make.name);
    const hasMake = queryClean.includes(make.slug) || queryClean.includes(makeNameClean);

    for (const model of make.models) {
      for (const syn of model.synonyms || [model.name]) {
        const synClean = cleanText(syn);
        if (queryClean.includes(synClean)) {
          recognizedMake = make.slug;
          recognizedModel = model.slug;
          recognizedVehicleName = `${make.name} ${model.name}`;
          break;
        }
      }
      if (recognizedModel) break;
    }

    if (hasMake && !recognizedMake) {
      recognizedMake = make.slug;
      recognizedVehicleName = make.name;
    }

    if (recognizedMake && recognizedModel) break;
  }

  return {
    make: recognizedMake,
    model: recognizedModel,
    vehicleName: recognizedVehicleName,
    remainingQuery: query,
  };
}
