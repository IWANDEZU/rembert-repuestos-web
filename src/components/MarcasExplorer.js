"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ALL_BRANDS = [
  // Fabricantes de Vehículos y Modelos Populares
  {
    name: "Chevrolet",
    slug: "chevrolet",
    logo: "/logos/autos/chevrolet.svg",
    category: "vehiculos",
    categoryLabel: "Fabricante Automotriz",
    models: "Sail, Spark GT, Aveo, Tracker, Optra, Onix, N300, D-Max",
    count: 113,
    highlight: true,
  },
  {
    name: "Kia",
    slug: "kia",
    logo: "/logos/autos/kia.svg",
    category: "vehiculos",
    categoryLabel: "Fabricante Automotriz",
    models: "Picanto, Rio, Cerato, Sportage, Soul, Sonet",
    count: 382,
    highlight: true,
  },
  {
    name: "Hyundai",
    slug: "hyundai",
    logo: "/logos/autos/hyundai.svg",
    category: "vehiculos",
    categoryLabel: "Fabricante Automotriz",
    models: "i10, Grand i10, Accent, Elantra, Tucson, Creta, HB20",
    count: 138,
    highlight: true,
  },
  {
    name: "Mazda",
    slug: "mazda",
    logo: "/logos/autos/mazda.svg",
    category: "vehiculos",
    categoryLabel: "Fabricante Automotriz",
    models: "Mazda 2, Mazda 3, Mazda 6, CX-3, CX-30, CX-5, Allegro",
    count: 93,
    highlight: true,
  },
  {
    name: "Renault",
    slug: "renault",
    logo: "/logos/autos/renault.svg",
    category: "vehiculos",
    categoryLabel: "Fabricante Automotriz",
    models: "Duster, Logan, Sandero, Stepway, Kwid, Megane, Kangoo",
    count: 54,
    highlight: true,
  },
  {
    name: "Ford",
    slug: "ford",
    logo: "/logos/autos/ford.svg",
    category: "vehiculos",
    categoryLabel: "Fabricante Automotriz",
    models: "Fiesta, Focus, EcoSport, Escape, Ranger, Explorer",
    count: 35,
  },
  {
    name: "Nissan",
    slug: "nissan",
    logo: "/logos/autos/nissan.svg",
    category: "vehiculos",
    categoryLabel: "Fabricante Automotriz",
    models: "March, Versa, Sentra, Kicks, Frontier, X-Trail, Qashqai",
    count: 33,
  },
  {
    name: "Toyota",
    slug: "toyota",
    logo: "/logos/autos/toyota.svg",
    category: "vehiculos",
    categoryLabel: "Fabricante Automotriz",
    models: "Hilux, Corolla, Fortuner, RAV4, Prado, Yaris",
    count: 9,
  },
  {
    name: "Daewoo",
    slug: "daewoo",
    logo: "/logos/autos/daewoo.svg",
    category: "vehiculos",
    categoryLabel: "Fabricante Automotriz",
    models: "Matiz, Tico, Cielo, Lanos, Nubira, Racer",
    count: 10,
  },
  {
    name: "Volkswagen",
    slug: "volkswagen",
    logo: "/logos/autos/volkswagen.svg",
    category: "vehiculos",
    categoryLabel: "Fabricante Automotriz",
    models: "Gol, Voyage, Fox, Polo, Jetta, Amarok, T-Cross",
    count: 4,
  },
  {
    name: "Suzuki",
    slug: "suzuki",
    logo: "/logos/autos/suzuki.svg",
    category: "vehiculos",
    categoryLabel: "Fabricante Automotriz",
    models: "Swift, Grand Vitara, Jimny, Alto, Celerio, Baleno",
    count: 4,
  },
  {
    name: "Honda",
    slug: "honda",
    logo: "/logos/autos/honda.svg",
    category: "vehiculos",
    categoryLabel: "Fabricante Automotriz",
    models: "Civic, CR-V, HR-V, Fit, Accord, City",
    count: 2,
  },
  {
    name: "Mitsubishi",
    slug: "mitsubishi",
    logo: "/logos/autos/mitsubishi.svg",
    category: "vehiculos",
    categoryLabel: "Fabricante Automotriz",
    models: "Montero, L200, Sportero, Outlander, ASX, Lancer",
    count: 2,
  },
  {
    name: "Peugeot",
    slug: "peugeot",
    logo: "/logos/autos/peugeot.svg",
    category: "vehiculos",
    categoryLabel: "Fabricante Automotriz",
    models: "206, 207, 208, 301, 2008, 3008, Partner",
    count: 0,
  },
  {
    name: "BMW",
    slug: "bmw",
    logo: "/logos/autos/bmw.svg",
    category: "vehiculos",
    categoryLabel: "Fabricante Automotriz",
    models: "Serie 1, Serie 3, Serie 5, X1, X3, X5",
    count: 0,
  },
  {
    name: "Volvo",
    slug: "volvo",
    logo: "/logos/autos/volvo.svg",
    category: "vehiculos",
    categoryLabel: "Fabricante Automotriz",
    models: "XC60, XC90, S60, V40, FH, FM",
    count: 0,
  },
  {
    name: "Daihatsu",
    slug: "daihatsu",
    logo: "/logos/autos/daihatsu.svg",
    category: "vehiculos",
    categoryLabel: "Fabricante Automotriz",
    models: "Terios, Sirion, Feroza, Delta",
    count: 0,
  },
  {
    name: "Škoda",
    slug: "skoda",
    logo: "/logos/autos/skoda.svg",
    category: "vehiculos",
    categoryLabel: "Fabricante Automotriz",
    models: "Fabia, Octavia, Rapid, Yeti",
    count: 0,
  },
  {
    name: "SEAT",
    slug: "seat",
    logo: "/logos/autos/seat.svg",
    category: "vehiculos",
    categoryLabel: "Fabricante Automotriz",
    models: "Ibiza, León, Toledo, Arona",
    count: 0,
  },

  // Marcas de Repuestos y Componentes Especializados
  {
    name: "GTI Autoparts",
    slug: "gti",
    logo: "/catalogo-gti/gti-linea-homocinetica-rembert.webp",
    category: "repuestos",
    categoryLabel: "Tracción y Homocinéticas",
    models: "Ejes, juntas homocinéticas y tricetas",
    count: 51,
    highlight: true,
  },
  {
    name: "TNK Suspensión",
    slug: "tnk",
    logo: "/logos/tnk-oficial.png",
    category: "suspension",
    categoryLabel: "Suspensión y Dirección",
    models: "Terminales, rótulas, axiales y bieletas",
    count: 11,
    highlight: true,
  },
  {
    name: "SKF Rodamientos",
    slug: "skf",
    logo: "/catalogo-marcas-watermarked/skf-kit-rodamiento-catalogo.webp",
    category: "repuestos",
    categoryLabel: "Rodamientos y Bocines",
    models: "Kits de rodamientos de rueda y distribución",
    count: 10,
    highlight: true,
  },
  {
    name: "ADS Componentes",
    slug: "ads",
    logo: "/catalogo-ads/ads-51750-1j000-bocin-delantero-abs-kia-hyundai.webp",
    category: "repuestos",
    categoryLabel: "Bocines y Dirección",
    models: "Bocines de rueda ABS y cajas de dirección",
    count: 5,
  },
  {
    name: "Motorcraft",
    slug: "motorcraft",
    logo: "/logos/motorcraft.svg",
    category: "repuestos",
    categoryLabel: "Línea Original Ford",
    models: "Filtros de aceite, aire, cabina y bujías",
    count: 4,
  },
  {
    name: "Verke Shock Absorber",
    slug: "verke",
    logo: "/logos/verke.svg",
    category: "suspension",
    categoryLabel: "Amortiguadores Premium",
    models: "Puntales y amortiguadores presurizados",
    count: 2,
    highlight: true,
  },
  {
    name: "PHC Valeo",
    slug: "phc-valeo",
    logo: "/catalogo-electricos/phc-valeo-kit-embrague-rembert.webp",
    category: "repuestos",
    categoryLabel: "Kits de Embrague",
    models: "Prensas, discos y balineras de clutch",
    count: 2,
  },
  {
    name: "Monroe",
    slug: "monroe",
    logo: "/brands/monroe-official-logo.png",
    category: "suspension",
    categoryLabel: "Amortiguadores",
    models: "Kits de amortiguadores delanteros y traseros",
    count: 2,
  },
  {
    name: "Bosch",
    slug: "bosch",
    logo: "/logos/bosch.svg",
    category: "repuestos",
    categoryLabel: "Electricidad e Inyección",
    models: "Bujías, sensores, bombas y componentes",
    count: 1,
  },
  {
    name: "Incolbest",
    slug: "incolbest",
    logo: "/logos/incolbest-real.png",
    category: "suspension",
    categoryLabel: "Frenos y Fricción",
    models: "Pastillas cerámicas, discos y bandas de freno",
    count: 12,
  },
  {
    name: "Safety Auto Parts",
    slug: "safety",
    logo: "/logos/safety-auto-parts.png",
    category: "suspension",
    categoryLabel: "Suspensión y Frenos",
    models: "Bases de amortiguador, bujes y terminales",
    count: 8,
  },
  {
    name: "Gabriel",
    slug: "gabriel",
    logo: "/logos/gabriel-real.png",
    category: "suspension",
    categoryLabel: "Amortiguadores",
    models: "Amortiguadores a gas y aceite",
    count: 10,
  },
  {
    name: "OSRAM",
    slug: "osram",
    logo: "/catalogo-ktx-osram/osram-ledriving-hl-bright-h4.webp",
    category: "repuestos",
    categoryLabel: "Iluminación Automotriz",
    models: "Bombillos halógenos y LEDriving H4/H7",
    count: 1,
  },
  {
    name: "KTX",
    slug: "ktx",
    logo: "/catalogo-ktx-osram/ktx-kit-embrague-familia.webp",
    category: "repuestos",
    categoryLabel: "Sistemas de Embrague",
    models: "Kits de embrague y accionamiento",
    count: 1,
  },
  {
    name: "NGK",
    slug: "ngk",
    logo: "/catalogo-marcas-panel/ngk-encendido-caja.webp",
    category: "repuestos",
    categoryLabel: "Encendido y Bujías",
    models: "Bujías de Iridium, cables de alta y bobinas",
    count: 1,
  },
  {
    name: "Dayco",
    slug: "dayco",
    logo: "/catalogo-marcas-panel/dayco-kit-distribucion-caja.webp",
    category: "repuestos",
    categoryLabel: "Correas y Distribución",
    models: "Kits de repartición, correas Poly-V y tensores",
    count: 1,
  },

  // Filtros, Lubricantes y Sellantes
  {
    name: "WIX Filters",
    slug: "wix",
    logo: "/logos/wix-filters.svg",
    category: "mantenimiento",
    categoryLabel: "Filtración Pesada y Liviana",
    models: "Filtros de aceite, aire, combustible y cabina",
    count: 16,
    highlight: true,
  },
  {
    name: "Victor Reinz",
    slug: "victor-reinz",
    logo: "/catalogo-siliconas-automotrices/victor-reinz-reinzosil-70ml-original.png",
    category: "mantenimiento",
    categoryLabel: "Sellantes y Siliconas",
    models: "Silicona Reinzosil alta temperatura 300°C",
    count: 1,
  },
  {
    name: "Valvoline",
    slug: "valvoline",
    logo: "/logos/valvoline.svg",
    category: "mantenimiento",
    categoryLabel: "Lubricantes y Fluidos",
    models: "Aceites sintéticos, semi-sintéticos y ATF",
    count: 8,
  },
  {
    name: "Liqui Moly",
    slug: "liqui-moly",
    logo: "/logos/liqui-moly.svg",
    category: "mantenimiento",
    categoryLabel: "Aditivos Alemanes",
    models: "Aceites de motor, aditivos y limpiadores",
    count: 6,
  },
  {
    name: "Shell",
    slug: "shell",
    logo: "/05_shell_logo_oficial.png",
    category: "mantenimiento",
    categoryLabel: "Lubricantes y Fluidos",
    models: "Helix, Rimula y aceites de alto rendimiento",
    count: 12,
  },
  {
    name: "Mobil",
    slug: "mobil",
    logo: "/07_mobil_logo_oficial.png",
    category: "mantenimiento",
    categoryLabel: "Lubricantes y Fluidos",
    models: "Mobil 1, Super, Delvac y fluidos de freno",
    count: 10,
  },
  {
    name: "Castrol",
    slug: "castrol",
    logo: "/06_castrol_logo_oficial.png",
    category: "mantenimiento",
    categoryLabel: "Lubricantes y Fluidos",
    models: "Magnatec, GTX, EDGE y CRB turbodiésel",
    count: 14,
  },
  {
    name: "Terpel",
    slug: "terpel",
    logo: "/04_terpel_logo_oficial.png",
    category: "mantenimiento",
    categoryLabel: "Lubricantes Nacionales",
    models: "Terpel Oil, Maxter y lubricantes de transmisión",
    count: 8,
  },
  {
    name: "Chevron",
    slug: "chevron",
    logo: "/14_chevron_lubricants_logo_oficial.png",
    category: "mantenimiento",
    categoryLabel: "Lubricantes y Fluidos",
    models: "Havoline, Delo y fluidos refrigerantes",
    count: 9,
  },
  {
    name: "Coéxito",
    slug: "coexito",
    logo: "/03_coexito_logo_oficial.png",
    category: "mantenimiento",
    categoryLabel: "Filtros y Baterías",
    models: "Filtros de cabina, aire y elementos filtrantes",
    count: 7,
  },
  {
    name: "Global Oil",
    slug: "global-oil",
    logo: "/logos/global-oil.svg",
    category: "mantenimiento",
    categoryLabel: "Lubricantes",
    models: "Aceites minerales y semi-sintéticos",
    count: 5,
  },
  {
    name: "Max Power",
    slug: "max-power",
    logo: "/logos/max-power.png",
    category: "mantenimiento",
    categoryLabel: "Fluidos Automotrices",
    models: "Refrigerantes y lubricantes para trabajo diario",
    count: 6,
  },
  {
    name: "Petroil",
    slug: "petroil",
    logo: "/logos/petroil.png",
    category: "mantenimiento",
    categoryLabel: "Lubricantes",
    models: "Aceites para motor y engranajes",
    count: 4,
  },
];

