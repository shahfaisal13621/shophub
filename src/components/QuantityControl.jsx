export default function QuantityControl({ value, max, onChange }) {
  const atMin = value <= 1;
  const atMax = typeof max === "number" && value >= max;

  return (
    <div className="d-flex align-items-center gap-2">
      <button type="button" className="btn btn-outline-secondary btn-sm" disabled={atMin}
        onClick={() => onChange(value - 1)} aria-label="Decrease quantity">
        −
      </button>
      <span aria-live="polite">{value}</span>
      <button type="button" className="btn btn-outline-secondary btn-sm" disabled={atMax}
        onClick={() => onChange(value + 1)} aria-label="Increase quantity">
        +
      </button>
    </div>
  );
}