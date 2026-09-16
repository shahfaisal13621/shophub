export default function FilterPanel({ categories, category, onCategoryChange, onReset }) {
  return (
    <div className="filter-panel">
      <p className="fw-semibold small text-uppercase text-muted mb-2">Category</p>
      <div className="d-flex flex-column gap-2 mb-3">
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="category"
            id="category-all"
            checked={category === ""}
            onChange={() => onCategoryChange("")}
          />
          <label className="form-check-label" htmlFor="category-all">
            All categories
          </label>
        </div>
        {categories.map((cat) => (
          <div className="form-check" key={cat}>
            <input
              className="form-check-input"
              type="radio"
              name="category"
              id={`category-${cat}`}
              checked={category === cat}
              onChange={() => onCategoryChange(cat)}
            />
            <label className="form-check-label text-capitalize" htmlFor={`category-${cat}`}>
              {cat}
            </label>
          </div>
        ))}
      </div>
      <button type="button" className="btn btn-outline-primary btn-sm w-100" onClick={onReset}>
        Reset filters
      </button>
    </div>
  );
}