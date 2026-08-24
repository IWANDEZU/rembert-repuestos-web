import Link from "next/link";
import CatalogSidebar from "@/components/CatalogSidebar";
import Image from "next/image";

export const revalidate = false;

export const metadata = {
  title: "Marcas Oficiales | REMBERT",
  description:
    "Marcas automotrices y de repuestos líderes en REMBERT: Chevrolet, Renault, Toyota, Kia, Mazda, Bosch, WIX, Incolbest y más en Barrancabermeja.",
  alternates: {
    canonical: "/marcas",
  },
  openGraph: {
    title: "Marcas Oficiales | REMBERT",
    description:
      "Filtros, radiadores, frenos, suspensión y repuestos de las marcas líderes en REMBERT con envíos a toda Colombia.",
    url: "https://www.rembertrepuestos.com/marcas",
  },
};

const fallbackBrands = [
  { name: "Shell", slug: "shell", logo: "/05_shell_logo_oficial.png", count: 12 },
  { name: "Mobil", slug: "mobil", logo: "/07_mobil_logo_oficial.webp", count: 10 },
  { name: "Castrol", slug: "castrol", logo: "/06_castrol_logo_oficial.png", count: 14 },
  { name: "Terpel", slug: "terpel", logo: "/04_terpel_logo_oficial.png", count: 8 },
  { name: "Chevron", slug: "chevron", logo: "/14_chevron_lubricants_logo_oficial.png", count: 9 },
  { name: "WIX Filters", slug: "wix", logo: "/logos/wix-filters.svg", count: 16 },
  { name: "Coéxito", slug: "coexito", logo: "/03_coexito_logo_oficial.png", count: 7 },
  { name: "Liqui Moly", slug: "liqui-moly", logo: "/logos/liqui-moly.svg", count: 6 },
  { name: "Bosch", slug: "bosch", logo: "/logos/bosch.svg", count: 15 },
  { name: "Valvoline", slug: "valvoline", logo: "/logos/valvoline.svg", count: 8 },
  { name: "Verke Shock Absorber", slug: "verke", logo: "/logos/verke.svg", count: 8 },
  { name: "TNK Suspensión y Dirección", slug: "tnk", logo: "/logos/tnk-oficial.png", count: 11 },
  { name: "GTI Autoparts", slug: "gti", logo: "/catalogo-gti/gti-linea-homocinetica-rembert.webp", count: 47 },
  { name: "Incolbest", slug: "incolbest", logo: "/logos/incolbest-real.png", count: 12 },
  { name: "Safety Auto Parts", slug: "safety", logo: "/logos/safety-auto-parts.png", count: 8 },
  { name: "Gabriel", slug: "gabriel", logo: "/logos/gabriel-real.png", count: 10 },
  { name: "Victor Reinz", slug: "victor-reinz", logo: "/catalogo-siliconas-automotrices/victor-reinz-reinzosil-70ml-original.webp", count: 1 },
  { name: "Global Oil", slug: "global-oil", logo: "/logos/global-oil.svg", count: 5 },
  { name: "Max Power", slug: "max-power", logo: "/logos/max-power.png", count: 6 },
  { name: "Petroil", slug: "petroil", logo: "/logos/petroil.png", count: 4 },
  { name: "OSRAM", slug: "osram", logo: "/catalogo-ktx-osram/osram-ledriving-hl-bright-h4.webp", count: 1 },
  { name: "KTX", slug: "ktx", logo: "/catalogo-ktx-osram/ktx-kit-embrague-familia.webp", count: 1 },
  { name: "NGK", slug: "ngk", logo: "/catalogo-marcas-panel/ngk-encendido-caja.webp", count: 1 },
  { name: "Dayco", slug: "dayco", logo: "/catalogo-marcas-panel/dayco-kit-distribucion-caja.webp", count: 1 },
  { name: "INA", slug: "ina", logo: "/catalogo-marcas-panel/ina-tensores-caja.webp", count: 1 },
  { name: "Monroe", slug: "monroe", logo: "/catalogo-marcas-panel/monroe-amortiguadores-caja.webp", count: 2 },
];

const lubricantBrandSlugs = new Set([
  "shell", "mobil", "castrol", "terpel", "chevron", "liqui-moly", "valvoline",
  "global-oil", "max-power", "petroil", "motul", "totalenergies",
]);

