import Link from "next/link";
import Image from "next/image";
import { products as fallbackProducts } from "@/lib/products";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

// La portada se genera durante la compilación. El catálogo y las rutas de cuenta
// siguen siendo dinámicos, pero una visita a "/" no debe abrir Prisma ni consumir
// CPU del Worker.
export const dynamic = "force-static";

const brandLogos = [
  ["Bosch", "/logos/bosch.svg"], ["WIX Filters", "/logos/wix-filters.svg"], ["Partmo", "/logos/partmo-real.png"],
  ["Mazda", "/logos/autos/mazda.svg"], ["Coéxito", "/03_coexito_logo_oficial.png"], ["Chevrolet", "/logos/autos/chevrolet.svg"],
  ["Renault", "/logos/autos/renault.svg"], ["Toyota", "/logos/autos/toyota.svg"], ["Kia", "/logos/autos/kia.svg"],
  ["Hyundai", "/logos/autos/hyundai.svg"], ["Ford", "/logos/autos/ford.svg"], ["Nissan", "/logos/autos/nissan.svg"],
  ["Volkswagen", "/logos/autos/volkswagen.svg"], ["Mitsubishi", "/logos/autos/mitsubishi.svg"], ["Honda", "/logos/autos/honda.svg"],
  ["BMW", "/logos/autos/bmw.svg"], ["Volvo", "/logos/autos/volvo.svg"], ["Daihatsu", "/logos/autos/daihatsu.svg"],
  ["Daewoo", "/logos/autos/daewoo.svg"], ["Škoda", "/logos/autos/skoda.svg"], ["SEAT", "/logos/autos/seat.svg"],
  ["Peugeot", "/logos/autos/peugeot.svg"],
].map(([name, src]) => ({ name, src }));

