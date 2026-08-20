"use client";

import React, { useRef, useState } from "react";
import { toJpeg } from "html-to-image";
import OrderReceipt from "./OrderReceipt";

export default function OrderActions({
  order,
  itemsFormatted,
  customerObj,
  whatsappUrl,
  mailtoUrl,
}) {
  const receiptRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadReceipt = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      if (!receiptRef.current) throw new Error("Recibo no encontrado");

      const dataUrl = await toJpeg(receiptRef.current, { quality: 0.95 });
      const link = document.createElement("a");
      link.download = `Pedido_REMBERT_${order.id.slice(-6).toUpperCase()}.jpg`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Error descargando comprobante:", err);
      alert("No se pudo generar la imagen del comprobante.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <OrderReceipt
        ref={receiptRef}
        order={order}
        items={itemsFormatted}
        customer={customerObj}
      />

      <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #333' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '15px', color: '#fff' }}>
          🚀 Envía este pedido directamente a nuestro WhatsApp oficial:
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#25D366',
              color: '#fff',
              padding: '14px 20px',
              borderRadius: '6px',
              fontWeight: 'bold',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '1.05rem',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)',
            }}
          >
            💬 Enviar Pedido a WhatsApp (+57 310 873 7354)
          </a>

          <button
            type="button"
            onClick={handleDownloadReceipt}
            disabled={isDownloading}
            style={{
              background: '#222',
              color: '#eee',
              padding: '10px 20px',
              borderRadius: '6px',
              fontWeight: '500',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '0.95rem',
              border: '1px solid #444',
              cursor: isDownloading ? 'not-allowed' : 'pointer',
              opacity: isDownloading ? 0.7 : 1,
            }}
          >
            {isDownloading ? "Generando comprobante..." : "📥 Descargar Comprobante Visual (JPG)"}
          </button>

          <a
            href={mailtoUrl}
            style={{
              background: '#EA4335',
              color: '#fff',
              padding: '12px 20px',
              borderRadius: '6px',
              fontWeight: 'bold',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '0.95rem',
            }}
          >
            ✉️ Enviar este pedido por Correo Electrónico
          </a>
        </div>
      </div>
    </>
  );
}