const automotiveBrands = [
  { name: "Chevrolet", slug: "chevrolet", logo: "/logos/autos/chevrolet.svg", count: 0 },
  { name: "Renault", slug: "renault", logo: "/logos/autos/renault.svg", count: 0 },
  { name: "Toyota", slug: "toyota", logo: "/logos/autos/toyota.svg", count: 0 },
  { name: "Kia", slug: "kia", logo: "/logos/autos/kia.svg", count: 0 },
  { name: "Mazda", slug: "mazda", logo: "/logos/autos/mazda.svg", count: 0 },
  { name: "Hyundai", slug: "hyundai", logo: "/logos/autos/hyundai.svg", count: 0 },
  { name: "Ford", slug: "ford", logo: "/logos/autos/ford.svg", count: 0 },
  { name: "Nissan", slug: "nissan", logo: "/logos/autos/nissan.svg", count: 0 },
  { name: "Volkswagen", slug: "volkswagen", logo: "/logos/autos/volkswagen.svg", count: 0 },
  { name: "Mitsubishi", slug: "mitsubishi", logo: "/logos/autos/mitsubishi.svg", count: 0 },
  { name: "Honda", slug: "honda", logo: "/logos/autos/honda.svg", count: 0 },
  { name: "Suzuki", slug: "suzuki", logo: "/logos/autos/suzuki.svg", count: 0 },
  { name: "BMW", slug: "bmw", logo: "/logos/autos/bmw.svg", count: 0 },
  { name: "Volvo", slug: "volvo", logo: "/logos/autos/volvo.svg", count: 0 },
  { name: "Daihatsu", slug: "daihatsu", logo: "/logos/autos/daihatsu.svg", count: 0 },
  { name: "Daewoo", slug: "daewoo", logo: "/logos/autos/daewoo.svg", count: 0 },
  { name: "Škoda", slug: "skoda", logo: "/logos/autos/skoda.svg", count: 0 },
  { name: "SEAT", slug: "seat", logo: "/logos/autos/seat.svg", count: 0 },
  { name: "Peugeot", slug: "peugeot", logo: "/logos/autos/peugeot.svg", count: 0 },
];

export default function MarcasPage() {
  const displayBrands = [
    ...fallbackBrands.filter((brand) => !lubricantBrandSlugs.has(brand.slug)),
    ...automotiveBrands,
  ];

  return (
    <main className="main-container section catalog-layout">
      <CatalogSidebar />
      <div className="catalog-content">
        <div style={{ padding: "1rem 0", minHeight: "60vh" }}>
          <div style={{ marginBottom: "2rem" }}>
            <span className="badge-yellow" style={{ marginBottom: "0.5rem" }}>
              Garantía y Calidad Original
            </span>
            <h1 style={{ fontSize: "2.3rem", marginTop: "0.5rem", marginBottom: "0.5rem", color: "#111" }}>
              Nuestras Marcas Aliadas
            </h1>
            <p style={{ color: "#5A6A80", fontSize: "1.05rem", maxWidth: "800px" }}>
              En <strong>Rembert Repuestos BCA</strong> distribuimos exclusivamente marcas líderes a nivel mundial y nacional para garantizar la protección extrema de tu vehículo o flota.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {displayBrands.map((brand, i) => (
              <div
                key={brand.slug || i}
                style={{
                  background: "#FFFFFF",
                  borderRadius: "12px",
                  padding: "1.5rem 1rem",
                  textAlign: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  border: "1px solid #E2E8F0",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "center",
                  transition: "transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
                  transform: "perspective(700px) rotateX(0deg)",
                }}
                className="hover-card"
              >
                <div
                  style={{
                    height: "70px",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#FFFFFF",
                    borderRadius: "8px",
                    padding: "0.75rem",
                    marginBottom: "1rem",
                    border: "1px solid #E2E8F0",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9), 0 2px 8px rgba(15,23,42,0.05)",
                    transform: "translateZ(8px)",
                  }}
                >
                  <Image
                    src={brand.logo}
                    alt={`Logo ${brand.name}`}
                    width={130}
                    height={50}
                    style={{ maxHeight: "46px", maxWidth: "120px", objectFit: "contain" }}
                    loading="lazy"
                  />
                </div>

                <h3 style={{ fontSize: "1.05rem", fontWeight: "800", color: "#111", margin: "0 0 0.25rem 0" }}>
                  {brand.name}
                </h3>
                <p style={{ color: "#718096", fontSize: "0.85rem", marginBottom: "1.2rem" }}>
                  {brand.count} productos disponibles
                </p>

                <Link
                  href={brand.slug === "gti" ? "/marcas/gti" : `/catalogo?brand=${brand.slug}`}
                  className="btn btn--primary"
                  style={{
                    width: "100%",
                    padding: "0.55rem 1rem",
                    fontSize: "0.85rem",
                    textTransform: "uppercase",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Ver Catálogo
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
