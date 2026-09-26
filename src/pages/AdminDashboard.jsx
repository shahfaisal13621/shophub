import { useEffect, useState } from "react";
import { listAdminOrders, updateOrderStatus } from "../services/adminOrders.jsx";
import { listCoupons, addCoupon, updateCoupon, deleteCoupon } from "../services/coupons.jsx";
import { useToast } from "../App.jsx";

const STATUS_OPTIONS = ["pending", "processing", "shipped", "cancelled"];

function formatDate(timestamp) {
  if (!timestamp) return "Processing date";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
}

function OverviewTab({ orders }) {
  const activeOrders = orders.filter((o) => o.status !== "cancelled");
  const grossRevenue = activeOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const orderVolume = orders.length;
  const avgOrderValue = activeOrders.length ? grossRevenue / activeOrders.length : 0;
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
  const ordersToday = orders.filter((o) => {
    const created = o.createdAt?.toDate ? o.createdAt.toDate().getTime() : 0;
    return created >= oneDayAgo;
  }).length;

  const metrics = [
    { label: "Gross Revenue", value: `$${grossRevenue.toFixed(2)}` },
    { label: "Order Volume", value: orderVolume },
    { label: "Orders Today", value: ordersToday },
    { label: "Avg. Order Value", value: `$${avgOrderValue.toFixed(2)}` },
  ];

  return (
    <div>
      <div className="row g-3 mb-4">
        {metrics.map((m) => (
          <div key={m.label} className="col-6 col-lg-3">
            <div className="metric-card">
              <span className="metric-card-label">{m.label}</span>
              <p className="metric-card-value mb-0">{m.value}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="text-muted small">
        "Active Carts" isn't shown here — carts are stored only in each shopper's browser, so there's no
        honest way to track them without server-side cart syncing. These four numbers are all computed
        from real placed orders in Firestore.
      </p>
    </div>
  );
}

function OrdersTab({ orders, onStatusChange }) {
  return (
    <div>
      <div className="admin-table-header d-none d-md-grid">
        <span>Order ID</span>
        <span>Customer</span>
        <span>Total</span>
        <span>Placed</span>
        <span>Status</span>
      </div>
      <div className="d-flex flex-column gap-2">
        {orders.length === 0 && <p className="text-muted">No orders yet.</p>}
        {orders.map((order) => (
          <div key={order.id} className="admin-table-row">
            <span className="small text-truncate">{order.id}</span>
            <span className="small">
              {order.delivery?.fullName || "Unknown"}<br />
              <span className="text-muted">{order.delivery?.phone}</span>
            </span>
            <span className="fw-semibold price-accent">${(order.total || 0).toFixed(2)}</span>
            <span className="small text-muted">{formatDate(order.createdAt)}</span>
            <select
              className="form-select form-select-sm status-select"
              value={order.status || "pending"}
              onChange={(e) => onStatusChange(order, e.target.value)}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

function CouponsTab({ coupons, onAdd, onToggle, onDelete }) {
  const [code, setCode] = useState("");
  const [type, setType] = useState("percent");
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  async function handleAdd(e) {
    e.preventDefault();
    if (!code.trim() || !value || Number(value) <= 0) {
      setError("Enter a code and a valid discount value.");
      return;
    }
    setError("");
    await onAdd(code, { type, value: Number(value) });
    setCode("");
    setValue("");
  }

  return (
    <div className="row g-4">
      <div className="col-12 col-lg-5">
        <div className="section-card">
          <p className="section-card-heading">Add coupon</p>
          <form onSubmit={handleAdd}>
            <div className="mb-3">
              <label className="form-label">Code</label>
              <input className="form-control text-uppercase" value={code} onChange={(e) => setCode(e.target.value)} placeholder="SAVE10" />
            </div>
            <div className="row">
              <div className="col-6">
                <label className="form-label">Type</label>
                <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="percent">Percent off</option>
                  <option value="fixed">Fixed $ off</option>
                </select>
              </div>
              <div className="col-6">
                <label className="form-label">Value</label>
                <input type="number" className="form-control" value={value} onChange={(e) => setValue(e.target.value)} />
              </div>
            </div>
            {error && <p className="text-danger small mt-2">{error}</p>}
            <button type="submit" className="btn btn-primary btn-glow mt-3">Add coupon</button>
          </form>
        </div>
      </div>
      <div className="col-12 col-lg-7">
        {coupons.length === 0 && <p className="text-muted">No coupons yet.</p>}
        <div className="d-flex flex-column gap-2">
          {coupons.map((c) => (
            <div key={c.code} className="cart-item-row d-flex justify-content-between align-items-center">
              <div>
                <p className="fw-semibold mb-1">{c.code}</p>
                <p className="text-muted small mb-0">
                  {c.type === "percent" ? `${c.value}% off` : `$${c.value} off`} · {c.active ? "Active" : "Disabled"}
                </p>
              </div>
              <div className="d-flex gap-2">
                <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => onToggle(c)}>
                  {c.active ? "Disable" : "Enable"}
                </button>
                <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => onDelete(c.code)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [tab, setTab] = useState("overview");
  const [orders, setOrders] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [status, setStatus] = useState("loading");
  const notify = useToast();

  function load() {
    setStatus("loading");
    Promise.all([listAdminOrders(), listCoupons()])
      .then(([orderList, couponList]) => {
        setOrders(orderList);
        setCoupons(couponList);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }

  useEffect(() => {
    load();
  }, []);

  async function handleStatusChange(order, nextStatus) {
    setOrders((current) => current.map((o) => (o.id === order.id ? { ...o, status: nextStatus } : o)));
    try {
      await updateOrderStatus(order, nextStatus);
      notify(`Order ${order.id} marked as ${nextStatus}.`);
    } catch {
      notify("Couldn't update that order's status.");
      load();
    }
  }

  async function handleAddCoupon(code, data) {
    try {
      await addCoupon(code, data);
      notify("Coupon added.");
      load();
    } catch {
      notify("Couldn't add that coupon.");
    }
  }

  async function handleToggleCoupon(coupon) {
    try {
      await updateCoupon(coupon.code, { active: !coupon.active });
      notify(coupon.active ? "Coupon disabled." : "Coupon enabled.");
      load();
    } catch {
      notify("Couldn't update that coupon.");
    }
  }

  async function handleDeleteCoupon(code) {
    if (!window.confirm("Delete this coupon?")) return;
    try {
      await deleteCoupon(code);
      notify("Coupon deleted.");
      load();
    } catch {
      notify("Couldn't delete that coupon.");
    }
  }

  return (
    <div>
      <h1 className="page-heading mb-1">Admin dashboard</h1>
      <p className="text-muted mb-4">Real metrics, order fulfillment, and coupons — all backed by your Firestore data.</p>

      <div className="admin-tabs">
        <button type="button" className={`admin-tab-btn ${tab === "overview" ? "active" : ""}`} onClick={() => setTab("overview")}>Overview</button>
        <button type="button" className={`admin-tab-btn ${tab === "orders" ? "active" : ""}`} onClick={() => setTab("orders")}>Order queue</button>
        <button type="button" className={`admin-tab-btn ${tab === "coupons" ? "active" : ""}`} onClick={() => setTab("coupons")}>Coupons</button>
      </div>

      {status === "loading" && <p className="text-muted">Loading dashboard data...</p>}
      {status === "error" && <p className="text-danger">Couldn't load dashboard data.</p>}
      {status === "ready" && (
        <>
          {tab === "overview" && <OverviewTab orders={orders} />}
          {tab === "orders" && <OrdersTab orders={orders} onStatusChange={handleStatusChange} />}
          {tab === "coupons" && <CouponsTab coupons={coupons} onAdd={handleAddCoupon} onToggle={handleToggleCoupon} onDelete={handleDeleteCoupon} />}
        </>
      )}
    </div>
  );
}