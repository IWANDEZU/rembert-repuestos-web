import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { buildCatalogHref } from "@/lib/catalogUtils";

function CatalogLink({ href, active, children, className = "" }) {
  return (
    <Link
      href={href}
      className={`catalog-menu__link ${active ? "is-active" : ""} ${className}`}
      aria-current={active ? "page" : undefined}
    >
      {children}
    </Link>
  );
}

export default async function CatalogSidebar({
  categoryParam,
  brandParam,
  tipoParam,
  searchQuery,
  sortParam,
}) {
  let brands = [];
  try {
    brands = await prisma.brand.findMany({ 
      where: { slug: { not: 'vanssoil' } },
      orderBy: { name: "asc" } 
    });
  } catch (err) {
    brands = [
      { id: "1", name: "Castrol", slug: "castrol" },
      { id: "2", name: "Mobil", slug: "mobil" },
      { id: "3", name: "Shell", slug: "shell" },
      { id: "4", name: "Terpel", slug: "terpel" },
      { id: "5", name: "Chevron", slug: "chevron" },
      { id: "6", name: "Liqui Moly", slug: "liqui-moly" },
      { id: "7", name: "Bosch", slug: "bosch" },
      { id: "8", name: "WIX Filters", slug: "wix" },
      { id: "9", name: "Partmo", slug: "partmo" },
      { id: "10", name: "ACDelco", slug: "acdelco" },
      { id: "11", name: "Motorcraft", slug: "motorcraft" },
      { id: "12", name: "Incolbest", slug: "incolbest" },
      { id: "13", name: "Gabriel", slug: "gabriel" },
    ];
  }

  const sharedFilters = { brand: brandParam, search: searchQuery, sort: sortParam };
  const categoryHref = (category, tipo) => buildCatalogHref({ ...sharedFilters, category, tipo });

  const hasActiveFilters = !!(categoryParam || brandParam || searchQuery || tipoParam);
  const backHref = hasActiveFilters ? "/catalogo" : "/";

  return (
    <aside className="catalog-sidebar" aria-label="Filtros del catálogo">
      <div className="catalog-sidebar__mobile-nav">
        <Link href={backHref} className="catalog-sidebar__back-btn" title="Volver">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="catalog-sidebar__back-icon">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          <span>Volver</span>
        </Link>
        
        <input type="checkbox" id="sidebar-toggle" className="catalog-sidebar__toggle-checkbox" />
        <label htmlFor="sidebar-toggle" className="catalog-sidebar__toggle-label">
          Filtrar catálogo
        </label>
        
        <div className="catalog-sidebar__panel">
          <h2 className="catalog-sidebar__title">Categorías</h2>
          <nav aria-label="Categorías de productos">
            <ul className="catalog-menu">
              <li><CatalogLink href="/catalogo" active={!categoryParam && !brandParam}>Todas las categorías</CatalogLink></li>
              <li>
                <CatalogLink href={categoryHref("lubricantes")} active={categoryParam === "lubricantes"}>Lubricantes</CatalogLink>
                <ul className="catalog-menu catalog-menu--nested">
                  <li><CatalogLink href={categoryHref("lubricantes-gasolina")} active={categoryParam === "lubricantes-gasolina"}>Gasolina</CatalogLink></li>
                  <li><CatalogLink href={categoryHref("transmision")} active={categoryParam === "transmision"}>Transmisión</CatalogLink></li>
                  <li><CatalogLink href={categoryHref("hidraulico")} active={categoryParam === "hidraulico"}>Hidráulicos</CatalogLink></li>
                  <li><CatalogLink href={categoryHref("coolant")} active={categoryParam === "coolant"}>Refrigerantes</CatalogLink></li>
                  <li><CatalogLink href={categoryHref("grasas-y-aditivos")} active={categoryParam === "grasas-y-aditivos"}>Grasas y aditivos</CatalogLink></li>
                </ul>
              </li>
              <li>
                <CatalogLink href={categoryHref("filtros")} active={categoryParam === "filtros" && !tipoParam}>Filtros</CatalogLink>
                <ul className="catalog-menu catalog-menu--nested">
                  {[["aceite", "Aceite"], ["aire", "Aire"], ["combustible", "Combustible"], ["cabina", "Cabina"]].map(([tipo, label]) => (
                    <li key={tipo}><CatalogLink href={categoryHref("filtros", tipo)} active={categoryParam === "filtros" && tipoParam === tipo}>{label}</CatalogLink></li>
                  ))}
                </ul>
              </li>
              <li><CatalogLink href={categoryHref("frenos-y-suspension")} active={categoryParam === "frenos-y-suspension"}>Frenos y suspensión</CatalogLink></li>
              <li><CatalogLink href={categoryHref("radiadores")} active={categoryParam === "radiadores"}>Radiadores</CatalogLink></li>
              <li><CatalogLink href={categoryHref("servicio-tecnico")} active={categoryParam === "servicio-tecnico"}>Servicio técnico</CatalogLink></li>
            </ul>
          </nav>

          <h2 className="catalog-sidebar__title">Marca</h2>
          <ul className="catalog-brand-list">
            {brands.map((brand) => {
              const href = buildCatalogHref({ category: categoryParam, brand: brand.slug, tipo: tipoParam, search: searchQuery, sort: sortParam });
              const active = brandParam === brand.slug;
              return (
                <li key={brand.id}>
                  <Link href={href} className={`catalog-brand-link ${active ? "is-active" : ""}`} aria-current={active ? "page" : undefined}>
                    <span className="catalog-brand-link__marker" aria-hidden="true" />
                    {brand.name}
                  </Link>
                </li>
              );
            })}
          </ul>
          {(categoryParam || brandParam || searchQuery || tipoParam) && <Link href="/catalogo" className="btn btn--outline catalog-clear">Limpiar filtros</Link>}
        </div>
      </div>
    </aside>
  );
}
