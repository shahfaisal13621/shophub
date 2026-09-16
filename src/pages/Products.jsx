import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import SearchBar from "../components/SearchBar.jsx";
import FilterPanel from "../components/FilterPanel.jsx";
import SortSelect from "../components/SortSelect.jsx";
import ProductGrid from "../components/ProductGrid.jsx";
import PageState from "../components/PageState.jsx";
import { getProducts } from "../services/products.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { useToast } from "../App.jsx";

const PAGE_SIZE = 24;

function SkeletonCard() {
    return (
        <div className="col-12 col-sm-6 col-lg-4 col-xl-3">
            <div className="card h-100 placeholder-glow">
                <div className="product-image placeholder"></div>
                <div className="card-body">
                    <span className="placeholder col-8 d-block mb-2"></span>
                    <span className="placeholder col-4 d-block"></span>
                </div>
            </div>
        </div>
    );
}

export default function Products() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [status, setStatus] = useState("loading");
    const [allProducts, setAllProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("default");
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const category = searchParams.get("category") || "";
    const { addItem } = useCart();
    const { toggle, savedIds } = useWishlist();
    const notify = useToast();

    function loadProducts(signal) {
        setStatus("loading");
        getProducts(signal)
            .then((products) => {
                setAllProducts(products);
                setStatus("ready");
            })
            .catch((error) => {
                if (error.name !== "AbortError") setStatus("error");
            });
    }

    useEffect(() => {
        const controller = new AbortController();
        loadProducts(controller.signal);
        return () => controller.abort();
    }, []);

    const categories = useMemo(() => {
        return Array.from(new Set(allProducts.map((p) => p.category))).sort();
    }, [allProducts]);

    const results = useMemo(() => {
        let list = allProducts;

        if (search.trim()) {
            const query = search.trim().toLowerCase();
            list = list.filter((p) => p.title.toLowerCase().includes(query));
        }
        if (category) {
            list = list.filter((p) => p.category === category);
        }

        const sorted = [...list];
        if (sort === "low") sorted.sort((a, b) => a.price - b.price);
        if (sort === "high") sorted.sort((a, b) => b.price - a.price);
        return sorted;
    }, [allProducts, search, category, sort]);

    useEffect(() => {
        setVisibleCount(PAGE_SIZE);
    }, [search, category, sort]);

    const visibleResults = results.slice(0, visibleCount);

    function handleCategoryChange(nextCategory) {
        setSearchParams(nextCategory ? { category: nextCategory } : {});
    }

    function handleReset() {
        setSearch("");
        setSort("default");
        setSearchParams({});
    }

    function handleAdd(product, qty) {
        addItem(product, qty);
        notify(`${product.title} added to cart.`);
    }

    function handleToggleWishlist(product) {
        const wasSaved = savedIds.includes(product.id);
        toggle(product);
        notify(wasSaved ? "Removed from wishlist." : "Saved to wishlist.");
    }

    return (
        <div>
            <h1 className="page-heading mb-4">Explore products</h1>
            <div className="row g-4">
                <div className="col-12 col-lg-3">
                    <button
                        type="button"
                        className="btn btn-outline-primary w-100 d-lg-none mb-3"
                        aria-expanded={filtersOpen}
                        aria-controls="products-filters"
                        onClick={() => setFiltersOpen((open) => !open)}
                    >
                        {filtersOpen ? "Hide filters" : "Filters & sort"}
                    </button>

                    <div
                        id="products-filters"
                        className={`flex-column gap-3 ${filtersOpen ? "d-flex" : "d-none"} d-lg-flex`}
                    >
                        <SearchBar value={search} onChange={setSearch} />
                        <SortSelect value={sort} onChange={setSort} />
                        <FilterPanel
                            categories={categories}
                            category={category}
                            onCategoryChange={handleCategoryChange}
                            onReset={handleReset}
                        />
                    </div>
                </div>

                <div className="col-12 col-lg-9">
                    {status === "ready" && (
                        <p className="text-muted small mb-3" aria-live="polite">
                            {results.length} result{results.length === 1 ? "" : "s"}
                        </p>
                    )}

                    {status === "loading" && (
                        <div className="row g-4" role="status" aria-busy="true" aria-live="polite">
                            <span className="visually-hidden">Loading products…</span>
                            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
                        </div>
                    )}

                    {status === "error" && (
                        <PageState status="error" message="Couldn't load products." onRetry={() => loadProducts()} />
                    )}

                    {status === "ready" && results.length === 0 && (
                        <PageState status="empty" message="No products match your filters." onRetry={handleReset} retryLabel="Reset filters" />
                    )}

                    {status === "ready" && results.length > 0 && (
                        <>
                            <ProductGrid products={visibleResults} savedIds={savedIds} onAdd={handleAdd} onToggleWishlist={handleToggleWishlist} />
                            {visibleCount < results.length && (
                                <div className="text-center mt-4">
                                    <button
                                        type="button"
                                        className="btn btn-outline-primary"
                                        onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                                    >
                                        Load more ({results.length - visibleCount} remaining)
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}