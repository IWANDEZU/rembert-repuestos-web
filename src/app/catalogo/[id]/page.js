import { getProductById, products } from "@/lib/products";
import { notFound } from "next/navigation";

// Generar rutas estáticas para SEO
export async function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const product = getProductById(resolvedParams.id);
  if (!product) return { title: "Producto no encontrado" };
  return {
    title: `${product.name} | ${product.brand} - Victor Services`,
    description: product.description,
  };
}

export default async function ProductDetail({ params }) {
  const resolvedParams = await params;
  const product = getProductById(resolvedParams.id);
  if (!product) notFound();

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.image,
    "description": product.description,
    "brand": { "@type": "Brand", "name": product.brand },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "USD",
      "price": product.price,
      "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    }
  };

  return (
    <main className="main-container section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      <div style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap' }}>
        
        {/* Galería Izquierda */}
        <div style={{ flex: '1 1 500px', display: 'flex', gap: '1rem' }}>
          {/* Thumbnails */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '80px' }}>
            {[1, 2, 3, 4].map(n => (
              <div key={n} style={{ background: 'var(--card-dark)', height: '80px', borderRadius: '8px', border: n === 1 ? '2px solid var(--primary-color)' : '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={product.image} alt="thumb" style={{ maxWidth: '80%', maxHeight: '80%' }} />
              </div>
            ))}
          </div>
          {/* Main Image */}
          <div style={{ flex: 1, background: 'var(--card-dark)', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <img src={product.image} alt={product.name} style={{ width: '100%', maxHeight: '500px', objectFit: 'contain' }} />
          </div>
        </div>
        
        {/* Info Derecha */}
        <div style={{ flex: '1 1 400px' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{product.name}</h1>
          <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{product.brand}</p>
          
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary-color)', marginBottom: '1.5rem' }}>
            ${product.price.toFixed(2)}
          </div>
          
          <p style={{ fontSize: '1rem', color: '#ccc', marginBottom: '1.5rem' }}>
            {product.description}
          </p>

          <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginBottom: '2.5rem', color: '#ccc', fontSize: '0.95rem' }}>
            {product.features.map((feature, idx) => (
              <li key={idx} style={{ marginBottom: '0.5rem' }}>{feature}</li>
            ))}
          </ul>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Presentación</label>
            <select style={{ width: '100%', padding: '0.8rem', background: 'var(--card-dark)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
              <option>Galón (3.78 L)</option>
              <option>Caneca (5 Galones)</option>
              <option>Tambor (55 Galones)</option>
            </select>
          </div>

          <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Cantidad</label>
            <div style={{ display: 'flex', border: '1px solid var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
              <button style={{ background: 'var(--card-dark)', border: 'none', color: 'white', padding: '0.5rem 1rem', cursor: 'pointer' }}>-</button>
              <input type="text" value="1" readOnly style={{ width: '50px', textAlign: 'center', background: 'var(--secondary-color)', color: 'white', border: 'none' }} />
              <button style={{ background: 'var(--card-dark)', border: 'none', color: 'white', padding: '0.5rem 1rem', cursor: 'pointer' }}>+</button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
            <button className="btn btn--primary" style={{ flex: 1 }}>🛒 AGREGAR AL CARRITO</button>
            <button className="btn btn--outline" style={{ flex: 1, color: 'white', borderColor: 'var(--border-color)' }}>
              <span style={{ color: '#25D366' }}>💬</span> COTIZAR POR WHATSAPP
            </button>
          </div>

          {/* Badges */}
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>🚚</span>
              <div>
                <strong style={{ display: 'block', fontSize: '0.85rem' }}>Envíos rápidos</strong>
                <small style={{ color: 'var(--text-muted)' }}>A todo Colombia</small>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>🛡️</span>
              <div>
                <strong style={{ display: 'block', fontSize: '0.85rem' }}>Productos originales</strong>
                <small style={{ color: 'var(--text-muted)' }}>Garantía de fábrica</small>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>🔒</span>
              <div>
                <strong style={{ display: 'block', fontSize: '0.85rem' }}>Compra segura</strong>
                <small style={{ color: 'var(--text-muted)' }}>Pagos protegidos</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
