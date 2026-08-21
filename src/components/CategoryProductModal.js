"use client";

import { useState, useEffect, useCallback } from "react";
import { useCart } from "@/components/CartContext";
import Image from "next/image";
import { getProductDisplayImage } from "@/lib/productImage";
import { generateWhatsAppProductText, getWhatsAppUrl } from "@/lib/orderFormatter";

const getMainImage = (product) => getProductDisplayImage(product);
const getFirstVariant = (product) => product?.variants?.[0] || null;

export default function CategoryProductModal({ products, initialIndex = 0, onClose }) {
  const initialProduct = products && products.length > 0 ? products[initialIndex] : null;
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [activeTab, setActiveTab] = useState("specs");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [isZoom, setIsZoom] = useState(false);

  const { addToCart } = useCart();

  const currentProduct = products && products.length > 0 ? products[currentIndex] : null;
  const [selectedVariant, setSelectedVariant] = useState(() => getFirstVariant(initialProduct));
  const [selectedImage, setSelectedImage] = useState(() => getMainImage(initialProduct));

  const selectProduct = useCallback((nextIndex) => {
    const nextProduct = products?.[nextIndex];
    if (!nextProduct) return;
    setCurrentIndex(nextIndex);
    setSelectedImage(getMainImage(nextProduct));
    setSelectedVariant(getFirstVariant(nextProduct));
    setQuantity(1);
    setAdded(false);
  }, [products]);

  // Manejo de Navegación (Anterior / Siguiente)
  const handleNext = useCallback(() => {
    if (!products || products.length === 0) return;
    selectProduct((currentIndex + 1) % products.length);
  }, [currentIndex, products, selectProduct]);

  const handlePrev = useCallback(() => {
    if (!products || products.length === 0) return;
    selectProduct((currentIndex - 1 + products.length) % products.length);
  }, [currentIndex, products, selectProduct]);

  // Escuchar Teclado (←, →, ESC), Bloqueo de Scroll y Retroceso en Móvil (Botón Atrás del Navegador)
  useEffect(() => {
    // 1. Manejo de botón 'Atrás' nativo en celular (Android / iOS)
    window.history.pushState({ modalOpen: true }, "");
    const handlePopState = () => {
      onClose();
    };
    window.addEventListener("popstate", handlePopState);

    // 2. Bloquear scroll del fondo mientras el modal está abierto
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // 3. Atajos de Teclado
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [handleNext, handlePrev, onClose]);

  if (!currentProduct) return null;

  const currentPrice = selectedVariant ? (selectedVariant.price || currentProduct.price) : currentProduct.price;
  const currentStock = selectedVariant ? (selectedVariant.stock ?? 20) : (currentProduct.stock ?? 20);
  const canBuy = currentProduct.inStock && currentStock > 0 && currentPrice > 0;
  const brandName = currentProduct.brand?.name || currentProduct.brand || "REMBERT";
  const categoryName = currentProduct.category?.name || currentProduct.category || "Repuestos";

  const handleAddToCart = () => {
    if (!canBuy) return;
    addToCart(
      {
        id: currentProduct.id,
        name: selectedVariant ? `${currentProduct.name} (${selectedVariant.name})` : currentProduct.name,
        price: currentPrice,
        image: selectedImage,
        brand: brandName,
        category: categoryName,
        sku: selectedVariant?.sku || currentProduct.sku || "",
        slug: currentProduct.slug || currentProduct.id,
        variantId: selectedVariant?.id || null,
      },
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const galleryImages = currentProduct.images && currentProduct.images.length > 0 && currentProduct.images[0]?.url === getMainImage(currentProduct)
    ? currentProduct.images.map((img) => img.url)
    : [selectedImage || "/logo.png"];
  const whatsappUrl = getWhatsAppUrl(
    generateWhatsAppProductText({
      product: currentProduct,
      image: selectedImage,
      quantity,
      variant: selectedVariant,
      price: currentPrice,
    })
  );

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
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(6px, 2vw, 20px)",
        overscrollBehavior: "contain",
      }}
      onClick={onClose}
    >
      {/* Contenedor Modal de Ampliación */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "1000px",
          maxHeight: "95vh",
          background: "#141414",
          border: "1px solid #333",
          borderRadius: "16px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.95)",
        }}
      >
        {/* Cabecera del Modal con Navegación y Botón Volver/Cerrar */}
        <div
          style={{
            padding: "12px 16px",
            background: "#0a0a0a",
            borderBottom: "1px solid #262626",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          {/* Botón Volver / Cerrar Rápido */}
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

          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <span
              style={{
                background: "var(--primary-color)",
                color: "#000",
                fontSize: "0.72rem",
                fontWeight: "bold",
                padding: "3px 8px",
                borderRadius: "4px",
                textTransform: "uppercase",
              }}
            >
              {categoryName}
            </span>
            <span style={{ color: "#aaa", fontSize: "0.82rem" }}>
              <strong>{currentIndex + 1}</strong> / <strong>{products.length}</strong>
            </span>
          </div>

          {/* Botones Centrales de Avanzar / Retroceder */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              onClick={handlePrev}
              title="Producto Anterior (Flecha Izquierda)"
              style={{
                background: "#222",
                color: "#fff",
                border: "1px solid #444",
                borderRadius: "8px",
                padding: "6px 10px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "0.82rem",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              ◄
            </button>
            <button
              onClick={handleNext}
              title="Producto Siguiente (Flecha Derecha)"
              style={{
                background: "var(--primary-color)",
                color: "#000",
                border: "none",
                borderRadius: "8px",
                padding: "6px 10px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "0.82rem",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              ►
            </button>

            {/* Cerrar X */}
            <button
              onClick={onClose}
              title="Cerrar (Esc)"
              style={{
                background: "#2a2a2a",
                color: "#fff",
                border: "1px solid #444",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1rem",
                fontWeight: "bold",
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Cuerpo del Modal (Scrollable) */}
        <div
          style={{
            padding: "24px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          {/* Grid Principal (Imagen + Detalles) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "24px",
            }}
          >
            {/* Galería de Fotos */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div
                style={{
                  background: "#080808",
                  borderRadius: "12px",
                  padding: "16px",
                  height: "300px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #222",
                  position: "relative",
                }}
              >
                <Image
                  src={selectedImage}
                  alt={currentProduct.name}
                  width={800}
                  height={600}
                  unoptimized={selectedImage.startsWith("/api/imagen-referencia")}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>

              {/* Thumbnails si hay más de 1 imagen */}
              {galleryImages.length > 1 && (
                <div style={{ display: "flex", gap: "8px", overflowX: "auto" }}>
                  {galleryImages.map((imgUrl, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setSelectedImage(imgUrl)}
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "6px",
                        background: "#0f0f0f",
                        border: selectedImage === imgUrl ? "2px solid var(--primary-color)" : "1px solid #333",
                        padding: "4px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Image src={imgUrl} alt={`Vista ${idx + 1} de ${currentProduct.name}`} width={52} height={52} unoptimized={imgUrl.startsWith("/api/imagen-referencia")} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Información del Producto y Compra */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ color: "var(--primary-color)", fontWeight: "bold", fontSize: "0.82rem", letterSpacing: "1px" }}>
                {brandName} • <span className="product-reference">SKU: {currentProduct.sku || currentProduct.id.slice(-8)}</span>
              </div>

              <h2 style={{ fontSize: "1.6rem", color: "#fff", lineHeight: "1.2" }}>{currentProduct.name}</h2>

              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "1.8rem", fontWeight: "bold", color: "var(--primary-color)" }}>
                  {currentPrice > 0
                    ? new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(currentPrice)
                    : "Precio bajo cotización"}
                </span>
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: "12px",
                    fontSize: "0.78rem",
                    fontWeight: "bold",
                    background: canBuy ? "rgba(76, 175, 80, 0.15)" : "rgba(255, 107, 0, 0.12)",
                    color: canBuy ? "#4caf50" : "var(--primary-color)",
                    border: `1px solid ${canBuy ? "#2e7d32" : "var(--primary-color)"}`,
                  }}
                >
                  {canBuy ? `✓ En stock (${currentStock})` : "Disponibilidad por confirmar"}
                </span>
              </div>

              <p style={{ color: "#aaa", fontSize: "0.9rem", lineHeight: "1.5" }}>
                {currentProduct.description}
              </p>

              {/* Selector de Presentación / Variantes */}
              {currentProduct.variants && currentProduct.variants.length > 0 && (
                <div>
                  <label style={{ fontSize: "0.8rem", textTransform: "uppercase", color: "#888", display: "block", marginBottom: "6px" }}>
                    Selecciona Presentación / Empaque:
                  </label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {currentProduct.variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        style={{
                          background: selectedVariant?.id === v.id ? "var(--primary-color)" : "#1f1f1f",
                          color: selectedVariant?.id === v.id ? "#000" : "#fff",
                          border: `1px solid ${selectedVariant?.id === v.id ? "var(--primary-color)" : "#333"}`,
                          padding: "6px 12px",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "0.82rem",
                          fontWeight: "bold",
                        }}
                      >
                        {v.name} {v.price ? `- $${v.price.toLocaleString("es-CO")}` : ""}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Botones de Acción */}
              <div style={{ display: "flex", gap: "10px", marginTop: "auto", paddingTop: "12px" }}>
                <div style={{ display: "flex", border: "1px solid #333", borderRadius: "8px", overflow: "hidden", background: "#111" }}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{ background: "transparent", color: "#fff", border: "none", padding: "8px 12px", cursor: "pointer" }}
                  >
                    -
                  </button>
                  <span style={{ padding: "8px 12px", color: "#fff", fontWeight: "bold", display: "flex", alignItems: "center" }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    style={{ background: "transparent", color: "#fff", border: "none", padding: "8px 12px", cursor: "pointer" }}
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="btn-add-to-cart"
                  style={{
                    flex: 1,
                    padding: "10px 14px",
                    fontWeight: "800",
                    fontSize: "0.9rem",
                    borderRadius: "8px",
                    border: added ? "1.5px solid #16A34A" : "1.5px solid #FFD700",
                    background: added ? "#16A34A" : "#111111",
                    color: added ? "#FFFFFF" : "#FFD700",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    cursor: "pointer",
                    boxShadow: added ? "0 0 10px rgba(22, 163, 74, 0.5)" : "0 2px 8px rgba(0, 0, 0, 0.4)",
                    transition: "all 0.22s ease",
                  }}
                >
                  {added ? (
                    <>
                      <span>✓</span>
                      <span>¡Agregado!</span>
                    </>
                  ) : (
                    <>
                      <span style={{ color: "#FFD700", fontSize: "1rem" }}>🛒</span>
                      <span>Añadir al carrito</span>
                    </>
                  )}
                </button>
              </div>

              {/* WhatsApp */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #25D366",
                  color: "#25D366",
                  textDecoration: "none",
                  fontWeight: "bold",
                  fontSize: "0.85rem",
                }}
              >
                💬 Comprar por WhatsApp (+57 310 873 7354)
              </a>
            </div>
          </div>

          {/* Ficha Técnica Detallada */}
          <div style={{ background: "#0a0a0a", borderRadius: "12px", border: "1px solid #222", overflow: "hidden" }}>
            <div style={{ display: "flex", borderBottom: "1px solid #222", background: "#111" }}>
              <button
                onClick={() => setActiveTab("specs")}
                style={{
                  padding: "12px 20px",
                  background: activeTab === "specs" ? "#0a0a0a" : "transparent",
                  color: activeTab === "specs" ? "var(--primary-color)" : "#888",
                  border: "none",
                  borderBottom: activeTab === "specs" ? "2px solid var(--primary-color)" : "none",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontSize: "0.88rem",
                }}
              >
                ⚙️ Ficha Técnica & Especificaciones OEM
              </button>
              <button
                onClick={() => setActiveTab("shipping")}
                style={{
                  padding: "12px 20px",
                  background: activeTab === "shipping" ? "#0a0a0a" : "transparent",
                  color: activeTab === "shipping" ? "var(--primary-color)" : "#888",
                  border: "none",
                  borderBottom: activeTab === "shipping" ? "2px solid var(--primary-color)" : "none",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontSize: "0.88rem",
                }}
              >
                🚚 Envíos y Garantía
              </button>
            </div>

            <div style={{ padding: "16px 20px" }}>
              {activeTab === "specs" && (
                <div>
                  <h4 style={{ color: "#fff", marginBottom: "12px", fontSize: "0.95rem" }}>
                    Ficha Técnica Oficial de {currentProduct.name}
                  </h4>
                  {currentProduct.attributes && currentProduct.attributes.length > 0 ? (
                    <table style={{ width: "100%", borderCollapse: "collapse", color: "#ccc", fontSize: "0.85rem" }}>
                      <tbody>
                        {currentProduct.attributes.map((attr) => (
                          <tr key={attr.id} style={{ borderBottom: "1px solid #1a1a1a" }}>
                            <td style={{ padding: "8px 12px", fontWeight: "bold", color: "var(--primary-color)", width: "35%" }}>
                              {attr.name}:
                            </td>
                            <td style={{ padding: "8px 12px" }}>{attr.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p style={{ color: "#888", fontSize: "0.85rem" }}>
                      Producto certificado 100% original. Especificaciones de fábrica garantizadas para repuestos y lubricación.
                    </p>
                  )}
                </div>
              )}

              {activeTab === "shipping" && (
                <div style={{ color: "#aaa", fontSize: "0.85rem", display: "flex", flexDirection: "column", gap: "8px" }}>
                  <p>📍 <strong>Despacho Local:</strong> Entregas en Barrancabermeja y zonas industriales el mismo día.</p>
                  <p>🚚 <strong>Envíos Nacionales:</strong> Despachos diarios a toda Colombia por Interrapidísimo, Envía y Servientrega.</p>
                  <p>🛡️ <strong>Garantía:</strong> Repuesto 100% sellado de fábrica con garantía de encaje y calidad.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Modal con Botón Volver y Navegación Inferior */}
        <div
          style={{
            padding: "12px 16px",
            background: "#080808",
            borderTop: "1px solid #222",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={onClose}
            style={{
              background: "#222",
              color: "#fff",
              border: "1px solid #444",
              borderRadius: "8px",
              padding: "7px 16px",
              cursor: "pointer",
              fontWeight: "700",
              fontSize: "0.85rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            ✕ Cerrar y volver al catálogo
          </button>

          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button
              onClick={handlePrev}
              style={{
                background: "#1c1c1c",
                color: "#ccc",
                border: "1px solid #333",
                borderRadius: "6px",
                padding: "6px 12px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "0.82rem",
              }}
            >
              ◄ Anterior
            </button>
            <button
              onClick={handleNext}
              style={{
                background: "var(--primary-color)",
                color: "#000",
                border: "none",
                borderRadius: "6px",
                padding: "6px 14px",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "0.82rem",
              }}
            >
              Siguiente ►
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
