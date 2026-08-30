import { Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";
import { CartProvider } from "@/components/CartContext";
import CartIcon from "@/components/CartIcon";
import UserMenu from "@/components/UserMenu";
import AuthProvider from "@/components/AuthProvider";
import ContactSidebar from "@/components/ContactSidebar";
import CartDrawer from "@/components/CartDrawer";
import SearchBar from "@/components/SearchBar";
import CookieConsent from "@/components/CookieConsent";
import BrandLogo from "@/components/BrandLogo";
import { siteUrl } from "@/lib/site";
import { Analytics } from '@vercel/analytics/next';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const baseUrl = siteUrl;

export const viewport = {
  themeColor: "#101010",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata = {
  metadataBase: new URL(baseUrl),
  manifest: "/manifest.webmanifest",
  title: {
    default: "Repuestos para Automóviles de Todas las Marcas | REMBERT",
    template: "%s | REMBERT",
  },
  description:
    "REMBERT Repuestos BCA en Barrancabermeja. Venta especializada de repuestos automotrices, filtros, lubricantes, frenos y radiadores para automóviles de todas las marcas. Envíos seguros a todo Colombia.",
  keywords: [
    "repuestos para automoviles de todas las marcas",
    "repuestos para automóviles",
    "REMBERT",
    "REMBERT repuestos",
    "REMBERT Barrancabermeja",
    "repuestos Chevrolet Renault Toyota Nissan Kia Hyundai Mazda",
    "filtros automotrices todas las marcas",
    "frenos y suspensión Barrancabermeja",
    "radiadores Barrancabermeja",
    "lubricantes Barrancabermeja",
  ],
  authors: [{ name: "REMBERT", url: baseUrl }],
  creator: "REMBERT",
  publisher: "REMBERT",
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Repuestos para Automóviles de Todas las Marcas | REMBERT",
    description:
      "Venta especializada de repuestos automotrices, filtros, lubricantes, frenos y radiadores para automóviles de todas las marcas en Barrancabermeja. Envíos a toda Colombia.",
    url: baseUrl,
    siteName: "REMBERT Repuestos BCA",
    locale: "es_CO",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1011,
        height: 387,
        alt: "REMBERT - Repuestos para Automóviles de Todas las Marcas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Repuestos para Automóviles de Todas las Marcas | REMBERT",
    description: "Venta especializada de repuestos automotrices, filtros y radiadores para automóviles de todas las marcas en Barrancabermeja, Colombia.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

const jsonLdGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AutoPartsStore",
      "@id": `${baseUrl}/#store`,
      "name": "REMBERT Repuestos BCA",
      "alternateName": "Rembert Repuestos",
      "url": baseUrl,
      "logo": `${baseUrl}/logo.png`,
      "image": `${baseUrl}/logo.png`,
      "telephone": "+573102420490",
      "email": "repuestosrembertsa@gmail.com",
      "description": "Venta especializada de repuestos automotrices, filtros, lubricantes, frenos, radiadores y suspensión en Barrancabermeja, Santander. Envíos a toda Colombia.",
      "sameAs": [
        "https://www.facebook.com/profile.php?id=61557618591007",
        "https://wa.me/573102420490",
        "https://wa.me/573125022555",
        "https://wa.me/573102707375",
        "https://wa.me/573508299233"
      ],
      "hasMap": "https://maps.app.goo.gl/FmmwX9PivNVnurEL7",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Transversal 29",
        "addressLocality": "Barrancabermeja",
        "addressRegion": "Santander",
        "addressCountry": "CO",
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 7.0385664,
        "longitude": -73.8328576,
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "08:00",
          "closes": "18:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": "Saturday",
          "opens": "08:00",
          "closes": "14:00",
        },
      ],
      "priceRange": "$$",
    },
    {
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
      "url": baseUrl,
      "name": "Rembert Repuestos BCA",
      "publisher": {
        "@id": `${baseUrl}/#store`,
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${baseUrl}/catalogo?search={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
        />
      </head>
      <body>
        <AuthProvider>
          <CartProvider>
            {/* Top Bar (30% Amarillo) con Botones CTA */}
            <div className="top-bar">
              <div className="top-bar__inner main-container">
                {/* Slogan oficial de marca */}
                <div className="top-bar__highlight">
                  <span style={{ fontWeight: '800', fontSize: '0.84rem', color: '#111111', letterSpacing: '0.4px', textTransform: 'uppercase' }}>
                    🛡️ REPUESTOS CONFIABLES PARA TU VEHÍCULO
                  </span>
                </div>

                {/* Botones de Llamado a la Acción Táctiles para Móvil y Desktop */}
                <div className="top-bar__actions" role="navigation" aria-label="Canales de atención directa">
                  <a
                    href="https://wa.me/573102420490?text=Hola%2C%20me%20comunico%20con%20Punto%20Principal%20de%20Rembert%20Repuestos."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="top-bar__btn top-bar__btn--primary"
                    title="Llamar o escribir al Punto Principal"
                  >
                    <span className="btn-icon">📍</span>
                    <span><strong>Ppal:</strong> 310 242 0490</span>
                  </a>

                  <a
                    href="https://wa.me/573102707375?text=Hola%2C%20me%20comunico%20con%20Punto%20El%20Cerro%20de%20Rembert%20Repuestos."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="top-bar__btn top-bar__btn--dark"
                    title="Llamar o escribir al Punto El Cerro"
                  >
                    <span className="btn-icon">📍</span>
                    <span><strong>El Cerro:</strong> 310 270 7375</span>
                  </a>

                  <a
                    href="https://wa.me/573508299233?text=Hola%2C%20me%20comunico%20con%20Compras%20e%20Inventario%20de%20Rembert%20Repuestos."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="top-bar__btn top-bar__btn--cta"
                    title="Compras e Inventario: +57 350 829 9233"
                  >
                    <span className="btn-icon">🛒</span>
                    <span><strong>Compras e Inventario:</strong> +57 350 829 9233</span>
                  </a>

                  <div className="top-bar__chip">
                    <span>🚚 <strong>Envíos Nacionales</strong></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navbar */}
            <nav className="navbar">
              <div className="navbar__floating-logo" aria-hidden="true">
                <Image
                  src="/logo-rembert-medallion-transparent.webp"
                  alt=""
                  width={512}
                  height={512}
                  priority={false}
                  sizes="330px"
                />
              </div>
              <div className="navbar__main">
                {/* Brand / Logo + 38 Años de Experiencia Debajo */}
                <div className="navbar__identity" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.45rem' }}>
                  <Link href="/" className="navbar__brand" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                    <BrandLogo width={285} height={95} />
                  </Link>
                  <span className="experience-badge">
                    <span className="experience-badge__star">⭐</span> <strong>38 AÑOS</strong> DE EXPERIENCIA
                  </span>
                </div>

                {/* Search */}
                <SearchBar />

                {/* Actions */}
                <UserMenu />
              </div>

              {/* Bottom Menu */}
              <ul className="navbar__menu">
                <li style={{ whiteSpace: 'nowrap', flexShrink: 0 }}><Link href="/" className="navbar__link" style={{ whiteSpace: 'nowrap' }}>INICIO</Link></li>
                <li style={{ whiteSpace: 'nowrap', flexShrink: 0 }}><Link href="/catalogo" className="navbar__link" style={{ whiteSpace: 'nowrap' }}>CATÁLOGO</Link></li>
                <li style={{ whiteSpace: 'nowrap', flexShrink: 0 }}><Link href="/catalogo?category=electrico-y-encendido" className="navbar__link" style={{ whiteSpace: 'nowrap' }}>{"PARTES\u00A0ELÉCTRICAS"}</Link></li>
                <li style={{ whiteSpace: 'nowrap', flexShrink: 0 }}><Link href="/servicio-tecnico" className="navbar__link" style={{ whiteSpace: 'nowrap' }}>{"SERVICIO\u00A0TÉCNICO"}</Link></li>
                <li style={{ whiteSpace: 'nowrap', flexShrink: 0 }}><Link href="/marcas" className="navbar__link" style={{ whiteSpace: 'nowrap' }}>MARCAS</Link></li>
                <li style={{ whiteSpace: 'nowrap', flexShrink: 0 }}><Link href="/nosotros" className="navbar__link" style={{ whiteSpace: 'nowrap' }}>NOSOTROS</Link></li>
                <li style={{ whiteSpace: 'nowrap', flexShrink: 0 }}><Link href="/contacto" className="navbar__link" style={{ whiteSpace: 'nowrap' }}>CONTACTO</Link></li>
              </ul>
            </nav>

            {children}

            <footer className="footer" style={{ textAlign: 'center', padding: '3.5rem 1rem', background: '#111', color: '#ccc' }}>
              <div style={{ maxWidth: '1100px', margin: '0 auto 2.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem', textAlign: 'left' }}>
                <div>
                  <div style={{ marginBottom: '1rem' }}>
                    <BrandLogo width={160} height={52} />
                  </div>
                  <p style={{ color: '#aaa', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '0.8rem' }}>
                    Repuestos originales y alternativos para tu vehículo. Precios al por mayor y detal con envíos seguros a todo el país.
                  </p>
                  <p style={{ color: '#888', fontSize: '0.85rem' }}>Barrancabermeja, Santander - Colombia</p>
                </div>

                <div>
                  <h4 style={{ color: 'var(--primary-color)', fontSize: '1.1rem', marginBottom: '1rem', textTransform: 'uppercase' }}>Sedes & Atención</h4>
                  <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    <strong style={{ color: '#fff' }}>Punto Principal:</strong><br />
                    <a href="https://wa.me/573102420490" target="_blank" rel="noopener noreferrer" style={{ color: '#25D366' }}>📱 310 242 0490</a> / <a href="https://wa.me/573125022555" target="_blank" rel="noopener noreferrer" style={{ color: '#25D366' }}>312 502 2555</a>
                  </p>
                  <p style={{ fontSize: '0.9rem' }}>
                    <strong style={{ color: '#fff' }}>Punto El Cerro:</strong><br />
                    <a href="https://wa.me/573102707375" target="_blank" rel="noopener noreferrer" style={{ color: '#25D366' }}>📱 310 270 7375</a>
                  </p>
                </div>

                <div>
                  <h4 style={{ color: 'var(--primary-color)', fontSize: '1.1rem', marginBottom: '1rem', textTransform: 'uppercase' }}>Compras & Canales</h4>
                  <p style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                    <strong style={{ color: '#fff' }}>Compras e Inventario:</strong><br />
                    <a href="https://wa.me/573508299233" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>🛒 +57 350 829 9233</a>
                  </p>
                  <p style={{ fontSize: '0.9rem' }}>
                    <strong style={{ color: '#fff' }}>Email Corporativo:</strong><br />
                    <a href="https://mail.google.com/mail/?view=cm&fs=1&to=repuestosrembertsa@gmail.com&su=Consulta+de+Repuestos" target="_blank" rel="noopener noreferrer" style={{ color: '#aaa' }}>repuestosrembertsa@gmail.com</a>
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <a href="https://maps.app.goo.gl/FmmwX9PivNVnurEL7" target="_blank" rel="noreferrer" style={{ color: '#fff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.95rem' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#34A853" width="18" height="18"><path d="M12 0C7.589 0 4 3.589 4 8c0 4.274 7.219 15.184 7.633 15.82a.498.498 0 00.734 0C12.781 23.184 20 12.274 20 8c0-4.411-3.589-8-8-8zm0 11.5a3.5 3.5 0 110-7 3.5 3.5 0 010 7z" /></svg> Ver en Google Maps
                </a>
                <a href="https://www.facebook.com/profile.php?id=61557618591007" target="_blank" rel="noreferrer" style={{ color: '#1877F2', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.95rem' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1877F2" width="18" height="18"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg> Facebook
                </a>
                <a href="https://mail.google.com/mail/?view=cm&fs=1&to=repuestosrembertsa@gmail.com&su=Consulta+de+Repuestos+-+Rembert+Repuestos+BCA" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.95rem' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#EA4335" width="18" height="18"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg> repuestosrembertsa@gmail.com
                </a>
              </div>
              <nav aria-label="Información legal" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', fontSize: '0.88rem', marginBottom: '1rem' }}>
                <Link href="/politica-privacidad">Tratamiento de datos</Link>
                <Link href="/politica-cookies">Cookies</Link>
                <Link href="/terminos-y-condiciones">Términos y condiciones</Link>
                <Link href="/eliminar-datos">Eliminar cuenta y datos</Link>
              </nav>
              <p>&copy; {new Date().getFullYear()} Rembert Repuestos BCA. Barrancabermeja, Colombia.</p>
              <p style={{ marginTop: '0.5rem', color: '#666', fontSize: '0.9rem' }}>
                Sitio web creado por <a href="https://crk-publicity.pages.dev/" target="_blank" rel="noreferrer" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 'bold' }}>CRK Publicity</a>
              </p>
            </footer>
            <ContactSidebar />
            <CartDrawer />
            <CookieConsent />
            <Analytics />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
