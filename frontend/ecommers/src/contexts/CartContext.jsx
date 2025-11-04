import { createContext, useState } from 'react';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]); // {product, qty}

  function addToCart(product) {
    setCart(prev => {
      const found = prev.find(p => p.product._id === product._id);
      if (found) return prev.map(p => p.product._id === product._id ? { ...p, qty: p.qty+1 } : p);
      return [...prev, { product, qty: 1 }];
    });
  }

  function removeFromCart(productId) {
    setCart(prev => prev.filter(p => p.product._id !== productId));
  }

  function total() {
    return cart.reduce((s, it) => s + it.product.price * it.qty, 0);
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, total }}>
      {children}
    </CartContext.Provider>
  );
}
