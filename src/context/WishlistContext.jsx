import { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";

const WishlistContext = createContext(undefined);
const STORAGE_KEY = "shophub-wishlist-v1";

function readStoredWishlist() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item && typeof item.id !== "undefined");
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(readStoredWishlist);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
    } catch {
      // Ignore storage failures — wishlist still works in-memory this session.
    }
  }, [wishlist]);

  const toggle = useCallback((product) => {
    setWishlist((current) => {
      const exists = current.some((item) => item.id === product.id);
      if (exists) return current.filter((item) => item.id !== product.id);
      return [
        ...current,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          thumbnail: product.thumbnail,
          stock: product.stock ?? Infinity,
        },
      ];
    });
  }, []);

  const remove = useCallback((id) => {
    setWishlist((current) => current.filter((item) => item.id !== id));
  }, []);

  const savedIds = useMemo(() => wishlist.map((item) => item.id), [wishlist]);

  const value = useMemo(
    () => ({ wishlist, toggle, remove, savedIds, itemCount: wishlist.length }),
    [wishlist, toggle, remove, savedIds]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) throw new Error("useWishlist must be used within a WishlistProvider");
  return context;
}