"use client";

import { useCart } from "@/components/CartContext";
import { useState } from "react";
import { generateWhatsAppProductText, getWhatsAppUrl } from "@/lib/orderFormatter";
import WhatsAppIcon from "@/components/WhatsAppIcon";

export default function PrioridadDieselCard({ product, onSelect }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart({
      id: product.id || product.reference,
      name: `${product.subtype || ""} ${product.brandName || ""} ${product.reference}`.trim(),
      price: product.price || 0,
      image: product.web_image || "",
      brand: product.brandName,
      category: product.categoryName,
      sku: product.reference,
      slug: product.reference,
    }, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

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
      extraDetails: `Aplicación: ${product.vehicle}\nCompatibilidad: confirmar por VIN, código OE y año.`,
    })
  );

  return (
    <div
      style={{
        background: "var(--card-dark)",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--border-radius)",
        padding: "1.2rem",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        transition: "transform 0.2s ease, border-color 0.2s ease",
        position: "relative",
      }}
    >
      {/* Indicador de Estado de Fotografía */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem" }}>
        <span
          style={{
            fontSize: "0.75rem",
            fontWeight: "bold",
            color: "var(--primary-color)",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          {product.brandName} • {product.categoryName}
        </span>

        {product.has_photo ? (
          <span
            style={{
              background: "rgba(40, 167, 69, 0.15)",
              color: "#28a745",
              border: "1px solid #28a745",
              padding: "2px 8px",
              borderRadius: "12px",
              fontSize: "0.7rem",
              fontWeight: "600",
            }}
          >
            ✓ Foto Exacta
          </span>
        ) : (
          <span
            style={{
              background: "rgba(255, 193, 7, 0.15)",
              color: "#ffc107",
              border: "1px solid #ffc107",
              padding: "2px 8px",
              borderRadius: "12px",
              fontSize: "0.7rem",
              fontWeight: "600",
            }}
          >
            📷 Foto exacta pendiente
          </span>
        )}
      </div>

      {/* Contenedor de Imagen con Carga Diferida y Espacio Reservado (Aspect Ratio) */}
      <div
        style={{
          width: "100%",
          height: "180px",
          background: "#0d0d0d",
          borderRadius: "8px",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "1rem",
          border: "1px solid #222",
          position: "relative",
        }}
      >
        {product.has_photo ? (
          <img
            src={product.web_image}
            alt={product.altText}
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              padding: "10px",
            }}
          />
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "1rem",
              color: "#777",
            }}
          >
            <span style={{ fontSize: "2rem", display: "block", marginBottom: "0.5rem" }}>📷</span>
            <span style={{ fontSize: "0.82rem", fontWeight: "bold", color: "#aaa" }}>
              Foto exacta pendiente
            </span>
            <p style={{ fontSize: "0.72rem", color: "#666", marginTop: "0.2rem" }}>
              Fotografía en proceso de verificación de fábrica.
            </p>
          </div>
        )}

        <button
          onClick={onSelect}
          style={{
            position: "absolute",
            bottom: "8px",
            right: "8px",
            background: "rgba(0, 0, 0, 0.85)",
            color: "var(--primary-color)",
            border: "1px solid #444",
            borderRadius: "14px",
            padding: "4px 10px",
            fontSize: "0.72rem",
            fontWeight: "bold",
            cursor: "pointer",
          }}
          aria-label={`Ver ficha técnica de ${product.reference}`}
        >
          🔍 Ficha Técnica
        </button>
      </div>

      {/* Referencia y Nombre Principal */}
      <div style={{ marginBottom: "0.6rem" }}>
        <span className="product-reference" style={{ marginBottom: "6px" }}>
          Ref: {product.reference}
        </span>

        <h3
          style={{
            fontSize: "1.05rem",
            color: "#fff",
            lineHeight: "1.3",
            marginBottom: "0.3rem",
          }}
        >
          {product.subtype}
        </h3>
      </div>

      {/* Aplicación Vehicular */}
      <div
        style={{
          fontSize: "0.82rem",
          color: "var(--text-muted)",
          marginBottom: "0.8rem",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          background: "#141414",
          padding: "8px 10px",
          borderRadius: "6px",
        }}
      >
        <div>
          <strong style={{ color: "#ccc" }}>Vehículo:</strong> {product.vehicle}
        </div>
        <div>
          <strong style={{ color: "#ccc" }}>Motor:</strong> {product.engine} |{" "}
          <strong style={{ color: "#ccc" }}>Posición:</strong> {product.position}
        </div>
      </div>

      {/* Cruces u OE destacados */}
      {(product.oe.length > 0 || product.cross_references.length > 0) && (
        <div style={{ fontSize: "0.75rem", color: "#888", marginBottom: "0.8rem" }}>
          <strong>OE / Cruces:</strong>{" "}
          {[...product.oe, ...product.cross_references].slice(0, 2).join(", ")}
          {[...product.oe, ...product.cross_references].length > 2 && "..."}
        </div>
      )}

      {/* Sección de Precio */}
      <div style={{ marginTop: "auto", paddingTop: "0.8rem", borderTop: "1px solid #222" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "4px" }}>
          <span style={{ fontSize: "1.35rem", fontWeight: "bold", color: "var(--primary-color)" }}>
            {product.formattedPrice}
          </span>
        </div>

        <p style={{ fontSize: "0.7rem", color: "#aaa", fontStyle: "italic", marginBottom: "0.8rem" }}>
          Precio sugerido, sujeto a disponibilidad y confirmación.
        </p>

        {/* Advertencia Obligatoria de Compatibilidad */}
        <div
          style={{
            background: "rgba(255, 87, 34, 0.1)",
            border: "1px solid rgba(255, 87, 34, 0.3)",
            borderRadius: "6px",
            padding: "6px 8px",
            fontSize: "0.72rem",
            color: "#ff8a65",
            marginBottom: "0.8rem",
            lineHeight: "1.35",
          }}
        >
          <strong>⚠️ Nota de Compatibilidad:</strong> Confirma compatibilidad por VIN, código de motor, año y tracción antes de comprar o instalar.
        </div>

        {/* Botones de Acción */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <button
            type="button"
            onClick={handleAddToCart}
            className="btn-add-to-cart"
            style={{
              padding: "0.65rem 0.8rem",
              fontSize: "0.85rem",
              fontWeight: "800",
              width: "100%",
              borderRadius: "6px",
              border: added ? "1.5px solid #16A34A" : "1.5px solid #FFD700",
              background: added ? "#16A34A" : "#111111",
              color: added ? "#FFFFFF" : "#FFD700",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.45rem",
              cursor: "pointer",
              boxShadow: added ? "0 0 10px rgba(22, 163, 74, 0.5)" : "0 2px 8px rgba(0, 0, 0, 0.4)",
              transition: "all 0.22s ease",
            }}
          >
            {added ? (
              <>
                <span>✓</span>
                <span>¡Agregado al carrito!</span>
              </>
            ) : (
              <>
                <span style={{ color: "#FFD700", fontSize: "1rem" }}>🛒</span>
                <span>Añadir al carrito</span>
              </>
            )}
          </button>

          <button
            onClick={onSelect}
            style={{
              padding: "0.5rem",
              fontSize: "0.82rem",
              fontWeight: "bold",
              background: "#222",
              color: "#fff",
              border: "1px solid #444",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            📋 Ver Ficha y Especificaciones
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "0.55rem",
              fontSize: "0.82rem",
              fontWeight: "bold",
              background: "#25D366",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "6px",
              textDecoration: "none",
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              boxShadow: "0 2px 6px rgba(37, 211, 102, 0.25)",
              transition: "opacity 0.2s ease",
            }}
          >
            <WhatsAppIcon size={16} color="#FFFFFF" />
            <span>Confirmar Compatibilidad por VIN</span>
          </a>
        </div>
      </div>
    </div>
  );
}
