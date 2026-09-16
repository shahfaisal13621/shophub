import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { useToast } from "../App.jsx";
import { hasSizeVariants } from "../utils/productVariants.jsx";
import QuantityControl from "./QuantityControl.jsx";

export default function QuickViewModal({ product, onClose }) {
  const { addItem } = useCart();
  const { toggle, savedIds } = useWishlist();
  const notify = useToast();
  const [quantity, setQuantity] = useState(1);
  const closeButtonRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!product) return;

    setQuantity(1);
    triggerRef.current = document.activeElement;
    closeButtonRef.current?.focus();
    document.body.style.overflow = "hidden";

    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      if (triggerRef.current instanceof HTMLElement) {
        triggerRef.current.focus();
      }
    };
  }, [product, onClose]);

  if (!product) return null;

  const saved = savedIds.includes(product.id);
  const outOfStock = product.stock < 1;
  const sizeAvailable = hasSizeVariants(product);

  function handleAdd() {
    addItem(product, quantity);
    notify(`${product.title} added to cart.`);
    onClose();
  }

  function handleToggleWishlist() {
    toggle(product);
    notify(saved ? "Removed from wishlist." : "Saved to wishlist.");
  }

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
      style={{ background: "rgba(6,10,20,0.6)", zIndex: 1090 }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-view-title"
        className="bg-white rounded-4 shadow-lg overflow-hidden"
        style={{ maxWidth: 720, width: "100%", maxHeight: "90vh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="d-flex justify-content-end p-2">
          <button ref={closeButtonRef} type="button" className="btn btn-outline-secondary btn-sm" onClick={onClose} aria-label="Close quick view">
            Close
          </button>
        </div>
        <div className="row g-0 px-3 pb-3">
          <div className="col-12 col-sm-5">
            <div className="product-image" style={{ height: 220 }}>
              <img src={product.thumbnail} alt={product.title} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </div>
          </div>
          <div className="col-12 col-sm-7 ps-sm-3 pt-3 pt-sm-0">
            <h2 id="quick-view-title" className="h5 mb-1">{product.title}</h2>
            <p className="text-muted small text-capitalize mb-2">{product.category}</p>
            <p className="fw-bold price-accent mb-1">${product.price.toFixed(2)}</p>
            {sizeAvailable && (
              <p className="text-muted small mb-2">Choose your size on the full details page</p>
            )}
            <p className="small text-muted mb-3" style={{ maxHeight: 80, overflow: "hidden" }}>{product.description}</p>
            <p className="small mb-3">{outOfStock ? "Out of stock" : `In stock: ${product.stock}`}</p>
            <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
              <QuantityControl value={quantity} max={product.stock} onChange={setQuantity} />
              <button type="button" className="btn btn-primary btn-glow" disabled={outOfStock} onClick={handleAdd}>
                Add to cart
              </button>
            </div>
            <div className="d-flex flex-wrap gap-2">
              <button type="button" className="btn btn-outline-primary btn-sm" aria-pressed={saved} onClick={handleToggleWishlist}>
                {saved ? "Saved to wishlist" : "Save to wishlist"}
              </button>
              <Link to={`/products/${product.id}`} className="btn btn-outline-secondary btn-sm" onClick={onClose}>
                Full details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}