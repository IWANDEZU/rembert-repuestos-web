import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Contacto y cotizaciones",
  description:
    "Contáctanos para recibir asesoría técnica y cotizaciones de lubricantes, filtros y repuestos para motor en Barrancabermeja y con envíos a toda Colombia.",
  alternates: {
    canonical: "/contacto",
  },
  openGraph: {
    title: "Contacto de Victor Services",
    description:
      "Atención personalizada en lubricantes y filtros de motor. Escríbenos por WhatsApp o correo electrónico.",
    url: "https://www.victorservicesas.com/contacto",
  },
};

export default function ContactoPage() {
  return (
    <div className="main-container" style={{ padding: "3rem 1rem", minHeight: "70vh" }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem", color: "var(--primary-color)", textAlign: "center" }}>
        Contacto
      </h1>
      <p style={{ color: "var(--text-muted)", marginBottom: "3rem", fontSize: "1.2rem", textAlign: "center" }}>
        Estamos para asesorarte. Contáctanos por cualquiera de nuestros canales.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem",
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        {/* Info Box */}
        <div
          style={{
            background: "var(--primary-color)",
            color: "white",
            padding: "3rem 2rem",
            borderRadius: "12px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ fontSize: "1.8rem", marginBottom: "2rem" }}>Información</h2>

          <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", alignItems: "flex-start" }}>
            <span style={{ fontSize: "1.5rem" }}>📍</span>
            <div>
              <strong style={{ display: "block", marginBottom: "0.3rem" }}>Dirección</strong>
              <span style={{ opacity: 0.9, lineHeight: "1.5" }}>
                Barrancabermeja, Santander
                <br />
                Colombia
              </span>
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", alignItems: "flex-start" }}>
            <span style={{ fontSize: "1.5rem" }}>📞</span>
            <div>
              <strong style={{ display: "block", marginBottom: "0.3rem" }}>Teléfono / WhatsApp</strong>
              <span style={{ opacity: 0.9 }}>+57 310 873 7354</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", alignItems: "flex-start" }}>
            <span style={{ fontSize: "1.5rem" }}>✉️</span>
            <div>
              <strong style={{ display: "block", marginBottom: "0.3rem" }}>Correo Electrónico</strong>
              <span style={{ opacity: 0.9 }}>contacto@victorservices.com</span>
            </div>
          </div>

          <div style={{ marginTop: "3rem" }}>
            <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>Horario de Atención</h3>
            <p style={{ opacity: 0.9, marginBottom: "0.5rem" }}>Lunes - Viernes: 8:00 AM - 6:00 PM</p>
            <p style={{ opacity: 0.9 }}>Sábados: 8:00 AM - 2:00 PM</p>
          </div>
        </div>

        {/* Contact Form Client Component */}
        <ContactForm />
      </div>

      {/* Ubicación / Mapa */}
      <div style={{ maxWidth: "1000px", margin: "4rem auto 0" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "1.5rem", textAlign: "center" }}>Encuéntranos</h2>
        <iframe 
          src="https://maps.google.com/maps?q=Barrancabermeja,+Santander,+Colombia&t=&z=13&ie=UTF8&iwloc=&output=embed" 
          width="100%" 
          height="450" 
          style={{ border: 0, borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }} 
          allowFullScreen="" 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
}

