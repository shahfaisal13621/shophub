const SIZE_STEPS = [
  { id: "S", label: "Small", priceMultiplier: 0.85, stockFactor: 1.1 },
  { id: "M", label: "Medium", priceMultiplier: 1, stockFactor: 1 },
  { id: "L", label: "Large", priceMultiplier: 1.2, stockFactor: 0.75 },
  { id: "XL", label: "Extra Large", priceMultiplier: 1.45, stockFactor: 0.5 },
];

// Only categories where a physical "size" genuinely makes sense.
// Everything else (cars, electronics, watches, skincare, etc.) shows a single price.
const SIZE_ELIGIBLE_CATEGORIES = new Set([
  "furniture",
  "mens-shirts",
  "womens-dresses",
  "tops",
  "mens-shoes",
  "womens-shoes",
  "womens-bags",
]);

export function hasSizeVariants(product) {
  if (!product) return false;
  return SIZE_ELIGIBLE_CATEGORIES.has(product.category);
}

export function getSizeVariants(product) {
  if (!hasSizeVariants(product)) return [];
  return SIZE_STEPS.map((step) => ({
    id: step.id,
    label: step.label,
    price: Number((product.price * step.priceMultiplier).toFixed(2)),
    stock: Math.max(0, Math.round(product.stock * step.stockFactor)),
  }));
}

export const DEFAULT_VARIANT_INDEX = 1; // Medium