const FILTER_TABS = [
  { id: "all", label: "Todas las Marcas" },
  { id: "vehiculos", label: "🚗 Vehículos y Fabricantes" },
  { id: "repuestos", label: "⚙️ Fabricantes de Repuestos" },
  { id: "suspension", label: "🛡️ Frenos y Suspensión" },
  { id: "mantenimiento", label: "🛢️ Filtros y Lubricantes" },
];

const POPULAR_QUICK_SEARCHES = [
  { label: "Chevrolet", type: "brand", query: "chevrolet" },
  { label: "Kia", type: "brand", query: "kia" },
  { label: "Hyundai", type: "brand", query: "hyundai" },
  { label: "Renault", type: "brand", query: "renault" },
  { label: "Toyota", type: "brand", query: "toyota" },
  { label: "Mazda", type: "brand", query: "mazda" },
  { label: "GTI Autoparts", type: "brand", query: "gti" },
  { label: "Verke", type: "brand", query: "verke" },
  { label: "TNK Suspensión", type: "brand", query: "tnk" },
  { label: "WIX Filters", type: "brand", query: "wix" },
  { label: "Amortiguadores", type: "part", query: "amortiguador" },
  { label: "Pastillas de freno", type: "part", query: "pastillas" },
  { label: "Filtros", type: "part", query: "filtro" },
];

