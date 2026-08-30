import Catalogo, { generateMetadata as generateCatalogMetadata } from "../../page";

const STATIC_CATEGORIES = [
  "todos",
  "filtros",
  "lubricantes-gasolina",
  "transmision",
  "electrico-y-encendido",
  "motor-y-distribucion",
  "embrague",
  "rodamientos-y-traccion",
  "frenos-y-suspension",
  "radiadores",
  "combustible",
  "mangueras-y-tubos",
  "soportes-retenedores-y-guayas",
  "carroceria-iluminacion",
  "repuestos-varios",
  "mantenimiento",
  "siliconas",
];

export const dynamicParams = false;
export const revalidate = false;

export function generateStaticParams() {
  return STATIC_CATEGORIES.map((category) => ({ category }));
}

export async function generateMetadata({ params }) {
  const { category } = await params;
  const searchParams = category === "todos" ? {} : { category };
  return generateCatalogMetadata({ searchParams: Promise.resolve(searchParams) });
}

export default async function StaticCategoryPage({ params }) {
  const { category } = await params;
  const searchParams = category === "todos" ? {} : { category };
  // Renderizar el componente de página como elemento conserva el límite entre
  // Server Components y los controles de cliente del catálogo (paginación).
  return <Catalogo searchParams={Promise.resolve(searchParams)} />;
}
