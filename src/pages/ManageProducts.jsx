import { useEffect, useState } from "react";
import { listManagedProducts, addManagedProduct, updateManagedProduct, deleteManagedProduct } from "../services/customProducts.jsx";
import FormField from "../components/FormField.jsx";
import { useToast } from "../App.jsx";

const EMPTY_FORM = { title: "", category: "originals", price: "", stock: "", rating: "4.5", description: "", thumbnail: "" };

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const notify = useToast();

  function load() {
    setStatus("loading");
    listManagedProducts()
      .then((list) => { setProducts(list); setStatus("ready"); })
      .catch(() => setStatus("error"));
  }

  useEffect(() => { load(); }, []);

  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function validate() {
    const nextErrors = {};
    if (!form.title.trim()) nextErrors.title = "Title is required.";
    if (!form.category.trim()) nextErrors.category = "Category is required.";
    if (!form.thumbnail.trim()) nextErrors.thumbnail = "Image URL is required.";
    const priceNum = Number(form.price);
    if (!form.price || Number.isNaN(priceNum) || priceNum <= 0) nextErrors.price = "Enter a valid price.";
    const stockNum = Number(form.stock);
    if (form.stock === "" || Number.isNaN(stockNum) || stockNum < 0 || !Number.isInteger(stockNum)) nextErrors.stock = "Enter a valid whole number.";
    const ratingNum = Number(form.rating);
    if (Number.isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) nextErrors.rating = "Rating must be 1-5.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setErrors({});
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const payload = {
      title: form.title.trim(),
      category: form.category.trim().toLowerCase(),
      price: Number(form.price),
      stock: Number(form.stock),
      rating: Number(form.rating),
      description: form.description.trim(),
      thumbnail: form.thumbnail.trim(),
      images: [form.thumbnail.trim()],
    };

    try {
      if (editingId) {
        await updateManagedProduct(editingId, payload);
        notify("Product updated.");
      } else {
        await addManagedProduct(payload);
        notify("Product added.");
      }
      resetForm();
      load();
    } catch {
      notify("Something went wrong saving this product.");
    } finally {
      setSubmitting(false);
    }
  }

  function startEdit(product) {
    setEditingId(product.id);
    setForm({
      title: product.title || "",
      category: product.category || "originals",
      price: String(product.price ?? ""),
      stock: String(product.stock ?? ""),
      rating: String(product.rating ?? "4.5"),
      description: product.description || "",
      thumbnail: product.thumbnail || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    if (!window.confirm("Remove this product? This can't be undone.")) return;
    try {
      await deleteManagedProduct(id);
      notify("Product removed.");
      if (editingId === id) resetForm();
      load();
    } catch {
      notify("Couldn't remove this product.");
    }
  }

  return (
    <div>
      <h1 className="page-heading mb-1">Manage products</h1>
      <p className="text-muted mb-4">Add, edit, or remove your own products. They'll show up across the site alongside the catalog.</p>

      <div className="row g-4">
        <div className="col-12 col-lg-5">
          <div className="section-card">
            <p className="section-card-heading">{editingId ? "Edit product" : "Add a new product"}</p>
            <form onSubmit={handleSubmit} noValidate>
              <FormField id="mp-title" label="Title" value={form.title} onChange={(v) => updateField("title", v)} error={errors.title} />
              <FormField id="mp-category" label="Category" value={form.category} onChange={(v) => updateField("category", v)} error={errors.category} />
              <div className="row">
                <div className="col-6">
                  <FormField id="mp-price" label="Price ($)" type="number" value={form.price} onChange={(v) => updateField("price", v)} error={errors.price} />
                </div>
                <div className="col-6">
                  <FormField id="mp-stock" label="Stock" type="number" value={form.stock} onChange={(v) => updateField("stock", v)} error={errors.stock} />
                </div>
              </div>
              <FormField id="mp-rating" label="Rating (1-5)" type="number" value={form.rating} onChange={(v) => updateField("rating", v)} error={errors.rating} />
              <FormField id="mp-thumbnail" label="Image URL" value={form.thumbnail} onChange={(v) => updateField("thumbnail", v)} error={errors.thumbnail} />
              <div className="mb-3">
                <label htmlFor="mp-description" className="form-label">Description</label>
                <textarea id="mp-description" className="form-control" rows={3} value={form.description} onChange={(e) => updateField("description", e.target.value)} />
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary btn-glow" disabled={submitting}>
                  {submitting ? "Saving..." : editingId ? "Save changes" : "Add product"}
                </button>
                {editingId && (
                  <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>Cancel</button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="col-12 col-lg-7">
          {status === "loading" && <p className="text-muted">Loading your products...</p>}
          {status === "error" && <p className="text-danger">Couldn't load your products.</p>}
          {status === "ready" && products.length === 0 && (
            <p className="text-muted">You haven't added any custom products yet.</p>
          )}
          {status === "ready" && products.length > 0 && (
            <div className="d-flex flex-column gap-3">
              {products.map((product) => (
                <div key={product.id} className="cart-item-row d-flex gap-3 align-items-center">
                  <img src={product.thumbnail} alt={product.title} className="cart-item-image" />
                  <div className="flex-grow-1">
                    <p className="fw-semibold mb-1">{product.title}</p>
                    <p className="text-muted small mb-0 text-capitalize">
                      {product.category} · ${Number(product.price).toFixed(2)} · Stock: {product.stock}
                    </p>
                  </div>
                  <div className="d-flex flex-column gap-2">
                    <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => startEdit(product)}>Edit</button>
                    <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(product.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}