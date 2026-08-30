import dynamikCiosaPhotoAssets from "./dynamikCiosaPhotoAssets.generated.js";

const normalizeSku = (value) => String(value || "").trim().toUpperCase();
const isSha256 = (value) => /^[a-f0-9]{64}$/i.test(String(value || ""));
const isCiosaDetailUrl = (value) => /^https:\/\/www\.ciosa\.(?:co|com)\/productos\/detalle\//i.test(String(value || ""));
const PLACEHOLDER_HASHES = new Set([
  "ca1a24af8b6e37cb8a41b8b22c8b7838b500de4a89105b604ec95b6769f95a15",
  "5022e85b43813dcb0debd8ee66fc0d68aaa03c7265331c5ab7afde9f3de2d14f",
]);

export function getCiosaDynamikTechnicalSource(sku) {
  const normalizedSku = normalizeSku(sku);
  const record = dynamikCiosaPhotoAssets[normalizedSku];
  if (!record || record.sku !== normalizedSku) return null;
  if (!isCiosaDetailUrl(record.sourceProof?.detailUrl)) return null;
  if (normalizeSku(record.technical?.npc) !== normalizedSku) return null;

  const technical = record.technical || {};
  if (!technical.description || !technical.system || !technical.subgroup || !technical.group) return null;
  return {
    sku: normalizedSku,
    sourceProof: record.sourceProof,
    technical,
  };
}

export function getCiosaDynamikPhoto(sku) {
  const normalizedSku = normalizeSku(sku);
  const record = dynamikCiosaPhotoAssets[normalizedSku];
  if (!record || record.sku !== normalizedSku) return null;
  if (record.imageStatus !== "official-catalog-watermarked") return null;
  if (!isCiosaDetailUrl(record.sourceProof?.detailUrl)) return null;
  if (!Array.isArray(record.views) || record.views.length === 0) return null;

  const eligibleViews = record.views
    .filter((view) => (
      view
      && !view.isSharedAcrossSkus
      && !PLACEHOLDER_HASHES.has(view.sha256)
      && typeof view.url === "string"
      && view.url.startsWith("/catalogo-dynamik/ciosa/")
      && typeof view.sourceUrl === "string"
      && (
        view.sourceUrl.includes(`/marcaDetalle/${normalizedSku}`)
        || view.sourceUrl.includes(`/filter/${normalizedSku}/${normalizedSku}`)
      )
      && isSha256(view.sha256)
      && Number(view.width) >= 300
      && Number(view.height) >= 300
    ));
  const photoViews = eligibleViews.filter((view) => view.mediaType === "photo");
  if (!photoViews.length) return null;
  const technicalViews = eligibleViews.filter((view) => view.mediaType === "technical-diagram");
  const views = [...photoViews, ...technicalViews]
    .map((view, index) => ({
      ...view,
      alt: view.alt || (view.mediaType === "technical-diagram"
        ? `Plano técnico oficial Dynamik ${normalizedSku}`
        : `Fotografía real Dynamik ${normalizedSku}, vista ${index + 1}`),
      label: view.label || (view.mediaType === "technical-diagram" ? "Plano técnico" : `Fotografía ${index + 1}`),
      isMain: index === 0,
      zoom: true,
    }));

  return {
    ...record,
    views,
    main: views.find((view) => view.isMain) || views[0],
  };
}

export default dynamikCiosaPhotoAssets;
