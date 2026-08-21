import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import {
  generateWhatsAppOrderText,
  getWhatsAppUrl,
  generateEmailOrderContent,
  getMailtoUrl,
  getProductImageUrl,
} from "@/lib/orderFormatter";
import OrderActions from "@/components/OrderActions";

export default async function OrderSuccessPage({ params }) {
  const resolvedParams = await params;
  const orderId = resolvedParams?.id;

  if (!orderId) {
    notFound();
  }

  const session = await getServerSession();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: true,
              brand: true,
              category: true,
            },
          },
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  // Protección IDOR: Si el pedido pertenece a un usuario, solo su dueño o un ADMIN pueden verlo
  if (order.userId && session?.user?.id !== order.userId && session?.user?.role !== "ADMIN") {
    redirect("/pedidos");
  }

  const orderNumberStr = order.id.slice(-6).toUpperCase();

  const customerObj = {
    fullName: order.customerName,
    phone: order.customerPhone,
    email: order.customerEmail,
    street: order.address || "",
  };

  const itemsFormatted = order.items.map((item) => ({
    name: item.productName || item.product?.name || "Producto",
    quantity: item.quantity,
    price: item.price || item.unitPrice || item.product?.price || 0,
    slug: item.product?.slug || item.productId,
    sku: item.product?.sku || "",
    brand: item.product?.brand?.name || "",
    category: item.product?.category?.name || "",
    image: getProductImageUrl({ product: item.product }),
  }));

  const whatsappText = generateWhatsAppOrderText({
    orderNumber: orderNumberStr,
    customer: customerObj,
    items: itemsFormatted,
    totalAmount: order.totalAmount,
    paymentMethod: order.paymentMethod || "Pago contra entrega",
  });

  const emailContent = generateEmailOrderContent({
    orderNumber: orderNumberStr,
    customer: customerObj,
    items: itemsFormatted,
    totalAmount: order.totalAmount,
    paymentMethod: order.paymentMethod || "Pago contra entrega",
  });

  const whatsappUrl = getWhatsAppUrl(whatsappText);
  const mailtoUrl = getMailtoUrl(emailContent);

  return (
    <div className="main-container section" style={{ padding: '60px 20px', minHeight: '60vh', textAlign: 'center' }}>
      <div style={{ maxWidth: '650px', margin: '0 auto', background: 'var(--card-dark)', padding: '40px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <div style={{ fontSize: '4rem', marginBottom: '15px' }}>✅</div>
        <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>¡Pedido Registrado con Éxito!</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
          Tu pedido <strong>#{orderNumberStr}</strong> ha sido guardado. Puedes enviarlo directamente a nuestros asesores.
        </p>

        <div style={{ background: '#111', padding: '20px', borderRadius: '8px', textAlign: 'left', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '15px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
            📋 Detalles del Pedido
          </h2>
          
          {order.customerName && (
            <div style={{ fontSize: '0.9rem', color: '#ccc', marginBottom: '15px' }}>
              <div><strong>Cliente:</strong> {order.customerName} ({order.customerPhone})</div>
              {order.address && <div><strong>Dirección:</strong> {order.address}</div>}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            {order.items.map((item) => {
              const name = item.productName || item.product?.name || "Producto";
              const price = item.price || item.unitPrice || 0;
              return (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span>{item.quantity}x {name}</span>
                  <span>${(price * item.quantity).toLocaleString('es-CO')}</span>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem', borderTop: '1px solid #333', paddingTop: '10px' }}>
            <span>Total:</span>
            <span style={{ color: 'var(--primary-color)' }}>${order.totalAmount.toLocaleString('es-CO')}</span>
          </div>
        </div>

        <OrderActions 
          order={order}
          itemsFormatted={itemsFormatted}
          customerObj={customerObj}
          whatsappUrl={whatsappUrl}
          mailtoUrl={mailtoUrl}
        />

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <Link href="/catalogo" className="btn btn--primary" style={{ padding: '12px 24px' }}>
            Seguir Comprando
          </Link>
          <Link href="/perfil" className="btn" style={{ padding: '12px 24px', background: 'transparent', border: '1px solid var(--primary-color)', color: 'var(--primary-color)' }}>
            Ver Mis Pedidos
          </Link>
        </div>
      </div>
    </div>
  );
}
