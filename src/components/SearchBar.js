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
    <form onSubmit={handleSearch} className="navbar__search" style={{ display: 'flex', alignItems: 'center' }}>
      <label htmlFor="site-search" className="sr-only">Buscar productos</label>
      <input
        id="site-search"
        type="search"
        name="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar por producto, marca o referencia..."
      />
      <button type="submit" aria-label="Buscar">🔍</button>
    </form>
  );
}
