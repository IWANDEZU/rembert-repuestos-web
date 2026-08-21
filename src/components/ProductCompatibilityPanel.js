import { getProductFitment } from "@/lib/productCompatibility";

const statusIcons = { verified: "✓", conditional: "!", family: "⌕" };

function formatFitment(item) {
  return [item.make, item.model, item.engine, item.years, item.position]
    .filter(Boolean)
    .join(" · ");
}

export default function ProductCompatibilityPanel({ product, compact = false, dark = false }) {
  const fitment = getProductFitment(product);
  const visibleFitments = compact ? fitment.fitments.slice(0, 2) : fitment.fitments;

  return (
    <section
      className={`fitment-panel fitment-panel--${fitment.status}${dark ? " fitment-panel--dark" : ""}${compact ? " fitment-panel--compact" : ""}`}
      aria-label={fitment.label}
    >
      <div className="fitment-panel__heading">
        <span className="fitment-panel__icon" aria-hidden="true">{statusIcons[fitment.status]}</span>
        <strong>{fitment.label}</strong>
      </div>
      <p className="fitment-panel__summary">{fitment.summary}</p>

      {visibleFitments.length > 0 && (
        <ul className="fitment-panel__applications">
          {visibleFitments.map((item, index) => (
            <li key={`${item.make || "marca"}-${item.model || "modelo"}-${index}`}>
              {formatFitment(item)}
            </li>
          ))}
        </ul>
      )}

      {compact && fitment.fitments.length > visibleFitments.length && (
        <span className="fitment-panel__more">+{fitment.fitments.length - visibleFitments.length} aplicación(es) en la ficha</span>
      )}

      {!compact && fitment.requirements.length > 0 && (
        <div className="fitment-panel__requirements">
          <strong>Validar antes de despachar:</strong> {fitment.requirements.join(" · ")}
        </div>
      )}

      {!compact && fitment.source && (
        <div className="fitment-panel__source"><strong>Fuente:</strong> {fitment.source}</div>
      )}
    </section>
  );
}
