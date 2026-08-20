import Link from "next/link";
import { siteUrl } from "@/lib/site";

export const metadata = {
  title: "Blog técnico de mantenimiento automotriz y repuestos",
  description:
    "Guías técnicas, consejos de lubricación y mantenimiento preventivo para vehículos en Barrancabermeja.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog técnico de Rembert Repuestos BCA",
    description:
      "Artículos y recomendaciones para prolongar la vida útil de tu motor y sistema de frenos.",
    url: "https://www.rembertrepuestos.com/blog",
  },
};

export default function BlogPage() {
  const baseUrl = siteUrl;
  const posts = [
    {
      id: 1,
      title: "¿Qué significa el 15W-40 o 20W-50 en tu aceite de motor?",
      excerpt: "Aprende a leer la viscosidad de tu lubricante y por qué es vital elegir la correcta según el clima de Barrancabermeja y el desgaste de tu motor.",
      date: "15 Oct 2023",
      category: "Lubricantes"
    },
    {
      id: 2,
      title: "Mantenimiento Preventivo del Sistema de Filtración",
      excerpt: "Descubre cómo los filtros de aceite, aire y combustible protegen la vida de tu motor y mejoran el consumo de gasolina.",
      date: "02 Nov 2023",
      category: "Filtros"
    },
    {
      id: 3,
      title: "¿Cuándo cambiar el líquido de frenos DOT 4?",
      excerpt: "El líquido de frenos absorbe humedad con el tiempo. Te explicamos cada cuántos kilómetros debes cambiarlo para no perder potencia de frenado.",
      date: "28 Nov 2023",
      category: "Seguridad"
    }
  ];

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Blog Técnico Rembert Repuestos BCA",
    "description": "Guías técnicas y consejos de lubricación y mantenimiento preventivo para motores en Barrancabermeja.",
    "url": `${baseUrl}/blog`,
    "publisher": {
      "@type": "AutoPartsStore",
      "name": "Rembert Repuestos BCA",
      "url": baseUrl,
    },
    "blogPost": posts.map((p) => ({
      "@type": "BlogPosting",
      "headline": p.title,
      "description": p.excerpt,
      "datePublished": "2023-10-15",
      "author": {
        "@type": "Organization",
        "name": "Victor Services",
      },
    })),
  };

  return (
    <div className="main-container" style={{ padding: '3rem 1rem', minHeight: '70vh' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>Blog Técnico</h1>
      <p style={{ color: '#666', marginBottom: '3rem', fontSize: '1.2rem' }}>
        Artículos, guías y consejos de expertos para el mantenimiento de su motor.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
        {posts.map((post) => (
          <div key={post.id} style={{ 
            background: 'white', 
            borderRadius: '12px', 
            overflow: 'hidden',
            boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
            border: '1px solid #f0f0f0',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ padding: '2rem', flexGrow: 1 }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--primary-color)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {post.category}
              </span>
              <h2 style={{ fontSize: '1.3rem', color: '#222', marginTop: '0.5rem', marginBottom: '1rem', lineHeight: '1.4' }}>
                {post.title}
              </h2>
              <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.6' }}>
                {post.excerpt}
              </p>
            </div>
            <div style={{ padding: '1.5rem 2rem', background: '#fafafa', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <small style={{ color: '#999' }}>{post.date}</small>
              <Link href="/contacto" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem' }}>
                Consultar con un asesor &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
