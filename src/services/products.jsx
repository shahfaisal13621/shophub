import { CUSTOM_PRODUCTS } from "../data/customProducts.jsx";
import { listManagedProducts, getManagedProduct } from "./customProducts.jsx";

const BASE_URL = "https://dummyjson.com/products";

export async function getProducts(signal) {
  const [dummyData, managed] = await Promise.all([
    fetch(`${BASE_URL}?limit=0`, { signal }).then((r) => {
      if (!r.ok) throw new Error(`Failed to load products (${r.status})`);
      return r.json();
    }),
    listManagedProducts().catch(() => []),
  ]);

  const bundledOriginals = CUSTOM_PRODUCTS.map((p) => ({ ...p, isCustom: true, isStatic: true }));
  const managedOriginals = managed.map((p) => ({ ...p, isCustom: true, isStatic: false }));

  return [...dummyData.products, ...bundledOriginals, ...managedOriginals];
}

export async function getProduct(id, signal) {
  const staticMatch = CUSTOM_PRODUCTS.find((p) => p.id === id);
  if (staticMatch) return { ...staticMatch, isCustom: true, isStatic: true };

  if (/^\d+$/.test(String(id))) {
    const response = await fetch(`${BASE_URL}/${id}`, { signal });
    if (response.status === 404) {
      const notFoundError = new Error("Product not found");
      notFoundError.notFound = true;
      throw notFoundError;
    }
    if (!response.ok) throw new Error(`Failed to load product (${response.status})`);
    return response.json();
  }

  const managed = await getManagedProduct(id);
  if (!managed) {
    const notFoundError = new Error("Product not found");
    notFoundError.notFound = true;
    throw notFoundError;
  }
  return { ...managed, isCustom: true, isStatic: false };
}