"use client";

import { useState } from "react";
import { getWhatsAppUrl, getMailtoUrl } from "@/lib/orderFormatter";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "Consulta de Productos / Cotización",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendWhatsApp = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.message) {
      return alert("Por favor ingresa tu nombre y mensaje.");
    }

    const text =
      `💬 *NUEVA CONSULTA - REMBERT*\n` +
      `--------------------------------\n` +
      `👤 *Nombre:* ${formData.name}\n` +
      `📱 *Teléfono:* ${formData.phone || "No especificado"}\n` +
      `✉️ *Email:* ${formData.email || "No especificado"}\n` +
      (formData.vehicle ? `🚗 *Vehículo / Modelo:* ${formData.vehicle}\n` : "") +
      `📝 *Mensaje:* ${formData.message}\n` +
      `--------------------------------\n` +
      `Enviado desde el formulario de contacto web.`;

    window.open(getWhatsAppUrl(text), "_blank", "noopener,noreferrer");
  };

  const handleSendEmail = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.message) {
      return alert("Por favor ingresa tu nombre y mensaje.");
    }

    const body =
      `NUEVA CONSULTA DESDE LA WEB - REMBERT\n` +
      `==================================================\n` +
      `Nombre: ${formData.name}\n` +
      `Teléfono: ${formData.phone || "No especificado"}\n` +
      `Email: ${formData.email || "No especificado"}\n` +
      `Asunto: ${formData.subject}\n` +
      `==================================================\n` +
      `Mensaje:\n${formData.message}\n` +
      `==================================================`;

    const mailUrl = getMailtoUrl({
      to: "repuestosrembertsa@gmail.com",
      subject: `Consulta Web: ${formData.subject} (${formData.name})`,
      body,
    });

    window.location.href = mailUrl;
  };

  return (
    <div
      style={{
        background: "var(--card-dark)",
        padding: "3rem 2rem",
        borderRadius: "12px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        border: "1px solid var(--border-color)",
      }}
    >
      <h2 style={{ fontSize: "1.8rem", marginBottom: "1.5rem", color: "#fff" }}>
        Envíanos un mensaje
      </h2>

      <form style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", color: "#ccc", fontWeight: "500" }}>
            Nombre Completo *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Tu nombre"
            style={{
              width: "100%",
              padding: "0.8rem",
              borderRadius: "6px",
              border: "1px solid #444",
              background: "#111",
              color: "#fff",
              fontSize: "1rem",
            }}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "#ccc", fontWeight: "500" }}>
              Teléfono / WhatsApp
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="3101234567"
              style={{
                width: "100%",
                padding: "0.8rem",
                borderRadius: "6px",
                border: "1px solid #444",
                background: "#111",
                color: "#fff",
                fontSize: "1rem",
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "#ccc", fontWeight: "500" }}>
              Correo Electrónico
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              style={{
                width: "100%",
                padding: "0.8rem",
                borderRadius: "6px",
                border: "1px solid #444",
                background: "#111",
                color: "#fff",
                fontSize: "1rem",
              }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", color: "#ccc", fontWeight: "500" }}>
            Asunto
          </label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "0.8rem",
              borderRadius: "6px",
              border: "1px solid #444",
              background: "#111",
              color: "#fff",
              fontSize: "1rem",
            }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", color: "#ccc", fontWeight: "500" }}>
            Mensaje o Consulta *
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            placeholder="¿En qué te podemos ayudar? (Cotizaciones, repuestos específicos, asesoría técnica, etc.)"
            rows="4"
            style={{
              width: "100%",
              padding: "0.8rem",
              borderRadius: "6px",
              border: "1px solid #444",
              background: "#111",
              color: "#fff",
              fontSize: "1rem",
              resize: "vertical",
            }}
          ></textarea>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "1rem" }}>
          <button
            type="button"
            onClick={handleSendWhatsApp}
            style={{
              background: "#25D366",
              color: "white",
              padding: "0.9rem",
              border: "none",
              borderRadius: "6px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            💬 Enviar Mensaje por WhatsApp
          </button>

          <button
            type="button"
            onClick={handleSendEmail}
            style={{
              background: "#EA4335",
              color: "white",
              padding: "0.9rem",
              border: "none",
              borderRadius: "6px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            ✉️ Enviar Mensaje por Correo
          </button>
        </div>
      </form>
    </div>
  );
}
