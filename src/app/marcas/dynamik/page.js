import Image from "next/image";
import Link from "next/link";
import CatalogSidebar from "@/components/CatalogSidebar";
import { siteUrl } from "@/lib/site";
import { products } from "@/lib/products";
import { getProductDisplayImage } from "@/lib/productImage";

const brandUrl = `${siteUrl}/marcas/dynamik`;
const catalogUrl = `${siteUrl}/catalogo?brand=dynamik`;
const featuredSkus = [
  "DNK7570D696SM",
  "DNK7641D774SM",
  "DNK7667D797SM",
  "DNK7685D808SD",
  "DNK7688D863SM",
  "DNK7611D741SM",
];
const verifiedPhotoPreviews = featuredSkus
  .map((sku) => products.find((product) => product.sku === sku))
  .filter((product) => product?.imageStatus === "exact-real-photo" && getProductDisplayImage(product));

export const metadata = {
  title: "Dynamik: Pastillas y Discos de Freno por Referencia",
  description: "Catálogo Dynamik de pastillas y discos de freno en REMBERT Repuestos. Cotiza por referencia, VIN y sistema de freno desde Barrancabermeja para Colombia.",
  keywords: [
    "Dynamik Colombia",
    "pastillas Dynamik",
    "discos Dynamik",
    "pastillas de freno Dynamik",
    "repuestos Dynamik Barrancabermeja",
    "Dynamik Hyundai Atos",
  ],
  alternates: { canonical: "/marcas/dynamik" },
  openGraph: {
    title: "Dynamik: Pastillas y Discos de Freno | REMBERT",
    description: "Línea Dynamik de fricción: cotización precisa de pastillas y discos por VIN y referencia.",
    url: brandUrl,
    type: "website",
    images: [{
      url: "/catalogo-dynamik/dynamik-pastillas-discos-catalogo.jpg",
      width: 1120,
      height: 1600,
      alt: "Línea Dynamik de pastillas y discos de freno",
    }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Dynamik: pastillas y discos de freno",
  description: "Selección REMBERT de la línea Dynamik para fricción automotriz, bajo validación por VIN y referencia.",
  url: brandUrl,
  isPartOf: { "@type": "WebSite", name: "REMBERT Repuestos BCA", url: siteUrl },
  about: {
    "@type": "Brand",
    name: "Dynamik",
    description: "Línea de pastillas y discos de freno para aplicaciones automotrices.",
  },
  mainEntity: {
    "@type": "ItemList",
    name: "Catálogo Dynamik en REMBERT",
    numberOfItems: 7,
    itemListElement: [
      "Pastillas de freno Dynamik por referencia",
      "Discos de freno Dynamik por referencia",
      "DNK8258D1148SM Hyundai Atos",
      "DNK7289D400SM Mazda 626 / MX-6",
      "DNK7937D1033LM Chevrolet HHR / Cobalt / Malibu",
      "DK18017GMS Mazda CX-5",
      "DNK000TY21D Toyota Corolla 2014+",
    ].map((name, position) => ({ "@type": "ListItem", position: position + 1, name })),
  },
};

export default function DynamikBrandPage() {
  return (
    <main className="main-container section catalog-layout">
      <CatalogSidebar />
      <article className="catalog-content" style={{ paddingBottom: "3rem" }}>
        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: "clamp(1.5rem, 4vw, 3rem)", alignItems: "center", padding: "clamp(1.25rem, 4vw, 3rem) 0" }}>
          <div>
            <p style={{ color: "#d46200", fontWeight: 800, letterSpacing: ".08em", fontSize: ".78rem", margin: "0 0 .55rem", textTransform: "uppercase" }}>Marca de fricción</p>
            <h1 style={{ color: "#101010", fontSize: "clamp(2rem, 5vw, 3.45rem)", lineHeight: 1.05, margin: "0 0 1rem" }}>Dynamik: pastillas y discos de freno</h1>
            <p style={{ color: "#475569", fontSize: "1.06rem", lineHeight: 1.65, maxWidth: "65ch", margin: "0 0 1.25rem" }}>
              Referencias Dynamik para frenos de disco. Cotizamos la pieza correcta con VIN, eje y código de fabricante; no recomendamos ni despachamos fricción solamente por apariencia.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: ".7rem" }}>
              <Link href="/catalogo?brand=dynamik" className="btn btn--primary">Ver catálogo Dynamik</Link>
              <Link href="/catalogo?brand=dynamik&category=frenos-y-suspension" className="btn btn--outline">Pastillas y discos</Link>
            </div>
          </div>
          <div style={{ position: "relative", minHeight: "240px", borderRadius: "18px", overflow: "hidden", background: "#111" }}>
            <Image src="/catalogo-dynamik/dynamik-pastillas-discos-catalogo.jpg" alt="Catálogo gráfico Dynamik de pastillas y discos" fill sizes="(max-width: 800px) 100vw, 34vw" style={{ objectFit: "cover", objectPosition: "center" }} priority />
          </div>
        </section>

        <section aria-labelledby="dynamik-lineas" style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "clamp(1.1rem, 3vw, 1.75rem)", marginBottom: "1.25rem" }}>
          <h2 id="dynamik-lineas" style={{ color: "#111827", margin: "0 0 .7rem" }}>Líneas que puedes cotizar</h2>
          <ul style={{ color: "#475569", lineHeight: 1.7, margin: 0, paddingLeft: "1.2rem" }}>
            <li>Pastillas en formulaciones Low Metallic, Semi Metallic, Carboceramic y Severe Duty según SKU.</li>
            <li>Discos sólidos o ventilados, con acabado y recubrimiento definidos por referencia.</li>
            <li>Validación técnica por VIN, eje, medidas, sistema de freno y código Dynamik.</li>
          </ul>
        </section>

        <section aria-labelledby="dynamik-fotos-reales" style={{ marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: "1rem", flexWrap: "wrap", marginBottom: ".85rem" }}>
            <div>
              <p style={{ color: "#d46200", fontWeight: 800, letterSpacing: ".08em", fontSize: ".76rem", margin: "0 0 .3rem", textTransform: "uppercase" }}>Por NPC</p>
              <h2 id="dynamik-fotos-reales" style={{ color: "#111827", margin: 0 }}>Fotos reales verificadas</h2>
            </div>
            <Link href="/catalogo?brand=dynamik" className="btn btn--outline">Ver las 570 referencias</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 170px), 1fr))", gap: ".85rem" }}>
            {verifiedPhotoPreviews.map((product) => {
              const image = getProductDisplayImage(product);
              return (
                <Link key={product.sku} href={`/producto/${product.slug || product.id}`} style={{ display: "block", color: "inherit", textDecoration: "none", background: "#111827", border: "1px solid #334155", borderRadius: "14px", padding: ".65rem", overflow: "hidden" }}>
                  <div style={{ position: "relative", height: "150px", borderRadius: "9px", overflow: "hidden", background: "#fff" }}>
                    <Image src={image} alt={`Fotografía real de la pastilla Dynamik ${product.sku}`} fill sizes="(max-width: 640px) 48vw, 190px" style={{ objectFit: "contain", padding: "8px" }} />
                  </div>
                  <p style={{ color: "#f8fafc", fontSize: ".83rem", fontWeight: 750, lineHeight: 1.25, margin: ".65rem 0 .35rem" }}>{product.name}</p>
                  <span style={{ color: "#facc15", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: ".72rem", fontWeight: 800 }}>{product.sku}</span>
                </Link>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="dynamik-seguridad" style={{ borderLeft: "4px solid #f97316", padding: "1rem 1.1rem", background: "#fff7ed", color: "#4a260b" }}>
          <h2 id="dynamik-seguridad" style={{ fontSize: "1rem", margin: "0 0 .35rem" }}>Antes de comprar</h2>
          <p style={{ margin: 0, lineHeight: 1.55 }}>La misma marca y modelo puede llevar frenos distintos según año, versión o mercado. Envíanos VIN o placa y confirma el eje antes de instalar.</p>
        </section>
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  );
}
