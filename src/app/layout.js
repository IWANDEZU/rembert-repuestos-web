import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "900"],
});

export const metadata = {
  title: "Victor Services | Lubricantes y Filtros",
  description: "Multiservicios Victor Services Barrancabermeja - Lubricantes y filtros para motores diésel y gasolina.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${inter.variable}`}>
      <body>
        {/* Top Bar */}
        <div className="top-bar">
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>📞 +57 300 000 0000</span>
            <span>💬 Escríbenos por WhatsApp</span>
          </div>
          <div>
            <span>🚚 Envíos a todo Colombia</span>
          </div>
        </div>

        {/* Navbar */}
        <nav className="navbar">
          <div className="navbar__main main-container">
            {/* Brand / Logo */}
            <a href="/" className="navbar__brand">
              <img src="/logo.png" alt="Victor Services Logo" style={{ width: '70px', height: '70px', objectFit: 'contain', borderRadius: '50%' }} />
              <div className="navbar__title">
                <small>MULTISERVICIOS</small>
                <strong>VICTOR SERVICES</strong>
                <small style={{ color: '#fff' }}>BARRANCABERMEJA</small>
              </div>
            </a>

            {/* Search */}
            <div className="navbar__search">
              <input type="text" placeholder="Buscar por producto, marca o referencia..." />
              <button>🔍</button>
            </div>

            {/* Actions */}
            <div className="navbar__actions">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '1.2rem' }}>👤</span>
                <span>Mi cuenta</span>
              </div>
              <a href="/admin/dashboard" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '1.2rem', color: 'var(--primary-color)' }}>⚙️</span>
                <span>CRM Admin</span>
              </a>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                <span style={{ fontSize: '1.2rem' }}>🛒</span>
                <span>Carrito</span>
                <span style={{ position: 'absolute', top: '-5px', right: '5px', background: 'var(--primary-color)', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '0.7rem' }}>2</span>
              </div>
            </div>
          </div>

          {/* Bottom Menu */}
          <ul className="navbar__menu main-container">
            <li><a href="/" className="navbar__link active">INICIO</a></li>
            <li><a href="/catalogo" className="navbar__link">LUBRICANTES ⌄</a></li>
            <li><a href="/catalogo" className="navbar__link">FILTROS ⌄</a></li>
            <li><a href="/marcas" className="navbar__link">MARCAS</a></li>
            <li><a href="/nosotros" className="navbar__link">NOSOTROS</a></li>
            <li><a href="/blog" className="navbar__link">BLOG TÉCNICO</a></li>
            <li><a href="/contacto" className="navbar__link">CONTACTO</a></li>
          </ul>
        </nav>

        {children}

        <footer className="footer">
          <p>&copy; {new Date().getFullYear()} Multiservicios Victor Services. Barrancabermeja, Colombia.</p>
          <p style={{ marginTop: '0.5rem', color: '#666' }}>Plataforma Web + CRM conectada</p>
        </footer>
      </body>
    </html>
  );
}
