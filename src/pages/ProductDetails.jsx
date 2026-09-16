import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router";
import { getProduct } from "../services/products.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { getSizeVariants, hasSizeVariants, DEFAULT_VARIANT_INDEX } from "../utils/productVariants.jsx";
import QuantityControl from "../components/QuantityControl.jsx";
import PageState from "../components/PageState.jsx";

export default function ProductDetails() {
  const { id } = useParams();
  const [status, setStatus] = useState("loading");
  const [product, setProduct] = useState(null);
  const [variantIndex, setVariantIndex] = useState(DEFAULT_VARIANT_INDEX);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [announcement, setAnnouncement] = useState("");

  const { addItem } = useCart();
  const { toggle, savedIds } = useWishlist();

  function load(signal) {
    setStatus("loading");
    setVariantIndex(DEFAULT_VARIANT_INDEX);
    setQuantity(1);
    setActiveImage(0);
    getProduct(id, signal)
      .then((data) => {
        setProduct(data);
        setStatus("ready");
      })
      .catch((error) => {
        if (error.name === "AbortError") return;
        setStatus(error.notFound ? "not-found" : "error");
      });
  }

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [id]);

  const sizeEnabled = hasSizeVariants(product);
  const variants = useMemo(() => (product ? getSizeVariants(product) : []), [product]);
  const selectedVariant = sizeEnabled ? variants[variantIndex] || variants[0] : null;

  const displayPrice = selectedVariant ? selectedVariant.price : product?.price ?? 0;
  const displayStock = selectedVariant ? selectedVariant.stock : product?.stock ?? 0;

  useEffect(() => {
    setQuantity(1);
  }, [variantIndex]);

  if (status === "loading") {
    return (
      <div className="row g-4 placeholder-glow">
        <div className="col-12 col-lg-6">
          <div className="product-image placeholder" style={{ height: 360 }}></div>
        </div>
        <div className="col-12 col-lg-6">
          <span className="placeholder col-6 d-block mb-3"></span>
          <span className="placeholder col-4 d-block mb-3"></span>
          <span className="placeholder col-8 d-block"></span>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return <PageState status="error" message="Couldn't load this product." onRetry={() => load()} />;
  }

  if (status === "not-found") {
    return (
      <div className="text-center py-5">
        <h1 className="page-heading mb-3">Product not found</h1>
        <p className="text-muted mb-4">This product doesn't exist or may have been removed.</p>
        <Link to="/products" className="btn btn-primary">Back to products</Link>
      </div>
    );
  }

  const saved = savedIds.includes(product.id);
  const outOfStock = displayStock < 1;
  const images = product.images?.length ? product.images : [product.thumbnail];

  function handleAdd() {
    let success;
    if (selectedVariant) {
      const variantProduct = {
        ...product,
        id: `${product.id}-${selectedVariant.id}`,
        title: `${product.title} (${selectedVariant.label})`,
        price: selectedVariant.price,
        stock: selectedVariant.stock,
      };
      success = addItem(variantProduct, quantity);
    } else {
      success = addItem(product, quantity);
    }
    setAnnouncement(
      success
        ? `${product.title}${selectedVariant ? `, ${selectedVariant.label} size,` : ""} added to cart.`
        : "Couldn't add more of this item."
    );
  }

  return (
    <div>
      <nav aria-label="breadcrumb" className="breadcrumb-pro mb-3">
        <Link to="/products">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Shop
        </Link>
        <span className="breadcrumb-sep" aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </span>
        <span className="breadcrumb-current">{product.title}</span>
      </nav>

      <div className="row g-4">
        <div className="col-12 col-lg-6">
          <div className="product-gallery-main mb-3" style={{ height: 360 }}>
            <img
              src={images[activeImage]}
              alt={product.title}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
            <span className="zoom-hint" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
                <path d="M11 8v6M8 11h6" />
              </svg>
            </span>
          </div>
          {images.length > 1 && (
            <div className="d-flex gap-2 flex-wrap">
              {images.map((img, index) => (
                <button
                  key={img + index}
                  type="button"
                  className={`btn btn-sm p-1 thumb-btn ${activeImage === index ? "active border-primary border-2" : "border"}`}
                  onClick={() => setActiveImage(index)}
                  aria-label={`View image ${index + 1}`}
                >
                  <img src={img} alt="" style={{ width: 48, height: 48, objectFit: "contain" }} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="col-12 col-lg-6">
          <h1 className="page-heading mb-2">{product.title}</h1>
          <p className="text-muted mb-2 text-capitalize">
            {product.category} | Rating {Number(product.rating).toFixed(1)} / 5
          </p>
          <p className="h4 fw-bold price-accent mb-3">${displayPrice.toFixed(2)}</p>

          {sizeEnabled && variants.length > 0 && (
            <div className="mb-3">
              <p className="fw-semibold small text-uppercase text-muted mb-2">Size</p>
              <div className="d-flex flex-wrap gap-2" role="radiogroup" aria-label="Select size">
                {variants.map((variant, index) => (
                  <button
                    key={variant.id}
                    type="button"
                    role="radio"
                    aria-checked={variantIndex === index}
                    className={`btn btn-sm ${variantIndex === index ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => setVariantIndex(index)}
                  >
                    {variant.label} · ${variant.price.toFixed(2)}
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="mb-3">{product.description}</p>
          <p className="mb-3">
            {outOfStock ? `Out of stock${selectedVariant ? " in this size" : ""}` : `In stock: ${displayStock}`}
          </p>

          <div className="d-flex flex-column flex-sm-row gap-3 mb-3">
            <QuantityControl value={quantity} max={displayStock} onChange={setQuantity} />
            <button type="button" className="btn btn-primary btn-glow" disabled={outOfStock} onClick={handleAdd}>
              Add to cart
            </button>
          </div>

          <button type="button" className="btn btn-outline-primary" aria-pressed={saved} onClick={() => toggle(product)}>
            {saved ? "Saved to wishlist" : "Save to wishlist"}
          </button>

          <p aria-live="polite" className="visually-hidden">{announcement}</p>
        </div>
      </div>
    </div>
  );
}