"use client";

import { useCart } from "@/components/CartContext";
import { useState } from "react";

export default function AddToCartButton({ product, quantity = 1, disabled }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button 
      onClick={handleAdd} 
      disabled={disabled} 
      className="btn btn--primary" 
      style={{ 
        padding: '1rem 2rem', 
        fontSize: '1.1rem', 
        fontWeight: 'bold',
        width: '100%', 
        cursor: disabled ? 'not-allowed' : 'pointer', 
        border: 'none',
        opacity: disabled ? 0.5 : 1,
        background: added ? '#28a745' : 'var(--primary-color)',
        transition: 'background 0.2s ease'
      }}
    >
      {added ? '✅ ¡AGREGADO AL CARRITO!' : '🛒 AGREGAR AL CARRITO'}
    </button>
  );
}

