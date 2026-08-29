import CatalogSidebar from "@/components/CatalogSidebar";
import MarcasExplorer from "@/components/MarcasExplorer";

export const revalidate = false;

export const metadata = {
  title: "Marcas y Fabricantes Automotrices | REMBERT Repuestos",
  description:
    "Busca y encuentra repuestos automotrices por marca y fabricante: Chevrolet, Renault, Toyota, Kia, Hyundai, Mazda, GTI, Verke, TNK, WIX, Bosch, Incolbest y más en Barrancabermeja con envíos a Colombia.",
  alternates: {
    canonical: "/marcas",
  },
  openGraph: {
    title: "Marcas y Fabricantes Automotrices | REMBERT Repuestos",
    description:
      "Filtros, radiadores, frenos, suspensión, rodamientos y repuestos de las marcas líderes en REMBERT con envíos a toda Colombia.",
    url: "https://www.rembertrepuestos.com/marcas",
  },
};

export default function MarcasPage() {
  return (
    <main className="main-container section catalog-layout">
      <CatalogSidebar />
      <div className="catalog-content">
        <div style={{ padding: "0.5rem 0 2rem", minHeight: "60vh" }}>
          <MarcasExplorer />
        </div>
      </div>
    </main>
  );
}
