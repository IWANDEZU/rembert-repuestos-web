"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { buildCatalogHref } from "@/lib/catalogUtils";

/**
 * Genera la lista de números de página con elipses inteligentes.
 */
function getPaginationRange(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const items = [];
  let leftBound = Math.max(2, currentPage - 1);
  let rightBound = Math.min(totalPages - 1, currentPage + 1);

  if (currentPage <= 4) {
    leftBound = 2;
    rightBound = 5;
  } else if (currentPage >= totalPages - 3) {
    leftBound = totalPages - 4;
    rightBound = totalPages - 1;
  }

  items.push(1);

  if (leftBound > 2) {
    items.push("ellipsis-left");
  }

  for (let p = leftBound; p <= rightBound; p++) {
    items.push(p);
  }

  if (rightBound < totalPages - 1) {
    items.push("ellipsis-right");
  }

  items.push(totalPages);

  return items;
}

export default function CatalogPagination({
  currentPage = 1,
  totalPages = 1,
  totalProducts = 0,
  queryFilters = {},
}) {
  const router = useRouter();

  if (totalPages <= 1) return null;

  const buildHref = (page) => buildCatalogHref({ ...queryFilters, page });
  const paginationItems = getPaginationRange(currentPage, totalPages);
  const pageOptions = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handleSelectChange = (e) => {
    const selectedPage = Number(e.target.value);
    if (selectedPage && selectedPage !== currentPage) {
      router.push(buildHref(selectedPage));
    }
  };

  return (
    <nav
      className="catalog-pagination-container"
      aria-label="Paginación y selección directa de páginas del catálogo"
    >
      <div className="catalog-pagination-main">
        {/* Botón Anterior */}
        {currentPage > 1 ? (
          <Link
            href={buildHref(currentPage - 1)}
            rel="prev"
            className="btn btn--outline catalog-pagination__nav-btn"
            aria-label="Ir a la página anterior"
          >
            &larr; Anterior
          </Link>
        ) : (
          <span
            className="btn btn--outline catalog-pagination__nav-btn is-disabled"
            aria-disabled="true"
          >
            &larr; Anterior
          </span>
        )}

        {/* Lista de números de página (1 a totalPages) */}
        <div className="catalog-pagination__numbers" role="list">
          {paginationItems.map((item, index) => {
            if (typeof item === "string") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="catalog-pagination__ellipsis"
                  aria-hidden="true"
                >
                  &hellip;
                </span>
              );
            }

            const isCurrent = item === currentPage;
            return (
              <Link
                key={`page-${item}`}
                href={buildHref(item)}
                className={`catalog-pagination__number-btn ${isCurrent ? "is-active" : ""}`}
                aria-current={isCurrent ? "page" : undefined}
                aria-label={`Página ${item}`}
              >
                {item}
              </Link>
            );
          })}
        </div>

        {/* Botón Siguiente */}
        {currentPage < totalPages ? (
          <Link
            href={buildHref(currentPage + 1)}
            rel="next"
            className="btn btn--outline catalog-pagination__nav-btn"
            aria-label="Ir a la página siguiente"
          >
            Siguiente &rarr;
          </Link>
        ) : (
          <span
            className="btn btn--outline catalog-pagination__nav-btn is-disabled"
            aria-disabled="true"
          >
            Siguiente &rarr;
          </span>
        )}
      </div>

      {/* Selector directo de página para ver y seleccionar cualquiera de las 1 a N páginas */}
      <div className="catalog-pagination__jump">
        <label htmlFor="catalog-page-select" className="catalog-pagination__jump-label">
          Ir a la página:
        </label>
        <div className="catalog-pagination__select-wrapper">
          <select
            id="catalog-page-select"
            value={currentPage}
            onChange={handleSelectChange}
            className="catalog-pagination__select"
            aria-label={`Seleccionar página de la 1 a la ${totalPages}`}
          >
            {pageOptions.map((p) => (
              <option key={p} value={p}>
                Página {p} de {totalPages}
              </option>
            ))}
          </select>
        </div>
      </div>
    </nav>
  );
}
