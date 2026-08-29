import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Contacto y Sedes | REMBERT Repuestos",
  description:
    "Puntos de atención, teléfonos y WhatsApp de REMBERT en Barrancabermeja. Punto Principal, Punto El Cerro y Línea de Compras. Asesoría técnica inmediata y envíos a todo Colombia.",
  alternates: {
    canonical: "/contacto",
  },
  openGraph: {
    title: "Contacto y Sedes | REMBERT Repuestos",
    description:
      "Atención especializada en Barrancabermeja: Punto Principal, Punto El Cerro y Línea de Compras e Inventario. Envíos garantizados a todo Colombia.",
    url: "https://www.rembertrepuestos.com/contacto",
  },
};

export default function ContactoPage() {
  const mapsUrl = "https://maps.app.goo.gl/FmmwX9PivNVnurEL7";

  return (
    <div style={{ minHeight: "80vh", padding: "clamp(1.5rem, 4vw, 2.5rem) clamp(0.5rem, 2.5vw, 1rem) clamp(2rem, 5vw, 4rem)" }}>
      <div className="main-container" style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* Header Hero de Contacto */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
            <span className="live-indicator-dot" />
            <span
              style={{
                background: "linear-gradient(135deg, #FFE033 0%, #FFB800 100%)",
                color: "#111111",
                fontWeight: "800",
                fontSize: "clamp(0.72rem, 2.5vw, 0.82rem)",
                padding: "0.4rem 1.1rem",
                borderRadius: "30px",
                textTransform: "uppercase",
                letterSpacing: "0.6px",
                boxShadow: "0 4px 14px rgba(255, 215, 0, 0.35)",
              }}
            >
              Atención Inmediata en Línea
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(1.85rem, 5vw, 3rem)",
              fontWeight: "900",
              color: "#0F172A",
              lineHeight: 1.15,
              marginBottom: "0.85rem",
              letterSpacing: "-0.02em",
            }}
          >
            REPUESTOS CONFIABLES <br />
            <span style={{ color: "#D4A000" }}>PARA TU VEHÍCULO</span>
          </h1>

          <p
            style={{
              color: "#475569",
              fontSize: "clamp(0.95rem, 2.5vw, 1.1rem)",
              maxWidth: "680px",
              margin: "0 auto 1.5rem",
              lineHeight: 1.5,
            }}
          >
            Asesoría técnica personalizada, repuestos originales y alternativos con garantía total. Despachos rápidos a todo el país.
          </p>

          {/* Badges de Garantía y Beneficios */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "0.5rem",
              flexWrap: "wrap",
            }}
          >
            <span className="luxury-chip luxury-chip--dark">
              ⚙️ Repuestos Originales y Alternativos
            </span>
            <span className="luxury-chip luxury-chip--gold">
              💰 Precios al Por Mayor y Detal
            </span>
            <span className="luxury-chip luxury-chip--green">
              🚚 Envíos a Todo Colombia
            </span>
          </div>
        </div>

        {/* Grid Principal: Canales de Atención vs Formulario */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
            gap: "1.75rem",
            alignItems: "start",
          }}
        >
          {/* Columna Izquierda: Tarjetas de Sedes de Lujo */}
          <div
            className="glass-card-dark"
            style={{
              padding: "clamp(1.25rem, 4vw, 2.2rem) clamp(1rem, 3vw, 1.8rem)",
              border: "1px solid rgba(255, 215, 0, 0.25)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.5rem" }}>
              <h2 style={{ fontSize: "1.4rem", margin: 0, color: "var(--primary-color)", fontWeight: "800" }}>
                📍 Sedes y Líneas de Atención
              </h2>
              <span className="luxury-chip luxury-chip--green" style={{ fontSize: "0.75rem" }}>
                <span className="live-indicator-dot" /> Abierto Hoy
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

              {/* Sede 1: Punto Principal */}
              <div className="location-branch-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem", flexWrap: "wrap", gap: "0.4rem" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <span style={{ color: "var(--primary-color)", fontSize: "1.1rem" }}>🏢</span>
                      <strong style={{ color: "#FFFFFF", fontSize: "1.02rem", letterSpacing: "0.2px" }}>
                        PUNTO PRINCIPAL
                      </strong>
                    </div>
                    <p style={{ color: "#94A3B8", fontSize: "0.84rem", marginTop: "0.2rem" }}>
                      Transversal 29, Barrancabermeja, Santander
                    </p>
                  </div>
                  <span style={{ fontSize: "0.72rem", background: "rgba(255, 215, 0, 0.15)", color: "#FFD700", padding: "0.2rem 0.6rem", borderRadius: "6px", fontWeight: "700" }}>
                    Sede Central
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 130px), 1fr))", gap: "0.5rem", marginTop: "0.75rem" }}>
                  <a
                    href="https://wa.me/573102420490?text=Hola%2C%20me%20comunico%20con%20Punto%20Principal%20de%20Rembert%20Repuestos."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp-action"
                    style={{ fontSize: "0.80rem", padding: "0.55rem 0.75rem" }}
                  >
                    <span>💬 310 242 0490</span>
                  </a>
                  <a
                    href="https://wa.me/573125022555?text=Hola%2C%20me%20comunico%20con%20Punto%20Principal%20de%20Rembert%20Repuestos."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp-action"
                    style={{ fontSize: "0.80rem", padding: "0.55rem 0.75rem" }}
                  >
                    <span>💬 312 502 2555</span>
                  </a>
                </div>
              </div>

              {/* Sede 2: Punto El Cerro */}
              <div className="location-branch-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <span style={{ color: "var(--primary-color)", fontSize: "1.1rem" }}>🏪</span>
                      <strong style={{ color: "#FFFFFF", fontSize: "1.02rem", letterSpacing: "0.2px" }}>
                        PUNTO EL CERRO
                      </strong>
                    </div>
                    <p style={{ color: "#94A3B8", fontSize: "0.84rem", marginTop: "0.2rem" }}>
                      Sector El Cerro, Barrancabermeja, Santander
                    </p>
                  </div>
                </div>

                <div style={{ marginTop: "0.75rem" }}>
                  <a
                    href="https://wa.me/573102707375?text=Hola%2C%20me%20comunico%20con%20Punto%20El%20Cerro%20de%20Rembert%20Repuestos."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp-action"
                    style={{ width: "100%", fontSize: "0.82rem", padding: "0.6rem 0.85rem" }}
                  >
                    <span>💬 Contactar El Cerro: 310 270 7375</span>
                  </a>
                </div>
              </div>

              {/* Sede 3: Compras e Inventario */}
              <div className="location-branch-card location-branch-card--accent">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <span style={{ color: "#25D366", fontSize: "1.1rem" }}>📦</span>
                      <strong style={{ color: "#FFFFFF", fontSize: "1.02rem", letterSpacing: "0.2px" }}>
                        COMPRAS, TALLERES Y MAYORISTAS
                      </strong>
                    </div>
                    <p style={{ color: "#94A3B8", fontSize: "0.84rem", marginTop: "0.2rem" }}>
                      Atención para flotas, talleres mecánicos y cotizaciones de gran volumen
                    </p>
                  </div>
                </div>

                <div style={{ marginTop: "0.75rem" }}>
                  <a
                    href="https://wa.me/573508299233?text=Hola%2C%20me%20comunico%20con%20Compras%20e%20Inventario%20de%20Rembert%20Repuestos."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp-action"
                    style={{ width: "100%", fontSize: "0.82rem", padding: "0.6rem 0.85rem" }}
                  >
                    <span>🛒 Línea Directa Mayoristas: +57 350 829 9233</span>
                  </a>
                </div>
              </div>

              {/* Canal de Correo Corporativo */}
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.04)",
                  borderRadius: "12px",
                  padding: "1rem",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "0.75rem",
                }}
              >
                <div>
                  <span style={{ color: "#94A3B8", fontSize: "0.78rem", display: "block" }}>
                    Correo Oficial de Cotizaciones:
                  </span>
                  <span style={{ color: "#FFFFFF", fontWeight: "700", fontSize: "0.88rem", wordBreak: "break-all" }}>
                    repuestosrembertsa@gmail.com
                  </span>
                </div>
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=repuestosrembertsa@gmail.com&su=Consulta+de+Repuestos+-+Rembert+Repuestos+BCA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary-action"
                  style={{ fontSize: "0.82rem", padding: "0.5rem 0.85rem" }}
                >
                  ✉️ Redactar Correo
                </a>
              </div>

            </div>
          </div>

          {/* Columna Derecha: Formulario de Contacto Moderno */}
          <ContactForm />

        </div>

        {/* Sección de Mapa Interactivo con Estilo Automotive */}
        <div style={{ marginTop: "3.5rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.25rem",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div>
              <h2 style={{ fontSize: "clamp(1.3rem, 4vw, 1.6rem)", margin: 0, color: "#0F172A", fontWeight: "800" }}>
                📍 Ubicación Sede Principal
              </h2>
              <p style={{ color: "#64748B", margin: "0.25rem 0 0", fontSize: "0.92rem" }}>
                Transversal 29, Barrancabermeja, Santander, Colombia
              </p>
            </div>

            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--primary"
              style={{
                padding: "0.7rem 1.25rem",
                fontSize: "0.88rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                boxShadow: "0 4px 15px rgba(255, 215, 0, 0.4)",
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M12 0C7.589 0 4 3.589 4 8c0 4.274 7.219 15.184 7.633 15.82a.498.498 0 00.734 0C12.781 23.184 20 12.274 20 8c0-4.411-3.589-8-8-8zm0 11.5a3.5 3.5 0 110-7 3.5 3.5 0 010 7z" />
              </svg>
              Abrir en Google Maps
            </a>
          </div>

          <div
            style={{
              position: "relative",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 12px 36px rgba(0,0,0,0.08)",
              border: "2px solid #E2E8F0",
              height: "clamp(280px, 45vw, 420px)",
            }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3955.5796030999557!2d-73.8350463!3d7.0385664!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e42eb56b38df4f9%3A0xb7c9324e2b880f05!2sRembeat!5e0!3m2!1ses!2sco!4v1700000000000!5m2!1ses!2sco"
              width="100%"
              height="100%"
              style={{ border: 0, display: "block" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación Rembert Repuestos Barrancabermeja"
            />
          </div>
        </div>

      </div>
    </div>
  );
}

