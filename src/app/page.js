import Link from "next/link";
import Image from "next/image";
import { products as fallbackProducts } from "@/lib/products";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

const brandLogos = [
  { name: "Shell", src: "/05_shell_logo_oficial.png" },
  { name: "Mobil", src: "/07_mobil_logo_oficial.png" },
  { name: "Castrol", src: "/06_castrol_logo_oficial.png" },
  { name: "Terpel", src: "/04_terpel_logo_oficial.png" },
  { name: "Chevron", src: "/14_chevron_lubricants_logo_oficial.png" },
  { name: "Liqui Moly", src: "/logos/liqui-moly.svg" },
  { name: "Bosch", src: "/logos/bosch.svg" },
  { name: "WIX Filters", src: "/01_wix_filters_logo_oficial.png", darkBg: true },
  { name: "Partmo", src: "/logos/partmo-real.png" },
  { name: "Mazda", src: "/logos/mazda.svg", darkBg: true },
  { name: "Coéxito", src: "/03_coexito_logo_oficial.png" },
  { name: "Global Oil", src: "/logos/global-oil.png", darkBg: true },
  { name: "Max Power", src: "/logos/max-power.png" },
  { name: "Caterpillar", src: "/logos/caterpillar.svg" },
  { name: "Valvoline", src: "/logos/valvoline.svg" },
  { name: "Petroil", src: "/logos/petroil.png" },
];

