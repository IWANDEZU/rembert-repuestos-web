"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";
import CategoryProductModal from "./CategoryProductModal";
import { useSession } from "@/components/AuthProvider";
import WhatsAppIcon from "./WhatsAppIcon";
import { getProductDisplayImage } from "@/lib/productImage";
import { useCatalogRealtime } from "@/hooks/useCatalogRealtime";

const POPULAR_SEARCH_SUGGESTIONS = [
  { label: "Filtros de Aceite", query: "filtro aceite" },
  { label: "Pastillas de Freno", query: "pastillas freno" },
  { label: "Amortiguadores", query: "amortiguador" },
  { label: "Bujías", query: "bujia" },
  { label: "Líquido de Frenos", query: "liquido frenos" },
  { label: "Radiadores", query: "radiador" },
  { label: "Kits de Distribución", query: "distribucion" },
  { label: "Embragues / Clutch", query: "embrague" },
];

export default function CatalogGridWithModal({ products, favoriteProductIds = [] }) {
  useCatalogRealtime();
  const [modalIndex, setModalIndex] = useState(null);
  const [favoriteIds, setFavoriteIds] = useState(favoriteProductIds);
  const { status } = useSession();
  const visibleFavoriteIds = status === "authenticated" ? favoriteIds : [];

  const imageCounts = useMemo(() => {
    const counts = new Map();
    if (!products) return counts;
    for (const p of products) {
      const img = getProductDisplayImage(p);
      counts.set(img, (counts.get(img) || 0) + 1);
    }
    return counts;
  }, [products]);

  useEffect(() => {
    if (status !== "authenticated") return;

    const controller = new AbortController();
    fetch("/api/favorites", { signal: controller.signal, cache: "no-store" })
      .then((response) => (response.ok ? response.json() : { productIds: [] }))
      .then((payload) => setFavoriteIds(Array.isArray(payload.productIds) ? payload.productIds : []))
      .catch((error) => {
        if (error.name !== "AbortError") console.error("No fue posible cargar favoritos", error);
      });
    return () => controller.abort();
  }, [status]);

  const handleOpenModal = (index) => {
    setModalIndex(index);
  };

  const handleCloseModal = () => {
    setModalIndex(null);
  };

  if (!products || products.length === 0) {
    const whatsappHelpUrl = "https://wa.me/573508299233?text=Hola%20Rembert%2C%20estoy%20buscando%20un%20repuesto%20que%20no%20encontr%C3%A9%20en%20el%20cat%C3%A1logo.%20Veh%C3%ADculo%3A%20___%20Repuesto%20o%20Referencia%3A%20___";

    return (
      <div
        style={{
          padding: "2.5rem 1.5rem",
          textAlign: "center",
          color: "#FFFFFF",
          border: "1px solid #262626",
          borderRadius: "12px",
          background: "#121212",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          maxWidth: "680px",
          margin: "1rem auto 2.5rem",
        }}
      >
        <div
          style={{
            width: "56px",
            height: "56px",
            background: "rgba(255, 215, 0, 0.12)",
            borderRadius: "50%",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.75rem",
            marginBottom: "1rem",
            border: "1px solid rgba(255, 215, 0, 0.3)",
          }}
        >
          🔍
        </div>
        <h3 style={{ fontSize: "1.25rem", fontWeight: "800", margin: "0 0 0.5rem", color: "#FFFFFF" }}>
          No encontramos repuestos que coincidan exactamente
        </h3>
        <p style={{ fontSize: "0.9rem", color: "#94A3B8", margin: "0 0 1.5rem", lineHeight: "1.5" }}>
          Verifica que la referencia o nombre esté bien escrito, o consulta directamente con un asesor técnico para confirmar disponibilidad en bodega.
        </p>

        {/* Búsquedas frecuentes sugeridas */}
        <div style={{ marginBottom: "1.75rem" }}>
          <p style={{ fontSize: "0.78rem", color: "#CBD5E1", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem" }}>
            Búsquedas sugeridas:
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center" }}>
            {POPULAR_SEARCH_SUGGESTIONS.map((item) => (
              <Link
                key={item.query}
                href={`/catalogo?search=${encodeURIComponent(item.query)}`}
                style={{
                  background: "#1E1E1E",
                  color: "#FFD700",
                  border: "1px solid rgba(255, 215, 0, 0.35)",
                  borderRadius: "20px",
                  padding: "0.35rem 0.85rem",
                  fontSize: "0.82rem",
                  fontWeight: "600",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Botones de acción */}
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/catalogo"
            className="btn btn--primary"
            style={{
              padding: "0.65rem 1.25rem",
              fontSize: "0.88rem",
              fontWeight: "800",
              borderRadius: "8px",
            }}
          >
            Ver todo el catálogo
          </Link>
          <a
            href={whatsappHelpUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
            style={{
              background: "#25D366",
              color: "#FFFFFF",
              padding: "0.65rem 1.25rem",
              fontSize: "0.88rem",
              fontWeight: "700",
              borderRadius: "8px",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              textDecoration: "none",
            }}
          >
            <WhatsAppIcon size={18} color="#FFFFFF" />
            <span>Consultar por WhatsApp</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Grid de Productos con Opción de Ampliación / Ficha Técnica */}
      <div className="catalog-grid">
        {products.map((product, idx) => {
          const imgUrl = getProductDisplayImage(product);
          const isRepeated = (imageCounts.get(imgUrl) || 0) > 1;

          return (
            <div key={product.id} className="catalog-grid__item">
              <ProductCard 
                product={product} 
                onExpand={() => handleOpenModal(idx)} 
                key={`${product.id}:${visibleFavoriteIds.includes(product.id)}`}
                isFavorite={visibleFavoriteIds.includes(product.id)}
                isRepeated={isRepeated}
              />
            </div>
          );
        })}
      </div>

      {/* Modal Interactivo de Ampliación con Navegación de Categoría (Anterior/Siguiente) */}
      {modalIndex !== null && (
        <CategoryProductModal
          products={products}
          initialIndex={modalIndex}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
