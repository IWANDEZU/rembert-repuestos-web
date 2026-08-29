"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useCart } from "@/components/CartContext";
import Image from "next/image";
import { getProductDisplayImage } from "@/lib/productImage";
import { generateWhatsAppProductText, getWhatsAppUrl } from "@/lib/orderFormatter";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import ProductCompatibilityPanel from "@/components/ProductCompatibilityPanel";
import { getProductReferenceLabel } from "@/lib/productCompatibility";

const getMainImage = (product) => getProductDisplayImage(product);
const getFirstVariant = (product) => product?.variants?.[0] || null;

export default function CategoryProductModal({ products, initialIndex = 0, onClose }) {
  const initialProduct = products && products.length > 0 ? products[initialIndex] : null;
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [activeTab, setActiveTab] = useState("specs");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [isZoom, setIsZoom] = useState(false);
  const closeButtonRef = useRef(null);

  const { addToCart } = useCart();

  const currentProduct = products && products.length > 0 ? products[currentIndex] : null;
  const referenceLabel = getProductReferenceLabel(currentProduct);
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

  const handleClose = useCallback(() => {
    if (typeof window !== "undefined" && window.history.state?.modalOpen) {
      window.history.back();
    } else {
      onClose();
    }
  }, [onClose]);

  // Escuchar Teclado (←, →, ESC), Bloqueo de Scroll y Retroceso en Móvil (Botón Atrás del Navegador)
  useEffect(() => {
    const previouslyFocused = document.activeElement;
    // 1. Manejo de botón 'Atrás' nativo en celular (Android / iOS)
    window.history.pushState({ modalOpen: true }, "");
    const handlePopState = () => {
      onClose();
    };
    window.addEventListener("popstate", handlePopState);

    // 2. Bloquear scroll del fondo mientras el modal está abierto
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    // 3. Atajos de Teclado
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
      previouslyFocused?.focus?.();
    };
  }, [handleNext, handlePrev, handleClose, onClose]);

  if (!currentProduct) return null;

  const currentPrice = selectedVariant ? (selectedVariant.price || currentProduct.price) : currentProduct.price;
  const currentStock = selectedVariant ? (selectedVariant.stock ?? 0) : (currentProduct.stock ?? 0);
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
        stock: currentStock,
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
      onClick={handleClose}
      role="presentation"
    >
      {/* Contenedor Modal de Ampliación */}
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "980px",
          maxHeight: "94vh",
          background: "#141414",
          border: "1px solid #333",
          borderRadius: "16px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.95)",
        }}
      >
        {/* Cabecera del Modal con Navegación Compacta en 1 Sola Línea */}
        <div
          style={{
            padding: "10px 14px",
            background: "#0a0a0a",
            borderBottom: "1px solid #262626",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "8px",
            flexWrap: "nowrap",
            flexShrink: 0,
          }}
        >
          {/* Botón Volver / Cerrar Rápido */}
          <button
            ref={closeButtonRef}
            type="button"
            onClick={handleClose}
            aria-label="Volver al catálogo"
            style={{
              background: "#E52421",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "8px",
              padding: "6px 12px",
              cursor: "pointer",
              fontWeight: "800",
              fontSize: "clamp(0.75rem, 2vw, 0.84rem)",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              boxShadow: "0 2px 8px rgba(229, 36, 33, 0.4)",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}
          >
            ← VOLVER
          </button>

          {/* Categoría y Contador de Posición */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", minWidth: 0, overflow: "hidden" }}>
            <span
              style={{
                background: "var(--primary-color)",
                color: "#000",
                fontSize: "clamp(0.68rem, 1.8vw, 0.74rem)",
                fontWeight: "800",
                padding: "3px 8px",
                borderRadius: "6px",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "140px",
              }}
            >
              {categoryName}
            </span>
            <span style={{ color: "#aaa", fontSize: "0.78rem", whiteSpace: "nowrap" }}>
              <strong>{currentIndex + 1}</strong>/<strong style={{ color: "#fff" }}>{products.length}</strong>
            </span>
          </div>

          {/* Botones de Navegación (◄, ►, ✕) */}
          <div style={{ display: "flex", alignItems: "center", gap: "5px", flexShrink: 0 }}>
            <button
              type="button"
              onClick={handlePrev}
              title="Producto Anterior (Flecha Izquierda)"
              aria-label="Producto anterior"
              style={{
                background: "#222",
                color: "#fff",
                border: "1px solid #444",
                borderRadius: "6px",
                padding: "5px 8px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "0.82rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: "28px",
                height: "30px",
              }}
            >
              ◄
            </button>
            <button
              type="button"
              onClick={handleNext}
              title="Producto Siguiente (Flecha Derecha)"
              aria-label="Producto siguiente"
              style={{
                background: "var(--primary-color)",
                color: "#000",
                border: "none",
                borderRadius: "6px",
                padding: "5px 8px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "0.82rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: "28px",
                height: "30px",
              }}
            >
              ►
            </button>
            <button
              type="button"
              onClick={handleClose}
              title="Cerrar (Esc)"
              aria-label="Cerrar ficha ampliada"
              style={{
                background: "#2a2a2a",
                color: "#fff",
                border: "1px solid #444",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "0.9rem",
                marginLeft: "2px",
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Cuerpo del Modal (Scrollable) */}
        <div
          style={{
            padding: "clamp(12px, 2.5vw, 20px)",
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {/* Grid Principal (Imagen + Detalles) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
              gap: "16px",
            }}
          >
            {/* Galería de Fotos */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: "12px",
                  padding: "14px",
                  height: "clamp(200px, 42vw, 300px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #E2E8F0",
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
                <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
                  {galleryImages.map((imgUrl, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setSelectedImage(imgUrl)}
                      style={{
                        width: "56px",
                        height: "56px",
                        borderRadius: "6px",
                        background: "#FFFFFF",
                        border: selectedImage === imgUrl ? "2px solid var(--primary-color)" : "1px solid #CBD5E1",
                        padding: "3px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Image
                        src={imgUrl}
                        alt={`Vista ${idx + 1} de ${currentProduct.name}`}
                        width={50}
                        height={50}
                        unoptimized={imgUrl.startsWith("/api/imagen-referencia")}
                        style={{ width: "100%", height: "100%", objectFit: "contain" }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Información del Producto y Compra */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                <span style={{ color: "var(--primary-color)", fontWeight: "800", fontSize: "0.80rem", letterSpacing: "0.5px", textTransform: "uppercase" }}>
                  {brandName}
                </span>
                <span style={{ color: "#666" }}>•</span>
                <span className="product-reference" style={{ fontSize: "0.74rem", padding: "0.15rem 0.55rem" }}>
                  {referenceLabel}: {currentProduct.sku || currentProduct.id.slice(-8)}
                </span>
              </div>

              <h2
                id="product-modal-title"
                style={{
                  fontSize: "clamp(1.15rem, 3.5vw, 1.5rem)",
                  color: "#FFFFFF",
                  lineHeight: "1.25",
                  margin: 0,
                  overflowWrap: "anywhere",
                  textWrap: "balance",
                }}
              >
                {currentProduct.name}
              </h2>

              {/* Precio y Estado de Existencia */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "clamp(1.3rem, 4vw, 1.75rem)", fontWeight: "900", color: "var(--primary-color)" }}>
                  {currentPrice > 0
                    ? new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(currentPrice)
                    : "Precio bajo cotización"}
                </span>
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: "20px",
                    fontSize: "0.76rem",
                    fontWeight: "700",
                    background: canBuy ? "rgba(76, 175, 80, 0.15)" : "rgba(255, 107, 0, 0.12)",
                    color: canBuy ? "#4caf50" : "var(--primary-color)",
                    border: `1px solid ${canBuy ? "#2e7d32" : "var(--primary-color)"}`,
                  }}
                >
                  {canBuy ? `✓ En stock (${currentStock})` : "Disponibilidad por confirmar"}
                </span>
              </div>

              {currentProduct.description && (
                <p style={{ color: "#CBD5E1", fontSize: "0.88rem", lineHeight: "1.45", margin: 0 }}>
                  {currentProduct.description}
                </p>
              )}

              <ProductCompatibilityPanel product={currentProduct} dark compact />

              {/* Selector de Presentación / Variantes */}
              {currentProduct.variants && currentProduct.variants.length > 0 && (
                <div>
                  <label style={{ fontSize: "0.78rem", textTransform: "uppercase", color: "#94A3B8", display: "block", marginBottom: "5px", fontWeight: "700" }}>
                    Selecciona Presentación / Empaque:
                  </label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {currentProduct.variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        style={{
                          background: selectedVariant?.id === v.id ? "var(--primary-color)" : "#1f1f1f",
                          color: selectedVariant?.id === v.id ? "#000" : "#fff",
                          border: `1px solid ${selectedVariant?.id === v.id ? "var(--primary-color)" : "#333"}`,
                          padding: "6px 10px",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "0.80rem",
                          fontWeight: "bold",
                        }}
                      >
                        {v.name} {v.price ? `- $${v.price.toLocaleString("es-CO")}` : ""}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Botones de Acción (Cantidad + Añadir al Carrito) */}
              <div style={{ display: "flex", gap: "8px", marginTop: "auto", paddingTop: "8px", flexWrap: "wrap" }}>
                <div style={{ display: "flex", border: "1px solid #333", borderRadius: "8px", overflow: "hidden", background: "#111", height: "44px" }}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    type="button"
                    aria-label="Reducir cantidad"
                    style={{ background: "transparent", color: "#fff", border: "none", padding: "0 12px", cursor: "pointer", fontSize: "1.1rem", fontWeight: "bold" }}
                  >
                    -
                  </button>
                  <span style={{ padding: "0 10px", color: "#fff", fontWeight: "bold", display: "flex", alignItems: "center", minWidth: "32px", justifyContent: "center" }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(currentStock || 99, quantity + 1))}
                    type="button"
                    aria-label="Aumentar cantidad"
                    disabled={quantity >= currentStock && canBuy}
                    style={{ background: "transparent", color: "#fff", border: "none", padding: "0 12px", cursor: "pointer", fontSize: "1.1rem", fontWeight: "bold" }}
                  >
                    +
                  </button>
                </div>

                {canBuy ? (
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="btn-add-to-cart"
                    style={{
                      flex: 1,
                      minWidth: "140px",
                      height: "44px",
                      padding: "0 14px",
                      fontWeight: "800",
                      fontSize: "0.88rem",
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
                    {added ? <><span>✓</span><span>¡Agregado!</span></> : <><span>🛒</span><span>Añadir al carrito</span></>}
                  </button>
                ) : (
                  <div
                    className="product-card__quote-notice product-card__quote-notice--dark"
                    style={{ flex: 1, minWidth: "140px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 10px", fontSize: "0.78rem" }}
                  >
                    Validamos referencia y precio antes de vender
                  </div>
                )}
              </div>

              {/* Botón WhatsApp */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  height: "44px",
                  padding: "0 14px",
                  borderRadius: "8px",
                  border: "1.5px solid #25D366",
                  background: "rgba(37, 211, 102, 0.08)",
                  color: "#25D366",
                  textDecoration: "none",
                  fontWeight: "bold",
                  fontSize: "0.86rem",
                  boxShadow: "0 2px 8px rgba(37, 211, 102, 0.2)",
                  transition: "background 0.2s ease",
                }}
              >
                <WhatsAppIcon size={18} color="#25D366" />
                <span>Cotizar por WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Ficha Técnica Detallada y Pestañas */}
          <div style={{ background: "#0a0a0a", borderRadius: "12px", border: "1px solid #222", overflow: "hidden" }}>
            <div style={{ display: "flex", borderBottom: "1px solid #222", background: "#111", overflowX: "auto" }}>
              <button
                type="button"
                onClick={() => setActiveTab("specs")}
                style={{
                  padding: "10px 16px",
                  background: activeTab === "specs" ? "#0a0a0a" : "transparent",
                  color: activeTab === "specs" ? "var(--primary-color)" : "#888",
                  border: "none",
                  borderBottom: activeTab === "specs" ? "2px solid var(--primary-color)" : "none",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontSize: "0.84rem",
                  whiteSpace: "nowrap",
                }}
              >
                ⚙️ Ficha Técnica & Especificaciones
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("shipping")}
                style={{
                  padding: "10px 16px",
                  background: activeTab === "shipping" ? "#0a0a0a" : "transparent",
                  color: activeTab === "shipping" ? "var(--primary-color)" : "#888",
                  border: "none",
                  borderBottom: activeTab === "shipping" ? "2px solid var(--primary-color)" : "none",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontSize: "0.84rem",
                  whiteSpace: "nowrap",
                }}
              >
                🚚 Envíos y Garantía
              </button>
            </div>

            <div style={{ padding: "12px 16px" }}>
              {activeTab === "specs" && (
                <div>
                  <h4 style={{ color: "#fff", marginBottom: "10px", fontSize: "0.88rem", fontWeight: "700" }}>
                    Especificaciones de {currentProduct.name}
                  </h4>
                  <table style={{ width: "100%", borderCollapse: "collapse", color: "#ccc", fontSize: "0.82rem" }}>
                    <tbody>
                      <tr style={{ borderBottom: "1px solid #1a1a1a" }}>
                        <td style={{ padding: "7px 10px", fontWeight: "bold", color: "var(--primary-color)", width: "36%", minWidth: "90px", verticalAlign: "top" }}>
                          Marca:
                        </td>
                        <td style={{ padding: "7px 10px", color: "#E2E8F0" }}>{brandName}</td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid #1a1a1a" }}>
                        <td style={{ padding: "7px 10px", fontWeight: "bold", color: "var(--primary-color)", verticalAlign: "top" }}>
                          Categoría:
                        </td>
                        <td style={{ padding: "7px 10px", color: "#E2E8F0" }}>{categoryName}</td>
                      </tr>
                      {currentProduct.sku && (
                        <tr style={{ borderBottom: "1px solid #1a1a1a" }}>
                          <td style={{ padding: "7px 10px", fontWeight: "bold", color: "var(--primary-color)", verticalAlign: "top" }}>
                            Referencia:
                          </td>
                          <td style={{ padding: "7px 10px", color: "#E2E8F0", fontFamily: "monospace" }}>
                            {currentProduct.sku}
                          </td>
                        </tr>
                      )}
                      {currentProduct.attributes && currentProduct.attributes.length > 0 ? (
                        currentProduct.attributes.map((attr) => (
                          <tr key={attr.id || attr.name} style={{ borderBottom: "1px solid #1a1a1a" }}>
                            <td style={{ padding: "7px 10px", fontWeight: "bold", color: "var(--primary-color)", verticalAlign: "top" }}>
                              {attr.name}:
                            </td>
                            <td style={{ padding: "7px 10px", color: "#E2E8F0", overflowWrap: "anywhere", wordBreak: "break-word" }}>
                              {attr.value}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr style={{ borderBottom: "1px solid #1a1a1a" }}>
                          <td style={{ padding: "7px 10px", fontWeight: "bold", color: "var(--primary-color)", verticalAlign: "top" }}>
                            Calidad:
                          </td>
                          <td style={{ padding: "7px 10px", color: "#E2E8F0" }}>
                            Repuesto certificado con garantía y ajuste garantizado.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === "shipping" && (
                <div style={{ color: "#aaa", fontSize: "0.82rem", display: "flex", flexDirection: "column", gap: "8px" }}>
                  <p style={{ margin: 0 }}>📍 <strong>Despacho Local:</strong> Entregas en Barrancabermeja y zonas industriales el mismo día.</p>
                  <p style={{ margin: 0 }}>🚚 <strong>Envíos Nacionales:</strong> Despachos diarios a toda Colombia por transportadora aliada.</p>
                  <p style={{ margin: 0 }}>🛡️ <strong>Garantía:</strong> Producto nuevo y sellado con respaldo técnico oficial.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Modal con Botón Volver y Navegación Inferior */}
        <div
          style={{
            padding: "10px 14px",
            background: "#080808",
            borderTop: "1px solid #222",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "8px",
            flexWrap: "nowrap",
            flexShrink: 0,
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "#222",
              color: "#fff",
              border: "1px solid #444",
              borderRadius: "6px",
              padding: "6px 12px",
              cursor: "pointer",
              fontWeight: "700",
              fontSize: "clamp(0.74rem, 2vw, 0.82rem)",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              whiteSpace: "nowrap",
            }}
          >
            ✕ Cerrar
          </button>

          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <button
              type="button"
              onClick={handlePrev}
              style={{
                background: "#1c1c1c",
                color: "#ccc",
                border: "1px solid #333",
                borderRadius: "6px",
                padding: "6px 10px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "0.78rem",
                whiteSpace: "nowrap",
              }}
            >
              ◄ Anterior
            </button>
            <button
              type="button"
              onClick={handleNext}
              style={{
                background: "var(--primary-color)",
                color: "#000",
                border: "none",
                borderRadius: "6px",
                padding: "6px 12px",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "0.78rem",
                whiteSpace: "nowrap",
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
