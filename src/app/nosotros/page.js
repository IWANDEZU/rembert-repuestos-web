export const metadata = {
  title: "Sobre Nosotros | REMBERT",
  description:
    "Conozca la historia, misión y experiencia de REMBERT en Barrancabermeja. Soluciones en mantenimiento automotriz, lubricantes y repuestos.",
  alternates: {
    canonical: "/nosotros",
  },
  openGraph: {
    title: "Sobre REMBERT | Repuestos Automotrices",
    description:
      "Años de experiencia proveyendo lubricantes, filtros y repuestos de alta calidad para vehículos en Barrancabermeja.",
    url: "https://www.rembertrepuestos.com/nosotros",
  },
};

export default function NosotrosPage() {
  return (
    <div className="main-container" style={{ padding: '3rem 1rem', minHeight: '70vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: 'var(--primary-color)', textAlign: 'center' }}>
          Sobre Rembert Repuestos BCA
        </h1>
        
        <div style={{ background: 'white', padding: '3rem', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#333', marginBottom: '1rem' }}>Nuestra Historia</h2>
          <p style={{ color: '#555', lineHeight: '1.8', marginBottom: '2rem' }}>
            Nacidos en el corazón de <strong>Barrancabermeja</strong>, Santander, Rembert Repuestos BCA ha sido un pilar fundamental en el suministro de repuestos y lubricantes automotrices de la región. Entendemos perfectamente la exigencia que el clima y el trabajo imponen sobre los vehículos.
          </p>

          <h2 style={{ fontSize: '1.5rem', color: '#333', marginBottom: '1rem' }}>Nuestra Misión</h2>
          <p style={{ color: '#555', lineHeight: '1.8', marginBottom: '2rem' }}>
            Proveer lubricantes, filtros y soluciones de mantenimiento de la más alta calidad, garantizando que los vehículos y la maquinaria de nuestros clientes operen siempre en su punto óptimo de rendimiento y eficiencia. No solo vendemos productos; brindamos asesoría técnica especializada.
          </p>

          <h2 style={{ fontSize: '1.5rem', color: '#333', marginBottom: '1rem' }}>¿Por qué elegirnos?</h2>
          <ul style={{ color: '#555', lineHeight: '1.8', paddingLeft: '1.5rem', marginBottom: '2rem' }}>
            <li><strong>Productos Originales:</strong> Distribuidores directos de las mejores marcas.</li>
            <li><strong>Asesoría Técnica:</strong> Conocimiento profundo en especificaciones API, ACEA y OEM.</li>
            <li><strong>Cobertura:</strong> Envíos seguros y rápidos a nivel local y nacional.</li>
            <li><strong>Orientación a Resultados:</strong> Buscamos reducir sus costos operativos alargando la vida útil de sus equipos.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
