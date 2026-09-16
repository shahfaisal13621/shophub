export default function SearchBar({ value, onChange, id = "product-search" }) {
  return (
    <div>
      <label htmlFor={id} className="form-label small text-muted mb-1">
        Search products
      </label>
      <input
        id={id}
        type="search"
        className="form-control"
        placeholder="Search products..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}