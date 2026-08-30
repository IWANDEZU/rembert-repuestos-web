import dynamikLocalPhotoAssets from "./dynamikLocalPhotoAssets.generated.js";

// Solo se incluyen fotos físicas propias, verificadas y asignadas al mismo NPC.
// Cada entrada debe incluir: sku, imageStatus: "exact-real-photo", sourceProof
// con sha256 y vistas locales. La galería admite Caja, Producto y Detalle; la
// caja es una vista adicional del mismo NPC, nunca un reemplazo de la pieza.
//
// Ejemplo de estructura (sin activos de ejemplo):
// "DNK000000SM": {
//   sku: "DNK000000SM",
//   imageStatus: "exact-real-photo",
//   sourceProof: { sha256: "…", approvedBy: "equipo", approvedAt: "2026-08-30" },
//   views: [
//     { url: "/catalogo-dynamik/dnk000000sm-caja.webp", label: "Caja" },
//     { url: "/catalogo-dynamik/dnk000000sm-producto.webp", label: "Producto", isMain: true },
//     { url: "/catalogo-dynamik/dnk000000sm-detalle.webp", label: "Detalle", zoom: true },
//   ],
// },
//
// Los archivos referenciales permanecen fuera de este índice y nunca se muestran
// como si representaran la geometría real de una pastilla.
const normalizeSku = (sku) => String(sku || "").trim().toUpperCase();
const isApprovedHash = (hash) => /^[a-f0-9]{64}$/i.test(String(hash || ""));

// La propia ficha no puede habilitar una imagen por su cuenta. Esta función es
// la única lista de autorización para medios Dynamik en el catálogo y la API.
export function getVerifiedDynamikPhoto(sku) {
  const normalizedSku = normalizeSku(sku);
  const record = dynamikLocalPhotoAssets[normalizedSku];
  if (!record || typeof record !== "object") return null;
  if (record.sku !== normalizedSku || record.imageStatus !== "exact-real-photo") return null;
  if (!isApprovedHash(record.sourceProof?.sha256) || !record.sourceProof?.approvedBy || !record.sourceProof?.approvedAt) return null;
  if (!Array.isArray(record.views) || record.views.length === 0) return null;

  const views = record.views
    .filter((view) => view && typeof view.url === "string" && view.url.startsWith("/catalogo-dynamik/"))
    .map((view, index) => ({
      url: view.url,
      alt: view.alt || `Foto verificada Dynamik ${normalizedSku}`,
      label: view.label || `Vista ${index + 1}`,
      isMain: Boolean(view.isMain),
      zoom: Boolean(view.zoom),
      isDerivative: Boolean(view.isDerivative),
    }));
  if (!views.length) return null;

  return {
    ...record,
    views,
    main: views.find((view) => view.isMain) || views[0],
  };
}

export default dynamikLocalPhotoAssets;
