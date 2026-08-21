"use client";

import { useCart } from "@/components/CartContext";
import { useState } from "react";

export default function AddToCartButton({ product, quantity = 1, disabled, className = "", style = {} }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button 
      type="button"
      onClick={handleAdd} 
      disabled={disabled} 
      className={`btn-add-to-cart ${className}`}
      style={{ 
        padding: '0.85rem 1.5rem', 
        fontSize: '0.95rem', 
        fontWeight: '800',
        width: '100%', 
        cursor: disabled ? 'not-allowed' : 'pointer', 
        borderRadius: '8px',
        border: added ? '1.5px solid #16A34A' : '1.5px solid #FFD700',
        opacity: disabled ? 0.5 : 1,
        background: added ? '#16A34A' : '#111111',
        color: added ? '#FFFFFF' : '#FFD700',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        boxShadow: added ? '0 0 10px rgba(22, 163, 74, 0.5)' : '0 2px 8px rgba(0, 0, 0, 0.4)',
        transition: 'all 0.22s ease',
        ...style
      }}
    >
      {added ? (
        <>
          <span>✓</span>
          <span>¡AGREGADO AL CARRITO!</span>
        </>
      ) : (
        <>
          <span style={{ color: '#FFD700', fontSize: '1.1rem' }}>🛒</span>
          <span>AÑADIR AL CARRITO</span>
        </>
      )}
    </button>
  );
}

