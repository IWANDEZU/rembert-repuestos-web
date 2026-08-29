"use client";

import { useState } from "react";
import { getWhatsAppUrl, getMailtoUrl } from "@/lib/orderFormatter";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    vehicle: "",
    subject: "Consulta de Repuestos / Cotización",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendWhatsApp = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.message.trim()) {
      return alert("Por favor ingresa tu nombre y mensaje.");
    }

    const text =
      `💬 *NUEVA CONSULTA - REMBERT REPUESTOS*\n` +
      `--------------------------------\n` +
      `👤 *Nombre:* ${formData.name.trim()}\n` +
      `📱 *Teléfono:* ${formData.phone.trim() || "No especificado"}\n` +
      `✉️ *Email:* ${formData.email.trim() || "No especificado"}\n` +
      (formData.vehicle.trim() ? `🚗 *Vehículo / Modelo:* ${formData.vehicle.trim()}\n` : "") +
      `📋 *Asunto:* ${formData.subject}\n` +
      `📝 *Mensaje:* ${formData.message.trim()}\n` +
      `--------------------------------\n` +
      `Enviado desde el portal web oficial.`;

    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    window.open(getWhatsAppUrl(text), "_blank", "noopener,noreferrer");
  };

  const handleSendEmail = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.message.trim()) {
      return alert("Por favor ingresa tu nombre y mensaje.");
    }

    const body =
      `NUEVA CONSULTA DESDE LA WEB - REMBERT\n` +
      `==================================================\n` +
      `Nombre: ${formData.name.trim()}\n` +
      `Teléfono: ${formData.phone.trim() || "No especificado"}\n` +
      `Email: ${formData.email.trim() || "No especificado"}\n` +
      (formData.vehicle.trim() ? `Vehículo / Modelo: ${formData.vehicle.trim()}\n` : "") +
      `Asunto: ${formData.subject}\n` +
      `==================================================\n` +
      `Mensaje:\n${formData.message.trim()}\n` +
      `==================================================`;

    const mailUrl = getMailtoUrl({
      to: "repuestosrembertsa@gmail.com",
      subject: `Consulta Web: ${formData.subject} - ${formData.name.trim()}`,
      body,
    });

    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    window.location.href = mailUrl;
  };

  return (
    <div
      className="glass-card-light"
      style={{
        padding: "clamp(1.25rem, 4vw, 2.2rem) clamp(1rem, 3vw, 1.8rem)",
        background: "#FFFFFF",
        border: "1.5px solid #E2E8F0",
      }}
    >
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.5rem", color: "#0F172A", fontWeight: "800", marginBottom: "0.35rem" }}>
          💬 Envíanos un Mensaje
        </h2>
        <p style={{ color: "#64748B", fontSize: "0.92rem", margin: 0 }}>
          Diligencia tus datos y te responderemos en el menor tiempo posible.
        </p>
      </div>

      {submitted && (
        <div
          style={{
            background: "#ECFDF5",
            border: "1px solid #10B981",
            color: "#065F46",
            padding: "0.85rem 1rem",
            borderRadius: "10px",
            fontSize: "0.9rem",
            fontWeight: "600",
            marginBottom: "1.2rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <span>✅</span> ¡Mensaje preparado con éxito! Redirigiendo a tu canal seleccionado...
        </div>
      )}

      <form style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
        
        {/* Nombre */}
        <div>
          <label style={{ display: "block", marginBottom: "0.4rem", color: "#334155", fontWeight: "700", fontSize: "0.88rem" }}>
            Nombre Completo <span style={{ color: "#EF4444" }}>*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Ej: Carlos Rodríguez"
            className="modern-contact-input"
          />
        </div>

        {/* Teléfono y Correo */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 140px), 1fr))", gap: "0.85rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.4rem", color: "#334155", fontWeight: "700", fontSize: "0.88rem" }}>
              Teléfono / WhatsApp
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="310 123 4567"
              className="modern-contact-input"
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.4rem", color: "#334155", fontWeight: "700", fontSize: "0.88rem" }}>
              Correo Electrónico
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@correo.com"
              className="modern-contact-input"
            />
          </div>
        </div>

        {/* Vehículo / Modelo */}
        <div>
          <label style={{ display: "block", marginBottom: "0.4rem", color: "#334155", fontWeight: "700", fontSize: "0.88rem" }}>
            Vehículo o Repuesto Buscado <span style={{ color: "#64748B", fontWeight: "normal", fontSize: "0.8rem" }}>(Opcional)</span>
          </label>
          <input
            type="text"
            name="vehicle"
            value={formData.vehicle}
            onChange={handleChange}
            placeholder="Ej: Chevrolet Spark GT 2018 - Pastillas de freno"
            className="modern-contact-input"
          />
        </div>

        {/* Asunto */}
        <div>
          <label style={{ display: "block", marginBottom: "0.4rem", color: "#334155", fontWeight: "700", fontSize: "0.88rem" }}>
            Asunto o Motivo
          </label>
          <select
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="modern-contact-input"
            style={{ cursor: "pointer" }}
          >
            <option value="Consulta de Repuestos / Cotización">Cotización de Repuestos</option>
            <option value="Asesoría Técnica de Compatibilidad">Asesoría Técnica de Compatibilidad</option>
            <option value="Compras al Por Mayor / Talleres">Compras al Por Mayor / Talleres y Flotas</option>
            <option value="Estado de Pedido o Envío">Estado de Pedido o Envío Nacional</option>
            <option value="Otro Motivo">Otro Motivo</option>
          </select>
        </div>

        {/* Mensaje */}
        <div>
          <label style={{ display: "block", marginBottom: "0.4rem", color: "#334155", fontWeight: "700", fontSize: "0.88rem" }}>
            Mensaje o Consulta <span style={{ color: "#EF4444" }}>*</span>
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            placeholder="Escribe aquí los detalles del repuesto que necesitas (marca, modelo, año, cilindraje, referencia o duda)..."
            rows="4"
            className="modern-contact-input modern-contact-textarea"
          />
        </div>

        {/* Botones de Envío */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 160px), 1fr))", gap: "0.85rem", marginTop: "0.5rem" }}>
          <button
            type="button"
            onClick={handleSendWhatsApp}
            className="btn-whatsapp-action"
            style={{ padding: "0.85rem 1.2rem", fontSize: "0.95rem" }}
          >
            <span>💬 Enviar por WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={handleSendEmail}
            style={{
              background: "#0F172A",
              color: "#FFFFFF",
              padding: "0.85rem 1.2rem",
              borderRadius: "10px",
              border: "none",
              fontWeight: "700",
              fontSize: "0.92rem",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#1E293B")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#0F172A")}
          >
            <span>✉️ Enviar por Correo</span>
          </button>
        </div>

      </form>
    </div>
  );
}