function normalize(text = "") {
  return String(text)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export default function MarcasExplorer() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      router.push(`/catalogo?search=${encodeURIComponent(query)}`);
    } else {
      router.push("/catalogo");
    }
  };

  const handleQuickSearch = (item) => {
    if (item.type === "brand") {
      router.push(`/catalogo?brand=${encodeURIComponent(item.query)}`);
    } else {
      router.push(`/catalogo?search=${encodeURIComponent(item.query)}`);
    }
  };

  const filteredBrands = useMemo(() => {
    const qClean = normalize(searchQuery);

    return ALL_BRANDS.filter((brand) => {
      // 1. Filtrar por pestaña
      if (activeTab !== "all") {
        if (activeTab === "suspension" && brand.category !== "suspension") return false;
        if (activeTab === "vehiculos" && brand.category !== "vehiculos") return false;
        if (activeTab === "repuestos" && brand.category !== "repuestos") return false;
        if (activeTab === "mantenimiento" && brand.category !== "mantenimiento") return false;
      }

      // 2. Filtrar por término de búsqueda
      if (!qClean) return true;

      const nameClean = normalize(brand.name);
      const slugClean = normalize(brand.slug);
      const categoryClean = normalize(brand.categoryLabel);
      const modelsClean = normalize(brand.models);
      const fullSearchable = `${nameClean} ${slugClean} ${categoryClean} ${modelsClean}`;

      const tokens = qClean.split(/\s+/).filter(Boolean);
      return (
        fullSearchable.includes(qClean) ||
        tokens.every((token) => fullSearchable.includes(token))
      );
    });
  }, [activeTab, searchQuery]);

  return (
    <div className="marcas-explorer" style={{ width: "100%" }}>
      {/* Barra de Búsqueda Principal de Marcas y Repuestos */}
      <div
        style={{
          background: "linear-gradient(135deg, #161616 0%, #222222 100%)",
          borderRadius: "16px",
          padding: "clamp(1.25rem, 3.5vw, 1.75rem) clamp(0.85rem, 3vw, 1.5rem)",
          marginBottom: "1.5rem",
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          color: "#FFFFFF",
          border: "1px solid rgba(255, 215, 0, 0.25)",
        }}
      >
        <div style={{ maxWidth: "780px", margin: "0 auto", textAlign: "center" }}>
          <span
            style={{
              display: "inline-block",
              background: "rgba(255, 215, 0, 0.15)",
              color: "#FFD700",
              border: "1px solid rgba(255, 215, 0, 0.4)",
              borderRadius: "999px",
              padding: "0.25rem 0.8rem",
              fontSize: "clamp(0.72rem, 2vw, 0.80rem)",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "0.6rem",
            }}
          >
            Búsqueda de Repuestos por Marca y Fabricante
          </span>
          <h2
            style={{
              fontSize: "clamp(1.25rem, 4vw, 1.75rem)",
              fontWeight: "800",
              color: "#FFFFFF",
              marginBottom: "0.4rem",
              lineHeight: "1.25",
              textWrap: "balance",
            }}
          >
            ¿Qué marca o repuesto estás buscando?
          </h2>
          <p
            style={{
              color: "#D1D5DB",
              fontSize: "clamp(0.82rem, 2.2vw, 0.95rem)",
              marginBottom: "1rem",
              lineHeight: 1.45,
            }}
          >
            Filtra fabricantes automotrices, marcas de repuestos o busca directamente por modelo, pieza o referencia.
          </p>

          {/* Formulario de Búsqueda */}
          <form
            onSubmit={handleSearchSubmit}
            style={{
              display: "flex",
              alignItems: "center",
              background: "#FFFFFF",
              borderRadius: "12px",
              padding: "0.25rem 0.35rem 0.25rem 0.75rem",
              boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
              gap: "0.35rem",
              maxWidth: "680px",
              margin: "0 auto",
              minHeight: "44px",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#888888"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ flexShrink: 0 }}
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar marca (ej. Chevrolet, Verke) o pieza..."
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                fontSize: "clamp(0.85rem, 2.2vw, 0.95rem)",
                color: "#111111",
                background: "transparent",
                padding: "0.45rem 0",
                minWidth: 0,
              }}
              aria-label="Buscar marcas y productos"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#999",
                  padding: "0.3rem",
                  fontSize: "1rem",
                  lineHeight: 1,
                }}
                title="Limpiar búsqueda"
              >
                ✕
              </button>
            )}

            <button
              type="submit"
              className="btn btn--primary"
              style={{
                padding: "0.55rem 0.95rem",
                fontSize: "clamp(0.78rem, 2vw, 0.86rem)",
                fontWeight: "800",
                borderRadius: "8px",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                flexShrink: 0,
                minHeight: "36px",
              }}
            >
              <span>Buscar</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </form>

          {/* Accesos rápidos de marcas y repuestos */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.35rem",
              marginTop: "1rem",
            }}
          >
            <span style={{ fontSize: "0.75rem", color: "#9CA3AF", marginRight: "0.2rem" }}>
              Búsquedas frecuentes:
            </span>
            {POPULAR_QUICK_SEARCHES.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => handleQuickSearch(item)}
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  color: "#F3F4F6",
                  border: "1px solid rgba(255, 255, 255, 0.18)",
                  borderRadius: "999px",
                  padding: "0.25rem 0.6rem",
                  fontSize: "0.74rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#FFD700";
                  e.currentTarget.style.color = "#111111";
                  e.currentTarget.style.borderColor = "#FFD700";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                  e.currentTarget.style.color = "#F3F4F6";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.18)";
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Banner de Acción si el usuario está escribiendo un término de búsqueda */}
      {searchQuery.trim() && (
        <div
          style={{
            background: "#FFFBE6",
            border: "1px solid #FFE066",
            borderRadius: "12px",
            padding: "0.85rem 1rem",
            marginBottom: "1.25rem",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.75rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flex: 1, minWidth: "220px" }}>
            <span style={{ fontSize: "1.25rem" }}>🔍</span>
            <div>
              <p style={{ margin: 0, fontWeight: "700", color: "#855D00", fontSize: "0.90rem" }}>
                Buscando repuestos para &quot;{searchQuery}&quot;
              </p>
              <p style={{ margin: 0, color: "#665000", fontSize: "0.78rem" }}>
                Explora los repuestos directamente o haz clic en una marca abajo.
              </p>
            </div>
          </div>
          <Link
            href={`/catalogo?search=${encodeURIComponent(searchQuery.trim())}`}
            className="btn btn--primary"
            style={{
              padding: "0.5rem 0.95rem",
              fontSize: "0.80rem",
              fontWeight: "800",
              borderRadius: "8px",
              whiteSpace: "nowrap",
            }}
          >
            Buscar en Catálogo &rarr;
          </Link>
        </div>
      )}

      {/* Pestañas de Filtro por Categoría de Marca con Scroll Táctil */}
      <div
        style={{
          display: "flex",
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          gap: "0.45rem",
          marginBottom: "1.25rem",
          paddingBottom: "0.45rem",
          borderBottom: "1px solid #E2E8F0",
        }}
      >
        {FILTER_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "0.45rem 0.85rem",
                borderRadius: "999px",
                fontSize: "clamp(0.76rem, 2vw, 0.84rem)",
                fontWeight: isActive ? "800" : "600",
                cursor: "pointer",
                border: isActive ? "2px solid #111111" : "1px solid #CBD5E1",
                background: isActive ? "#111111" : "#FFFFFF",
                color: isActive ? "#FFD700" : "#475569",
                boxShadow: isActive ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
                transition: "all 0.2s ease",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Contador de marcas */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
          flexWrap: "wrap",
          gap: "0.4rem",
        }}
      >
        <span style={{ fontSize: "0.82rem", color: "#64748B", fontWeight: "600" }}>
          Mostrando <strong>{filteredBrands.length}</strong> marcas aliadas
          {searchQuery && ` para "${searchQuery}"`}
        </span>

        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            style={{
              background: "none",
              border: "none",
              color: "#2563EB",
              fontSize: "0.80rem",
              fontWeight: "700",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Ver todas las marcas
          </button>
        )}
      </div>

      {/* Grilla de Marcas */}
      {filteredBrands.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 145px), 1fr))",
            gap: "clamp(0.75rem, 2vw, 1.15rem)",
          }}
        >
          {filteredBrands.map((brand) => {
            const hasActiveQuery = searchQuery.trim().length > 0;
            const targetHref = hasActiveQuery
              ? `/catalogo?brand=${brand.slug}&search=${encodeURIComponent(searchQuery.trim())}`
              : `/catalogo?brand=${brand.slug}`;

            return (
              <div
                key={brand.slug}
                style={{
                  background: "#FFFFFF",
                  borderRadius: "12px",
                  padding: "clamp(0.85rem, 2vw, 1.25rem) clamp(0.65rem, 1.8vw, 0.95rem)",
                  textAlign: "center",
                  boxShadow: brand.highlight
                    ? "0 4px 14px rgba(255, 215, 0, 0.25), 0 2px 8px rgba(0,0,0,0.05)"
                    : "0 2px 10px rgba(0,0,0,0.04)",
                  border: brand.highlight ? "1.5px solid #FFD700" : "1px solid #E2E8F0",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "center",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
                  position: "relative",
                }}
                className="hover-card"
              >
                {brand.highlight && (
                  <span
                    style={{
                      position: "absolute",
                      top: "8px",
                      right: "8px",
                      background: "#FFD700",
                      color: "#111111",
                      fontSize: "0.62rem",
                      fontWeight: "800",
                      padding: "0.15rem 0.45rem",
                      borderRadius: "999px",
                      textTransform: "uppercase",
                      letterSpacing: "0.03em",
                      zIndex: 2,
                    }}
                  >
                    Top
                  </span>
                )}

                {/* Logo de la Marca */}
                <div
                  style={{
                    height: "65px",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#F8FAFC",
                    borderRadius: "8px",
                    padding: "0.5rem",
                    marginBottom: "0.65rem",
                    border: "1px solid #EDF2F7",
                  }}
                >
                  <Image
                    src={brand.logo}
                    alt={`Logo ${brand.name}`}
                    width={130}
                    height={48}
                    style={{
                      maxHeight: "44px",
                      maxWidth: "115px",
                      objectFit: "contain",
                    }}
                    loading="lazy"
                  />
                </div>

                {/* Información de la Marca */}
                <div style={{ marginBottom: "0.75rem", width: "100%" }}>
                  <span
                    style={{
                      display: "inline-block",
                      fontSize: "0.68rem",
                      fontWeight: "700",
                      color: "#475569",
                      background: "#F1F5F9",
                      padding: "0.12rem 0.45rem",
                      borderRadius: "4px",
                      marginBottom: "0.25rem",
                    }}
                  >
                    {brand.categoryLabel}
                  </span>

                  <h3
                    style={{
                      fontSize: "clamp(0.92rem, 2.4vw, 1.05rem)",
                      fontWeight: "800",
                      color: "#111111",
                      margin: "0.1rem 0 0.25rem 0",
                    }}
                  >
                    {brand.name}
                  </h3>

                  {brand.models && (
                    <p
                      style={{
                        color: "#64748B",
                        fontSize: "0.74rem",
                        lineHeight: 1.3,
                        margin: "0 0 0.4rem 0",
                        minHeight: "2.3em",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                      title={brand.models}
                    >
                      {brand.models}
                    </p>
                  )}

                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.25rem",
                      fontSize: "0.74rem",
                      color: brand.count > 0 ? "#059669" : "#64748B",
                      fontWeight: "700",
                    }}
                  >
                    <span>{brand.count > 0 ? "✓" : "•"}</span>
                    <span>
                      {brand.count > 0
                        ? `${brand.count} repuestos`
                        : "Bajo catálogo"}
                    </span>
                  </div>
                </div>

                {/* Botón de Acción Principal */}
                <Link
                  href={targetHref}
                  className="btn btn--primary"
                  style={{
                    width: "100%",
                    padding: "0.48rem 0.65rem",
                    fontSize: "clamp(0.70rem, 2vw, 0.78rem)",
                    textTransform: "uppercase",
                    fontWeight: "800",
                    textAlign: "center",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.3rem",
                    minHeight: "34px",
                  }}
                >
                  <span>
                    {hasActiveQuery ? `Buscar en ${brand.name}` : "Ver Catálogo"}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        /* Estado vacío si no hay coincidencias directas en nombres de marca */
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "16px",
            padding: "3rem 2rem",
            textAlign: "center",
            border: "1px solid #E2E8F0",
            boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "#FFF9D2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.25rem",
              fontSize: "1.8rem",
            }}
          >
            🔍
          </div>
          <h3
            style={{
              fontSize: "1.3rem",
              fontWeight: "800",
              color: "#111",
              marginBottom: "0.5rem",
            }}
          >
            No encontramos marcas llamadas &quot;{searchQuery}&quot;
          </h3>
          <p
            style={{
              color: "#64748B",
              fontSize: "0.95rem",
              maxWidth: "500px",
              margin: "0 auto 1.5rem",
              lineHeight: 1.5,
            }}
          >
            Sin embargo, es posible que tengamos repuestos, referencias o compatibilidades con este nombre en nuestro catálogo general de productos.
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <Link
              href={`/catalogo?search=${encodeURIComponent(searchQuery.trim())}`}
              className="btn btn--primary"
              style={{
                padding: "0.7rem 1.5rem",
                fontWeight: "800",
                fontSize: "0.9rem",
              }}
            >
              Buscar &quot;{searchQuery}&quot; en todo el Catálogo &rarr;
            </Link>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setActiveTab("all");
              }}
              className="btn btn--outline"
              style={{
                padding: "0.7rem 1.5rem",
                fontSize: "0.9rem",
              }}
            >
              Ver todas las marcas
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
