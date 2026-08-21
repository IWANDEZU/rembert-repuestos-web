"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const SEARCH_SUGGESTIONS = [
  "Filtros de aceite WIX",
  "Pastillas de freno",
  "Radiadores de aluminio",
  "Aceite Terpel 15W-40",
  "Silicona Reinzosil 70ml",
  "Refrigerante Star Free",
  "Kit distribución Gates",
  "Embrague LuK",
  "Amortiguadores Gabriel",
  "Bujías ACDelco",
  "Filtros diésel Donaldson",
];

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const searchRef = useRef(null);

  // Rotar sugerencias dinámicas en el placeholder
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % SEARCH_SUGGESTIONS.length);
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

  const filteredSuggestions = query.trim()
    ? SEARCH_SUGGESTIONS.filter((s) =>
        s.toLowerCase().includes(query.toLowerCase())
      )
    : SEARCH_SUGGESTIONS.slice(0, 6);

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
          placeholder={`Sugerencia: ${SEARCH_SUGGESTIONS[placeholderIndex]}`}
          autoComplete="off"
          aria-label="Buscar repuestos o marcas"
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
            <span>💡 Sugerencias de búsqueda</span>
          </div>
          <div className="navbar__search-suggestions-list">
            {filteredSuggestions.map((item, idx) => (
              <button
                key={idx}
                type="button"
                className="navbar__search-suggestion-item"
                onClick={() => {
                  setQuery(item);
                  handleSearch(item);
                }}
              >
                <span className="navbar__search-suggestion-icon">🔍</span>
                <span className="navbar__search-suggestion-text">{item}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