const popularCarBrands = [
  ["Renault", "Duster, Sandero, Logan, Kwid", "renault", "Líder Colombia"],
  ["Chevrolet", "Onix, Spark, Tracker, Sail", "chevrolet", "Más Vendido"],
  ["Toyota", "Hilux, Fortuner, Corolla, Prado", "toyota", "Top Confianza"],
  ["Mazda", "Mazda 2, Mazda 3, CX-30, CX-5", "mazda", "Línea Premium"],
  ["Kia", "Picanto, Rio, Sportage, Sonet", "kia", "Alta Demanda"],
  ["Hyundai", "i10, Accent, Tucson, Creta", "hyundai", "Garantía Total"],
  ["Nissan", "March, Versa, Frontier, Kicks", "nissan", "Top Ventas"],
  ["Ford", "Fiesta, Ranger, EcoSport, Explorer", "ford", "Potencia"],
  ["Volkswagen", "Gol, Amarok, Jetta, T-Cross", "volkswagen", "Calidad"],
  ["Suzuki", "Swift, Vitara, Jimny, Alto", "suzuki", "Económico"],
  ["Mitsubishi", "Montero, L200, Outlander, ASX", "mitsubishi", "4x4 Líder"],
  ["Honda", "Civic, CR-V, HR-V, Fit", "honda", "Confiabilidad"],
  ["BMW", "Serie 3, Serie 5, X1, X3, X5", "bmw", "Premium"],
  ["Daihatsu", "Terios, Sirion, Charade", "daihatsu", "Japonesa"],
  ["Daewoo", "Matiz, Lanos, Nubira, Cielo", "daewoo", "Línea Clásica"],
  ["Škoda", "Fabia, Octavia, Rapid, Karoq", "skoda", "Europea"],
  ["SEAT", "Ibiza, León, Córdoba, Ateca", "seat", "Europea"],
  ["Peugeot", "206, 207, 208, 301, 2008", "peugeot", "Francesa"],
].map(([name, popularModels, query, badge]) => ({
  name,
  logo: `/logos/autos/${query}.svg`,
  popularModels,
  query,
  badge,
}));

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
    featuredProducts = dbProducts.length > 0 ? dbProducts : fallbackProducts.slice(0, 8);
  } catch (err) {
    featuredProducts = fallbackProducts.slice(0, 8);
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
          src="/hero-rembert-fachada-v2.jpg"
          alt="Fachada Sede Principal Rembert Repuestos BCA - Barrancabermeja"
          fill
          priority
          sizes="100vw"
          quality={75}
          style={{ objectFit: 'cover', objectPosition: 'center 35%', zIndex: 0 }}
        />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(90deg, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.72) 55%, rgba(10,10,10,0.45) 100%)' }} />
        <div className="main-container" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative', zIndex: 2 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#E52421', color: '#FFFFFF', padding: '0.35rem 0.95rem', borderRadius: '30px', fontWeight: '900', fontSize: 'clamp(0.75rem, 2.5vw, 0.9rem)', marginBottom: '1rem', letterSpacing: '0.5px', boxShadow: '0 4px 15px rgba(229, 36, 33, 0.45)', flexWrap: 'wrap' }}>
              ⭐ 38 AÑOS DE EXPERIENCIA EN EL SECTOR AUTOMOTRIZ
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 7vw, 3.8rem)', maxWidth: '850px', lineHeight: 1.1, marginBottom: '1rem', textTransform: 'uppercase', color: '#ffffff' }}>
              Repuestos confiables <br />
              <span className="text-primary">de la mejor calidad</span>
            </h1>
            <p style={{ color: '#E2E8F0', fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)', maxWidth: '650px', lineHeight: '1.5', margin: '0 0 1.5rem 0' }}>
              Originales y alternativos para todas las marcas. Precios al por mayor y detal con envíos rápidos a todo el país.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            <Link href="/catalogo" className="btn btn--primary" style={{ padding: '0.85rem 1.8rem', fontSize: '0.95rem' }}>VER PRODUCTOS</Link>
            <a href="https://wa.me/573102420490?text=Hola%2C%20quisiera%20cotizar%20un%20repuesto." target="_blank" rel="noopener noreferrer" className="btn btn--outline" style={{ padding: '0.85rem 1.8rem', color: '#fff', borderColor: '#fff', fontSize: '0.95rem' }}>
              <span style={{ color: '#25D366' }}>💬</span> COMPRAR POR WHATSAPP
            </a>
          </div>

        </div>
      </header>

      {/* Cenefa Móvil de Marcas (Limpia, Cápsulas Blancas) */}
      <div className="marquee-container">
        <div className="marquee-track">
          <div className="marquee-group">
            {brandLogos.map((b, i) => (
              <div className="marquee-item-wrapper" key={`a-${i}`}>
                <Image src={b.src} alt={b.name} className="marquee-item" width={160} height={72} sizes="160px" loading="lazy" />
              </div>
            ))}
          </div>
          <div className="marquee-group" aria-hidden="true">
            {brandLogos.map((b, i) => (
              <div className="marquee-item-wrapper" key={`b-${i}`}>
                <Image src={b.src} alt="" className="marquee-item" width={160} height={72} sizes="160px" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categorías Principales (Claro) */}
      <section className="section section--light">
        <div className="main-container">
          <h2 style={{ marginBottom: '2rem', textTransform: 'uppercase', fontSize: 'clamp(1.75rem, 5vw, 2.4rem)' }}>Categorías Principales</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '1.25rem' }}>

            {/* Categoría 1: Mantenimiento automotriz */}
            <Link href="/catalogo?category=mantenimiento" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{
                background: '#fff',
                borderRadius: 'var(--border-radius)',
                padding: '1.25rem',
                textAlign: 'center',
                boxShadow: 'var(--box-shadow-light)',
                cursor: 'pointer',
                border: '1px solid transparent',
                transition: 'var(--transition)'
              }} className="hover-card">
                <div style={{ height: '180px', borderRadius: '8px', marginBottom: '1rem', overflow: 'hidden', position: 'relative', background: '#f8f8f8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Image src="/catalogo-siliconas-automotrices/victor-reinz-reinzosil-70ml-original.png" alt="Mantenimiento automotriz con sellante Victor Reinz" fill sizes="(max-width: 700px) 100vw, 25vw" quality={85} style={{ objectFit: 'contain', padding: '6px' }} />
                </div>
                <strong style={{ fontSize: '1.1rem', display: 'block' }}>Mantenimiento automotriz</strong>
              </div>
            </Link>

            {/* Categoría 2: Filtros */}
            <Link href="/catalogo?category=filtros" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{
                background: '#fff',
                borderRadius: 'var(--border-radius)',
                padding: '1.25rem',
                textAlign: 'center',
                boxShadow: 'var(--box-shadow-light)',
                cursor: 'pointer',
                border: '1px solid transparent',
                transition: 'var(--transition)'
              }} className="hover-card">
                <div style={{ height: '180px', borderRadius: '8px', marginBottom: '1rem', overflow: 'hidden', position: 'relative' }}>
                  <Image src="/filtro-aceite.jpg" alt="Filtros de Motor" fill sizes="(max-width: 700px) 100vw, 25vw" quality={75} style={{ objectFit: 'cover' }} />
                </div>
                <strong style={{ fontSize: '1.1rem', display: 'block' }}>Filtros de Motor y Cabina</strong>
              </div>
            </Link>

            {/* Categoría 3: Frenos y Suspensión */}
            <Link href="/catalogo?category=frenos-y-suspension" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{
                background: '#fff',
                borderRadius: 'var(--border-radius)',
                padding: '1.25rem',
                textAlign: 'center',
                boxShadow: 'var(--box-shadow-light)',
                cursor: 'pointer',
                border: '1px solid transparent',
                transition: 'var(--transition)'
              }} className="hover-card">
                <div style={{ height: '180px', borderRadius: '8px', marginBottom: '1rem', overflow: 'hidden', position: 'relative' }}>
                  <Image src="/catalogo-suspensiones/suspensiones-camionetas-referencias-populares.webp" alt="Suspensiones para camionetas de referencias populares" fill sizes="(max-width: 700px) 100vw, 25vw" quality={82} style={{ objectFit: 'cover' }} />
                </div>
                <strong style={{ fontSize: '1.1rem', display: 'block' }}>Frenos y Suspensión</strong>
              </div>
            </Link>

            {/* Categoría 4: Radiadores */}
            <Link href="/radiadores" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{
                background: '#fff',
                borderRadius: 'var(--border-radius)',
                padding: '1.25rem',
                textAlign: 'center',
                boxShadow: 'var(--box-shadow-light)',
                cursor: 'pointer',
                border: '1px solid transparent',
                transition: 'var(--transition)'
              }} className="hover-card">
                <div style={{ height: '180px', borderRadius: '8px', marginBottom: '1rem', overflow: 'hidden', position: 'relative' }}>
                  <Image src="/radiador-auto.jpg" alt="Radiadores y Sistema de Enfriamiento" fill sizes="(max-width: 700px) 100vw, 25vw" quality={80} style={{ objectFit: 'cover' }} />
                </div>
                <strong style={{ fontSize: '1.1rem', color: 'var(--primary-dark)', display: 'block' }}>Radiadores y Refrigeración</strong>
              </div>
            </Link>

            {/* Categoría 5: Transmisión */}
            <Link href="/catalogo?category=transmision" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{
                background: '#fff',
                borderRadius: 'var(--border-radius)',
                padding: '1.25rem',
                textAlign: 'center',
                boxShadow: 'var(--box-shadow-light)',
                cursor: 'pointer',
                border: '1px solid transparent',
                transition: 'var(--transition)'
              }} className="hover-card">
                <div style={{ height: '180px', borderRadius: '8px', marginBottom: '1rem', overflow: 'hidden', background: '#f8f8f8', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <Image src="/transmision.png" alt="Cajas y transmisiones automotrices" fill sizes="(max-width: 700px) 100vw, 25vw" quality={70} style={{ objectFit: 'contain', padding: '5%' }} />
                </div>
                <strong style={{ fontSize: '1.1rem', display: 'block' }}>Transmisiones y Cajas</strong>
              </div>
            </Link>

            {/* Categoría 6: Servicio Técnico */}
            <Link href="/servicio-tecnico" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{
                background: '#fff',
                borderRadius: 'var(--border-radius)',
                padding: '1.25rem',
                textAlign: 'center',
                boxShadow: 'var(--box-shadow-light)',
                cursor: 'pointer',
                border: '1px solid var(--primary-color)',
                transition: 'var(--transition)'
              }} className="hover-card">
                <div style={{ height: '180px', borderRadius: '8px', marginBottom: '1rem', overflow: 'hidden', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <span style={{ fontSize: '3.5rem' }}>🛠️</span>
                </div>
                <strong style={{ fontSize: '1.1rem', color: 'var(--primary-dark)', display: 'block' }}>Servicio Técnico Especializado</strong>
              </div>
            </Link>

          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link href="/catalogo" className="btn btn--outline" style={{ color: '#111', borderColor: '#111', fontWeight: 'bold', padding: '0.85rem 2rem' }}>
              VER TODAS LAS CATEGORÍAS EN CATÁLOGO →
            </Link>
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section className="section" style={{ background: '#111111', color: 'white', borderTop: '3px solid var(--primary-color)', borderBottom: '3px solid var(--primary-color)' }}>
        <div className="main-container">
          <h2 style={{ textTransform: 'uppercase', marginBottom: '2rem', textAlign: 'center', color: '#ffffff', letterSpacing: '1px', fontSize: 'clamp(1.5rem, 4vw, 2.2rem)' }}>
            Nuestros Servicios Automotrices
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.75rem', fontWeight: 'bold', fontSize: 'clamp(0.8rem, 2.5vw, 1rem)' }}>
            {[
              { name: 'CAMBIO DE ACEITE & FILTROS', icon: '🛢️' },
              { name: 'MANTENIMIENTO DE FRENOS', icon: '🛑' },
              { name: 'RADIADORES & REFRIGERACIÓN', icon: '❄️' },
              { name: 'BATERÍAS & SISTEMA ELÉCTRICO', icon: '🔋' },
              { name: 'SUSPENSIÓN & DIRECCIÓN', icon: '⚙️' },
            ].map((servicio, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  color: '#ffffff',
                  padding: '0.75rem 1.35rem',
                  borderRadius: '30px',
                  letterSpacing: '0.5px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <span>{servicio.icon}</span>
                <span>{servicio.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marcas de Autos más comercializadas en Colombia */}
      <section className="section" style={{ background: '#ffffff', color: '#111111' }}>
        <div className="main-container">
          <div style={{ textAlign: 'center', marginBottom: 'clamp(1.5rem, 4vw, 2.5rem)' }}>
            <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', marginTop: '0.5rem', marginBottom: '0.5rem', textTransform: 'uppercase', lineHeight: '1.2' }}>
              Repuestos por Marca de Vehículo
            </h2>
            <p style={{ color: '#666666', fontSize: 'clamp(0.88rem, 2.2vw, 1.05rem)', maxWidth: '700px', margin: '0 auto', lineHeight: '1.45' }}>
              Disponemos de filtros, radiadores, frenos y repuestos para las marcas y modelos más vendidos en Colombia.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 140px), 1fr))',
            gap: 'clamp(0.75rem, 2vw, 1.15rem)'
          }}>
            {popularCarBrands.map((brand) => (
              <div
                key={brand.name}
                style={{
                  background: '#fcfcfc',
                  border: '1px solid #e8e8e8',
                  borderRadius: '12px',
                  padding: 'clamp(0.85rem, 2vw, 1.25rem) clamp(0.65rem, 1.8vw, 0.95rem)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                  position: 'relative'
                }}
                className="hover-card"
              >
                <span style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  background: '#111111',
                  color: 'var(--primary-color)',
                  fontSize: '0.62rem',
                  fontWeight: '800',
                  padding: '0.15rem 0.45rem',
                  borderRadius: '8px',
                }}>
                  {brand.badge}
                </span>

                <div style={{
                  height: '52px',
                  width: '100%',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.5rem',
                  marginTop: '0.35rem',
                }}>
                  <Image
                    src={brand.logo}
                    alt={`Logo oficial ${brand.name}`}
                    width={90}
                    height={44}
                    style={{ objectFit: 'contain', maxHeight: '44px', maxWidth: '85px' }}
                  />
                </div>

                <h3 style={{ fontSize: 'clamp(0.95rem, 2.4vw, 1.12rem)', fontWeight: '800', marginBottom: '0.25rem', color: '#111111' }}>
                  {brand.name}
                </h3>

                <p style={{ fontSize: '0.74rem', color: '#666666', marginBottom: '0.75rem', minHeight: '2.4em', lineHeight: '1.3' }}>
                  <strong style={{ color: '#333333' }}>Modelos:</strong> {brand.popularModels}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', width: '100%', marginTop: 'auto' }}>
                  <Link
                    href={`/catalogo?make=${brand.name.toLowerCase()}`}
                    style={{
                      background: 'var(--primary-color)',
                      color: '#111111',
                      padding: '0.45rem 0.65rem',
                      borderRadius: '6px',
                      fontWeight: '800',
                      fontSize: 'clamp(0.72rem, 2vw, 0.80rem)',
                      textAlign: 'center',
                      textDecoration: 'none',
                      transition: 'background 0.2s ease',
                      minHeight: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    Ver Repuestos
                  </Link>
                  <a
                    href={`https://wa.me/573108737354?text=Hola%2C%20estoy%20buscando%20repuestos%20para%20veh%C3%ADculo%20${encodeURIComponent(brand.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: 'transparent',
                      color: '#2e7d32',
                      border: '1px solid #a5d6a7',
                      padding: '0.40rem 0.65rem',
                      borderRadius: '6px',
                      fontWeight: '700',
                      fontSize: 'clamp(0.68rem, 1.8vw, 0.74rem)',
                      textAlign: 'center',
                      textDecoration: 'none',
                      minHeight: '30px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    💬 Consultar por VIN
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 'clamp(1.5rem, 4vw, 2.5rem)' }}>
            <p style={{ fontSize: 'clamp(0.85rem, 2vw, 0.95rem)', color: '#666666', marginBottom: '0.75rem' }}>
              ¿Tu vehículo no aparece en la lista? Tenemos inventario de repuestos para marcas europeas, asiáticas y americanas.
            </p>
            <a
              href="https://wa.me/573108737354?text=Hola%2C%20necesito%20cotizar%20repuestos%20para%20mi%20veh%C3%ADculo."
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--primary"
              style={{ padding: '0.75rem 1.6rem', fontSize: 'clamp(0.85rem, 2.2vw, 0.95rem)' }}
            >
              💬 Cotizar Repuestos para mi Vehículo por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Sección Destacada de Radiadores y Sistema Térmico */}
      <section className="section" style={{ background: 'linear-gradient(135deg, #0d0d0d 0%, #171717 100%)', color: '#ffffff', borderTop: '3px solid var(--primary-color)', borderBottom: '3px solid var(--primary-color)', padding: 'clamp(2.5rem, 6vw, 4.5rem) 0' }}>
        <div className="main-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 290px), 1fr))', gap: '2.5rem', alignItems: 'center' }}>
            <div>
              <span style={{
                background: 'var(--primary-color)',
                color: '#111',
                fontWeight: '900',
                fontSize: '0.85rem',
                padding: '0.35rem 0.9rem',
                borderRadius: '20px',
                display: 'inline-block',
                marginBottom: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                ❄️ Línea Especializada
              </span>
              <h2 style={{ fontSize: 'clamp(1.8rem, 4.5vw, 2.8rem)', color: '#ffffff', marginBottom: '1rem', lineHeight: '1.2', textTransform: 'uppercase' }}>
                Radiadores & Refrigeración <span style={{ color: 'var(--primary-color)' }}>Automotriz</span>
              </h2>
              <p style={{ color: '#d1d5db', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                Evita recalentamientos y daños en el motor. Contamos con radiadores en <strong>aluminio soldado</strong>, tanques de polímero térmico reforzado y núcleos de <strong>cobre para trabajo pesado</strong> (Isuzu NPR, Hino, Foton, maquinaria).
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
                <div style={{ background: '#222', padding: '0.85rem 1rem', borderRadius: '8px', borderLeft: '3px solid var(--primary-color)' }}>
                  <strong style={{ color: '#fff', fontSize: '0.92rem', display: 'block' }}>✓ Ensamble OEM</strong>
                  <span style={{ color: '#aaa', fontSize: '0.8rem' }}>Ajuste 100% exacto</span>
                </div>
                <div style={{ background: '#222', padding: '0.85rem 1rem', borderRadius: '8px', borderLeft: '3px solid var(--primary-color)' }}>
                  <strong style={{ color: '#fff', fontSize: '0.92rem', display: 'block' }}>✓ Clima Cálido</strong>
                  <span style={{ color: '#aaa', fontSize: '0.8rem' }}>Máxima disipación térmica</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
                <Link href="/radiadores" className="btn btn--primary" style={{ padding: '0.85rem 1.6rem', fontSize: '0.92rem', fontWeight: '800' }}>
                  CONOCER SECCIÓN RADIADORES
                </Link>
                <a
                  href="https://wa.me/573102420490?text=Hola%2C%20quisiera%20cotizar%20un%20radiador%20con%20urgencia."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--outline"
                  style={{ padding: '0.85rem 1.6rem', color: '#fff', borderColor: '#fff', fontSize: '0.92rem' }}
                >
                  💬 Cotizar por WhatsApp
                </a>
              </div>
            </div>

            <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', border: '2px solid #333', boxShadow: '0 12px 35px rgba(0,0,0,0.6)', height: 'clamp(240px, 40vw, 360px)' }}>
              <Image
                src="/radiador-banner.jpg"
                alt="Radiadores automotrices de alta eficiencia térmica"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Productos Destacados (Oscuro) */}
      <section className="section">
        <div className="main-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 style={{ textTransform: 'uppercase', margin: 0, fontSize: 'clamp(1.4rem, 4vw, 2rem)' }}>Productos Destacados</h2>
            <Link href="/catalogo" className="text-primary" style={{ fontWeight: 'bold' }}>VER TODOS →</Link>
          </div>

          <div className="catalog-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Sección de Ubicación y Almacén en Barrancabermeja */}
      <section className="section" style={{ background: '#0e0e0e', borderTop: '3px solid var(--primary-color)', padding: 'clamp(2.5rem, 6vw, 4rem) 0' }}>
        <div className="main-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '2.5rem', alignItems: 'center' }}>
            {/* Información del Almacén */}
            <div>
              <span style={{
                background: 'var(--primary-color)',
                color: '#111',
                fontWeight: 'bold',
                fontSize: '0.85rem',
                padding: '0.35rem 0.85rem',
                borderRadius: '20px',
                display: 'inline-block',
                marginBottom: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                📍 Punto de Venta Físico
              </span>
              <h2 style={{ fontSize: 'clamp(1.8rem, 4.5vw, 2.2rem)', color: '#ffffff', marginBottom: '1rem', lineHeight: '1.2' }}>
                Visítanos en <span style={{ color: 'var(--primary-color)' }}>Barrancabermeja</span>
              </h2>
              <p style={{ color: '#cccccc', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                Atención experta y entrega inmediata en nuestro punto de venta en <strong>Santander</strong>. También despachamos a talleres, empresas y clientes particulares en todo el territorio nacional.
              </p>

              <div style={{ background: '#181818', padding: '1.25rem', borderRadius: '12px', border: '1px solid #282828', marginBottom: '2rem' }}>
                {/* Sede Principal */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1rem', borderBottom: '1px solid #252525', paddingBottom: '0.75rem' }}>
                  <span style={{ fontSize: '1.3rem' }}>🏢</span>
                  <div>
                    <strong style={{ color: 'var(--primary-color)', display: 'block', fontSize: '0.98rem' }}>Punto Principal (Barrancabermeja):</strong>
                    <span style={{ color: '#bbb', fontSize: '0.88rem', display: 'block', marginBottom: '0.3rem' }}>Tv. 29, Barrancabermeja, Santander</span>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <a href="https://wa.me/573102420490" target="_blank" rel="noopener noreferrer" style={{ color: '#25D366', fontWeight: 'bold', fontSize: '0.9rem' }}>
                        📱 310 242 0490
                      </a>
                      <a href="https://wa.me/573125022555" target="_blank" rel="noopener noreferrer" style={{ color: '#25D366', fontWeight: 'bold', fontSize: '0.9rem' }}>
                        📱 312 502 2555
                      </a>
                    </div>
                  </div>
                </div>

                {/* Sede El Cerro */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1rem', borderBottom: '1px solid #252525', paddingBottom: '0.75rem' }}>
                  <span style={{ fontSize: '1.3rem' }}>📍</span>
                  <div>
                    <strong style={{ color: 'var(--primary-color)', display: 'block', fontSize: '0.98rem' }}>Punto El Cerro:</strong>
                    <span style={{ color: '#bbb', fontSize: '0.88rem', display: 'block', marginBottom: '0.3rem' }}>Sector El Cerro, Barrancabermeja</span>
                    <a href="https://wa.me/573102707375" target="_blank" rel="noopener noreferrer" style={{ color: '#25D366', fontWeight: 'bold', fontSize: '0.9rem' }}>
                      📱 310 270 7375
                    </a>
                  </div>
                </div>

                {/* Línea de Compras e Inventario */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.3rem' }}>🛒</span>
                  <div>
                    <strong style={{ color: 'var(--primary-color)', display: 'block', fontSize: '0.98rem' }}>Compras e Inventario:</strong>
                    <span style={{ color: '#bbb', fontSize: '0.88rem', display: 'block', marginBottom: '0.3rem' }}>Gestión de stock, precios al por mayor y detal con despachos a todo el país</span>
                    <a href="https://wa.me/573508299233" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)', fontWeight: 'bold', fontSize: '0.9rem' }}>
                      🛒 +57 350 829 9233
                    </a>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <a
                  href="https://maps.app.goo.gl/FmmwX9PivNVnurEL7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--primary"
                  style={{ padding: '0.85rem 1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.92rem' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 0C7.589 0 4 3.589 4 8c0 4.274 7.219 15.184 7.633 15.82a.498.498 0 00.734 0C12.781 23.184 20 12.274 20 8c0-4.411-3.589-8-8-8zm0 11.5a3.5 3.5 0 110-7 3.5 3.5 0 010 7z" /></svg>
                  Cómo Llegar (Google Maps)
                </a>
                <a
                  href="https://wa.me/573102420490?text=Hola%2C%20quisiera%20cotizar%20repuestos."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn"
                  style={{ background: '#25D366', color: '#fff', border: 'none', padding: '0.85rem 1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.92rem' }}
                >
                  💬 WhatsApp Principal
                </a>
              </div>
            </div>

            {/* Mapa Interactivo Google Maps */}
            <div style={{ borderRadius: '16px', overflow: 'hidden', border: '2px solid #333', boxShadow: '0 12px 35px rgba(0,0,0,0.5)', height: 'clamp(280px, 45vw, 420px)', minHeight: '260px' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3955.5796030999557!2d-73.8350463!3d7.0385664!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e42eb56b38df4f9%3A0xb7c9324e2b880f05!2sRembeat!5e0!3m2!1ses!2sco!4v1700000000000!5m2!1ses!2sco"
                width="100%"
                height="100%"
                style={{ border: 0, display: 'block' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa Rembert Repuestos Barrancabermeja"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
