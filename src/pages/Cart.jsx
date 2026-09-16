import { Link } from "react-router";
import { useCart } from "../context/CartContext.jsx";
import QuantityControl from "../components/QuantityControl.jsx";
import OrderSummary from "../components/OrderSummary.jsx";
import EmptyState from "../components/EmptyState.jsx";

export default function Cart() {
  const { cart, updateQuantity, removeItem } = useCart();

     if (cart.length === 0) {
    return (
      <EmptyState
        icon="cart"
        title="Your cart is empty"
        message="Looks like you haven't added anything yet. Explore the catalog and find something you'll love."
        actionLabel="Browse products"
        actionTo="/products"
      />
    );
  }

  return (
    <div>
      <h1 className="page-heading mb-1">Your cart</h1>
      <p className="text-muted mb-4">{cart.length} item{cart.length === 1 ? "" : "s"} in your cart</p>

      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <ul className="list-unstyled d-flex flex-column gap-3" aria-live="polite">
            {cart.map((item) => (
              <li key={item.id} className="cart-item-row d-flex flex-row gap-3 align-items-center">
                <img src={item.thumbnail} alt={item.title} className="cart-item-image" />
                <div className="flex-grow-1">
                  <p className="fw-semibold mb-1">{item.title}</p>
                  <p className="price-accent fw-bold mb-2">${item.price.toFixed(2)}</p>
                  <div className="d-flex flex-wrap align-items-center gap-3">
                    <QuantityControl value={item.quantity} max={item.stock} onChange={(next) => updateQuantity(item.id, next)} />
                    <button type="button" className="cart-remove-btn" onClick={() => removeItem(item.id)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6" />
                      </svg>
                      Remove
                    </button>
                  </div>
                </div>
                <p className="fw-bold text-nowrap d-none d-sm-block">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
          <Link to="/products" className="d-inline-flex align-items-center gap-2 mt-3 text-decoration-none">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
            Continue shopping
          </Link>
        </div>
        <div className="col-12 col-lg-4">
          <OrderSummary items={cart} actionArea={<Link to="/checkout" className="btn btn-primary btn-glow w-100">Checkout</Link>} />
        </div>
      </div>
    </div>
  );
}