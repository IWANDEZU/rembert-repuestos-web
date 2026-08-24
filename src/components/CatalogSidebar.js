import Link from "next/link";
import { buildCatalogHref } from "@/lib/catalogUtils";
import { products as fallbackCatalogProducts } from "@/lib/products";
import { inventoryLineSummary } from "@/data/inventoryProducts";

function getFallbackBrands() {
  const brandMap = new Map();
  for (const product of fallbackCatalogProducts) {
    if (!product.brand?.slug || ["vanssoil", "loctite"].includes(product.brand.slug)) continue;
    const existing = brandMap.get(product.brand.slug);
    if (existing) {
      existing.count += 1;
    } else {
      brandMap.set(product.brand.slug, {
        id: product.brand.slug,
        name: product.brand.name,
        slug: product.brand.slug,
        count: 1,
      });
    }
  }
  return Array.from(brandMap.values()).sort((a, b) => a.name.localeCompare(b.name, "es"));
}

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

export default function CatalogSidebar({
  categoryParam,
  brandParam,
  tipoParam,
  lineParam,
  vehicleParam,
  partParam,
  searchQuery,
  sortParam,
}) {
  const brands = getFallbackBrands();

  const categoryHref = (category, tipo) => buildCatalogHref({ category, tipo, search: searchQuery, sort: sortParam });

  const hasActiveFilters = !!(categoryParam || brandParam || searchQuery || tipoParam || lineParam || vehicleParam || partParam);
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
              <li>
                <CatalogLink
                  href={buildCatalogHref({ search: searchQuery, sort: sortParam })}
                  active={!categoryParam && !brandParam && !lineParam && !vehicleParam && !partParam}
                >
                  Todas las categorías
                </CatalogLink>
              </li>
              <li>
                <CatalogLink href={categoryHref("filtros")} active={categoryParam === "filtros" && !tipoParam}>Filtros</CatalogLink>
                <ul className="catalog-menu catalog-menu--nested">
                  {[["aceite", "Aceite"], ["aire", "Aire"], ["combustible", "Combustible"], ["cabina", "Cabina"]].map(([tipo, label]) => (
                    <li key={tipo}><CatalogLink href={categoryHref("filtros", tipo)} active={categoryParam === "filtros" && tipoParam === tipo}>{label}</CatalogLink></li>
                  ))}
                </ul>
              </li>
              <li><CatalogLink href={categoryHref("lubricantes-gasolina")} active={categoryParam === "lubricantes-gasolina"}>Lubricantes y fluidos</CatalogLink></li>
              <li><CatalogLink href={categoryHref("transmision")} active={categoryParam === "transmision"}>Transmisiones</CatalogLink></li>
              <li><CatalogLink href={categoryHref("electrico-y-encendido")} active={categoryParam === "electrico-y-encendido"}>PARTES ELÉCTRICAS</CatalogLink></li>
              <li><CatalogLink href={categoryHref("motor-y-distribucion")} active={categoryParam === "motor-y-distribucion"}>Motor y distribución</CatalogLink></li>
              <li><CatalogLink href={categoryHref("embrague")} active={categoryParam === "embrague"}>Embrague</CatalogLink></li>
              <li><CatalogLink href={categoryHref("rodamientos-y-traccion")} active={categoryParam === "rodamientos-y-traccion"}>Rodamientos y tracción</CatalogLink></li>
              <li><CatalogLink href={categoryHref("frenos-y-suspension")} active={categoryParam === "frenos-y-suspension"}>Frenos y suspensión</CatalogLink></li>
              <li><CatalogLink href={categoryHref("radiadores")} active={categoryParam === "radiadores"}>Radiadores</CatalogLink></li>
              <li><CatalogLink href={categoryHref("combustible")} active={categoryParam === "combustible"}>Combustible e inyección</CatalogLink></li>
              <li><CatalogLink href={categoryHref("mangueras-y-tubos")} active={categoryParam === "mangueras-y-tubos"}>Mangueras y tubos</CatalogLink></li>
              <li><CatalogLink href={categoryHref("soportes-retenedores-y-guayas")} active={categoryParam === "soportes-retenedores-y-guayas"}>Soportes, retenedores y guayas</CatalogLink></li>
              <li><CatalogLink href={categoryHref("carroceria-iluminacion")} active={categoryParam === "carroceria-iluminacion"}>Carrocería e iluminación</CatalogLink></li>
              <li><CatalogLink href={categoryHref("repuestos-varios")} active={categoryParam === "repuestos-varios"}>Otros repuestos</CatalogLink></li>
            </ul>
          </nav>

          <details className="catalog-lines" open={Boolean(lineParam)}>
            <summary className="catalog-sidebar__title">Líneas del inventario</summary>
            <ul className="catalog-brand-list">
              {inventoryLineSummary
                .filter((line) => line.name !== "SIN LINEA")
                .map((line) => {
                  const active = lineParam === line.name;
                  const href = buildCatalogHref({
                    line: active ? undefined : line.name,
                    search: searchQuery,
                    sort: sortParam,
                  });
                  return (
                    <li key={line.name}>
                      <Link href={href} className={`catalog-brand-link ${active ? "is-active" : ""}`} aria-current={active ? "page" : undefined}>
                        <span className="catalog-brand-link__marker" aria-hidden="true" />
                        <span>{line.name}</span>
                        <small aria-label={`${line.count} referencias`}>{line.count}</small>
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </details>

          <h2 className="catalog-sidebar__title">Marca</h2>
          <ul className="catalog-brand-list">
            {brands.map((brand) => {
              const active = brandParam === brand.slug;
              const href = buildCatalogHref({
                brand: active ? undefined : brand.slug,
                search: searchQuery,
                sort: sortParam,
              });
              return (
                <li key={brand.id}>
                  <Link href={href} className={`catalog-brand-link ${active ? "is-active" : ""}`} aria-current={active ? "page" : undefined}>
                    <span className="catalog-brand-link__marker" aria-hidden="true" />
                    <span>{brand.name}</span>
                    {brand.count > 0 && <small aria-label={`${brand.count} referencias`}>{brand.count}</small>}
                  </Link>
                </li>
              );
            })}
          </ul>
          {hasActiveFilters && <Link href="/catalogo" className="btn btn--outline catalog-clear">Limpiar filtros</Link>}
        </div>
      </div>
    </aside>
  );
}
