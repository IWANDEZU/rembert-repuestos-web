import dynamikSourcedPhotoAssets from "./dynamikSourcedPhotoAssets.generated.js";

const normalizeSku = (sku) => String(sku || "").trim().toUpperCase();
const isApprovedHash = (hash) => /^[a-f0-9]{64}$/i.test(String(hash || ""));

export function getVerifiedDynamikSourcedPhoto(sku) {
  const normalizedSku = normalizeSku(sku);
  const record = dynamikSourcedPhotoAssets[normalizedSku];
  if (!record || record.sku !== normalizedSku || record.imageStatus !== "exact-real-photo") return null;
  if (!isApprovedHash(record.sourceProof?.sha256) || !record.sourceProof?.sourcePageUrl || !record.sourceProof?.approvedAt) return null;
  if (!Array.isArray(record.views) || !record.views.length) return null;

  const views = record.views
    .filter((view) => view?.url?.startsWith("/catalogo-dynamik/sourced/"))
    .map((view, index) => ({
      ...view,
      alt: view.alt || `Fotografía física exacta Dynamik ${normalizedSku}`,
      label: view.label || `Vista ${index + 1}`,
      isMain: Boolean(view.isMain),
      zoom: Boolean(view.zoom),
    }));
  if (!views.length) return null;

  return {
    ...record,
    views,
    main: views.find((view) => view.isMain) || views[0],
  };
}

export default dynamikSourcedPhotoAssets;
