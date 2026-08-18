import { prisma } from "@/lib/prisma"
import Link from "next/link"
import BrandLogo from "@/components/BrandLogo"
import CatalogSidebar from "@/components/CatalogSidebar"

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Marcas aliadas de lubricantes y filtros",
  description:
    "Trabajamos con las marcas líderes a nivel mundial: Shell, Mobil, Castrol, Terpel, Chevron, WIX Filters, Bosch, Liqui Moly y más en Barrancabermeja.",
  alternates: {
    canonical: "/marcas",
  },
  openGraph: {
    title: "Marcas aliadas de Victor Services",
    description:
      "Lubricantes y filtros de las marcas líderes a nivel mundial con envíos a toda Colombia.",
    url: "https://www.victorservicesas.com/marcas",
  },
};

export default async function MarcasPage() {
  const brands = await prisma.brand.findMany({
    where: {
      slug: { not: 'vanssoil' }
    },
    include: {
      _count: {
        select: { products: true }
      }
    }
  })

  const brandLogos = {
    // Marcas internacionales — logos locales del repo
    'shell':      '/05_shell_logo_oficial.png',
    'mobil':      '/07_mobil_logo_oficial.png',
    'castrol':    '/06_castrol_logo_oficial.png',
    'terpel':     '/04_terpel_logo_oficial.png',
    'chevron':    '/14_chevron_lubricants_logo_oficial.png',
    'wix':        '/01_wix_filters_logo_oficial.png',
    'mazda':      '/logos/mazda.svg',
    'coexito':    '/03_coexito_logo_oficial.png',
    // Marcas internacionales — logos descargados localmente
    'liqui-moly': '/logos/liqui-moly.svg',
    'bosch':      '/logos/bosch.svg',
    'partmo':     '/logos/partmo-real.png',
    'caterpillar':'/logos/caterpillar-3d.png',
    // Marcas de repuestos: archivos de identidad reales, preservados sin redibujar.
    'valvoline':  '/logos/valvoline-real.svg',
    'motorcraft': '/logos/motorcraft-real.svg',
    'acdelco':    '/logos/acdelco-real.svg',
    'donsson':    '/logos/donsson-real.png',
    'gabriel':    '/logos/gabriel-real.png',
    'incolbest':  '/logos/incolbest-real.png',
    // Marcas nacionales colombianas — logos descargados / oficiales
    'global-oil': '/logos/global-oil.png',
    'max-power':  '/logos/max-power.png',
    'petroil':    '/logos/petroil.png',
    'lubrisol':   '/logos/lubrisol-gen.png',
  };

  // Logos con fondo blanco/transparente que no se leen bien sin el filtro
  const brandFilterBlack = new Set(['wix', 'global-oil']);

  return (
    <main className="main-container section catalog-layout">
      <CatalogSidebar />
      <div className="catalog-content">
        <div style={{ padding: '3rem 1rem', minHeight: '60vh' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>Nuestras Marcas Aliadas</h1>
          <p style={{ color: '#666', marginBottom: '3rem', fontSize: '1.2rem' }}>
            En Multiservicios Victor Services trabajamos exclusivamente con las marcas líderes a nivel mundial para garantizar el máximo rendimiento y protección de su motor.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '2rem' }}>
            {brands.map((brand) => (
              <div key={brand.id} style={{ 
                background: 'white', 
                borderRadius: '8px', 
                padding: '2rem', 
                textAlign: 'center',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                border: '1px solid #eee',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <BrandLogo src={brandLogos[brand.slug]} name={brand.name} filterBlack={brandFilterBlack.has(brand.slug)} />
                
                <p style={{ color: '#888', marginBottom: '1rem' }}>{brand._count.products} productos</p>
                <Link href={`/catalogo?brand=${brand.slug}`} style={{
                  display: 'inline-block',
                  background: 'var(--primary-color)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}>
                  Ver Catálogo
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
