"use client";

import { useState, useTransition, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
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
      background: "linear-gradient(135deg, #16181D 0%, #0F1015 100%)",
      borderRadius: "14px",
      padding: "1.25rem 1.5rem",
      marginBottom: "1.75rem",
      border: "1px solid rgba(255, 215, 0, 0.22)",
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.28)",
      color: "#FFFFFF",
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
              fontWeight: "800",
              color: "#FFD700",
              letterSpacing: "0.3px",
              textTransform: "uppercase",
            }}>
              Filtrar Repuestos por Vehículo
            </h3>
            <p style={{ margin: 0, fontSize: "0.82rem", color: "#A0AEC0" }}>
              Encuentra repuestos compatibles seleccionando la marca y modelo de tu auto
            </p>
          </div>
        </div>

        {hasActiveVehicle && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{
              background: "rgba(255, 215, 0, 0.15)",
              color: "#FFD700",
              padding: "0.3rem 0.75rem",
              borderRadius: "20px",
              fontSize: "0.82rem",
              fontWeight: "700",
              border: "1px solid rgba(255, 215, 0, 0.35)",
            }}>
              Filtrado por: {currentMakeObj?.name || activeMake} {currentModelObj?.name || activeModel || activeVehicle}
            </span>
            <button
              type="button"
              onClick={handleClearVehicle}
              style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#CBD5E0",
                padding: "0.3rem 0.65rem",
                borderRadius: "20px",
                fontSize: "0.78rem",
                cursor: "pointer",
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
      <form onSubmit={handleApplyFilter} style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr)) auto",
        gap: "0.75rem",
        alignItems: "center",
      }}>
        {/* Selector de Marca */}
        <div style={{ position: "relative" }}>
          <label htmlFor="vehicle-make-select" style={{ display: "none" }}>Marca de Auto</label>
          <select
            id="vehicle-make-select"
            value={selectedMake}
            onChange={handleMakeChange}
            style={{
              width: "100%",
              padding: "0.65rem 0.9rem",
              borderRadius: "8px",
              background: "#1E222B",
              color: "#FFFFFF",
              border: "1px solid #374151",
              fontSize: "0.9rem",
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
        <div style={{ position: "relative" }}>
          <label htmlFor="vehicle-model-select" style={{ display: "none" }}>Modelo de Auto</label>
          <select
            id="vehicle-model-select"
            value={selectedModel}
            onChange={handleModelChange}
            disabled={!selectedMake}
            style={{
              width: "100%",
              padding: "0.65rem 0.9rem",
              borderRadius: "8px",
              background: selectedMake ? "#1E222B" : "#14171E",
              color: selectedMake ? "#FFFFFF" : "#6B7280",
              border: "1px solid #374151",
              fontSize: "0.9rem",
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
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            type="submit"
            disabled={isPending}
            style={{
              background: "linear-gradient(135deg, #FFD700 0%, #D4A000 100%)",
              color: "#111111",
              border: "none",
              borderRadius: "8px",
              padding: "0.65rem 1.25rem",
              fontSize: "0.9rem",
              fontWeight: "800",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              whiteSpace: "nowrap",
              boxShadow: "0 2px 8px rgba(212, 160, 0, 0.35)",
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
                background: "rgba(255,255,255,0.08)",
                color: "#E2E8F0",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "8px",
                padding: "0.65rem 0.9rem",
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
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        display: "flex",
        alignItems: "center",
        gap: "0.4rem",
        flexWrap: "wrap",
      }}>
        <span style={{ fontSize: "0.78rem", color: "#A0AEC0", fontWeight: "700", marginRight: "0.2rem" }}>
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
                background: isActive ? "#FFD700" : "rgba(255, 255, 255, 0.06)",
                color: isActive ? "#111111" : "#E2E8F0",
                border: isActive ? "1px solid #FFD700" : "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "16px",
                padding: "0.25rem 0.65rem",
                fontSize: "0.78rem",
                fontWeight: isActive ? "800" : "600",
                cursor: "pointer",
                transition: "all 0.15s ease",
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
