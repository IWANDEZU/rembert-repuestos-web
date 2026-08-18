"use client";
import { useCart } from "./CartContext";

export default function CartIcon() {
  const { cartCount, toggleCart, isMounted } = useCart();

  if (!isMounted) return null;

  return (
    <div 
      onClick={toggleCart}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', cursor: 'pointer' }}
    >
      <span style={{ fontSize: '1.2rem' }}>🛒</span>
      <span>Carrito</span>
      {cartCount > 0 && (
        <span style={{ position: 'absolute', top: '-5px', right: '5px', background: 'var(--primary-color)', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '0.7rem' }}>
          {cartCount}
        </span>
      )}
    </div>
  );
}

