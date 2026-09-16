import { Link } from "react-router";
import { useWishlist } from "../context/WishlistContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useToast } from "../App.jsx";
import ProductGrid from "../components/ProductGrid.jsx";
import EmptyState from "../components/EmptyState.jsx";

export default function Wishlist() {
  const { wishlist, toggle } = useWishlist();
  const { addItem } = useCart();
  const notify = useToast();

  const savedIds = wishlist.map((item) => item.id);

   if (wishlist.length === 0) {
    return (
      <EmptyState
        icon="heart"
        title="Your wishlist is empty"
        message="Save products you love here so you can find them again later."
        actionLabel="Browse products"
        actionTo="/products"
      />
    );
  }

  function handleAdd(product, qty) {
    const success = addItem(product, qty);
    if (success) {
      toggle(product);
      notify(`${product.title} moved to cart.`);
    } else {
      notify("Couldn't move this item — it's already at full stock in your cart.");
    }
  }

  function handleToggleWishlist(product) {
    toggle(product);
    notify("Removed from wishlist.");
  }

  return (
    <div>
      <h1 className="page-heading mb-1">Your wishlist</h1>
      <p className="text-muted mb-4">{wishlist.length} saved product{wishlist.length === 1 ? "" : "s"}</p>
      <ProductGrid
        products={wishlist}
        savedIds={savedIds}
        onAdd={handleAdd}
        onToggleWishlist={handleToggleWishlist}
        addLabel="Move to cart"
      />
    </div>
  );
}