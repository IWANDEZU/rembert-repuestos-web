"use client";

import { useState } from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";
import CategoryProductModal from "./CategoryProductModal";

export default function CatalogGridWithModal({ products, favoriteProductIds = [] }) {
  const [modalIndex, setModalIndex] = useState(null);

  const handleOpenModal = (index) => {
    setModalIndex(index);
  };

  const handleCloseModal = () => {
    setModalIndex(null);
  };

  if (!products || products.length === 0) {
    return (
      <div
        style={{
          padding: "50px 20px",
          textAlign: "center",
          color: "#888",
          border: "1px solid var(--border-color)",
          borderRadius: "12px",
          background: "var(--card-dark)",
        }}
      >
        <span style={{ fontSize: "3rem", display: "block", marginBottom: "1rem" }}>🔍</span>
        <h3>No se encontraron productos para esta categoría o filtro.</h3>
        <p style={{ fontSize: "0.9rem", color: "#aaa", marginTop: "0.5rem" }}>
          Intenta seleccionar otra categoría o limpiar los filtros activos.
        </p>
        <Link
          href="/catalogo"
          className="btn btn--primary"
          style={{ marginTop: "1.5rem", display: "inline-block" }}
        >
          Ver Todos los Productos
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Grid de Productos con Opción de Ampliación / Ficha Técnica */}
      <div
        className="catalog-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {products.map((product, idx) => (
          <div key={product.id} className="catalog-grid__item">
            <ProductCard 
              product={product} 
              onExpand={() => handleOpenModal(idx)} 
              isFavorite={favoriteProductIds.includes(product.id)}
            />
          </div>
        ))}
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
