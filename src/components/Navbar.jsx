import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import Logo from "./Logo.jsx";

function HeartIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
    </svg>
  );
}
function BagIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 8h12l-1 12H7L6 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20c1.5-3.5 4.5-5.5 7.5-5.5s6 2 7.5 5.5" />
    </svg>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { itemCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const { user, logout, isAdmin } = useAuth();

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 8);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function closeMenu() {
    setMenuOpen(false);
  }

  const proLinkClass = ({ isActive }) => "nav-link-pro" + (isActive ? " active" : "");
  const mobileLinkClass = ({ isActive }) => "mobile-nav-link" + (isActive ? " active" : "");

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="shop-container d-flex align-items-center justify-content-between py-3">
        <NavLink to="/" className="site-logo" onClick={closeMenu}>
          <Logo />
        </NavLink>

        <nav className="d-none d-lg-flex align-items-center gap-4">
          <NavLink to="/products" className={proLinkClass}>Shop</NavLink>
          <NavLink to="/wishlist" className={proLinkClass}>Wishlist</NavLink>
          {user && <NavLink to="/orders" className={proLinkClass}>Orders</NavLink>}
          {isAdmin && <NavLink to="/admin/products" className={proLinkClass}>Manage</NavLink>}
        </nav>

        <div className="d-none d-lg-flex align-items-center gap-2">
          <NavLink to="/wishlist" className="icon-btn" aria-label={`Wishlist${wishlistCount > 0 ? `, ${wishlistCount} items` : ""}`}>
            <HeartIcon />
            {wishlistCount > 0 && <span className="icon-badge">{wishlistCount}</span>}
          </NavLink>
          <NavLink to="/cart" className="icon-btn" aria-label={`Cart${itemCount > 0 ? `, ${itemCount} items` : ""}`}>
            <BagIcon />
            {itemCount > 0 && <span className="icon-badge">{itemCount}</span>}
          </NavLink>
          {user ? (
            <button type="button" className="btn btn-outline-primary btn-sm ms-2" onClick={logout}>
              Log out
            </button>
          ) : (
            <NavLink to="/login" className="icon-btn" aria-label="Account">
              <UserIcon />
            </NavLink>
          )}
        </div>

        <button
          type="button"
          className="icon-btn d-lg-none"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className={`hamburger-icon ${menuOpen ? "open" : ""}`}>
            <span /><span /><span />
          </span>
        </button>
      </div>

      {menuOpen && (
        <nav id="mobile-nav" className="d-lg-none border-top bg-white">
          <div className="shop-container d-flex flex-column py-2">
            <NavLink to="/products" className={mobileLinkClass} onClick={closeMenu}>
              <BagIcon /> Shop
            </NavLink>
            <NavLink to="/wishlist" className={mobileLinkClass} onClick={closeMenu}>
              <HeartIcon /> Wishlist{wishlistCount > 0 ? ` (${wishlistCount})` : ""}
            </NavLink>
            <NavLink to="/cart" className={mobileLinkClass} onClick={closeMenu}>
              <BagIcon /> Cart ({itemCount})
            </NavLink>
            {user ? (
              <>
                <NavLink to="/orders" className={mobileLinkClass} onClick={closeMenu}>
                  <UserIcon /> Orders
                </NavLink>
                {isAdmin && (
                  <NavLink to="/admin/products" className={mobileLinkClass} onClick={closeMenu}>
                    <UserIcon /> Manage products
                  </NavLink>
                )}
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm mt-3 align-self-start"
                  onClick={() => { logout(); closeMenu(); }}
                >
                  Log out
                </button>
              </>
            ) : (
              <NavLink to="/login" className={mobileLinkClass} onClick={closeMenu}>
                <UserIcon /> Account
              </NavLink>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}