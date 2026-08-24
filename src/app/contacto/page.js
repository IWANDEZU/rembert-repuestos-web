import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Contacto y Sedes | REMBERT",
  description:
    "Puntos de atención, teléfonos y WhatsApp de REMBERT en Barrancabermeja. Punto Principal y Punto El Cerro.",
  alternates: {
    canonical: "/contacto",
  },
  openGraph: {
    title: "Contacto y Sedes | REMBERT",
    description:
      "Atención en Barrancabermeja: Punto Principal, Punto El Cerro y Línea de Compras. Envíos a todo Colombia.",
    url: "https://www.rembertrepuestos.com/contacto",
  },
};

export default function ContactoPage() {
  const mapsUrl = "https://maps.app.goo.gl/FmmwX9PivNVnurEL7";

  return (
    <div className="main-container" style={{ padding: "3rem 1rem", minHeight: "70vh" }}>
      {/* Encabezado */}
      <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <span style={{
          background: "var(--primary-color)",
          color: "#111",
          fontWeight: "800",
          fontSize: "0.85rem",
          padding: "0.35rem 0.9rem",
          borderRadius: "20px",
          textTransform: "uppercase",
          letterSpacing: "0.5px"
        }}>
          Atención Inmediata
        </span>
        <h1 style={{ fontSize: "2.5rem", marginTop: "0.75rem", marginBottom: "0.5rem", color: "#111" }}>
          REPUESTOS CONFIABLES <span style={{ color: "var(--primary-dark)" }}>PARA TU VEHÍCULO</span>
        </h1>
        <p style={{ color: "#5A6A80", fontSize: "1.1rem", maxWidth: "700px", margin: "0 auto" }}>
          Repuestos originales y alternativos | Precios al por mayor y detal | Envíos a todo el país.
        </p>

        {/* Badges de Beneficios */}
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
          <span className="badge-gray" style={{ fontSize: "0.85rem", padding: "0.4rem 1rem", border: "1px solid #E2E8F0" }}>
            ⚙️ Repuestos Originales y Alternativos
          </span>
          <span className="badge-yellow" style={{ fontSize: "0.85rem", padding: "0.4rem 1rem" }}>
            💰 Precios al Por Mayor y Detal
          </span>
          <span className="badge-black" style={{ fontSize: "0.85rem", padding: "0.4rem 1rem" }}>
            🚚 Envíos a Todo el País
          </span>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "2rem",
          maxWidth: "1150px",
          margin: "0 auto",
        }}
      >
        {/* Info Box con Sedes y Canales */}
        <div
          style={{
            background: "#111111",
            color: "#ffffff",
            padding: "2.5rem 2rem",
            borderRadius: "14px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            border: "2px solid var(--primary-color)",
          }}
        >
          <h2 style={{ fontSize: "1.6rem", marginBottom: "1.5rem", color: "var(--primary-color)" }}>
            📞 Líneas de Atención Directa
          </h2>

          {/* Sede 1: Punto Principal */}
          <div style={{ background: "#1C1C1C", padding: "1.2rem", borderRadius: "10px", border: "1px solid #333", marginBottom: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "1.2rem" }}>📍</span>
              <strong style={{ color: "var(--primary-color)", fontSize: "1.05rem" }}>PUNTO PRINCIPAL</strong>
            </div>
            <p style={{ color: "#aaa", fontSize: "0.88rem", marginBottom: "0.75rem" }}>Tv. 29, Barrancabermeja, Santander</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <a
                href="https://wa.me/573102420490?text=Hola%2C%20me%20comunico%20con%20Punto%20Principal%20de%20Rembert%20Repuestos."
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#fff", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem", fontWeight: "bold", fontSize: "0.95rem" }}
              >
                <span style={{ color: "#25D366" }}>📱 WhatsApp:</span> 310 242 0490
              </a>
              <a
                href="https://wa.me/573125022555?text=Hola%2C%20me%20comunico%20con%20Punto%20Principal%20de%20Rembert%20Repuestos."
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#fff", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem", fontWeight: "bold", fontSize: "0.95rem" }}
              >
                <span style={{ color: "#25D366" }}>📱 WhatsApp:</span> 312 502 2555
              </a>
            </div>
          </div>

          {/* Sede 2: Punto El Cerro */}
          <div style={{ background: "#1C1C1C", padding: "1.2rem", borderRadius: "10px", border: "1px solid #333", marginBottom: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "1.2rem" }}>📍</span>
              <strong style={{ color: "var(--primary-color)", fontSize: "1.05rem" }}>PUNTO EL CERRO</strong>
            </div>
            <p style={{ color: "#aaa", fontSize: "0.88rem", marginBottom: "0.75rem" }}>Sector El Cerro, Barrancabermeja</p>
            <div>
              <a
                href="https://wa.me/573102707375?text=Hola%2C%20me%20comunico%20con%20Punto%20El%20Cerro%20de%20Rembert%20Repuestos."
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#fff", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem", fontWeight: "bold", fontSize: "0.95rem" }}
              >
                <span style={{ color: "#25D366" }}>📱 WhatsApp:</span> 310 270 7375
              </a>
            </div>
          </div>

          {/* Sede 3: Compras e Inventario */}
          <div style={{ background: "#1C1C1C", padding: "1.2rem", borderRadius: "10px", border: "1px solid #333", marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "1.2rem" }}>🛒</span>
              <strong style={{ color: "var(--primary-color)", fontSize: "1.05rem" }}>COMPRAS E INVENTARIO</strong>
            </div>
            <p style={{ color: "#aaa", fontSize: "0.88rem", marginBottom: "0.75rem" }}>Gestión de stock, pedidos al por mayor, talleres y flotas de transporte</p>
            <div>
              <a
                href="https://wa.me/573508299233?text=Hola%2C%20me%20comunico%20con%20Compras%20e%20Inventario%20de%20Rembert%20Repuestos."
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#fff", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem", fontWeight: "bold", fontSize: "0.95rem" }}
              >
                <span style={{ color: "#25D366" }}>📱 WhatsApp:</span> +57 350 829 9233
              </a>
            </div>
          </div>

          {/* Correo Electrónico */}
          <div style={{ borderTop: "1px solid #333", paddingTop: "1rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
            <div>
              <span style={{ color: "#aaa", fontSize: "0.85rem", display: "block" }}>Correo Corporativo:</span>
              <span style={{ color: "#fff", fontWeight: "bold", fontSize: "0.95rem" }}>repuestosrembertsa@gmail.com</span>
            </div>
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=repuestosrembertsa@gmail.com&su=Consulta+de+Repuestos+-+Rembert+Repuestos+BCA"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--primary"
              style={{ padding: "0.45rem 1rem", fontSize: "0.8rem" }}
            >
              ✉️ Redactar Correo
            </a>
          </div>
        </div>

        {/* Contact Form Client Component */}
        <ContactForm />
      </div>

      {/* Ubicación / Mapa Interactivo */}
      <div style={{ maxWidth: "1150px", margin: "4rem auto 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h2 style={{ fontSize: "1.8rem", margin: 0, color: "#111" }}>📍 Ubicación Punto Principal en Barrancabermeja</h2>
            <p style={{ color: "#666", margin: "0.3rem 0 0 0", fontSize: "0.95rem" }}>Transversal 29, Barrancabermeja, Santander</p>
          </div>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--primary"
            style={{ padding: "0.75rem 1.5rem", fontSize: "0.95rem", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 0C7.589 0 4 3.589 4 8c0 4.274 7.219 15.184 7.633 15.82a.498.498 0 00.734 0C12.781 23.184 20 12.274 20 8c0-4.411-3.589-8-8-8zm0 11.5a3.5 3.5 0 110-7 3.5 3.5 0 010 7z" /></svg>
            Cómo Llegar con Google Maps
          </a>
        </div>

        <div style={{ position: "relative", borderRadius: "14px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.12)", border: "2px solid #e0e0e0" }}>
          <iframe
            src="https://maps.google.com/maps?q=Rembert,+Tv.+29,+Barrancabermeja,+Santander&t=&z=16&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="450"
            style={{ border: 0, display: "block" }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación Rembert Repuestos Barrancabermeja"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
