"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const groups = [
  {
    title: "Motor y transmisión",
    links: [
      ["Motor y distribución", "motor-y-distribucion"],
      ["Cajas y transmisión", "transmision"],
      ["Embragues y clutch", "embrague"],
      ["Rodamientos y tracción", "rodamientos-y-traccion"],
      ["Mangueras y tubos", "mangueras-y-tubos"],
      ["Soportes, retenedores y guayas", "soportes-retenedores-y-guayas"],
    ],
  },
  {
    title: "Seguridad y sistemas",
    links: [
      ["Frenos, dirección y suspensión", "frenos-y-suspension"],
      ["Partes eléctricas", "electrico-y-encendido"],
      ["Radiadores y refrigeración", "radiadores"],
      ["Filtros", "filtros"],
      ["Combustible e inyección", "combustible"],
      ["Carrocería e iluminación", "carroceria-iluminacion"],
    ],
  },
  {
    title: "Mantenimiento",
    links: [
      ["Lubricantes y fluidos", "lubricantes-gasolina"],
      ["Otros repuestos en inventario", "repuestos-varios"],
    ],
  },
];

export default function CatalogMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Cerrar el menú al hacer clic afuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <li
      ref={menuRef}
      className="catalog-menu-item"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      style={{ position: "relative", whiteSpace: "nowrap", flexShrink: 0 }}
    >
      <div style={{ display: "inline-flex", alignItems: "center" }}>
        {/* Enlace principal que va DIRECTO a /catalogo al hacer clic */}
        <Link
          href="/catalogo"
          className="navbar__link"
          onClick={() => setIsOpen(false)}
          style={{ whiteSpace: "nowrap" }}
        >
          CATÁLOGO
        </Link>

        {/* Botón flecha para desplegar mega menú de categorías */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen((prev) => !prev);
          }}
          aria-expanded={isOpen}
          aria-label="Abrir menú de categorías del catálogo"
          style={{
            background: "transparent",
            border: "none",
            color: isOpen ? "#FFD700" : "#fff",
            cursor: "pointer",
            padding: "0.25rem 0.4rem 0.25rem 0",
            fontSize: "0.75rem",
            display: "inline-flex",
            alignItems: "center",
            transition: "transform 0.2s ease, color 0.2s ease",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          ▾
        </button>
      </div>

      {/* Mega Menú Desplegable */}
      {isOpen && (
        <div
          className="catalog-dropdown-panel"
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: "50%",
            transform: "translateX(-30%)",
            width: "min(760px, calc(100vw - 2rem))",
            background: "#141414",
            border: "1.5px solid rgba(255, 215, 0, 0.4)",
            borderRadius: "14px",
            padding: "1.2rem",
            boxShadow: "0 20px 50px rgba(0,0,0,0.8), 0 0 20px rgba(255, 215, 0, 0.15)",
            zIndex: 99999,
            animation: "fadeInMenu 0.18s ease-out forwards",
            backdropFilter: "blur(10px)",
          }}
        >
          {/* Botón destacado superior: Ver Todo el Catálogo */}
          <Link
            href="/catalogo"
            onClick={handleLinkClick}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "var(--primary-color)",
              color: "#111111",
              padding: "0.75rem 1.2rem",
              borderRadius: "8px",
              fontWeight: "900",
              fontSize: "0.9rem",
              textDecoration: "none",
              marginBottom: "1rem",
              boxShadow: "0 4px 12px rgba(255, 215, 0, 0.35)",
              letterSpacing: "0.4px",
            }}
          >
            <span>🛒 VER CATÁLOGO COMPLETO (TODOS LOS PRODUCTOS)</span>
            <span>➔</span>
          </Link>

          {/* Columnas de Categorías */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
              gap: "1rem",
            }}
          >
            {groups.map((group) => (
              <div
                key={group.title}
                style={{
                  background: "rgba(255, 255, 255, 0.04)",
                  padding: "0.85rem",
                  borderRadius: "10px",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <h3
                  style={{
                    color: "var(--primary-color)",
                    fontSize: "0.76rem",
                    fontWeight: "800",
                    letterSpacing: "0.6px",
                    textTransform: "uppercase",
                    margin: "0 0 0.6rem 0",
                    borderBottom: "1px solid rgba(255, 215, 0, 0.2)",
                    paddingBottom: "0.35rem",
                  }}
                >
                  {group.title}
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  {group.links.map(([label, category]) => (
                    <Link
                      key={category}
                      href={`/catalogo?category=${category}`}
                      onClick={handleLinkClick}
                      style={{
                        color: "#E2E8F0",
                        fontSize: "0.83rem",
                        textDecoration: "none",
                        padding: "0.35rem 0.5rem",
                        borderRadius: "6px",
                        fontWeight: "600",
                        transition: "all 0.15s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#111111";
                        e.currentTarget.style.background = "var(--primary-color)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "#E2E8F0";
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInMenu {
          from {
            opacity: 0;
            transform: translateX(-30%) translateY(-6px);
          }
          to {
            opacity: 1;
            transform: translateX(-30%) translateY(0);
          }
        }
        @media (max-width: 768px) {
          .catalog-dropdown-panel {
            left: 50% !important;
            transform: translateX(-50%) !important;
            width: calc(100vw - 1.5rem) !important;
            max-height: 75vh;
            overflow-y: auto;
          }
        }
      `}</style>
    </li>
  );
}
