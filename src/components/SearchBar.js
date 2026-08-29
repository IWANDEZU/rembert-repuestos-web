"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";

const STRUCTURED_SUGGESTIONS = [
  // Marcas de Repuestos y Fabricantes Líderes
  { text: "Verke Shock Absorber", type: "marca", label: "Marca" },
  { text: "Amortiguadores Gabriel", type: "marca", label: "Marca" },
  { text: "Filtros de aceite WIX", type: "marca", label: "Marca" },
  { text: "Filtros MANN-FILTER", type: "marca", label: "Marca" },
  { text: "Pastillas de freno Incolbest", type: "marca", label: "Marca" },
  { text: "Kit Embrague LuK", type: "marca", label: "Marca" },
  { text: "Kit Distribución Gates", type: "marca", label: "Marca" },
  { text: "Bujías Bosch", type: "marca", label: "Marca" },
  { text: "Silicona Victor Reinz Reinzosil", type: "marca", label: "Marca" },
  { text: "Bujías ACDelco", type: "marca", label: "Marca" },
  { text: "Rodamientos SKF", type: "marca", label: "Marca" },
  { text: "Suspensión TNK", type: "marca", label: "Marca" },
  { text: "Líquido de frenos Cofre", type: "marca", label: "Marca" },

  // Modelos de Vehículos Populares en Colombia
  { text: "Chevrolet Sail", type: "vehiculo", label: "Vehículo" },
  { text: "Chevrolet Spark GT", type: "vehiculo", label: "Vehículo" },
  { text: "Chevrolet Onix", type: "vehiculo", label: "Vehículo" },
  { text: "Chevrolet Tracker", type: "vehiculo", label: "Vehículo" },
  { text: "Chevrolet Aveo", type: "vehiculo", label: "Vehículo" },
  { text: "Chevrolet N200 / N300", type: "vehiculo", label: "Vehículo" },
  { text: "Chevrolet D-Max", type: "vehiculo", label: "Vehículo" },
  { text: "Renault Duster", type: "vehiculo", label: "Vehículo" },
  { text: "Renault Sandero / Logan", type: "vehiculo", label: "Vehículo" },
  { text: "Renault Stepway", type: "vehiculo", label: "Vehículo" },
  { text: "Renault Kwid", type: "vehiculo", label: "Vehículo" },
  { text: "Kia Picanto / Ion", type: "vehiculo", label: "Vehículo" },
  { text: "Kia Rio", type: "vehiculo", label: "Vehículo" },
  { text: "Kia Sportage Revolution", type: "vehiculo", label: "Vehículo" },
  { text: "Hyundai Tucson ix35", type: "vehiculo", label: "Vehículo" },
  { text: "Hyundai i10 / Grand i10", type: "vehiculo", label: "Vehículo" },
  { text: "Hyundai Accent", type: "vehiculo", label: "Vehículo" },
  { text: "Toyota Hilux", type: "vehiculo", label: "Vehículo" },
  { text: "Toyota Fortuner", type: "vehiculo", label: "Vehículo" },
  { text: "Toyota Corolla / Prado", type: "vehiculo", label: "Vehículo" },
  { text: "Mazda 2 / Mazda 3", type: "vehiculo", label: "Vehículo" },
  { text: "Mazda CX-30 / CX-5", type: "vehiculo", label: "Vehículo" },
  { text: "Ford Fiesta", type: "vehiculo", label: "Vehículo" },
  { text: "Ford Ranger", type: "vehiculo", label: "Vehículo" },
  { text: "Nissan March / Versa", type: "vehiculo", label: "Vehículo" },
  { text: "Volkswagen Gol / Amarok", type: "vehiculo", label: "Vehículo" },

  // Referencias OE y Códigos de Fabricante Populares
  { text: "54661-2S000", type: "referencia", label: "Ref. OE Amortiguador Tucson" },
  { text: "24512523", type: "referencia", label: "Ref. OE Rodamiento Clutch Sail" },
  { text: "24521039A", type: "referencia", label: "Ref. Balinera Sail / N200 / N300" },
  { text: "WL7570", type: "referencia", label: "Ref. Filtro Aceite WIX" },
  { text: "W 712/83", type: "referencia", label: "Ref. Filtro MANN Hilux Diésel" },
  { text: "PU 9008 z", type: "referencia", label: "Ref. Filtro Combustible Ranger" },
  { text: "USA79356-A", type: "referencia", label: "Ref. Strut Gabriel Hilux" },
  { text: "8888-D1661", type: "referencia", label: "Ref. Pastillas Freno Sail" },
  { text: "G707136", type: "referencia", label: "Ref. Amortiguador Duster" },
  { text: "Reinzosil 70ml", type: "referencia", label: "Ref. Sellante Alta Temp" },
  { text: "LF028", type: "referencia", label: "Ref. Líquido Frenos DOT 3" },

  // Líneas y Categorías Principales
  { text: "Amortiguadores delanteros y traseros", type: "repuesto", label: "Repuesto" },
  { text: "Pastillas de freno cerámicas", type: "repuesto", label: "Repuesto" },
  { text: "Filtros de aceite, aire y cabina", type: "repuesto", label: "Repuesto" },
  { text: "Rodamientos de clutch y balineras", type: "repuesto", label: "Repuesto" },
  { text: "Radiadores de aluminio y refrigeración", type: "repuesto", label: "Repuesto" },
  { text: "Rótulas, terminales y axiales", type: "repuesto", label: "Repuesto" },
  { text: "Correas y kits de distribución", type: "repuesto", label: "Repuesto" },
  { text: "Líquido de frenos DOT 3 y DOT 4", type: "repuesto", label: "Fluidos" },
];

