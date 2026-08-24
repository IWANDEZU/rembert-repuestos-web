"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";

const STRUCTURED_SUGGESTIONS = [
  // Marcas de Repuestos y Fabricantes
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
  { text: "Bombillos OSRAM", type: "marca", label: "Marca" },

  // Modelos de Vehículos Populares
  { text: "Chevrolet Sail", type: "vehiculo", label: "Vehículo" },
  { text: "Renault Duster", type: "vehiculo", label: "Vehículo" },
  { text: "Hyundai Tucson ix35", type: "vehiculo", label: "Vehículo" },
  { text: "Kia Sportage Revolution", type: "vehiculo", label: "Vehículo" },
  { text: "Toyota Hilux", type: "vehiculo", label: "Vehículo" },
  { text: "Chevrolet Spark GT", type: "vehiculo", label: "Vehículo" },
  { text: "Chevrolet N200 / N300", type: "vehiculo", label: "Vehículo" },
  { text: "Renault Sandero / Logan", type: "vehiculo", label: "Vehículo" },
  { text: "Kia Picanto / Rio", type: "vehiculo", label: "Vehículo" },
  { text: "Mazda 2 / Mazda 3", type: "vehiculo", label: "Vehículo" },

  // Referencias OE y Códigos de Fabricante
  { text: "54661-2S000", type: "referencia", label: "Ref. OE Amortiguador Tucson" },
  { text: "24512523", type: "referencia", label: "Ref. OE Rodamiento Clutch Sail" },
  { text: "24521039A", type: "referencia", label: "Ref. Balinera Sail / N200 / N300" },
  { text: "WL7570", type: "referencia", label: "Ref. Filtro Aceite WIX" },
  { text: "Reinzosil 70ml", type: "referencia", label: "Ref. Sellante Alta Temp" },

  // Líneas y Categorías de Repuestos
  { text: "Amortiguadores delanteros y traseros", type: "repuesto", label: "Repuesto" },
  { text: "Pastillas de freno cerámicas", type: "repuesto", label: "Repuesto" },
  { text: "Rodamientos de clutch y balineras", type: "repuesto", label: "Repuesto" },
  { text: "Radiadores de aluminio y refrigeración", type: "repuesto", label: "Repuesto" },
  { text: "Refrigerante Star Free Rojo", type: "repuesto", label: "Líquidos" },
  { text: "Aceite Terpel 15W-40", type: "repuesto", label: "Lubricante" },
];

function cleanSearch(str = "") {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function cleanAlpha(str = "") {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const searchRef = useRef(null);

  // Rotar sugerencias dinámicas en el placeholder
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % STRUCTURED_SUGGESTIONS.length);
    }, 3500);
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
    if (term.trim()) {
      router.push(`/catalogo?search=${encodeURIComponent(term.trim())}`);
    } else {
      router.push("/catalogo");
    }
    setIsOpen(false);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSearch(query);
  };

  const filteredSuggestions = useMemo(() => {
    const qClean = cleanSearch(query);
    const qAlpha = cleanAlpha(query);

    if (!qClean) {
      return STRUCTURED_SUGGESTIONS.slice(0, 7);
    }

    return STRUCTURED_SUGGESTIONS.filter((item) => {
      const textClean = cleanSearch(item.text);
      const labelClean = cleanSearch(item.label);
      const textAlpha = cleanAlpha(item.text);

      return (
        textClean.includes(qClean) ||
        labelClean.includes(qClean) ||
        (qAlpha.length >= 3 && textAlpha.includes(qAlpha))
      );
    }).slice(0, 8);
  }, [query]);

  return (
    <div ref={searchRef} className="navbar__search-container">
      <form onSubmit={onSubmit} className="navbar__search" role="search">
        <input
          id="site-search"
          type="search"
          name="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={`Buscar marca, modelo o ref: ${STRUCTURED_SUGGESTIONS[placeholderIndex]?.text}`}
          autoComplete="off"
          aria-label="Buscar repuestos, marcas o referencias"
        />
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
            <span>🔍 Búsqueda rápida por marcas y referencias</span>
          </div>
          <div className="navbar__search-suggestions-list">
            {filteredSuggestions.length > 0 ? (
              filteredSuggestions.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="navbar__search-suggestion-item"
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
                      : "⚙️"}
                  </span>
                  <span className="navbar__search-suggestion-text">{item.text}</span>
                  <span className="navbar__search-suggestion-tag">{item.label}</span>
                </button>
              ))
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
