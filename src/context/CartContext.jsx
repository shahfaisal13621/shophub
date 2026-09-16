import { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";

const CartContext = createContext(undefined);
const STORAGE_KEY = "shophub-cart-v1";

function readStoredCart() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item) =>
        item &&
        typeof item.id !== "undefined" &&
        Number.isFinite(item.price) &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(readStoredCart);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // Storage full or unavailable — cart still works in-memory this session.
    }
  }, [cart]);

  const addItem = useCallback((product, quantity = 1) => {
    let added = false;
    setCart((current) => {
      const stock = product.stock ?? Infinity;
      const existing = current.find((item) => item.id === product.id);

      if (existing) {
        if (existing.quantity >= stock) return current;
        const nextQuantity = Math.min(existing.quantity + quantity, stock);
        added = nextQuantity > existing.quantity;
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: nextQuantity } : item
        );
      }

      added = true;
      return [
        ...current,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          thumbnail: product.thumbnail,
          stock,
          quantity: Math.min(quantity, stock),
        },
      ];
    });
    return added;
  }, []);

  const updateQuantity = useCallback((id, nextQuantity) => {
    setCart((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, Math.min(nextQuantity, item.stock ?? Infinity)) }
          : item
      )
    );
  }, []);

  const removeItem = useCallback((id) => {
    setCart((current) => current.filter((item) => item.id !== id));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const itemCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);

  const value = useMemo(
    () => ({ cart, addItem, updateQuantity, removeItem, clearCart, itemCount, subtotal }),
    [cart, addItem, updateQuantity, removeItem, clearCart, itemCount, subtotal]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) throw new Error("useCart must be used within a CartProvider");
  return context;
}