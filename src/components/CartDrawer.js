"use client";

import { useCart } from "@/components/CartContext";
import { useRouter } from "next/navigation";

export default function CartDrawer() {
  const {
    cart,
    cartTotal,
    cartCount,
    removeFromCart,
    updateQuantity,
    clearCart,
    isCartOpen,
    closeCart,
    isMounted,
  } = useCart();

  const router = useRouter();

  if (!isMounted || !isCartOpen) return null;

  const handleCheckout = () => {
    closeCart();
    router.push("/checkout");
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        zIndex: 99999,
        display: "flex",
        justifyContent: "flex-end",
        backdropFilter: "blur(4px)",
      }}
      onClick={closeCart}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "420px",
          height: "100%",
          background: "#141414",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          boxShadow: "-5px 0 25px rgba(0,0,0,0.6)",
          borderLeft: "1px solid var(--border-color)",
          animation: "slideInRight 0.3s ease-out forwards",
        }}
      >
        {/* Header Drawer */}
        <div
          style={{
            padding: "20px",
            borderBottom: "1px solid var(--border-color)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#1a1a1a",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "1.4rem" }}>🛒</span>
            <h2 style={{ fontSize: "1.2rem", margin: 0, color: "#fff" }}>
              Carrito de Compras ({cartCount})
            </h2>
          </div>
          <button
            onClick={closeCart}
            style={{
              background: "transparent",
              border: "none",
              color: "#888",
              fontSize: "1.5rem",
              cursor: "pointer",
              padding: "4px 8px",
            }}
          >
            ✕
          </button>
        </div>

        {/* Items List */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          {cart.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                color: "var(--text-muted)",
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "15px" }}>🛒</div>
              <p style={{ fontSize: "1.1rem", marginBottom: "15px" }}>
                Tu carrito está vacío
              </p>
              <button
                onClick={() => {
                  closeCart();
                  router.push("/catalogo");
                }}
                className="btn btn--primary"
                style={{ padding: "10px 20px" }}
              >
                Explorar Productos
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  gap: "12px",
                  background: "#1c1c1c",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #2a2a2a",
                  alignItems: "center",
                }}
              >
                <img
                  src={item.image || "/logo.png"}
                  alt={item.name}
                  style={{
                    width: "60px",
                    height: "60px",
                    objectFit: "contain",
                    background: "#fff",
                    borderRadius: "6px",
                    padding: "4px",
                  }}
                />

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: "bold",
                      marginBottom: "4px",
                      color: "#fff",
                    }}
                  >
                    {item.name}
                  </div>
                  <div
                    style={{
                      fontSize: "0.95rem",
                      color: "var(--primary-color)",
                      fontWeight: "bold",
                      marginBottom: "8px",
                    }}
                  >
                    ${(item.price || 0).toLocaleString("es-CO")}
                  </div>

                  {/* Quantity selector */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        border: "1px solid #444",
                        borderRadius: "4px",
                        background: "#111",
                        overflow: "hidden",
                      }}
                    >
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        style={{
                          background: "transparent",
                          color: "#fff",
                          border: "none",
                          padding: "2px 8px",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        -
                      </button>
                      <span
                        style={{
                          padding: "2px 8px",
                          fontSize: "0.85rem",
                          fontWeight: "bold",
                        }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        style={{
                          background: "transparent",
                          color: "#fff",
                          border: "none",
                          padding: "2px 8px",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#ff4d4f",
                        fontSize: "0.8rem",
                        cursor: "pointer",
                        marginLeft: "auto",
                      }}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Drawer */}
        {cart.length > 0 && (
          <div
            style={{
              padding: "20px",
              borderTop: "1px solid var(--border-color)",
              background: "#1a1a1a",
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
                fontSize: "1.2rem",
                fontWeight: "bold",
              }}
            >
              <span>Subtotal:</span>
              <span style={{ color: "var(--primary-color)" }}>
                ${cartTotal.toLocaleString("es-CO")}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              className="btn btn--primary"
              style={{
                width: "100%",
                padding: "14px",
                fontSize: "1.05rem",
                fontWeight: "bold",
                textAlign: "center",
                border: "none",
                cursor: "pointer",
              }}
            >
              🚀 COMPLETAR PEDIDO (WHATSAPP / EMAIL)
            </button>

            <button
              onClick={clearCart}
              style={{
                background: "transparent",
                border: "none",
                color: "#888",
                fontSize: "0.85rem",
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              Vaciar carrito
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
