"use client";

import { useCart } from "@/components/CartContext";
import { useState } from "react";
import { useSession } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    fullName: session?.user?.name || "",
    phone: "",
    email: session?.user?.email || "",
    street: "",
    city: "Barrancabermeja",
    state: "Santander",
    zipCode: "",
    notes: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMessage) setErrorMessage("");
  };

  const processOrder = async (event) => {
    event?.preventDefault();
    if (cart.length === 0) {
      setErrorMessage("Tu carrito está vacío.");
      return;
    }
    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.street.trim() || !formData.city.trim()) {
      setErrorMessage("Por favor completa los campos obligatorios de envío (Nombre, Teléfono, Dirección y Ciudad).");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    // Reserve the tab from the user click so WhatsApp is not blocked after the async request.
    const whatsappWindow = typeof window !== "undefined" ? window.open("about:blank", "_blank") : null;

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          address: formData,
          notes: formData.notes,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Error al procesar pedido");

      clearCart();

      if (data.formatted?.whatsappUrl) {
        if (whatsappWindow && !whatsappWindow.closed) {
          whatsappWindow.location.href = data.formatted.whatsappUrl;
        } else {
          window.open(data.formatted.whatsappUrl, "_blank", "noopener,noreferrer");
        }
      }

      // Redirigir a la vista de confirmación del pedido
      router.push(`/pedidos/${data.order.id}`);
    } catch (err) {
      if (whatsappWindow && !whatsappWindow.closed) whatsappWindow.close();
      setErrorMessage(err.message || "Ocurrió un error al procesar el pedido. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="main-container section" style={{ textAlign: "center", padding: "100px 20px", minHeight: "60vh" }}>
        <h2>Tu carrito está vacío</h2>
        <p style={{ marginTop: "15px", color: "var(--text-muted)" }}>Agrega productos para proceder al pago o cotización.</p>
        <Link href="/catalogo" className="btn btn--primary" style={{ marginTop: "20px", display: "inline-block" }}>
          Ir al Catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="main-container section" style={{ padding: "40px 20px", minHeight: "70vh" }}>
      <h1 style={{ marginBottom: "10px", fontSize: "clamp(1.8rem, 4vw, 2.4rem)" }}>Finalizar Compra / Solicitar Pedido</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: "30px" }}>
        Completa los datos de envío para procesar tu pedido y generar la orden para WhatsApp y correo.
      </p>

      {errorMessage && (
        <div
          role="alert"
          style={{
            background: "#FEF2F2",
            border: "1.5px solid #EF4444",
            color: "#991B1B",
            padding: "1rem 1.25rem",
            borderRadius: "10px",
            marginBottom: "1.5rem",
            fontWeight: "600",
            fontSize: "0.95rem",
          }}
        >
          ⚠️ {errorMessage}
        </div>
      )}

      <div className="checkout-grid">
        {/* Formulario de Envío */}
        <div className="checkout-card">
          <h2 style={{ marginBottom: "20px", fontSize: "1.3rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "10px", color: "#fff" }}>
            📋 Datos del Cliente y Envío
          </h2>

          <form style={{ display: "flex", flexDirection: "column", gap: "15px" }} onSubmit={processOrder}>
            <div className="checkout-form-row--2">
              <div>
                <label htmlFor="checkout-full-name" style={{ display: "block", marginBottom: "5px", fontSize: "0.88rem", color: "#E2E8F0" }}>Nombre Completo *</label>
                <input id="checkout-full-name" autoComplete="name" type="text" name="fullName" value={formData.fullName} onChange={handleChange} required placeholder="Ej: Juan Pérez" className="checkout-input" />
              </div>
              <div>
                <label htmlFor="checkout-phone" style={{ display: "block", marginBottom: "5px", fontSize: "0.88rem", color: "#E2E8F0" }}>Teléfono / WhatsApp *</label>
                <input id="checkout-phone" autoComplete="tel" inputMode="tel" type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="Ej: 310 123 4567" className="checkout-input" />
              </div>
            </div>

            <div>
              <label htmlFor="checkout-email" style={{ display: "block", marginBottom: "5px", fontSize: "0.88rem", color: "#E2E8F0" }}>Correo Electrónico (Opcional)</label>
              <input id="checkout-email" autoComplete="email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="ejemplo@correo.com" className="checkout-input" />
            </div>

            <div>
              <label htmlFor="checkout-street" style={{ display: "block", marginBottom: "5px", fontSize: "0.88rem", color: "#E2E8F0" }}>Dirección de Envío (Calle, número) *</label>
              <input id="checkout-street" autoComplete="street-address" type="text" name="street" value={formData.street} onChange={handleChange} required placeholder="Ej: Transversal 29 # 15-20, Barrio Colombia" className="checkout-input" />
            </div>

            <div className="checkout-form-row--3">
              <div>
                <label htmlFor="checkout-city" style={{ display: "block", marginBottom: "5px", fontSize: "0.88rem", color: "#E2E8F0" }}>Ciudad *</label>
                <input id="checkout-city" autoComplete="address-level2" type="text" name="city" value={formData.city} onChange={handleChange} required className="checkout-input" />
              </div>
              <div>
                <label htmlFor="checkout-state" style={{ display: "block", marginBottom: "5px", fontSize: "0.88rem", color: "#E2E8F0" }}>Departamento</label>
                <input id="checkout-state" autoComplete="address-level1" type="text" name="state" value={formData.state} onChange={handleChange} className="checkout-input" />
              </div>
              <div>
                <label htmlFor="checkout-zip" style={{ display: "block", marginBottom: "5px", fontSize: "0.88rem", color: "#E2E8F0" }}>Cód. Postal</label>
                <input id="checkout-zip" autoComplete="postal-code" type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} placeholder="687031" className="checkout-input" />
              </div>
            </div>

            <div>
              <label htmlFor="checkout-notes" style={{ display: "block", marginBottom: "5px", fontSize: "0.88rem", color: "#E2E8F0" }}>Notas o Instrucciones Especiales</label>
              <textarea id="checkout-notes" name="notes" rows="2" value={formData.notes} onChange={handleChange} placeholder="Detalles de facturación, modelo/VIN del vehículo, referencias de entrega, etc." className="checkout-input" style={{ resize: "vertical" }} />
            </div>

            <div style={{ marginTop: "15px" }}>
              <button
                type="submit"
                disabled={loading}
                className="btn btn--primary"
                style={{
                  width: "100%",
                  padding: "14px 20px",
                  fontSize: "1.05rem",
                  fontWeight: "800",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  boxShadow: "0 4px 14px rgba(255, 215, 0, 0.35)",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Procesando pedido..." : "Confirmar Pedido"}
              </button>
            </div>
          </form>
        </div>

        {/* Resumen del Pedido */}
        <div className="checkout-card" style={{ height: "fit-content" }}>
          <h2 style={{ marginBottom: "20px", fontSize: "1.3rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "10px", color: "#fff" }}>
            🛒 Resumen del Pedido
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginBottom: "20px" }}>
            {cart.map((item, index) => (
              <div key={item.cartKey || item.id || index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
                <div style={{ display: "flex", gap: "10px", alignItems: "center", minWidth: 0 }}>
                  <div style={{ position: "relative", width: "50px", height: "50px", flexShrink: 0, background: "#fff", borderRadius: "6px", overflow: "hidden", padding: "2px" }}>
                    <Image
                      src={item.image || "/logo.png"}
                      alt={item.name}
                      fill
                      sizes="50px"
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: "0.9rem", fontWeight: "bold", color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</div>
                    <div style={{ color: "#94A3B8", fontSize: "0.8rem" }}>Cant: {item.quantity}</div>
                  </div>
                </div>
                <div style={{ fontWeight: "bold", color: "#FFD700", whiteSpace: "nowrap" }}>
                  ${((item.price || 0) * item.quantity).toLocaleString("es-CO")}
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "15px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "1.1rem" }}>
            <span style={{ color: "#E2E8F0" }}>Subtotal</span>
            <span style={{ fontWeight: "bold", color: "#fff" }}>${cartTotal.toLocaleString("es-CO")}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px", color: "#94A3B8", fontSize: "0.88rem" }}>
            <span>Envío / Despacho</span>
            <span style={{ color: "#E2E8F0" }}>A acordar con el asesor</span>
          </div>

          <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "15px", marginTop: "15px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "1.45rem", fontWeight: "900", color: "var(--primary-color)" }}>
            <span>Total</span>
            <span>${cartTotal.toLocaleString("es-CO")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
