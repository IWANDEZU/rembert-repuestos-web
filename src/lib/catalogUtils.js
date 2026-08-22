export function buildCatalogHref({ category, brand, tipo, line, vehicle, part, search, sort, page }) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (brand) params.set("brand", brand);
  if (tipo) params.set("tipo", tipo);
  if (line) params.set("line", line);
  if (vehicle) params.set("vehicle", vehicle);
  if (part) params.set("part", part);
  if (search) params.set("search", search);
  if (sort && sort !== "recent") params.set("sort", sort);
  if (page && page > 1) params.set("page", page);
  const query = params.toString();
  return query ? `/catalogo?${query}` : "/catalogo";
}
