import Logo from "./Logo.jsx";

export default function AuthBrandPanel() {
  return (
    <div className="auth-brand-panel h-100">
      <Logo light />
      <div>
        <h2 className="auth-brand-heading mt-4">Your next find starts here.</h2>
        <p className="auth-brand-sub mb-0">Save favourites. Track orders.</p>

        <ul className="auth-feature-list">
          <li className="auth-feature-item">
            <span className="auth-feature-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
              </svg>
            </span>
            Save products to your wishlist
          </li>
          <li className="auth-feature-item">
            <span className="auth-feature-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 8h12l-1 12H7L6 8Z" />
                <path d="M9 8V6a3 3 0 0 1 6 0v2" />
              </svg>
            </span>
            Track every order in one place
          </li>
          <li className="auth-feature-item">
            <span className="auth-feature-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" />
              </svg>
            </span>
            Your data stays private and secure
          </li>
        </ul>
      </div>

      <p className="text-white-50 small mb-0">© {new Date().getFullYear()} ShopHub</p>
    </div>
  );
}