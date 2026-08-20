import Image from "next/image";
import Link from "next/link";
import { siteUrl } from "@/lib/site";

export const metadata = {
  title: "Radiadores Chevrolet y Renault | REMBERT",
  description:
    "Venta especializada de radiadores para Chevrolet (Sail, Onix, Tracker, Spark, Aveo) y Renault (Duster, Sandero, Logan, Stepway, Kwid) en Barrancabermeja. Envíos a todo Colombia.",
  alternates: {
    canonical: "/radiadores",
  },
  keywords: [
    "radiadores Chevrolet",
    "radiadores Renault",
    "radiador Sail",
    "radiador Onix",
    "radiador Tracker",
    "radiador Spark GT",
    "radiador Duster",
    "radiador Sandero",
    "radiador Logan",
    "radiador Stepway",
    "radiador Kwid",
    "radiadores Barrancabermeja",
    "tapas de radiador",
    "refrigerante motor",
  ],
  openGraph: {
    title: "Radiadores Chevrolet y Renault | REMBERT",
    description:
      "Radiadores originales y homologados para Chevrolet y Renault. Alta eficiencia térmica, asesoría inmediata en Barrancabermeja y envíos a toda Colombia.",
    url: `${siteUrl}/radiadores`,
    images: [
      {
        url: "/radiador-banner.jpg",
        width: 1200,
        height: 630,
        alt: "Radiadores Chevrolet y Renault - REMBERT",
      },
    ],
  },
};

const radiatorCategories = [
  {
    id: "chevrolet-radiadores",
    title: "Radiadores para Chevrolet",
    badge: "Especialidad Chevrolet",
    description:
      "Radiadores de aluminio con panel de alta disipación térmica para Chevrolet Sail, Onix, Tracker, Spark GT, Aveo, Captiva, Cruze y Optra. Ajuste exacto OEM de fábrica.",
    image: "/radiador-auto.jpg",
    specs: ["Aluminio de alta transferencia", "Tanques de polímero reforzado", "Ajuste OEM directo", "Garantía térmica"],
    whatsappText: "Hola, me interesa cotizar un Radiador para Chevrolet (Sail, Onix, Tracker, Spark, Aveo).",
  },
  {
    id: "renault-radiadores",
    title: "Radiadores para Renault",
    badge: "Especialidad Renault",
    description:
      "Radiadores de alto rendimiento térmico para Renault Duster, Sandero, Logan, Stepway, Kwid, Megane, Clio y Symbol. Diseñados para clima cálido y exigente.",
    image: "/radiador-banner.jpg",
    specs: ["Resistencia a altas presiones", "Tomas y conectores OEM", "Enfriamiento garantizado", "Durabilidad superior"],
    whatsappText: "Hola, necesito cotizar un Radiador para Renault (Duster, Sandero, Logan, Stepway, Kwid).",
  },
  {
    id: "intercoolers-enfriadores",
    title: "Enfriadores y Calefacción",
    badge: "Sistema Térmico",
    description:
      "Radiadores de calefacción interior, enfriadores de aceite y post-enfriadores térmicos para vehículos Chevrolet y Renault.",
    image: "/radiador-auto.jpg",
    specs: ["Calefacción interior", "Enfriamiento de aceite", "Protección del motor", "Rendimiento óptimo"],
    whatsappText: "Hola, requiero cotizar un radiador de calefacción o enfriador para Chevrolet/Renault.",
  },
  {
    id: "componentes-refrigeracion",
    title: "Tapas, Termostatos y Refrigerante ACDelco",
    badge: "Accesorios Críticos",
    description:
      "Refrigerante original ACDelco DEX-COOL 50/50 OAT, tapas presurizadas de seguridad calibradas (0.9, 1.1 y 1.4 Bar) y termostatos de apertura precisa.",
    image: "/acdelco-dex-cool-50-50-galon.png",
    specs: ["ACDelco DEX-COOL 50/50 OAT", "Tapas presurizadas calibradas", "Termostatos OEM de precisión", "Protección anticorrosiva 5 años"],
    whatsappText: "Hola, deseo cotizar el Refrigerante ACDelco DEX-COOL 50/50, tapas de radiador o termostato para mi vehículo.",
  },
];

