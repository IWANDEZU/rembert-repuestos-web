"use client";

import { useCart } from "@/components/CartContext";
import { useState } from "react";
import { useSession } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
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
  };

  const processOrder = async (event) => {
    event?.preventDefault();
    if (cart.length === 0) return alert("Tu carrito está vacío.");
    if (!formData.fullName || !formData.phone || !formData.street || !formData.city) {
      return alert("Por favor completa los campos obligatorios de envío.");
    }
    
    setLoading(true);
    // Reserve the tab from the user click so WhatsApp is not blocked after the async request.
    const whatsappWindow = typeof window !== "undefined" ? window.open("about:blank", "_blank") : null;

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((item) => ({
            sku: item.sku,
            variantId: item.variantId || null,
            quantity: item.quantity,
            image: item.image,
          })),
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
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="main-container section" style={{ textAlign: 'center', padding: '100px 20px', minHeight: '60vh' }}>
        <h2>Tu carrito está vacío</h2>
        <p style={{ marginTop: '15px' }}>Agrega productos para proceder al pago o cotización.</p>
        <Link href="/catalogo" className="btn btn--primary" style={{ marginTop: '20px', display: 'inline-block' }}>
          Ir al Catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="main-container section" style={{ padding: '40px 20px', minHeight: '70vh' }}>
      <h1 style={{ marginBottom: '10px' }}>Finalizar Compra / Solicitar Pedido</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
        Completa los datos de envío para procesar tu pedido en el sistema.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '40px' }}>
        {/* Formulario de Envío */}
        <div style={{ background: 'var(--card-dark)', padding: '30px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <h2 style={{ marginBottom: '20px', fontSize: '1.3rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
            📋 Datos del Cliente y Envío
          </h2>
          
          <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }} onSubmit={processOrder}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label htmlFor="checkout-full-name" style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Nombre Completo *</label>
                <input id="checkout-full-name" autoComplete="name" type="text" name="fullName" value={formData.fullName} onChange={handleChange} required placeholder="Ej: Juan Pérez" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #444', background: '#111', color: '#fff' }} />
              </div>
              <div>
                <label htmlFor="checkout-phone" style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Teléfono / WhatsApp *</label>
                <input id="checkout-phone" autoComplete="tel" inputMode="tel" type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="Ej: 3101234567" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #444', background: '#111', color: '#fff' }} />
              </div>
            </div>

            <div>
              <label htmlFor="checkout-email" style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Correo Electrónico (Opcional)</label>
              <input id="checkout-email" autoComplete="email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="ejemplo@correo.com" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #444', background: '#111', color: '#fff' }} />
            </div>

            <div>
              <label htmlFor="checkout-street" style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Dirección de Envío (Calle, número) *</label>
              <input id="checkout-street" autoComplete="street-address" type="text" name="street" value={formData.street} onChange={handleChange} required placeholder="Ej: Calle 50 # 15-20, Barrio Colombia" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #444', background: '#111', color: '#fff' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
              <div>
                <label htmlFor="checkout-city" style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Ciudad *</label>
                <input id="checkout-city" autoComplete="address-level2" type="text" name="city" value={formData.city} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #444', background: '#111', color: '#fff' }} />
              </div>
              <div>
                <label htmlFor="checkout-state" style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Departamento</label>
                <input id="checkout-state" autoComplete="address-level1" type="text" name="state" value={formData.state} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #444', background: '#111', color: '#fff' }} />
              </div>
              <div>
                <label htmlFor="checkout-zip" style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Cód. Postal</label>
                <input id="checkout-zip" autoComplete="postal-code" type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} placeholder="680001" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #444', background: '#111', color: '#fff' }} />
              </div>
            </div>

            <div>
              <label htmlFor="checkout-notes" style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Notas o Instrucciones Especiales</label>
              <textarea id="checkout-notes" name="notes" rows="2" value={formData.notes} onChange={handleChange} placeholder="Detalles de facturación, referencias para entrega, etc." style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #444', background: '#111', color: '#fff', resize: 'vertical' }} />
            </div>

            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  background: 'var(--primary-color)',
                  color: '#111111',
                  padding: '14px 20px',
                  borderRadius: '8px',
                  fontSize: '1.05rem',
                  fontWeight: '800',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: '0 4px 14px rgba(255, 215, 0, 0.35)',
                  transition: 'transform 0.2s ease',
                }}
              >
                {loading ? "Procesando pedido..." : "Confirmar Pedido"}
              </button>
            </div>
          </form>
        </div>

        {/* Resumen del Pedido */}
        <div style={{ background: '#111', padding: '30px', borderRadius: '12px', border: '1px solid var(--border-color)', height: 'fit-content' }}>
          <h2 style={{ marginBottom: '20px', fontSize: '1.3rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
            🛒 Resumen del Pedido
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
            {cart.map((item, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <img src={item.image || "/logo.png"} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'contain', background: '#fff', borderRadius: '4px' }} />
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{item.name}</div>
                    <div style={{ color: '#888', fontSize: '0.8rem' }}>Cant: {item.quantity}</div>
                  </div>
                </div>
                <div style={{ fontWeight: 'bold' }}>
                  ${(item.price * item.quantity).toLocaleString('es-CO')}
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.2rem' }}>
            <span>Subtotal</span>
            <span style={{ fontWeight: 'bold' }}>${cartTotal.toLocaleString('es-CO')}</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', color: '#888', fontSize: '0.9rem' }}>
            <span>Envío / Despacho</span>
            <span>A acordar con el asesor</span>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '15px', marginTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
            <span>Total</span>
            <span>${cartTotal.toLocaleString('es-CO')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
