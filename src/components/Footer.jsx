import { Link } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";
import Logo from "./Logo.jsx";

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

const SOCIAL_LINKS = [
  {
    label: "GitHub",
    href: "https://github.com/shahfaisal13621",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.58 2 12.19c0 4.49 2.87 8.3 6.84 9.64.5.1.68-.22.68-.49 0-.24-.01-1.04-.01-1.89-2.78.61-3.37-1.21-3.37-1.21-.45-1.18-1.11-1.49-1.11-1.49-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.55 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.36-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.73 0 0 .84-.27 2.75 1.05a9.29 9.29 0 0 1 5 0c1.91-1.32 2.75-1.05 2.75-1.05.55 1.42.2 2.47.1 2.73.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.8-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.19C22 6.58 17.52 2 12 2Z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/shahfaisal-datascience",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.6v1.7h.05c.5-.94 1.72-1.94 3.55-1.94 3.8 0 4.5 2.5 4.5 5.75V21h-4v-5.9c0-1.4-.03-3.2-1.95-3.2-1.96 0-2.26 1.53-2.26 3.1V21h-4V9Z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com/btw_faisal1",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: "mailto:shahfaisal@gmail.com",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 6-10 7L2 6" />
      </svg>
    ),
  },
];

export default function Footer() {
  const { user } = useAuth();

  return (
    <footer className="site-footer">
      <div className="shop-container footer-top">
        <div className="row g-4">
          <div className="col-12 col-md-4">
            <Link to="/" className="site-logo mb-3 d-inline-flex">
              <Logo light />
            </Link>
            <p className="footer-tagline mt-2">
              Everyday products, one simple store — built as a student showcase project with a techy edge.
            </p>
            <div className="social-row">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target={social.label === "Email" ? undefined : "_blank"}
                  rel={social.label === "Email" ? undefined : "noopener noreferrer"}
                  className="social-icon-btn"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="col-6 col-md-2">
            <p className="footer-heading">Shop</p>
            <ul className="footer-link-list">
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/products" className="footer-link">All products</Link></li>
              <li><Link to="/wishlist" className="footer-link">Wishlist</Link></li>
              <li><Link to="/cart" className="footer-link">Cart</Link></li>
            </ul>
          </div>

          <div className="col-6 col-md-2">
            <p className="footer-heading">Account</p>
            <ul className="footer-link-list">
              {user ? (
                <li><Link to="/orders" className="footer-link">Your orders</Link></li>
              ) : (
                <>
                  <li><Link to="/login" className="footer-link">Log in</Link></li>
                  <li><Link to="/signup" className="footer-link">Sign up</Link></li>
                </>
              )}
              <li><Link to="/checkout" className="footer-link">Checkout</Link></li>
            </ul>
          </div>

          <div className="col-12 col-md-4">
            <p className="footer-heading">About this build</p>
            <p className="footer-tagline">
              A demo checkout — no real payment is collected. Product data via DummyJSON.
            </p>
            <button type="button" className="back-to-top mt-3" onClick={scrollToTop}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
              Back to top
            </button>
          </div>
        </div>
      </div>

      <div className="shop-container footer-bottom">
        <span>© {new Date().getFullYear()} ShopHub. Built by Faisal — student project, not a real store.</span>
        <span className="footer-stack-badge">
          Built with
          <span>React</span>
          <span>Firebase</span>
          <span>Bootstrap</span>
        </span>
      </div>
    </footer>
  );
}