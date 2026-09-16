export default function SortSelect({ value, onChange, id = "product-sort" }) {
  return (
    <div>
      <label htmlFor={id} className="form-label small text-muted mb-1">
        Sort by
      </label>
      <select
        id={id}
        className="form-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="default">Featured</option>
        <option value="low">Price: low to high</option>
        <option value="high">Price: high to low</option>
      </select>
    </div>
  );
}