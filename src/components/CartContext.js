"use client";
import { createContext, useCallback, useContext, useState, useEffect, useSyncExternalStore } from "react";

const CartContext = createContext();

const emptySubscribe = () => () => {};

const getStockLimit = (item) => {
  const stock = Number(item?.stock);
  return Number.isFinite(stock) && stock > 0 ? Math.floor(stock) : Number.POSITIVE_INFINITY;
};

export function CartProvider({ children }) {
  const isMounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [cart, setCart] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) return JSON.parse(savedCart);
      } catch (e) {}
    }
    return [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, isMounted]);

  const addToCart = (product, quantity = 1) => {
    const requestedQuantity = Math.max(1, Math.floor(Number(quantity) || 1));
    const stockLimit = getStockLimit(product);
    const qty = Math.min(requestedQuantity, stockLimit);
    if (!Number.isFinite(qty) || qty < 1) return;
    const cartKey = `${product.id}:${product.variantId || "base"}`;
    setCart((prev) => {
      const existing = prev.find((item) => (item.cartKey || `${item.id}:${item.variantId || "base"}`) === cartKey);
      if (existing) {
        return prev.map((item) =>
          (item.cartKey || `${item.id}:${item.variantId || "base"}`) === cartKey
            ? { ...item, ...product, quantity: Math.min(item.quantity + qty, getStockLimit(product)) }
            : item
        );
      }
      return [...prev, { ...product, cartKey, quantity: qty }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (cartItemId, newQuantity) => {
    const normalizedQuantity = Math.floor(Number(newQuantity) || 0);
    if (normalizedQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        (item.cartKey || item.id) === cartItemId
          ? { ...item, quantity: Math.min(normalizedQuantity, getStockLimit(item)) }
          : item
      )
    );
  };

  const removeFromCart = (cartItemId) => {
    setCart((prev) => prev.filter((item) => (item.cartKey || item.id) !== cartItemId));
  };

  const clearCart = useCallback(() => setCart([]), []);
  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);

  const cartTotal = cart.reduce((total, item) => total + (item.price || 0) * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        cartCount,
        isMounted,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);

