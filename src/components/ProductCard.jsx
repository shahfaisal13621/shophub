import { Link } from "react-router";
import { motion } from "framer-motion";
import { useQuickView } from "../App.jsx";

export default function ProductCard({ product, saved, onAdd, onToggleWishlist, addLabel = "Add to cart" }) {
  const openQuickView = useQuickView();
  const outOfStock = product.stock < 1;

  return (
    <motion.article
      className="card product-card product-card-tech h-100"
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="product-image-wrap">
        {product.isCustom ? (
          <span className="original-badge">ShopHub Original</span>
        ) : (
          product.category && <span className="category-badge">{product.category}</span>
        )}
        <Link to={`/products/${product.id}`}>
          <img className="product-image" src={product.thumbnail} alt={product.title} loading="lazy" />
        </Link>
        <button
          type="button"
          className="quick-view-btn"
          onClick={() => openQuickView(product)}
          aria-label={`Quick view ${product.title}`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          Quick view
        </button>
      </div>
      <div className="card-body d-flex flex-column gap-2">
        <h3 className="h6 mb-0">
          <Link to={`/products/${product.id}`} className="text-decoration-none text-dark">
            {product.title}
          </Link>
        </h3>
        <p className="fw-bold price-accent mb-0">${product.price.toFixed(2)}</p>
        <button type="button" className="btn btn-primary btn-glow mt-auto" disabled={outOfStock} onClick={() => onAdd(product, 1)}>
          {outOfStock ? "Out of stock" : addLabel}
        </button>
        <button type="button" className="btn btn-outline-primary" aria-pressed={saved} onClick={() => onToggleWishlist(product)}>
          {saved ? "Saved to wishlist" : "Save to wishlist"}
        </button>
      </div>
    </motion.article>
  );
}