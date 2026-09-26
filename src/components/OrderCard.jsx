import { useState } from "react";

function formatDate(timestamp) {
  if (!timestamp) return "Processing date";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
}

const STATUS_STYLES = {
  pending: { className: "status-badge-pending", label: "Pending" },
  processing: { className: "status-badge-processing", label: "Processing" },
  shipped: { className: "status-badge-shipped", label: "Shipped" },
  cancelled: { className: "status-badge-cancelled", label: "Cancelled" },
  placed: { className: "status-badge-shipped", label: "Placed" },
};

export default function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);
  const itemCount = order.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  const statusInfo = STATUS_STYLES[order.status] || STATUS_STYLES.pending;

  return (
    <div className="order-card-pro">
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-3">
        <div className="d-flex align-items-center gap-3">
          <span className="order-card-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 8h12l-1 12H7L6 8Z" />
              <path d="M9 8V6a3 3 0 0 1 6 0v2" />
            </svg>
          </span>
          <div>
            <p className="fw-semibold mb-1">Order {order.id}</p>
            <div className="order-meta-row">
              <span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 4, marginBottom: 1 }}>
                  <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
                {formatDate(order.createdAt)}
              </span>
              <span>{itemCount} item{itemCount === 1 ? "" : "s"}</span>
              <span className="fw-semibold price-accent">${order.total?.toFixed(2)}</span>
              {order.couponCode && <span className="text-success">Coupon: {order.couponCode}</span>}
            </div>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2">
          <span className={`status-pill ${statusInfo.className}`}>{statusInfo.label}</span>
          <button type="button" className="btn btn-outline-primary btn-sm" aria-expanded={expanded} onClick={() => setExpanded((v) => !v)}>
            {expanded ? "Hide items" : "View items"}
          </button>
        </div>
      </div>

      {expanded && (
        <ul className="list-unstyled order-items-divider mb-0 d-flex flex-column gap-2">
          {order.items?.map((item) => (
            <li key={item.id} className="d-flex justify-content-between small">
              <span>{item.title} × {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}