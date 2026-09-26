import { useRef, useState } from "react";
import { useNavigate, Link } from "react-router";
import { doc, setDoc, serverTimestamp, collection } from "firebase/firestore";
import { db } from "../services/firebase.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { getCoupon } from "../services/coupons.jsx";
import FormField from "../components/FormField.jsx";
import OrderSummary from "../components/OrderSummary.jsx";

export default function Checkout() {
  const { user } = useAuth();
  const { cart, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [checkingCoupon, setCheckingCoupon] = useState(false);

  const orderRefHolder = useRef(null);

  function getOrderRef() {
    if (!orderRefHolder.current) {
      orderRefHolder.current = doc(collection(db, "users", user.uid, "orders"));
    }
    return orderRefHolder.current;
  }

  const discount = appliedCoupon
    ? appliedCoupon.type === "percent"
      ? Number((subtotal * (appliedCoupon.value / 100)).toFixed(2))
      : Math.min(appliedCoupon.value, subtotal)
    : 0;
  const total = Number((subtotal - discount).toFixed(2));

  async function handleApplyCoupon() {
    if (!couponInput.trim()) return;
    setCheckingCoupon(true);
    setCouponError("");
    try {
      const coupon = await getCoupon(couponInput);
      if (!coupon || !coupon.active) {
        setCouponError("That coupon code isn't valid.");
        setAppliedCoupon(null);
      } else {
        setAppliedCoupon(coupon);
      }
    } catch {
      setCouponError("Couldn't check that coupon right now.");
    } finally {
      setCheckingCoupon(false);
    }
  }

  function validate() {
    const nextErrors = {};
    if (!fullName.trim()) nextErrors.fullName = "Full name is required.";
    if (!phone.trim()) nextErrors.phone = "Phone is required.";
    if (!address.trim()) nextErrors.address = "Address is required.";
    if (!city.trim()) nextErrors.city = "City is required.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    if (cart.length === 0 || !validate()) return;

    setSubmitting(true);
    try {
      const orderRef = getOrderRef();
      const orderData = {
        items: cart.map((item) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          thumbnail: item.thumbnail,
        })),
        delivery: { fullName, phone, address, city },
        subtotal,
        discount,
        couponCode: appliedCoupon ? appliedCoupon.code : null,
        total,
        status: "pending",
        createdAt: serverTimestamp(),
      };

      await setDoc(orderRef, orderData);
      await setDoc(doc(db, "adminOrders", orderRef.id), {
        ...orderData,
        uid: user.uid,
        itemCount: cart.reduce((sum, item) => sum + item.quantity, 0),
      });

      clearCart();
      navigate("/orders", { state: { confirmedOrderId: orderRef.id } });
    } catch {
      setFormError("Couldn't place your order. Your cart and details are safe — please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (cart.length === 0) {
    return (
      <div className="text-center py-5">
        <h1 className="page-heading mb-3">Checkout</h1>
        <p className="text-muted mb-4">Your cart is empty, so there's nothing to check out yet.</p>
        <Link to="/products" className="btn btn-primary btn-glow">Browse products</Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-heading mb-4">Checkout</h1>
      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="section-card">
            <p className="section-card-heading">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Delivery details
            </p>
            <form id="checkout-form" onSubmit={handleSubmit} noValidate>
              <FormField id="checkout-name" label="Full name" value={fullName} onChange={setFullName} error={errors.fullName} autoComplete="name" />
              <div className="row">
                <div className="col-12 col-sm-6">
                  <FormField id="checkout-phone" label="Phone" type="tel" value={phone} onChange={setPhone} error={errors.phone} autoComplete="tel" />
                </div>
                <div className="col-12 col-sm-6">
                  <FormField id="checkout-city" label="City" value={city} onChange={setCity} error={errors.city} autoComplete="address-level2" />
                </div>
              </div>
              <FormField id="checkout-address" label="Address" value={address} onChange={setAddress} error={errors.address} autoComplete="street-address" />
              {formError && <p className="text-danger small" role="alert">{formError}</p>}
            </form>

            <div className="demo-notice mt-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
              This is a demo checkout — no real payment is collected.
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-4">
          <div className="section-card mb-3">
            <p className="section-card-heading mb-2" style={{ fontSize: "0.9rem" }}>Have a coupon?</p>
            <div className="d-flex gap-2">
              <input
                className="form-control text-uppercase"
                placeholder="Coupon code"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
              />
              <button type="button" className="btn btn-outline-primary" disabled={checkingCoupon} onClick={handleApplyCoupon}>
                {checkingCoupon ? "..." : "Apply"}
              </button>
            </div>
            {couponError && <p className="text-danger small mt-2 mb-0">{couponError}</p>}
            {appliedCoupon && (
              <p className="text-success small mt-2 mb-0">
                "{appliedCoupon.code}" applied — you're saving ${discount.toFixed(2)}.
              </p>
            )}
          </div>

          <OrderSummary
            items={cart}
            discount={discount}
            couponCode={appliedCoupon?.code}
            actionArea={
              <button type="submit" form="checkout-form" className="btn btn-primary w-100 btn-glow" disabled={submitting}>
                {submitting ? "Placing order..." : "Place demo order"}
              </button>
            }
          />
        </div>
      </div>
    </div>
  );
}