const brandCompatibilities = [
  {
    brand: "Chevrolet",
    logo: "/logos/autos/chevrolet.svg",
    models: "Sail, Onix, Tracker, Spark GT, Aveo, Captiva, Cruze, Optra, Sonic, Cobalt",
    tag: "Especialidad #1",
  },
  {
    brand: "Renault",
    logo: "/logos/autos/renault.svg",
    models: "Duster, Sandero, Logan, Stepway, Kwid, Megane, Clio Campus, Symbol, Twingo",
    tag: "Especialidad #2",
  },
  {
    brand: "Toyota",
    logo: "/logos/autos/toyota.svg",
    models: "Corolla, Yaris, RAV4, Prado, Fortuner",
    tag: "Línea Liviana",
  },
  {
    brand: "Mazda",
    logo: "/logos/autos/mazda.svg",
    models: "Mazda 2, Mazda 3, CX-30, CX-5, Allegro",
    tag: "Línea Liviana",
  },
  {
    brand: "Kia & Hyundai",
    logo: "/logos/autos/kia.svg",
    models: "Picanto, Rio, Sportage, Tucson, Accent, i10",
    tag: "Línea Coreana",
  },
  {
    brand: "Nissan",
    logo: "/logos/autos/nissan.svg",
    models: "Versa, March, Sentra, Kicks, Tiida",
    tag: "Línea Liviana",
  },
];

const diagnosticTips = [
  {
    icon: "🌡️",
    title: "Temperatura Alta en Subidas o Tráfico",
    description:
      "Si la aguja sube en pendientes o trancones, el panel del radiador puede tener sarro interno o aletas dobladas que impiden el flujo de aire.",
  },
  {
    icon: "💧",
    title: "Fugas Verdes o Rojas en el Suelo",
    description:
      "Goteras de color en la parte frontal indican fisuras en los tanques plásticos, juntas desgastadas o micro-perforaciones en las celdas.",
  },
  {
    icon: "💨",
    title: "Pérdida de Presión por la Tapa",
    description:
      "Una tapa de radiador vencida no retiene la presión (0.9 a 1.1 Bar), provocando ebullición prematura del líquido y retorno descontrolado al depósito.",
  },
  {
    icon: "🚫",
    title: "Uso de Agua Corriente en vez de Coolant",
    description:
      "El agua de grifo oxida los conductos de aluminio y crea sarro calcáreo que tapona el radiador en pocos meses. Usa siempre refrigerante con etilenglicol.",
  },
];

