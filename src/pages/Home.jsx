import { useEffect, useState } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import HeroShowcase from "../components/HeroShowcase.jsx";
import ProductGrid from "../components/ProductGrid.jsx";
import PageState from "../components/PageState.jsx";
import { getProducts } from "../services/products.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { useToast } from "../App.jsx";

const CATEGORIES = ["beauty", "furniture", "groceries", "fragrances"];

function SkeletonCard() {
  return (
    <div className="col-12 col-sm-6 col-lg-4 col-xl-3">
      <div className="card h-100 placeholder-glow">
        <div className="product-image placeholder"></div>
        <div className="card-body">
          <span className="placeholder col-8 d-block mb-2"></span>
          <span className="placeholder col-4 d-block"></span>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [status, setStatus] = useState("loading");
  const [products, setProducts] = useState([]);
  const [originals, setOriginals] = useState([]);
  const [totalCount, setTotalCount] = useState(null);
  const { addItem } = useCart();
  const { toggle, savedIds } = useWishlist();
  const notify = useToast();

  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");
    getProducts(controller.signal)
      .then((all) => {
        setProducts(all.filter((p) => !p.isCustom).slice(0, 8));
        setOriginals(all.filter((p) => p.isCustom));
        setTotalCount(all.length);
        setStatus("ready");
      })
      .catch((error) => {
        if (error.name !== "AbortError") setStatus("error");
      });
    return () => controller.abort();
  }, []);

  function handleAdd(product, qty) {
    addItem(product, qty);
    notify(`${product.title} added to cart.`);
  }

  function handleToggleWishlist(product) {
    const wasSaved = savedIds.includes(product.id);
    toggle(product);
    notify(wasSaved ? "Removed from wishlist." : "Saved to wishlist.");
  }

  const productStat = totalCount ? `${Math.floor(totalCount / 10) * 10}+ products` : "Curated products";

  return (
    <div className="d-flex flex-column gap-5">
      <section className="hero-tech">
        <div className="hero-content row align-items-center g-4">
          <div className="col-12 col-lg-6">
            <span className="hero-eyebrow mb-3">
              <span className="dot" /> New tech-forward store
            </span>
            <h1 className="page-heading hero-heading-gradient mb-3 mt-3">Find your next favourite.</h1>
            <p className="mb-4" style={{ color: "#c3d2f0" }}>Everyday products. One simple store.</p>
            <div className="d-flex flex-wrap gap-3 mb-4">
              <Link to="/products" className="btn btn-primary btn-lg btn-glow">Shop products</Link>
            </div>
            <div className="d-flex flex-wrap gap-2 mb-4">
              {CATEGORIES.map((category) => (
                <Link key={category} to={`/products?category=${category}`} className="glass-panel px-3 py-2 text-decoration-none text-capitalize small" style={{ color: "#eaf1ff" }}>
                  {category}
                </Link>
              ))}
            </div>
            <div className="hero-stats">
              <span className="hero-stat">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5" /></svg>
                {productStat}
              </span>
              <span className="hero-stat">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5" /></svg>
                Free delivery
              </span>
              <span className="hero-stat">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5" /></svg>
                Secure demo checkout
              </span>
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <div className="hero-visual-frame">
              {status === "ready" && products.length > 0 ? (
                <HeroShowcase products={products} />
              ) : (
                <div className="hero-3d-fallback" aria-hidden="true" />
              )}
              <span className="hero-floating-chip hero-chip-top">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l2.9 6.26L21 9.27l-4.5 4.38L17.8 21 12 17.77 6.2 21l1.3-7.35L3 9.27l6.1-1.01z" />
                </svg>
                <span>4.8 average rating</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {status === "ready" && originals.length > 0 && (
        <section>
          <span className="originals-eyebrow mb-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l2.9 6.26L21 9.27l-4.5 4.38L17.8 21 12 17.77 6.2 21l1.3-7.35L3 9.27l6.1-1.01z" />
            </svg>
            Exclusive to ShopHub
          </span>
          <div className="d-flex flex-wrap justify-content-between align-items-end gap-2 mb-4">
            <h2 className="section-heading mb-0">ShopHub Originals</h2>
            <Link to="/products?category=originals" className="small text-decoration-none">View all originals →</Link>
          </div>
          <ProductGrid products={originals} savedIds={savedIds} onAdd={handleAdd} onToggleWishlist={handleToggleWishlist} />
        </section>
      )}

      <section>
        <h2 className="section-heading mb-4">Featured products</h2>
        {status === "loading" && (
          <div className="row g-4" role="status" aria-busy="true" aria-live="polite">
            <span className="visually-hidden">Loading featured products…</span>
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}
        {status === "error" && (
          <PageState status="error" message="Couldn't load featured products." onRetry={() => window.location.reload()} />
        )}
        {status === "ready" && products.length === 0 && (
          <PageState status="empty" message="No products to show right now." />
        )}
        {status === "ready" && products.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5 }}>
            <ProductGrid products={products} savedIds={savedIds} onAdd={handleAdd} onToggleWishlist={handleToggleWishlist} />
          </motion.div>
        )}
      </section>
    </div>
  );
}