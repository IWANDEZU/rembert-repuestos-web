"use client";

import React, { forwardRef } from "react";
import { formatCurrency } from "@/lib/orderFormatter";

const OrderReceipt = forwardRef(({ order, items, customer }, ref) => {
  const dateStr = new Date(order.createdAt).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: "-9999px",
        left: "-9999px",
        width: "600px",
        background: "#0a0a0a",
        color: "#ffffff",
        fontFamily: "'Inter', sans-serif",
        padding: "40px",
        boxSizing: "border-box",
        zIndex: -1,
      }}
    >
      <div
        ref={ref}
        style={{
          background: "#111111",
          borderRadius: "16px",
          border: "2px solid #222222",
          overflow: "hidden",
          width: "100%",
          padding: "30px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
          color: "#fff",
        }}
      >
        {/* Encabezado */}
        <div style={{ textAlign: "center", borderBottom: "1px solid #333", paddingBottom: "20px", marginBottom: "20px" }}>
          <img src="/logo.png" alt="REMBERT" style={{ width: "140px", marginBottom: "15px" }} />
          <h1 style={{ margin: "0 0 5px 0", fontSize: "24px", color: "#E52421" }}>COMPROBANTE DE PEDIDO</h1>
          <p style={{ margin: 0, color: "#aaa", fontSize: "14px" }}>{dateStr}</p>
          <div style={{ background: "#222", display: "inline-block", padding: "5px 15px", borderRadius: "20px", marginTop: "10px", fontSize: "14px", fontWeight: "bold" }}>
            Pedido #{order.id.substring(0, 8).toUpperCase()}
          </div>
        </div>

        {/* Datos del Cliente */}
        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ fontSize: "16px", color: "#ddd", margin: "0 0 10px 0", textTransform: "uppercase", letterSpacing: "1px" }}>👤 Datos del Cliente</h2>
          <div style={{ background: "#1a1a1a", padding: "15px", borderRadius: "8px", border: "1px solid #2a2a2a", fontSize: "14px", lineHeight: "1.6" }}>
            <div><strong>Nombre:</strong> {customer?.fullName || "No especificado"}</div>
            <div><strong>Teléfono:</strong> {customer?.phone || "No especificado"}</div>
            <div><strong>Dirección:</strong> {customer?.street || "No especificada"}, {customer?.city}</div>
          </div>
        </div>

        {/* Productos */}
        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ fontSize: "16px", color: "#ddd", margin: "0 0 10px 0", textTransform: "uppercase", letterSpacing: "1px" }}>📦 Productos Solicitados</h2>
          <div style={{ background: "#1a1a1a", borderRadius: "8px", border: "1px solid #2a2a2a", overflow: "hidden" }}>
            {items.map((item, index) => (
              <div key={index} style={{ display: "flex", justifyContent: "space-between", padding: "15px", borderBottom: index < items.length - 1 ? "1px solid #2a2a2a" : "none" }}>
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.productName || item.name || "Producto"}
                    style={{ width: "64px", height: "64px", objectFit: "contain", background: "#fff", borderRadius: "6px", marginRight: "12px" }}
                  />
                )}
                <div style={{ flex: 1, paddingRight: "15px" }}>
                  <div style={{ fontWeight: "bold", fontSize: "15px", marginBottom: "4px", color: "#fff" }}>{item.productName || item.name || item.product?.name}</div>
                  <div style={{ color: "#aaa", fontSize: "13px" }}>Cant: {item.quantity} × {formatCurrency(item.unitPrice || item.price)}</div>
                </div>
                <div style={{ fontWeight: "bold", fontSize: "15px", color: "#fff", display: "flex", alignItems: "center" }}>
                  {formatCurrency((item.unitPrice || item.price || 0) * item.quantity)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Totales */}
        <div style={{ borderTop: "2px dashed #444", paddingTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: "14px", color: "#aaa" }}>
            <div><strong>Método de pago:</strong> {order.paymentMethod || "Pago contra entrega"}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "14px", color: "#aaa", marginBottom: "5px" }}>Total a pagar</div>
            <div style={{ fontSize: "28px", fontWeight: "bold", color: "#25D366" }}>
              {formatCurrency(order.totalAmount)}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: "30px", fontSize: "12px", color: "#666" }}>
          Generado automáticamente por REMBERT
          <br />www.rembertrepuestos.com
        </div>
      </div>
    </div>
  );
});

OrderReceipt.displayName = "OrderReceipt";

export default OrderReceipt;
