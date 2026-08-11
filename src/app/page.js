import Link from "next/link";
import { products } from "@/lib/products";

export default function Home() {
  return (
    <main>
      {/* Hero Section (Oscuro) */}
      <header className="hero" style={{ 
        backgroundImage: 'linear-gradient(90deg, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.7) 100%), url("/hero-bg.jpg")',
        alignItems: 'flex-start',
        textAlign: 'left'
      }}>
        <div className="main-container" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '4rem', maxWidth: '800px', lineHeight: 1.1, marginBottom: '1rem', textTransform: 'uppercase' }}>
              Lubricantes y filtros <br/>
              <span className="text-primary">para motores diésel y gasolina</span>
            </h1>
            <p style={{ fontSize: '1.4rem', color: 'var(--text-muted)' }}>
              Calidad que protege, rendimiento que impulsa.
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link href="/catalogo" className="btn btn--primary" style={{ padding: '1rem 2rem' }}>VER PRODUCTOS</Link>
            <a href="#whatsapp" className="btn btn--outline" style={{ padding: '1rem 2rem', color: '#fff', borderColor: '#fff' }}>
              <span style={{ color: '#25D366' }}>💬</span> COTIZAR POR WHATSAPP
            </a>
          </div>

          <div style={{ display: 'flex', gap: '3rem', marginTop: '4rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: 'var(--primary-color)', fontSize: '1.5rem' }}>🛡️</span>
              <div>
                <strong style={{ display: 'block' }}>Productos 100% originales</strong>
                <small style={{ color: 'var(--text-muted)' }}>Calidad garantizada</small>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: 'var(--primary-color)', fontSize: '1.5rem' }}>🚚</span>
              <div>
                <strong style={{ display: 'block' }}>Envíos rápidos</strong>
                <small style={{ color: 'var(--text-muted)' }}>A todo Colombia</small>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: 'var(--primary-color)', fontSize: '1.5rem' }}>🎧</span>
              <div>
                <strong style={{ display: 'block' }}>Asesoría especializada</strong>
                <small style={{ color: 'var(--text-muted)' }}>Te ayudamos a elegir</small>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Categorías Principales (Claro) */}
      <section className="section section--light">
        <div className="main-container">
          <h2 style={{ marginBottom: '2rem', textTransform: 'uppercase' }}>Categorías Principales</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem' }}>
            {['Lubricantes Diésel', 'Lubricantes Gasolina', 'Aceite Motor Transmisión', 'Aceite Hidráulico', 'Coolant Motor', 'Líquido de Frenos', 'Filtros', 'Grasas'].map((cat, i) => (
              <div key={i} style={{ 
                background: '#fff', 
                borderRadius: 'var(--border-radius)', 
                padding: '2rem 1rem', 
                textAlign: 'center',
                boxShadow: 'var(--box-shadow-light)',
                cursor: 'pointer',
                border: i === 0 ? '2px solid var(--primary-color)' : '1px solid transparent',
                transition: 'var(--transition)'
              }} className="hover-card">
                <div style={{ background: '#f5f5f5', height: '100px', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#aaa' }}>[Imagen]</span>
                </div>
                <strong style={{ color: i === 0 ? 'var(--primary-color)' : 'inherit' }}>{cat}</strong>
              </div>
            ))}
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
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {products.map(p => (
              <div key={p.id} style={{
                background: 'var(--card-dark)',
                borderRadius: 'var(--border-radius)',
                padding: '1.5rem',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{ background: '#111', height: '180px', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <img src={p.image} alt={p.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>
                <h3 style={{ fontSize: '1rem', flexGrow: 1, marginBottom: '0.5rem' }}>{p.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>{p.brand}</p>
                <div style={{ color: 'var(--primary-color)', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '1rem' }}>
                  ${p.price.toFixed(2)}
                </div>
                <button className="btn btn--primary" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                  🛒 AGREGAR AL CARRITO
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