function cleanSearch(str = "") {
  return String(str || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function cleanAlpha(str = "") {
  return String(str || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const router = useRouter();
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  // Rotar sugerencias dinámicas en el placeholder
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % STRUCTURED_SUGGESTIONS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Cerrar panel de sugerencias al hacer clic afuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (searchTerm) => {
    const term = searchTerm !== undefined ? searchTerm : query;
    if (term && term.trim()) {
      router.push(`/catalogo?search=${encodeURIComponent(term.trim())}`);
    } else {
      router.push("/catalogo");
    }
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  const filteredSuggestions = useMemo(() => {
    const qClean = cleanSearch(query);
    const qAlpha = cleanAlpha(query);

    if (!qClean) {
      return STRUCTURED_SUGGESTIONS.slice(0, 8);
    }

    const tokens = qClean.split(/\s+/).filter(Boolean);

    return STRUCTURED_SUGGESTIONS.filter((item) => {
      const textClean = cleanSearch(item.text);
      const labelClean = cleanSearch(item.label);
      const textAlpha = cleanAlpha(item.text);

      if (qAlpha.length >= 3 && textAlpha.includes(qAlpha)) {
        return true;
      }

      return tokens.every((token) => textClean.includes(token) || labelClean.includes(token));
    }).slice(0, 8);
  }, [query]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (focusedIndex >= 0 && filteredSuggestions[focusedIndex]) {
      handleSearch(filteredSuggestions[focusedIndex].text);
    } else {
      handleSearch(query);
    }
  };

  // Manejar navegación por teclado (flechas arriba/abajo, escape)
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev < filteredSuggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev > 0 ? prev - 1 : filteredSuggestions.length - 1));
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setFocusedIndex(-1);
    }
  };

  return (
    <div ref={searchRef} className="navbar__search-container">
      <form onSubmit={onSubmit} className="navbar__search" role="search">
        <input
          ref={inputRef}
          id="site-search"
          type="search"
          name="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setFocusedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={`Buscar repuesto, marca o ref: ${STRUCTURED_SUGGESTIONS[placeholderIndex]?.text}`}
          autoComplete="off"
          aria-label="Buscar repuestos, marcas o referencias"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            aria-label="Limpiar búsqueda"
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "#9CA3AF",
              padding: "0 6px",
              fontSize: "1rem",
              lineHeight: 1,
              display: "flex",
              alignItems: "center",
            }}
          >
            ✕
          </button>
        )}
        <button type="submit" aria-label="Buscar" className="navbar__search-btn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </form>

      {isOpen && (
        <div className="navbar__search-suggestions">
          <div className="navbar__search-suggestions-header">
            <span>🔍 Búsqueda rápida de repuestos y referencias</span>
          </div>
          <div className="navbar__search-suggestions-list" role="listbox">
            {filteredSuggestions.length > 0 ? (
              filteredSuggestions.map((item, idx) => {
                const isSelected = idx === focusedIndex;
                return (
                  <button
                    key={idx}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    className={`navbar__search-suggestion-item ${isSelected ? "is-focused" : ""}`}
                    style={isSelected ? { background: "rgba(255, 215, 0, 0.15)", borderLeft: "3px solid #FFD700" } : {}}
                    onClick={() => {
                      setQuery(item.text);
                      handleSearch(item.text);
                    }}
                  >
                    <span className="navbar__search-suggestion-icon">
                      {item.type === "marca"
                        ? "🏷️"
                        : item.type === "referencia"
                        ? "🔢"
                        : item.type === "vehiculo"
                        ? "🚗"
                        : item.type === "repuesto"
                        ? "⚙️"
                        : "🔍"}
                    </span>
                    <span className="navbar__search-suggestion-text">{item.text}</span>
                    <span className="navbar__search-suggestion-tag">{item.label}</span>
                  </button>
                );
              })
            ) : (
              <button
                type="button"
                className="navbar__search-suggestion-item"
                onClick={() => handleSearch(query)}
              >
                <span className="navbar__search-suggestion-icon">🔍</span>
                <span className="navbar__search-suggestion-text">
                  Buscar en todo el catálogo: &quot;{query}&quot;
                </span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
