"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/catalogo?search=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/catalogo");
    }
  };

  return (
    <form onSubmit={handleSearch} className="navbar__search">
      <label htmlFor="site-search" className="sr-only">Buscar productos</label>
      <input
        id="site-search"
        type="search"
        name="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar por producto, marca o referencia..."
        autoComplete="off"
      />
      <button type="submit" aria-label="Buscar" className="navbar__search-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </button>
    </form>
  );
}
