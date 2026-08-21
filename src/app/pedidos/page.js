import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Mis pedidos",
};

export default async function PedidosPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login?callbackUrl=/pedidos");
  }

  const orders = await prisma.order.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="main-container section" style={{ padding: "40px 20px", minHeight: "70vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <div>
          <h1 style={{ fontSize: "2rem", marginBottom: "5px" }}>📦 Mis Pedidos</h1>
          <p style={{ color: "var(--text-muted)" }}>
            Historial de pedidos realizados en REMBERT Barrancabermeja.
          </p>
        </div>
        <Link href="/catalogo" className="btn btn--primary" style={{ padding: "10px 20px" }}>
          Ir al Catálogo
        </Link>
      </div>

      {orders.length === 0 ? (
        <div
          style={{
            padding: "60px 20px",
            textAlign: "center",
            background: "var(--card-dark)",
            borderRadius: "12px",
            border: "1px solid var(--border-color)",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "15px" }}>🛒</div>
          <h2 style={{ fontSize: "1.4rem", marginBottom: "10px" }}>Aún no tienes pedidos registrados</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "20px" }}>
            Agrega productos a tu carrito y confirma tu compra para ver el seguimiento aquí.
          </p>
          <Link href="/catalogo" className="btn btn--primary">
            Explorar Catálogo de Productos
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {orders.map((order) => {
            const orderNumberStr = order.id.slice(-6).toUpperCase();
            return (
              <div
                key={order.id}
                style={{
                  background: "var(--card-dark)",
                  borderRadius: "12px",
                  border: "1px solid var(--border-color)",
                  padding: "25px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid var(--border-color)",
                    paddingBottom: "15px",
                    flexWrap: "wrap",
                    gap: "10px",
                  }}
                >
                  <div>
                    <span style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#fff" }}>
                      Pedido #{orderNumberStr}
                    </span>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "3px" }}>
                      Realizado el {new Date(order.createdAt).toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                    <span
                      style={{
                        padding: "6px 14px",
                        borderRadius: "20px",
                        fontSize: "0.85rem",
                        fontWeight: "bold",
                        background:
                          order.status === "DELIVERED"
                            ? "rgba(40, 167, 69, 0.2)"
                            : order.status === "PAID"
                            ? "rgba(24, 144, 255, 0.2)"
                            : "rgba(255, 193, 7, 0.2)",
                        color:
                          order.status === "DELIVERED"
                            ? "#28a745"
                            : order.status === "PAID"
                            ? "#1890ff"
                            : "#ffc107",
                        border: `1px solid ${
                          order.status === "DELIVERED"
                            ? "#28a745"
                            : order.status === "PAID"
                            ? "#1890ff"
                            : "#ffc107"
                        }`,
                      }}
                    >
                      {order.status === "PENDING" ? "⏳ Pendiente" : order.status === "PAID" ? "✅ Pagado" : order.status}
                    </span>

                    <span style={{ fontSize: "1.3rem", fontWeight: "bold", color: "var(--primary-color)" }}>
                      ${(order.totalAmount || 0).toLocaleString("es-CO")}
                    </span>
                  </div>
                </div>

                {/* Items Summary */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {order.items.map((item) => (
                    <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", color: "#ccc" }}>
                      <span>
                        • {item.quantity}x {item.productName || item.product?.name || "Producto"}
                      </span>
                      <span>${((item.price || item.unitPrice || 0) * item.quantity).toLocaleString("es-CO")}</span>
                    </div>
                  ))}
                </div>

                {/* Action Link */}
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
                  <Link
                    href={`/pedidos/${order.id}`}
                    className="btn btn--primary"
                    style={{ padding: "8px 18px", fontSize: "0.9rem" }}
                  >
                    🔍 Ver Detalle y Enviar por WhatsApp / Email
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
