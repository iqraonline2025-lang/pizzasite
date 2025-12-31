"use client";
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // 1. Load cart from LocalStorage on startup
  useEffect(() => {
    const savedCart = localStorage.getItem("pizza-cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart data", e);
      }
    }
  }, []);

  // 2. Save cart to LocalStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("pizza-cart", JSON.stringify(cart));
  }, [cart]);

  // 3. Add to Cart Logic
  const addToCart = useCallback((newItem) => {
    setCart((prev) => {
      // Check if exact same pizza (same ID, size, AND toppings) exists
      const existingItemIndex = prev.findIndex(
        (item) =>
          item._id === newItem._id &&
          item.size === newItem.size &&
          JSON.stringify(item.toppings.sort()) === JSON.stringify(newItem.toppings.sort())
      );

      if (existingItemIndex > -1) {
        const newCart = [...prev];
        newCart[existingItemIndex].quantity += 1;
        return newCart;
      }
      return [...prev, { ...newItem, quantity: 1 }];
    });
  }, []);

  // 4. Update Quantity Logic
  const updateQuantity = useCallback((index, delta) => {
    setCart((prev) => {
      const newCart = [...prev];
      const newQty = newCart[index].quantity + delta;
      if (newQty > 0) {
        newCart[index].quantity = newQty;
      }
      return newCart;
    });
  }, []);

  // 5. Remove Item Logic
  const removeFromCart = useCallback((index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // 6. Clear Cart Logic
  const clearCart = useCallback(() => setCart([]), []);

  // 7. Calculate Totals
  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);
  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  const value = useMemo(() => ({
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartCount
  }), [cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);