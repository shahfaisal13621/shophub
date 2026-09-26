export default function OrderSummary({ items, actionArea, discount = 0, couponCode }) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = Math.max(0, subtotal - discount);

  return (
    <div className="card p-3 order-summary-sticky">
      <h2 className="h6 mb-3">Order summary</h2>
      <div className="d-flex justify-content-between small mb-2">
        <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
      </div>
      {discount > 0 && (
        <div className="d-flex justify-content-between small mb-2 text-success">
          <span>Coupon {couponCode ? `(${couponCode})` : ""}</span><span>-${discount.toFixed(2)}</span>
        </div>
      )}
      <div className="d-flex justify-content-between small mb-2">
        <span>Delivery</span><span>Free</span>
      </div>
      <hr />
      <div className="d-flex justify-content-between fw-bold mb-3">
        <span>Total</span><span className="price-accent">${total.toFixed(2)}</span>
      </div>
      {actionArea}

      <div className="summary-trust-strip">
        <span className="summary-trust-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5" /></svg>
          Free delivery on every order
        </span>
        <span className="summary-trust-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5" /></svg>
          Secure demo checkout, no real payment
        </span>
      </div>
    </div>
  );
}