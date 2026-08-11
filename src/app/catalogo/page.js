import { products } from "@/lib/products";
import Link from "next/link";

export const metadata = {
  title: "Lubricantes Diésel | Victor Services",
  description: "Catálogo completo de lubricantes y filtros.",
};

export default function Catalogo() {
  return (
    <main className="main-container section" style={{ display: 'flex', gap: '2rem' }}>
      {/* Sidebar de Filtros (Oscuro) */}
      <aside style={{ width: '250px', flexShrink: 0 }}>
        <div style={{ background: 'var(--card-dark)', padding: '1.5rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1rem', textTransform: 'uppercase', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Categorías</h3>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '2rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            <li style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>Lubricantes Diésel</li>
            <li>Lubricantes Gasolina</li>
            <li>Aceite Motor Transmisión</li>
            <li>Aceites Hidráulicos</li>
            <li>Coolant Motor</li>
            <li>Líquido de Frenos</li>
            <li>Grasas y Aditivos</li>
            <li>Filtros</li>
          </ul>

          <h3 style={{ fontSize: '1rem', textTransform: 'uppercase', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Filtrar Por</h3>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: '#ccc' }}>Marca</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <li><label><input type="checkbox" /> Mobil (12)</label></li>
              <li><label><input type="checkbox" /> Shell (8)</label></li>
              <li><label><input type="checkbox" /> Chevron (5)</label></li>
              <li><label><input type="checkbox" /> Castrol (5)</label></li>
              <li style={{ color: 'var(--primary-color)', cursor: 'pointer', marginTop: '0.25rem' }}>Ver más</li>
            </ul>
          </div>
        </div>
      </aside>

      {/* Main Catalog Content */}
      <div style={{ flex: 1 }}>
        {/* Banner de Categoría */}
        <div style={{ background: 'var(--card-dark)', borderRadius: 'var(--border-radius)', padding: '2rem', marginBottom: '2rem', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Lubricantes Diésel</h1>
            <p style={{ color: 'var(--text-muted)' }}>Protección superior para motores de trabajo pesado.</p>
          </div>
          <div style={{ width: '150px', height: '100px', background: '#111', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#555' }}>[Imagen Banner]</span>
          </div>
        </div>

        {/* Header del Grid */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          <span>Mostrando 1-12 de 24 productos</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label>Ordenar por:</label>
            <select style={{ background: 'var(--card-dark)', color: 'white', border: '1px solid var(--border-color)', padding: '0.4rem', borderRadius: '4px' }}>
              <option>Más vendidos</option>
              <option>Menor precio</option>
              <option>Mayor precio</option>
            </select>
          </div>
        </div>

        {/* Grid de Productos */}
        <div className="catalog-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
          {products.map((product) => (
            <div key={product.id} style={{ 
              background: 'var(--card-dark)',
              border: '1px solid var(--border-color)', 
              borderRadius: 'var(--border-radius)', 
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ background: '#111', height: '150px', borderRadius: '8px', marginBottom: '1rem', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img src={product.image} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              </div>
              <h3 style={{ fontSize: '0.95rem', marginBottom: '0.25rem', flexGrow: 1 }}>{product.name}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1rem' }}>{product.brand}</p>
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary-color)', marginBottom: '1rem' }}>
                ${product.price.toFixed(2)}
              </span>
              <Link href={`/catalogo/${product.id}`} className="btn btn--primary" style={{ padding: '0.6rem 1rem', fontSize: '0.9rem', width: '100%' }}>
                🛒 AGREGAR
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
