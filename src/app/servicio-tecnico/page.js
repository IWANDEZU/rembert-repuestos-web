import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Servicio Técnico Automotriz | REMBERT",
  description:
    "Servicio técnico especializado de REMBERT en Barrancabermeja: Cambio de aceite y filtros, mantenimiento de frenos, suspensión, baterías y radiadores.",
  alternates: {
    canonical: "/servicio-tecnico",
  },
  openGraph: {
    title: "Servicio Técnico Automotriz | REMBERT",
    description:
      "Mantenimiento preventivo y montaje de repuestos con garantía en Barrancabermeja.",
    url: "https://www.rembertrepuestos.com/servicio-tecnico",
  },
};

export default function ServicioTecnicoPage() {
  const services = [
    /* Temporalmente desactivado: Diagnóstico Computarizado y Escáner
    {
      title: "Diagnóstico Computarizado y Escáner",
      icon: "💻",
      description:
        "Lectura de códigos de falla, diagnóstico electrónico de motor, ABS, Airbag y sistemas de inyección con equipos de última tecnología.",
      badge: "Precisión Total",
    },
    */
    {
      title: "Cambio de Aceite y Filtros",
      icon: "🛢️",
      description:
        "Mantenimiento rápido de fluidos con las mejores marcas del mercado (Shell, Mobil, Castrol, Terpel, Chevron). Filtros de aceite, aire y cabina WIX y MANN-FILTER.",
      badge: "Entrega Rápida",
    },
    {
      title: "Sistema de Frenos y Rectificación",
      icon: "🛑",
      description:
        "Cambio de pastillas, bandas, discos, campanas y purga de líquido de frenos con marcas de equipo original como Incolbest y Bosch.",
      badge: "Seguridad Garantizada",
    },
    {
      title: "Suspensión, Amortiguadores y Dirección",
      icon: "🚘",
      description:
        "Revisión y reemplazo de amortiguadores Gabriel, terminales de dirección, rótulas, tijeras y bujes para máxima estabilidad y confort de marcha.",
      badge: "Confort y Control",
    },
    {
      title: "Baterías y Sistema Eléctrico",
      icon: "🔋",
      description:
        "Prueba de carga de batería, diagnóstico de alternador y arranque, e instalación de baterías Coéxito y selladas de alto rendimiento.",
      badge: "Arranque Seguro",
    },
    {
      title: "Fluidos de Transmisión y Refrigeración",
      icon: "❄️",
      description:
        "Cambio de valvulinas de transmisión manual, fluidos ATF para cajas automáticas, purga y recarga de refrigerante Coolant de larga duración.",
      badge: "Protección Térmica",
    },
  ];

  return (
    <div className="main-container section" style={{ minHeight: "75vh", padding: "clamp(1.5rem, 4vw, 3rem) clamp(0.5rem, 2.5vw, 1rem)" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <span className="badge-yellow" style={{ marginBottom: "0.75rem", fontSize: "0.85rem", padding: "0.35rem 1rem" }}>
          🛠️ Taller y Diagnóstico Especializado
        </span>
        <h1 style={{ fontSize: "clamp(1.8rem, 5vw, 2.6rem)", marginTop: "0.5rem", marginBottom: "0.75rem", color: "#111" }}>
          Servicio Técnico <span style={{ color: "var(--primary-dark)" }}>en Barrancabermeja</span>
        </h1>
        <p style={{ color: "#5A6A80", fontSize: "clamp(0.95rem, 2.5vw, 1.15rem)", maxWidth: "750px", margin: "0 auto 1.5rem" }}>
          En <strong>Rembert Repuestos BCA</strong> no solo te suministramos los repuestos originales y alternativos; también contamos con personal calificado para el mantenimiento y diagnóstico de tu vehículo.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          <a
            href="https://wa.me/573102420490?text=Hola%2C%20quisiera%20agendar%20un%20servicio%20t%C3%A9cnico%20en%20Punto%20Principal."
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--primary"
            style={{ padding: "0.85rem 1.6rem", fontSize: "0.92rem" }}
          >
            💬 Agendar en Punto Principal
          </a>
          <a
            href="https://wa.me/573102707375?text=Hola%2C%20quisiera%20agendar%20un%20servicio%20t%C3%A9cnico%20en%20Punto%20El%20Cerro."
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
            style={{ background: "#111", color: "#fff", padding: "0.85rem 1.6rem", fontSize: "0.92rem", textDecoration: "none" }}
          >
            💬 Agendar en Punto El Cerro
          </a>
        </div>
      </div>

      {/* Grid de Servicios */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
          gap: "1.5rem",
          marginBottom: "4rem",
        }}
      >
        {services.map((s, idx) => (
          <div
            key={idx}
            style={{
              background: "#FFFFFF",
              borderRadius: "14px",
              padding: "clamp(1.25rem, 3vw, 2rem) clamp(1rem, 2.5vw, 1.75rem)",
              border: "1px solid #E2E8F0",
              boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              transition: "transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
            }}
            className="hover-card"
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                <span style={{ fontSize: "2.5rem" }}>{s.icon}</span>
                <span className="badge-yellow" style={{ fontSize: "0.78rem" }}>{s.badge}</span>
              </div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: "800", color: "#111", marginBottom: "0.75rem" }}>
                {s.title}
              </h3>
              <p style={{ color: "#5A6A80", fontSize: "0.95rem", lineHeight: "1.6" }}>
                {s.description}
              </p>
            </div>

            <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid #F1F5F9" }}>
              <a
                href={`https://wa.me/573102420490?text=Hola%2C%20deseo%20cotizar%20el%20servicio%20de%3A%20${encodeURIComponent(s.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "var(--primary-dark)",
                  fontWeight: "bold",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  fontSize: "0.92rem",
                }}
              >
                Cotizar este servicio por WhatsApp ➔
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Banner de Garantía y Confianza */}
      <div
        style={{
          background: "#111111",
          color: "#ffffff",
          borderRadius: "16px",
          padding: "3rem 2rem",
          textAlign: "center",
          border: "2px solid var(--primary-color)",
          boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
        }}
      >
        <h2 style={{ fontSize: "2rem", color: "var(--primary-color)", marginBottom: "1rem" }}>
          ¿Necesitas un Repuesto con Instalación Incluida?
        </h2>
        <p style={{ color: "#cccccc", fontSize: "1.05rem", maxWidth: "700px", margin: "0 auto 2rem", lineHeight: "1.6" }}>
          Visítanos en nuestras sedes en Barrancabermeja o contáctanos para asesorarte con la referencia exacta para tu modelo de vehículo.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
          <Link href="/catalogo" className="btn btn--primary" style={{ padding: "0.85rem 2rem" }}>
            Ver Catálogo de Repuestos
          </Link>
          <a
            href="https://wa.me/573508299233?text=Hola%2C%20quisiera%20consultar%20disponibilidad%20de%20repuestos%20e%20inventario."
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--outline"
            style={{ color: "#FFD700", borderColor: "#FFD700", padding: "0.85rem 2rem" }}
          >
            🛒 Compras e Inventario (+57 350 829 9233)
          </a>
          <Link href="/contacto" className="btn btn--outline" style={{ color: "#fff", borderColor: "#fff", padding: "0.85rem 2rem" }}>
            Ver Sedes y Horarios
          </Link>
        </div>
      </div>
    </div>
  );
}