export default async function Home() {
  let featuredProducts = [];
  try {
    const dbProducts = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        category: true,
        brand: true,
        images: true,
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    });
    featuredProducts = dbProducts.length > 0 ? dbProducts : fallbackProducts;
  } catch (err) {
    featuredProducts = fallbackProducts;
  }

  return (
    <main>
      {/* Hero Section (Oscuro) */}
      <header className="hero" style={{ 
        background: '#101010',
        alignItems: 'flex-start',
        textAlign: 'left',
        padding: '5rem 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Image
          src="/mecanico.jpg"
          alt="Mantenimiento de motores diésel y cambio de lubricantes en Barrancabermeja"
          fill
          priority
          sizes="100vw"
          quality={75}
          style={{ objectFit: 'cover', zIndex: 0 }}
        />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(90deg, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.7) 100%)' }} />
        
        {/* Logo Giratorio de Fondo con Resplandor Pulsante (2s) */}
        <div style={{
          position: 'absolute',
          top: '50%',
          right: '-5%',
          transform: 'translateY(-50%)',
          width: 'clamp(300px, 80vw, 800px)',
          height: 'clamp(300px, 80vw, 800px)',
          zIndex: 1,
          pointerEvents: 'none'
        }} className="spin-slow">
          <Image src="/logo.png" alt="Victor Services Barrancabermeja" fill sizes="800px" quality={60} style={{ objectFit: 'contain', opacity: 0.8 }} className="pulse-glow" />
        </div>

        <div className="main-container" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative', zIndex: 2 }}>
          <div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', maxWidth: '800px', lineHeight: 1.1, marginBottom: '1rem', textTransform: 'uppercase' }}>
              Lubricantes y filtros <br/>
              <span className="text-primary">para motores diésel y gasolina</span>
            </h1>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
            <Link href="/catalogo" className="btn btn--primary" style={{ padding: '1rem 2rem' }}>VER PRODUCTOS</Link>
            <a href="https://wa.me/573108737354" target="_blank" rel="noopener noreferrer" className="btn btn--outline" style={{ padding: '1rem 2rem', color: '#fff', borderColor: '#fff' }}>
              <span style={{ color: '#25D366' }}>💬</span> COMPRAR POR WHATSAPP
            </a>
          </div>

        </div>
      </header>

      {/* Cenefa Móvil de Marcas (Limpia, Cápsulas Redondas) */}
      <div className="marquee-container">
        <div className="marquee-track">
          <div className="marquee-group">
            {brandLogos.map((b, i) => (
              <div className={`marquee-item-wrapper ${b.darkBg ? 'marquee-item-wrapper--dark' : ''}`} key={`a-${i}`}>
                <Image src={b.src} alt={b.name} className="marquee-item" width={160} height={72} sizes="160px" loading="lazy" />
              </div>
            ))}
          </div>
          <div className="marquee-group" aria-hidden="true">
            {brandLogos.map((b, i) => (
              <div className={`marquee-item-wrapper ${b.darkBg ? 'marquee-item-wrapper--dark' : ''}`} key={`b-${i}`}>
                <Image src={b.src} alt="" className="marquee-item" width={160} height={72} sizes="160px" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categorías Principales (Claro) */}
      <section className="section section--light">
        <div className="main-container">
          <h2 style={{ marginBottom: '2rem', textTransform: 'uppercase' }}>Categorías Principales</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            
            {/* Categoría 1: Mantenimiento y Lubricación */}
            <Link href="/catalogo?category=lubricantes" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ 
                background: '#fff', 
                borderRadius: 'var(--border-radius)', 
                padding: '1.5rem', 
                textAlign: 'center',
                boxShadow: 'var(--box-shadow-light)',
                cursor: 'pointer',
                border: '1px solid transparent',
                transition: 'var(--transition)'
              }} className="hover-card">
                <div style={{ height: '180px', borderRadius: '8px', marginBottom: '1rem', overflow: 'hidden', position: 'relative' }}>
                  <Image src="/mecanico.jpg" alt="Mantenimiento y Lubricación" fill sizes="(max-width: 700px) 100vw, 25vw" quality={75} style={{ objectFit: 'cover' }} />
                </div>
                <strong style={{ fontSize: '1.2rem', color: 'var(--primary-color)' }}>Lubricantes y Aceites</strong>
              </div>
            </Link>

            {/* Categoría 2: Filtros */}
            <Link href="/catalogo?category=filtros" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ 
                background: '#fff', 
                borderRadius: 'var(--border-radius)', 
                padding: '1.5rem', 
                textAlign: 'center',
                boxShadow: 'var(--box-shadow-light)',
                cursor: 'pointer',
                border: '1px solid transparent',
                transition: 'var(--transition)'
              }} className="hover-card">
                <div style={{ height: '180px', borderRadius: '8px', marginBottom: '1rem', overflow: 'hidden', position: 'relative' }}>
                  <Image src="/filtro-aceite.jpg" alt="Filtros de Motor" fill sizes="(max-width: 700px) 100vw, 25vw" quality={75} style={{ objectFit: 'cover' }} />
                </div>
                <strong style={{ fontSize: '1.2rem' }}>Filtros Automotrices</strong>
              </div>
            </Link>

            {/* Categoría 3: Frenos y Suspensión */}
            <Link href="/catalogo?category=frenos-y-suspension" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ 
                background: '#fff', 
                borderRadius: 'var(--border-radius)', 
                padding: '1.5rem', 
                textAlign: 'center',
                boxShadow: 'var(--box-shadow-light)',
                cursor: 'pointer',
                border: '1px solid transparent',
                transition: 'var(--transition)'
              }} className="hover-card">
                <div style={{ height: '180px', borderRadius: '8px', marginBottom: '1rem', overflow: 'hidden', position: 'relative' }}>
                  <Image src="/catalogo-suspensiones/suspensiones-camionetas-referencias-populares.webp" alt="Suspensiones para camionetas de referencias populares" fill sizes="(max-width: 700px) 100vw, 25vw" quality={82} style={{ objectFit: 'cover' }} />
                </div>
                <strong style={{ fontSize: '1.2rem' }}>Frenos y Suspensión</strong>
              </div>
            </Link>

            {/* Categoría 4: Maquinaria Pesada */}
            <Link href="/catalogo?category=maquinaria-pesada" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ 
                background: '#fff', 
                borderRadius: 'var(--border-radius)', 
                padding: '1.5rem', 
                textAlign: 'center',
                boxShadow: 'var(--box-shadow-light)',
                cursor: 'pointer',
                border: '1px solid transparent',
                transition: 'var(--transition)'
              }} className="hover-card">
                <div style={{ height: '180px', borderRadius: '8px', marginBottom: '1rem', overflow: 'hidden', background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <Image src="/maquinaria.png" alt="Línea Amarilla" fill sizes="(max-width: 700px) 100vw, 25vw" quality={70} style={{ objectFit: 'contain', padding: '5%' }} />
                </div>
                <strong style={{ fontSize: '1.2rem' }}>Línea Amarilla / Diésel</strong>
              </div>
            </Link>

          </div>
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link href="/catalogo" className="btn btn--outline" style={{ color: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}>
              VER TODAS LAS CATEGORÍAS
            </Link>
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section className="section" style={{ background: '#b91c1c', color: 'white' }}>
        <div className="main-container">
          <h2 style={{ textTransform: 'uppercase', marginBottom: '2rem', textAlign: 'center' }}>Nuestros Servicios Automotrices</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', fontWeight: 'bold', fontSize: '1.2rem' }}>
            {['CAMBIO DE ACEITE', 'FRENOS', 'PLUMILLAS', 'BATERÍAS', 'SUSPENSIÓN', 'UREA AUTOMOTRIZ'].map((servicio, idx) => (
              <div key={idx} style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem 2rem', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.3)' }}>
                {servicio}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Productos Destacados (Oscuro) */}
      <section className="section">
        <div className="main-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ textTransform: 'uppercase', margin: 0 }}>Productos Destacados</h2>
            <Link href="/catalogo" className="text-primary" style={{ fontWeight: 'bold' }}>VER TODOS →</Link>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
