"use client";

import { useCart } from "@/components/CartContext";
import { useState } from "react";
import Image from "next/image";
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
      className="product-card hover-card"
      style={{
        background: "var(--card-dark)",
        border: "1px solid var(--border-color)",
        borderRadius: "14px",
        padding: "0.85rem",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        transition: "transform 0.2s ease, border-color 0.2s ease",
        position: "relative",
      }}
    >
      {/* Indicador de Estado de Fotografía */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
        <span
          style={{
            fontSize: "0.72rem",
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
              padding: "2px 7px",
              borderRadius: "12px",
              fontSize: "0.68rem",
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
              padding: "2px 7px",
              borderRadius: "12px",
              fontSize: "0.68rem",
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
          height: "155px",
          background: "#FFFFFF",
          borderRadius: "8px",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "0.75rem",
          border: product.has_photo ? "1px solid #E2E8F0" : "1px solid #222",
          position: "relative",
        }}
      >
        {product.has_photo ? (
          <Image
            src={product.web_image}
            alt={product.altText || product.reference}
            fill
            sizes="(max-width: 640px) 100vw, 300px"
            loading="lazy"
            style={{
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
      <div style={{ marginBottom: "0.5rem", flexGrow: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
          <span className="product-reference" style={{ fontSize: "0.74rem", padding: "2px 8px" }}>
            Ref: {product.reference}
          </span>
        </div>

        <h3
          onClick={onSelect}
          style={{
            fontSize: "clamp(0.88rem, 2.2vw, 0.98rem)",
            color: "#FFFFFF",
            lineHeight: "1.3",
            marginBottom: "0.3rem",
            cursor: "pointer",
            fontWeight: "700",
          }}
        >
          {product.subtype}
        </h3>

        <div style={{ fontSize: "0.76rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
          <span style={{ color: "#AAA" }}>Aplicación:</span> {product.vehicle}
        </div>
      </div>

      {/* Sección de Precio */}
      <div style={{ marginTop: "auto", paddingTop: "0.6rem", borderTop: "1px solid #222" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "6px" }}>
          <span style={{ fontSize: "clamp(1.15rem, 3vw, 1.35rem)", fontWeight: "bold", color: "var(--primary-color)" }}>
            {product.formattedPrice}
          </span>
        </div>

        {/* Botones de Acción */}
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <button
            type="button"
            onClick={onSelect}
            className="product-card__quote-notice product-card__quote-notice--dark"
            style={{ padding: "0.4rem 0.5rem", fontSize: "0.72rem", border: "1px solid rgba(255, 215, 0, 0.3)", borderRadius: "6px", cursor: "pointer", width: "100%", fontWeight: "700" }}
          >
            🔍 Ver Ficha Técnica y Compatibilidad
          </button>

          <button
            type="button"
            onClick={handleAddToCart}
            className="btn-add-to-cart"
            style={{
              padding: "0.48rem 0.65rem",
              fontSize: "clamp(0.72rem, 2vw, 0.82rem)",
              fontWeight: "800",
              width: "100%",
              minHeight: "36px",
              borderRadius: "6px",
              border: added ? "1.5px solid #16A34A" : "1.5px solid #FFD700",
              background: added ? "#16A34A" : "#111111",
              color: added ? "#FFFFFF" : "#FFD700",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.35rem",
              cursor: "pointer",
              boxShadow: added ? "0 0 10px rgba(22, 163, 74, 0.5)" : "0 2px 6px rgba(0, 0, 0, 0.4)",
              transition: "all 0.2s ease",
            }}
          >
            {added ? (
              <>
                <span>✓</span>
                <span>¡Agregado!</span>
              </>
            ) : (
              <>
                <span style={{ color: "#FFD700", fontSize: "0.90rem" }}>🛒</span>
                <span>Añadir al carrito</span>
              </>
            )}
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "0.45rem 0.65rem",
              fontSize: "clamp(0.68rem, 1.9vw, 0.76rem)",
              fontWeight: "700",
              background: "#25D366",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "6px",
              textDecoration: "none",
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
              minHeight: "34px",
              boxShadow: "0 2px 6px rgba(37, 211, 102, 0.25)",
              transition: "opacity 0.2s ease",
            }}
          >
            <WhatsAppIcon size={14} color="#FFFFFF" />
            <span>Confirmar por VIN en WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
