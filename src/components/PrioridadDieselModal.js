"use client";

import { useEffect, useState } from "react";
import { generateWhatsAppProductText, getWhatsAppUrl } from "@/lib/orderFormatter";

export default function PrioridadDieselModal({ products, initialIndex, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const product = products[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : products.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < products.length - 1 ? prev + 1 : 0));
  };

  useEffect(() => {
    // 1. Manejo de botón 'Atrás' nativo en celular (Android / iOS)
    window.history.pushState({ modalOpen: true }, "");
    const handlePopState = () => {
      onClose();
    };
    window.addEventListener("popstate", handlePopState);

    // 2. Bloquear scroll del fondo
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // 3. Atajos de Teclado
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose, products.length]);

  if (!product) return null;

  const whatsappUrl = getWhatsAppUrl(
    generateWhatsAppProductText({
      product: {
        ...product,
        name: `${product.subtype} ${product.brandName} ${product.reference}`,
        sku: product.reference,
        brand: product.brandName,
        category: product.categoryName,
        productPath: `/catalogo?category=frenos-y-suspension&search=${encodeURIComponent(product.reference)}`,
      },
      image: product.web_image || "",
      extraDetails: `Aplicación: ${product.vehicle}\nMotor: ${product.engine}\nPosición: ${product.position}\nCompatibilidad: confirmar por VIN, código OE y año.`,
    })
  );

  // Datos Estructurados JSON-LD solo para productos con foto y datos confirmados
  const jsonLdData = product.has_photo
    ? {
        "@context": "https://schema.org/",
        "@type": "Product",
        name: `${product.subtype} ${product.brandName} ${product.reference}`,
        image: product.web_image ? `https://rembertrepuestos.com${product.web_image}` : undefined,
        description: product.description,
        sku: product.reference,
        gtin: product.gtin || undefined,
        brand: {
          "@type": "Brand",
          name: product.brandName,
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "COP",
          price: product.price_cop,
          priceValidUntil: "2026-12-31",
          itemCondition: "https://schema.org/NewCondition",
          availability: "https://schema.org/PreOrder", // No declara inventario directo sin cotización
        },
      }
    : null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.88)",
        backdropFilter: "blur(8px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 99999,
        padding: "clamp(6px, 2vw, 16px)",
        overscrollBehavior: "contain",
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Script JSON-LD SEO */}
      {jsonLdData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
      )}

      <div
        style={{
          background: "var(--card-dark)",
          border: "1px solid var(--border-color)",
          borderRadius: "16px",
          maxWidth: "850px",
          width: "100%",
          maxHeight: "95vh",
          overflowY: "auto",
          position: "relative",
          boxShadow: "0 15px 45px rgba(0,0,0,0.8)",
          padding: "clamp(12px, 3vw, 24px)",
          display: "flex",
          flexDirection: "column",
          gap: "1.2rem",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal con Botón Volver */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <button
            onClick={onClose}
            style={{
              background: "#E52421",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "8px",
              padding: "6px 14px",
              cursor: "pointer",
              fontWeight: "800",
              fontSize: "0.85rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              boxShadow: "0 2px 8px rgba(229, 36, 33, 0.4)",
            }}
          >
            ← VOLVER
          </button>

          <div>
            <div style={{ fontSize: "0.78rem", color: "var(--primary-color)", fontWeight: "bold", textTransform: "uppercase" }}>
              {product.brandName} • {product.categoryName} • {product.subtype}
            </div>
            <h2 id="modal-title" style={{ fontSize: "1.3rem", color: "#fff", margin: 0 }}>
              <span className="product-reference">Ref: {product.reference}</span>
            </h2>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "#2a2a2a",
              border: "1px solid #444",
              color: "#fff",
              fontSize: "1.1rem",
              borderRadius: "50%",
              width: "34px",
              height: "34px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
            }}
            aria-label="Cerrar ventana"
          >
            ✕
          </button>
        </div>

        {/* Barra de Navegación de Categoría */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#161616",
            padding: "8px 14px",
            borderRadius: "8px",
            border: "1px solid #333",
            fontSize: "0.85rem",
          }}
        >
          <button
            onClick={handlePrev}
            style={{
              background: "#222",
              color: "var(--primary-color)",
              border: "1px solid #444",
              padding: "4px 12px",
              borderRadius: "6px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            ◄ Anterior
          </button>

          <span style={{ color: "#aaa" }}>
            Referencia <strong style={{ color: "#fff" }}>{currentIndex + 1}</strong> de <strong style={{ color: "#fff" }}>{products.length}</strong>
          </span>

          <button
            onClick={handleNext}
            style={{
              background: "#222",
              color: "var(--primary-color)",
              border: "1px solid #444",
              padding: "4px 12px",
              borderRadius: "6px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Siguiente ►
          </button>
        </div>

        {/* Body Contenido Principal: Imagen + Ficha */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
          {/* Columna Izquierda: Imagen o Badge de Foto Pendiente */}
          <div
            style={{
              background: "#0a0a0a",
              borderRadius: "10px",
              border: "1px solid #222",
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "240px",
            }}
          >
            {product.has_photo ? (
              <img
                src={product.web_image}
                alt={product.altText}
                loading="lazy"
                style={{ maxWidth: "100%", maxHeight: "260px", objectFit: "contain" }}
              />
            ) : (
              <div style={{ textAlign: "center", padding: "1.5rem" }}>
                <span style={{ fontSize: "2.8rem", display: "block", marginBottom: "0.5rem" }}>📷</span>
                <h4 style={{ color: "#ffc107", marginBottom: "0.4rem" }}>Foto de referencia</h4>
                <p style={{ fontSize: "0.8rem", color: "#aaa" }}>
                  Disponibilidad garantizada bajo código y medidas originales.
                </p>
              </div>
            )}
          </div>

          {/* Columna Derecha: Especificaciones y Compatibilidad */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--primary-color)", marginBottom: "2px" }}>
                {product.formattedPrice}
              </div>
              <span style={{ fontSize: "0.78rem", color: "#aaa", fontStyle: "italic" }}>
                Precio sujeto a confirmación y disponibilidad en bodega.
              </span>
            </div>

            {/* Vehículo y Posición */}
            <div style={{ background: "#141414", padding: "10px", borderRadius: "8px", border: "1px solid #282828", fontSize: "0.88rem" }}>
              <div style={{ marginBottom: "4px" }}><strong style={{ color: "#fff" }}>Aplicación:</strong> {product.vehicle}</div>
              <div style={{ marginBottom: "4px" }}><strong style={{ color: "#fff" }}>Motor:</strong> {product.engine}</div>
              <div><strong style={{ color: "#fff" }}>Posición:</strong> {product.position}</div>
            </div>

            {/* Tabla de Especificaciones */}
            {Object.keys(product.specifications).length > 0 && (
              <div>
                <h4 style={{ fontSize: "0.88rem", color: "var(--primary-color)", marginBottom: "6px", textTransform: "uppercase" }}>
                  🔬 Especificaciones Técnicas:
                </h4>
                <div style={{ background: "#111", borderRadius: "6px", padding: "8px", border: "1px solid #222", fontSize: "0.8rem" }}>
                  {Object.entries(product.specifications).map(([key, val]) => (
                    <div key={key} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", borderBottom: "1px solid #1a1a1a" }}>
                      <span style={{ color: "#aaa" }}>{key.replace(/_/g, " ").toUpperCase()}:</span>
                      <strong style={{ color: "#fff" }}>{typeof val === "boolean" ? (val ? "Sí" : "No") : String(val)}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* OE y Cruces */}
            {(product.oe.length > 0 || product.cross_references.length > 0) && (
              <div style={{ fontSize: "0.82rem" }}>
                {product.oe.length > 0 && (
                  <div style={{ marginBottom: "4px" }}>
                    <strong style={{ color: "var(--primary-color)" }}>Códigos OE:</strong>{" "}
                    <span style={{ color: "#ccc" }}>{product.oe.join(", ")}</span>
                  </div>
                )}
                {product.cross_references.length > 0 && (
                  <div>
                    <strong style={{ color: "var(--primary-color)" }}>Cruces Equivalentes:</strong>{" "}
                    <span style={{ color: "#ccc" }}>{product.cross_references.join(", ")}</span>
                  </div>
                )}
              </div>
            )}

            {/* Advertencia Obligatoria */}
            <div
              style={{
                background: "rgba(255, 87, 34, 0.12)",
                border: "1px solid rgba(255, 87, 34, 0.4)",
                borderRadius: "8px",
                padding: "8px 12px",
                fontSize: "0.78rem",
                color: "#ffab91",
                lineHeight: "1.4",
              }}
            >
              <strong>⚠️ Confirmación de Compatibilidad:</strong> Confirma compatibilidad por VIN, código de motor, año y modelo antes de comprar o instalar.
            </div>

            {/* CTA WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "0.75rem",
                fontSize: "0.9rem",
                fontWeight: "bold",
                background: "#25D366",
                color: "#000",
                borderRadius: "8px",
                textDecoration: "none",
                textAlign: "center",
                display: "block",
                boxShadow: "0 4px 12px rgba(37, 211, 102, 0.2)",
              }}
            >
              💬 Cotizar y Validar VIN por WhatsApp
            </a>

            {/* Botón Volver Inferior */}
            <button
              onClick={onClose}
              style={{
                padding: "0.65rem",
                fontSize: "0.85rem",
                fontWeight: "700",
                background: "#222",
                color: "#ccc",
                border: "1px solid #444",
                borderRadius: "8px",
                cursor: "pointer",
                textAlign: "center",
                display: "block",
                width: "100%",
              }}
            >
              ✕ Cerrar y volver al catálogo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
