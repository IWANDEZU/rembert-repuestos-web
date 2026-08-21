"use client";
import { useCart } from "./CartContext";

export default function CartIcon() {
  const { cartCount, toggleCart, isMounted } = useCart();

  if (!isMounted) return null;

  return (
    <button 
      type="button"
      onClick={toggleCart}
      className="navbar__action-btn navbar__action-btn--cart"
      aria-label={`Carrito de compras (${cartCount} productos)`}
      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
    >
      <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <span className="navbar__action-icon">🛒</span>
        {cartCount > 0 && (
          <span className="navbar__cart-badge">
            {cartCount}
          </span>
        )}
      </div>
      <span className="navbar__action-text">Carrito</span>
    </button>
  );
}

