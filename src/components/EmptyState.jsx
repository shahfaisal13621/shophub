import { Link } from "react-router";

function CartIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M6 8h12l-1 12H7L6 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}
function HeartIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
    </svg>
  );
}
function BoxIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M21 8 12 3 3 8l9 5 9-5Z" /><path d="M3 8v8l9 5 9-5V8" /><path d="M12 13v8" />
    </svg>
  );
}
function CompassIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="10" /><path d="m16 8-2 6-6 2 2-6 6-2Z" />
    </svg>
  );
}

const ICONS = { cart: CartIcon, heart: HeartIcon, box: BoxIcon, compass: CompassIcon };

export default function EmptyState({ icon = "box", title, message, actionLabel, actionTo }) {
  const Icon = ICONS[icon] || BoxIcon;

  return (
    <div className="empty-state">
      <span className="empty-state-icon"><Icon /></span>
      <h1 className="h4">{title}</h1>
      <p className="text-muted mb-4" style={{ maxWidth: 360 }}>{message}</p>
      {actionLabel && actionTo && (
        <Link to={actionTo} className="btn btn-primary btn-glow">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}