import ProductCard from "./ProductCard.jsx";

export default function ProductGrid({ products, savedIds = [], onAdd, onToggleWishlist, addLabel }) {
  return (
    <div className="row g-4">
      {products.map((product) => (
        <div key={product.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
          <ProductCard
            product={product}
            saved={savedIds.includes(product.id)}
            onAdd={onAdd}
            onToggleWishlist={onToggleWishlist}
            addLabel={addLabel}
          />
        </div>
      ))}
    </div>
  );
}