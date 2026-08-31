"use client";

import { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { VEHICLE_MAKES } from "@/lib/vehicleIndex";
import { buildCatalogHref } from "@/lib/catalogUtils";

const POPULAR_QUICK_VEHICLES = [
  { make: "chevrolet", model: "sail", label: "Chevrolet Sail", icon: "🚗" },
  { make: "renault", model: "duster", label: "Renault Duster", icon: "🚙" },
  { make: "toyota", model: "hilux", label: "Toyota Hilux", icon: "🛻" },
  { make: "kia", model: "picanto", label: "Kia Picanto", icon: "🚗" },
  { make: "mazda", model: "mazda-2", label: "Mazda 2", icon: "🚗" },
  { make: "hyundai", model: "tucson", label: "Hyundai Tucson", icon: "🚙" },
  { make: "chevrolet", model: "spark-gt", label: "Spark GT", icon: "🚗" },
  { make: "renault", model: "sandero", label: "Renault Sandero", icon: "🚗" },
];

export default function VehicleFilterSelector({
  activeMake,
  activeModel,
  activeVehicle,
  categoryParam,
  brandParam,
  tipoParam,
  lineParam,
  sortParam,
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [selectedMake, setSelectedMake] = useState(activeMake || "");
  const [selectedModel, setSelectedModel] = useState(activeModel || "");

  // Modelos dinámicos según la marca seleccionada
  const availableModels = useMemo(() => {
    if (!selectedMake) return [];
    const makeObj = VEHICLE_MAKES.find((m) => m.slug === selectedMake);
    return makeObj ? makeObj.models : [];
  }, [selectedMake]);

  const handleMakeChange = (e) => {
    const newMake = e.target.value;
    setSelectedMake(newMake);
    setSelectedModel(""); // Reset model when make changes
  };

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
  };

  const handleApplyFilter = (e) => {
    if (e) e.preventDefault();
    startTransition(() => {
      const href = buildCatalogHref({
        category: categoryParam,
        brand: brandParam,
        tipo: tipoParam,
        line: lineParam,
        make: selectedMake || undefined,
        model: selectedModel || undefined,
        vehicle: (!selectedMake && !selectedModel && activeVehicle) ? activeVehicle : undefined,
        sort: sortParam,
      });
      router.push(href);
    });
  };

  const handleQuickVehicleClick = (make, model) => {
    setSelectedMake(make);
    setSelectedModel(model);
    startTransition(() => {
      const href = buildCatalogHref({
        category: categoryParam,
        brand: brandParam,
        tipo: tipoParam,
        line: lineParam,
        make,
        model,
        sort: sortParam,
      });
      router.push(href);
    });
  };

  const handleClearVehicle = () => {
    setSelectedMake("");
    setSelectedModel("");
    startTransition(() => {
      const href = buildCatalogHref({
        category: categoryParam,
        brand: brandParam,
        tipo: tipoParam,
        line: lineParam,
        sort: sortParam,
      });
      router.push(href);
    });
  };

  const hasActiveVehicle = Boolean(activeMake || activeModel || activeVehicle);
  const currentMakeObj = VEHICLE_MAKES.find((m) => m.slug === activeMake);
  const currentModelObj = currentMakeObj?.models?.find((m) => m.slug === activeModel);

  return (
    <div className="vehicle-filter-box" style={{
      background: "#FFFFFF",
      borderRadius: "14px",
      padding: "clamp(1rem, 2.5vw, 1.35rem) clamp(1rem, 3vw, 1.5rem)",
      marginBottom: "1.75rem",
      border: "1px solid #E2E8F0",
      boxShadow: "0 4px 18px rgba(0, 0, 0, 0.05)",
      color: "#111827",
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "0.75rem",
        marginBottom: "1rem",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <span style={{ fontSize: "1.4rem", lineHeight: 1 }}>🚘</span>
          <div>
            <h3 style={{
              margin: 0,
              fontSize: "1.05rem",
              fontWeight: "900",
              color: "#111827",
              letterSpacing: "0.2px",
              textTransform: "uppercase",
            }}>
              Filtrar Repuestos por Vehículo
            </h3>
            <p style={{ margin: "2px 0 0", fontSize: "0.84rem", color: "#6B7280" }}>
              Encuentra repuestos compatibles seleccionando la marca y modelo de tu auto
            </p>
          </div>
        </div>

        {hasActiveVehicle && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{
              background: "#FEF3C7",
              color: "#92400E",
              padding: "0.3rem 0.75rem",
              borderRadius: "20px",
              fontSize: "0.82rem",
              fontWeight: "700",
              border: "1px solid #FCD34D",
            }}>
              Filtrado por: {currentMakeObj?.name || activeMake} {currentModelObj?.name || activeModel || activeVehicle}
            </span>
            <button
              type="button"
              onClick={handleClearVehicle}
              style={{
                background: "#F3F4F6",
                border: "1px solid #D1D5DB",
                color: "#4B5563",
                padding: "0.3rem 0.65rem",
                borderRadius: "20px",
                fontSize: "0.78rem",
                cursor: "pointer",
                fontWeight: "600",
                transition: "all 0.2s",
              }}
              title="Quitar filtro de auto"
            >
              ✕ Quitar
            </button>
          </div>
        )}
      </div>

      {/* Selectores de Marca y Modelo */}
      <form onSubmit={handleApplyFilter} className="vehicle-filter-form" style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.65rem",
        alignItems: "stretch",
      }}>
        {/* Selector de Marca */}
        <div style={{ flex: "1 1 min(100%, 180px)", position: "relative" }}>
          <label htmlFor="vehicle-make-select" style={{ display: "none" }}>Marca de Auto</label>
          <select
            id="vehicle-make-select"
            value={selectedMake}
            onChange={handleMakeChange}
            style={{
              width: "100%",
              height: "42px",
              padding: "0 0.9rem",
              borderRadius: "8px",
              background: "#F9FAFB",
              color: "#111827",
              border: "1.5px solid #D1D5DB",
              fontSize: "0.88rem",
              fontWeight: "600",
              cursor: "pointer",
              outline: "none",
            }}
          >
            <option value="">Todas las marcas de auto...</option>
            {VEHICLE_MAKES.map((make) => (
              <option key={make.slug} value={make.slug}>
                {make.name} {make.popular ? "⭐" : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Selector de Modelo */}
        <div style={{ flex: "1 1 min(100%, 180px)", position: "relative" }}>
          <label htmlFor="vehicle-model-select" style={{ display: "none" }}>Modelo de Auto</label>
          <select
            id="vehicle-model-select"
            value={selectedModel}
            onChange={handleModelChange}
            disabled={!selectedMake}
            style={{
              width: "100%",
              height: "42px",
              padding: "0 0.9rem",
              borderRadius: "8px",
              background: selectedMake ? "#F9FAFB" : "#F3F4F6",
              color: selectedMake ? "#111827" : "#9CA3AF",
              border: "1.5px solid #D1D5DB",
              fontSize: "0.88rem",
              fontWeight: "600",
              cursor: selectedMake ? "pointer" : "not-allowed",
              outline: "none",
            }}
          >
            <option value="">
              {selectedMake ? "Todos los modelos..." : "Selecciona marca primero"}
            </option>
            {availableModels.map((model) => (
              <option key={model.slug} value={model.slug}>
                {model.name}
              </option>
            ))}
          </select>
        </div>

        {/* Botón Aplicar */}
        <div style={{ display: "flex", gap: "0.5rem", flex: "1 1 min(100%, 140px)" }}>
          <button
            type="submit"
            disabled={isPending}
            style={{
              flex: "1 1 auto",
              minHeight: "42px",
              background: "linear-gradient(135deg, #FFD700 0%, #E6B800 100%)",
              color: "#111111",
              border: "none",
              borderRadius: "8px",
              padding: "0 1.25rem",
              fontSize: "0.88rem",
              fontWeight: "900",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.4rem",
              whiteSpace: "nowrap",
              boxShadow: "0 2px 8px rgba(230, 184, 0, 0.35)",
              opacity: isPending ? 0.7 : 1,
            }}
          >
            <span>{isPending ? "Buscando..." : "🔍 Filtrar Auto"}</span>
          </button>

          {hasActiveVehicle && (
            <button
              type="button"
              onClick={handleClearVehicle}
              style={{
                minHeight: "42px",
                background: "#F3F4F6",
                color: "#374151",
                border: "1px solid #D1D5DB",
                borderRadius: "8px",
                padding: "0 0.9rem",
                fontSize: "0.85rem",
                fontWeight: "600",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Limpiar
            </button>
          )}
        </div>
      </form>

      {/* Chips Rápidos de Autos Populares */}
      <div style={{
        marginTop: "1rem",
        paddingTop: "0.85rem",
        borderTop: "1px solid #E5E7EB",
        display: "flex",
        alignItems: "center",
        gap: "0.45rem",
        flexWrap: "wrap",
      }}>
        <span style={{ fontSize: "0.80rem", color: "#4B5563", fontWeight: "700", marginRight: "0.2rem" }}>
          Vehículos populares:
        </span>
        {POPULAR_QUICK_VEHICLES.map((v) => {
          const isActive = activeMake === v.make && activeModel === v.model;
          return (
            <button
              key={`${v.make}-${v.model}`}
              type="button"
              onClick={() => handleQuickVehicleClick(v.make, v.model)}
              style={{
                background: isActive ? "#FFD700" : "#F3F4F6",
                color: isActive ? "#111111" : "#374151",
                border: isActive ? "1px solid #D4A000" : "1px solid #E5E7EB",
                borderRadius: "16px",
                padding: "0.28rem 0.7rem",
                fontSize: "0.78rem",
                fontWeight: isActive ? "800" : "600",
                cursor: "pointer",
                transition: "all 0.15s ease",
                boxShadow: isActive ? "0 2px 6px rgba(212, 160, 0, 0.25)" : "none",
              }}
            >
              <span>{v.icon}</span> {v.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