export default function RadiadoresPage() {
  return (
    <main style={{ backgroundColor: "#F4F6F8", minHeight: "100vh" }}>
      {/* Hero Section Radiadores */}
      <section
        style={{
          background: "linear-gradient(135deg, #101010 0%, #1a1a1a 100%)",
          color: "#ffffff",
          padding: "4.5rem 1rem 5rem",
          position: "relative",
          overflow: "hidden",
          borderBottom: "4px solid var(--primary-color)",
        }}
      >
        <div
          className="main-container"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "3rem",
            alignItems: "center",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "var(--primary-color)",
                color: "#111111",
                padding: "0.4rem 1.1rem",
                borderRadius: "30px",
                fontWeight: "900",
                fontSize: "0.85rem",
                marginBottom: "1.2rem",
                letterSpacing: "0.5px",
                boxShadow: "0 4px 15px rgba(255, 215, 0, 0.4)",
              }}
            >
              ❄️ SISTEMAS DE ENFRIAMIENTO & RADIADORES
            </div>

            <h1
              style={{
                fontSize: "clamp(2.2rem, 5vw, 3.4rem)",
                lineHeight: 1.15,
                marginBottom: "1.2rem",
                textTransform: "uppercase",
                color: "#ffffff",
                fontWeight: 900,
              }}
            >
              Radiadores de <br />
              <span style={{ color: "var(--primary-color)" }}>Alta Eficiencia Térmica</span>
            </h1>

            <p
              style={{
                color: "#E2E8F0",
                fontSize: "1.1rem",
                lineHeight: "1.6",
                marginBottom: "2rem",
                maxWidth: "600px",
              }}
            >
              Radiadores originales y homologados en aluminio para vehículos Chevrolet, Renault, camionetas y línea liviana. Máxima disipación térmica, asesoría técnica y envíos a todo el país.
            </p>

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <a
                href="https://wa.me/573102420490?text=Hola%2C%20quisiera%20cotizar%20un%20radiador%20para%20mi%20veh%C3%ADculo.%20Indico%20marca%2C%20modelo%20y%20a%C3%B1o%3A"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--primary"
                style={{ padding: "0.95rem 2rem", fontSize: "0.95rem", fontWeight: "800" }}
              >
                💬 COTIZAR MI RADIADOR POR WHATSAPP
              </a>
              <Link
                href="/catalogo?category=radiadores"
                className="btn btn--outline"
                style={{
                  padding: "0.95rem 1.8rem",
                  color: "#ffffff",
                  borderColor: "rgba(255,255,255,0.6)",
                  fontSize: "0.95rem",
                }}
              >
                VER PRODUCTOS EN CATÁLOGO →
              </Link>
            </div>

            <div
              style={{
                display: "flex",
                gap: "1.5rem",
                marginTop: "2.5rem",
                paddingTop: "1.5rem",
                borderTop: "1px solid rgba(255,255,255,0.15)",
                flexWrap: "wrap",
              }}
            >
              <div>
                <span style={{ color: "var(--primary-color)", fontWeight: "900", fontSize: "1.2rem", display: "block" }}>
                  100% Garantía
                </span>
                <span style={{ color: "#aaa", fontSize: "0.85rem" }}>Ajuste OEM perfecto</span>
              </div>
              <div>
                <span style={{ color: "var(--primary-color)", fontWeight: "900", fontSize: "1.2rem", display: "block" }}>
                  Envíos Rápidos
                </span>
                <span style={{ color: "#aaa", fontSize: "0.85rem" }}>A nivel nacional</span>
              </div>
              <div>
                <span style={{ color: "var(--primary-color)", fontWeight: "900", fontSize: "1.2rem", display: "block" }}>
                  Barrancabermeja
                </span>
                <span style={{ color: "#aaa", fontSize: "0.85rem" }}>Entrega e instalación</span>
              </div>
            </div>
          </div>

          {/* Banner Image Preview */}
          <div
            style={{
              position: "relative",
              borderRadius: "16px",
              overflow: "hidden",
              border: "2px solid rgba(255, 215, 0, 0.4)",
              boxShadow: "0 15px 40px rgba(0,0,0,0.6)",
              minHeight: "360px",
              height: "100%",
            }}
          >
            <Image
              src="/radiador-banner.jpg"
              alt="Radiador automotriz de aluminio Rembert Repuestos"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              style={{ objectFit: "cover" }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)",
                padding: "1.5rem",
              }}
            >
              <span
                style={{
                  background: "var(--primary-color)",
                  color: "#111",
                  padding: "0.2rem 0.6rem",
                  borderRadius: "6px",
                  fontSize: "0.75rem",
                  fontWeight: "800",
                  textTransform: "uppercase",
                }}
              >
                Alta Resistencia
              </span>
              <p style={{ color: "#fff", fontWeight: "700", marginTop: "0.4rem", fontSize: "1rem" }}>
                Paneles de máxima disipación para clima cálido y exigente
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tipos de Radiadores & Categorías */}
      <section className="section" style={{ padding: "4rem 1rem" }}>
        <div className="main-container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span
              style={{
                background: "rgba(255, 215, 0, 0.2)",
                color: "#997300",
                padding: "0.35rem 1rem",
                borderRadius: "20px",
                fontSize: "0.85rem",
                fontWeight: "800",
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              Líneas Disponibles
            </span>
            <h2
              style={{
                fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
                marginTop: "0.75rem",
                marginBottom: "0.5rem",
                textTransform: "uppercase",
                color: "#111111",
              }}
            >
              Catálogo de Radiadores y Enfriamiento
            </h2>
            <p style={{ color: "#5A6A80", fontSize: "1.05rem", maxWidth: "720px", margin: "0 auto" }}>
              Disponemos de radiadores para toda la gama automotriz liviana, especialistas en las marcas líderes del país: Chevrolet y Renault.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "2rem",
            }}
          >
            {radiatorCategories.map((cat) => (
              <div
                key={cat.id}
                style={{
                  background: "#FFFFFF",
                  borderRadius: "14px",
                  overflow: "hidden",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease",
                }}
                className="hover-card"
              >
                <div style={{ position: "relative", height: "220px", background: "#181818" }}>
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ objectFit: "cover" }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      top: "12px",
                      left: "12px",
                      background: "var(--primary-color)",
                      color: "#111111",
                      padding: "0.3rem 0.75rem",
                      borderRadius: "20px",
                      fontWeight: "800",
                      fontSize: "0.75rem",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                    }}
                  >
                    {cat.badge}
                  </span>
                </div>

                <div style={{ padding: "1.75rem", display: "flex", flexDirection: "column", flex: 1 }}>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: "800", marginBottom: "0.6rem", color: "#111" }}>
                    {cat.title}
                  </h3>
                  <p style={{ color: "#5A6A80", fontSize: "0.92rem", lineHeight: "1.5", marginBottom: "1.25rem" }}>
                    {cat.description}
                  </p>

                  <div style={{ marginBottom: "1.5rem" }}>
                    <strong style={{ fontSize: "0.85rem", color: "#333", display: "block", marginBottom: "0.4rem" }}>
                      Características:
                    </strong>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                      {cat.specs.map((spec, sIdx) => (
                        <li
                          key={sIdx}
                          style={{
                            fontSize: "0.83rem",
                            color: "#555",
                            marginBottom: "0.25rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.4rem",
                          }}
                        >
                          <span style={{ color: "var(--primary-dark)", fontWeight: "bold" }}>✓</span> {spec}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <a
                      href={`https://wa.me/573102420490?text=${encodeURIComponent(cat.whatsappText)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn--primary"
                      style={{
                        padding: "0.7rem 1rem",
                        fontSize: "0.88rem",
                        fontWeight: "700",
                        textAlign: "center",
                        textDecoration: "none",
                      }}
                    >
                      💬 Cotizar por WhatsApp
                    </a>
                    <Link
                      href="/catalogo?category=radiadores"
                      style={{
                        textAlign: "center",
                        fontSize: "0.84rem",
                        color: "var(--primary-dark)",
                        fontWeight: "700",
                        padding: "0.3rem",
                      }}
                    >
                      Ver en catálogo →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compatibilidad por Marcas de Vehículo */}
      <section className="section" style={{ background: "#FFFFFF", borderTop: "1px solid #E2E8F0", borderBottom: "1px solid #E2E8F0", padding: "4rem 1rem" }}>
        <div className="main-container">
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <span
              style={{
                background: "rgba(255, 215, 0, 0.2)",
                color: "#997300",
                padding: "0.35rem 1rem",
                borderRadius: "20px",
                fontSize: "0.85rem",
                fontWeight: "800",
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              Cobertura de Marcas
            </span>
            <h2
              style={{
                fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
                marginTop: "0.75rem",
                marginBottom: "0.5rem",
                textTransform: "uppercase",
                color: "#111111",
              }}
            >
              Radiadores para Todas las Marcas
            </h2>
            <p style={{ color: "#5A6A80", fontSize: "1.05rem", maxWidth: "700px", margin: "0 auto" }}>
              Cotizamos con exactitud por VIN, placa o muestra física. Consulta disponibilidad inmediata para tu modelo.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {brandCompatibilities.map((b) => (
              <div
                key={b.brand}
                style={{
                  background: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  transition: "all 0.25s ease",
                  position: "relative",
                }}
                className="hover-card"
              >
                <span
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    background: "#111111",
                    color: "var(--primary-color)",
                    fontSize: "0.68rem",
                    fontWeight: "700",
                    padding: "0.2rem 0.5rem",
                    borderRadius: "8px",
                  }}
                >
                  {b.tag}
                </span>

                <div
                  style={{
                    height: "55px",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "0.8rem",
                  }}
                >
                  <Image
                    src={b.logo}
                    alt={`Logo ${b.brand}`}
                    width={85}
                    height={45}
                    style={{ objectFit: "contain", maxHeight: "45px" }}
                  />
                </div>

                <h3 style={{ fontSize: "1.2rem", fontWeight: "800", marginBottom: "0.4rem", color: "#111111" }}>
                  {b.brand}
                </h3>

                <p style={{ fontSize: "0.82rem", color: "#666", marginBottom: "1.2rem", minHeight: "36px", lineHeight: "1.4" }}>
                  <strong>Modelos:</strong> {b.models}
                </p>

                <a
                  href={`https://wa.me/573102420490?text=Hola%2C%20quisiera%20cotizar%20un%20radiador%20para%20marca%20${encodeURIComponent(b.brand)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: "var(--primary-color)",
                    color: "#111111",
                    padding: "0.55rem 1rem",
                    borderRadius: "6px",
                    fontWeight: "700",
                    fontSize: "0.84rem",
                    textAlign: "center",
                    textDecoration: "none",
                    width: "100%",
                    marginTop: "auto",
                  }}
                >
                  💬 Cotizar para {b.brand}
                </a>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
            <p style={{ color: "#666", fontSize: "0.95rem", marginBottom: "1rem" }}>
              ¿Tu marca o modelo no aparece? Disponemos de más de 400 referencias en bodega y pedidos directos de fábrica.
            </p>
            <a
              href="https://wa.me/573508299233?text=Hola%2C%20busco%20un%20radiador%20espec%C3%ADfico%20que%20no%20veo%20en%20la%20lista."
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--primary"
              style={{ padding: "0.85rem 2rem", fontSize: "0.95rem", fontWeight: "800" }}
            >
              🛒 Consultar Stock con Compras e Inventario
            </a>
          </div>
        </div>
      </section>

      {/* Diagnóstico & Guía Técnica */}
      <section className="section" style={{ padding: "4rem 1rem" }}>
        <div className="main-container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span
              style={{
                background: "rgba(255, 215, 0, 0.2)",
                color: "#997300",
                padding: "0.35rem 1rem",
                borderRadius: "20px",
                fontSize: "0.85rem",
                fontWeight: "800",
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              Asesoría de Expertos
            </span>
            <h2
              style={{
                fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
                marginTop: "0.75rem",
                marginBottom: "0.5rem",
                textTransform: "uppercase",
                color: "#111111",
              }}
            >
              ¿Cuándo Debes Cambiar o Revisar tu Radiador?
            </h2>
            <p style={{ color: "#5A6A80", fontSize: "1.05rem", maxWidth: "700px", margin: "0 auto" }}>
              Identifica a tiempo los síntomas de avería para prevenir recalentamientos y daños mayores en la culata o empaque de motor.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1.75rem",
            }}
          >
            {diagnosticTips.map((tip, idx) => (
              <div
                key={idx}
                style={{
                  background: "#FFFFFF",
                  padding: "1.75rem",
                  borderRadius: "14px",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                }}
              >
                <span style={{ fontSize: "2.4rem", display: "block", marginBottom: "1rem" }}>{tip.icon}</span>
                <h3 style={{ fontSize: "1.15rem", fontWeight: "800", color: "#111", marginBottom: "0.6rem" }}>
                  {tip.title}
                </h3>
                <p style={{ color: "#5A6A80", fontSize: "0.9rem", lineHeight: "1.5" }}>
                  {tip.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final de Cotización */}
      <section
        style={{
          background: "#111111",
          color: "#ffffff",
          padding: "4rem 1rem",
          borderTop: "3px solid var(--primary-color)",
          textAlign: "center",
        }}
      >
        <div className="main-container" style={{ maxWidth: "800px" }}>
          <h2
            style={{
              fontSize: "clamp(1.9rem, 4vw, 2.7rem)",
              textTransform: "uppercase",
              marginBottom: "1rem",
              color: "#ffffff",
            }}
          >
            ¿Necesitas Cotizar un Radiador <span style={{ color: "var(--primary-color)" }}>al Instante?</span>
          </h2>
          <p style={{ color: "#cccccc", fontSize: "1.1rem", lineHeight: "1.6", marginBottom: "2rem" }}>
            Envíanos una foto de tu radiador viejo, las medidas del panel o la placa de tu vehículo. Te respondemos en minutos con precio, disponibilidad y opciones originales u homologadas.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
            <a
              href="https://wa.me/573102420490?text=Hola%2C%20necesito%20cotizar%20un%20radiador%20con%20urgencia.%20Adjunto%20datos%20de%20mi%20veh%C3%ADculo."
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--primary"
              style={{ padding: "0.95rem 2.2rem", fontSize: "1rem", fontWeight: "800" }}
            >
              💬 WhatsApp Punto Principal: 310 242 0490
            </a>
            <a
              href="https://wa.me/573102707375?text=Hola%2C%20necesito%20cotizar%20un%20radiador%20en%20Punto%20El%20Cerro."
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
              style={{
                background: "#222",
                color: "#ffffff",
                border: "1px solid #444",
                padding: "0.95rem 1.8rem",
                fontSize: "1rem",
                textDecoration: "none",
                fontWeight: "700",
              }}
            >
              📍 Punto El Cerro: 310 270 7375
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
