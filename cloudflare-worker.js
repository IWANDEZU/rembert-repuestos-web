import openNextWorker from "./.open-next/worker.js";

const STATIC_CATEGORIES = new Set([
  "todos",
  "filtros",
  "lubricantes-gasolina",
  "transmision",
  "electrico-y-encendido",
  "motor-y-distribucion",
  "embrague",
  "rodamientos-y-traccion",
  "frenos-y-suspension",
  "radiadores",
  "combustible",
  "mangueras-y-tubos",
  "soportes-retenedores-y-guayas",
  "carroceria-iluminacion",
  "repuestos-varios",
  "mantenimiento",
  "siliconas",
]);

function rewriteStaticCatalogCategory(request) {
  if (request.method !== "GET" && request.method !== "HEAD") return request;

  const url = new URL(request.url);
  if (url.pathname !== "/catalogo") return request;

  const category = url.searchParams.get("category") || "todos";
  const normalizedCategory = category === "partes-electricas"
    ? "electrico-y-encendido"
    : category;
  if (!STATIC_CATEGORIES.has(normalizedCategory)) return request;

  const functionalParams = [...url.searchParams.keys()].filter(
    (key) => key !== "category" && key !== "_rsc"
  );
  if (functionalParams.length > 0) return request;

  url.pathname = `/catalogo/categoria/${normalizedCategory}`;
  url.searchParams.delete("category");
  return new Request(url, request);
}

const worker = {
  fetch(request, env, ctx) {
    return openNextWorker.fetch(rewriteStaticCatalogCategory(request), env, ctx);
  },
};

export default worker;
