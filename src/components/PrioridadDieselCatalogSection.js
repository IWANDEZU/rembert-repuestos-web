"use client";

import { useState, useMemo, useEffect } from "react";
import { filterPrioridadDieselProducts } from "@/lib/prioridadDieselNormalizer";
import PrioridadDieselCard from "./PrioridadDieselCard";
import PrioridadDieselModal from "./PrioridadDieselModal";

export default function PrioridadDieselCatalogSection({ activeCategory }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todas");
  const [selectedBrand, setSelectedBrand] = useState("todas");
  const [selectedVehicle, setSelectedVehicle] = useState("todos");
  const [selectedPhotoStatus, setSelectedPhotoStatus] = useState("todos");

  const [modalIndex, setModalIndex] = useState(null);

  // Sincronizar categoría activa desde la navegación principal del catálogo
  useEffect(() => {
    let targetCategory = "todas";
    if (activeCategory === "filtros") {
      targetCategory = "filtros";
    } else if (activeCategory === "frenos-y-suspension") {
      targetCategory = "suspensión";
    }
    const timer = setTimeout(() => setSelectedCategory(targetCategory), 0);
    return () => clearTimeout(timer);
  }, [activeCategory]);

  const filteredProducts = useMemo(() => {
    // Si la categoría principal seleccionada en la web es "lubricantes" o "urea",
    // no mezclamos filtros ni amortiguadores de esta colección.
    if (activeCategory === "lubricantes" || activeCategory === "lubricantes-diesel" || activeCategory === "lubricantes-gasolina") {
      return [];
    }

    return filterPrioridadDieselProducts({
      query: searchQuery,
      category: activeCategory === "filtros" ? "filtros" : activeCategory === "frenos-y-suspension" ? "suspensión" : selectedCategory,
      brand: selectedBrand,
      vehicle: selectedVehicle,
      photoStatus: selectedPhotoStatus,
    });
  }, [searchQuery, selectedCategory, selectedBrand, selectedVehicle, selectedPhotoStatus, activeCategory]);

  if (activeCategory === "lubricantes" || activeCategory === "lubricantes-diesel" || activeCategory === "lubricantes-gasolina") {
    return null;
  }

  const handleOpenModal = (index) => {
    setModalIndex(index);
  };

  const handleCloseModal = () => {
    setModalIndex(null);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory(activeCategory === "filtros" ? "filtros" : activeCategory === "frenos-y-suspension" ? "suspensión" : "todas");
    setSelectedBrand("todas");
    setSelectedVehicle("todos");
    setSelectedPhotoStatus("todos");
  };

  return (
    <section
      id="coleccion-prioridad-diesel"
      style={{
        background: "var(--card-dark)",
        borderRadius: "var(--border-radius)",
        padding: "2rem",
        border: "1px solid var(--border-color)",
        marginBottom: "3rem",
      }}
    >
      {/* Banner / Header de la Colección */}
      <div style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "1.2rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.5rem" }}>
          <span style={{ fontSize: "1.8rem" }}>🛠️</span>
          <h2 style={{ fontSize: "1.8rem", color: "#fff", margin: 0 }}>
            {activeCategory === "filtros"
              ? "Colección: Filtros Diésel (Referencias Prioritarias)"
              : activeCategory === "frenos-y-suspension"
              ? "Colección: Suspensión Diésel (Amortiguadores y Struts)"
              : "Colección: Filtros y Suspensión Diésel"}
          </h2>
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", margin: 0 }}>
          {activeCategory === "filtros"
            ? "Mostrando exclusivamente filtros prioritarios MANN-FILTER de aceite, aire, combustible y cabina para Hilux, Fortuner, Ranger y Amarok."
            : activeCategory === "frenos-y-suspension"
            ? "Mostrando exclusivamente amortiguadores y struts Gabriel para Hilux, Fortuner, Ranger y Amarok."
            : "Referencias prioritarias para Hilux, Fortuner, Ranger, BT-50 y Amarok. Consulta especificaciones exactas, OE y cruces."}
        </p>
      </div>

      {/* Barra de Búsqueda y Filtros Interactivos */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "1.5rem",
          background: "#121212",
          padding: "1.2rem",
          borderRadius: "10px",
          border: "1px solid #282828",
        }}
      >
        {/* Búsqueda Libres */}
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={{ fontSize: "0.82rem", color: "#aaa", display: "block", marginBottom: "4px" }}>
            🔍 Buscar por Referencia, Código OE o Cruce:
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ejemplo: W 712/83, PU 9008 z, USA79356-A, 90915-YZZD2, AB39-9601-AB..."
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              background: "#1a1a1a",
              color: "#fff",
              border: "1px solid #444",
              borderRadius: "6px",
              fontSize: "0.95rem",
              outline: "none",
            }}
          />
        </div>

        {/* Filtro Categoría */}
        {!activeCategory && (
          <div>
            <label style={{ fontSize: "0.8rem", color: "#aaa", display: "block", marginBottom: "4px" }}>Categoría:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ width: "100%", padding: "0.6rem", background: "#1a1a1a", color: "#fff", border: "1px solid #444", borderRadius: "6px" }}
            >
              <option value="todas">📦 Todas las Categorías</option>
              <option value="filtros">🪛 Filtros</option>
              <option value="suspensión">🛑 Suspensión</option>
            </select>
          </div>
        )}

        {/* Filtro Marca */}
        <div>
          <label style={{ fontSize: "0.8rem", color: "#aaa", display: "block", marginBottom: "4px" }}>Marca:</label>
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            style={{ width: "100%", padding: "0.6rem", background: "#1a1a1a", color: "#fff", border: "1px solid #444", borderRadius: "6px" }}
          >
            <option value="todas">🏷️ Todas las Marcas</option>
            <option value="mann-filter">MANN-FILTER</option>
            <option value="gabriel">Gabriel</option>
          </select>
        </div>

        {/* Filtro Vehículo */}
        <div>
          <label style={{ fontSize: "0.8rem", color: "#aaa", display: "block", marginBottom: "4px" }}>Vehículo / Aplicación:</label>
          <select
            value={selectedVehicle}
            onChange={(e) => setSelectedVehicle(e.target.value)}
            style={{ width: "100%", padding: "0.6rem", background: "#1a1a1a", color: "#fff", border: "1px solid #444", borderRadius: "6px" }}
          >
            <option value="todos">🚗 Todos los Vehículos</option>
            <option value="hilux">Toyota Hilux / Fortuner</option>
            <option value="ranger">Ford Ranger / Mazda BT-50</option>
            <option value="amarok">Volkswagen Amarok</option>
          </select>
        </div>

        {/* Filtro Disponibilidad de Foto */}
        <div>
          <label style={{ fontSize: "0.8rem", color: "#aaa", display: "block", marginBottom: "4px" }}>Disponibilidad de Foto:</label>
          <select
            value={selectedPhotoStatus}
            onChange={(e) => setSelectedPhotoStatus(e.target.value)}
            style={{ width: "100%", padding: "0.6rem", background: "#1a1a1a", color: "#fff", border: "1px solid #444", borderRadius: "6px" }}
          >
            <option value="todos">🖼️ Todas las Fotografías</option>
            <option value="lista">✓ Con Foto Exacta</option>
            <option value="pendiente">📷 Foto Pendiente</option>
          </select>
        </div>
      </div>

      {/* Header Contador de Resultados */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem", color: "var(--text-muted)", fontSize: "0.9rem" }}>
        <span>
          Mostrando <strong style={{ color: "var(--primary-color)" }}>{filteredProducts.length}</strong> referencia(s) de {activeCategory === "filtros" ? "Filtros" : activeCategory === "frenos-y-suspension" ? "Suspensión" : "Filtros y Suspensión"}.
        </span>

        {(searchQuery || selectedBrand !== "todas" || selectedVehicle !== "todos" || selectedPhotoStatus !== "todos") && (
          <button
            onClick={handleResetFilters}
            style={{ background: "transparent", color: "var(--primary-color)", border: "1px solid var(--primary-color)", padding: "4px 10px", borderRadius: "6px", cursor: "pointer", fontSize: "0.8rem" }}
          >
            🧹 Limpiar Filtros
          </button>
        )}
      </div>

      {/* Grid de Productos */}
      {filteredProducts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem 1rem", background: "#121212", borderRadius: "10px", border: "1px solid #282828" }}>
          <span style={{ fontSize: "3rem", display: "block", marginBottom: "1rem" }}>🔍</span>
          <h3 style={{ color: "#fff" }}>No se encontraron referencias para esta sección.</h3>
          <button
            onClick={handleResetFilters}
            className="btn btn--primary"
            style={{ marginTop: "1rem" }}
          >
            Restablecer Filtros
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {filteredProducts.map((product, idx) => (
            <PrioridadDieselCard
              key={product.id}
              product={product}
              onSelect={() => handleOpenModal(idx)}
            />
          ))}
        </div>
      )}

      {/* Modal Ampliado */}
      {modalIndex !== null && (
        <PrioridadDieselModal
          products={filteredProducts}
          initialIndex={modalIndex}
          onClose={handleCloseModal}
        />
      )}
    </section>
  );
}
