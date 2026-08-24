import Catalogo from "../../catalogo/page";
import { siteUrl } from "@/lib/site";

export const revalidate = false;

export const metadata = {
  title: "Repuestos GTI Autoparts | Puntas de eje y tulipas | REMBERT",
  description:
    "Catálogo REMBERT de repuestos GTI Autoparts: 47 referencias de puntas de eje y tulipas para Renault, Chevrolet, Daewoo, Kia, Hyundai y Mazda, con validación por VIN.",
  alternates: {
    canonical: `${siteUrl}/marcas/gti`,
  },
  openGraph: {
    title: "Repuestos GTI Autoparts | REMBERT",
    description:
      "Puntas de eje y tulipas GTI con referencia, aplicación y controles de compatibilidad antes del despacho.",
    url: `${siteUrl}/marcas/gti`,
    images: ["/catalogo-gti/gti-linea-homocinetica-studio-v2.webp"],
  },
};

export default function GtiBrandPage() {
  return Catalogo({ searchParams: Promise.resolve({ brand: "gti" }) });
}
