export default function Logo({ light = false }) {
  return (
    <span className="site-logo">
      <svg width="30" height="30" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id="logoGradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#5b8dff" />
            <stop offset="1" stopColor="#7c5cff" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="28" height="28" rx="9" fill="url(#logoGradient)" />
        <path d="M11 13V11.5C11 9.01472 13.0147 7 15.5 7H16.5C18.9853 7 21 9.01472 21 11.5V13" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
        <rect x="9" y="13" width="14" height="12" rx="3" fill="white" fillOpacity="0.16" stroke="white" strokeWidth="1.4" />
        <circle cx="13.2" cy="18.5" r="1.15" fill="white" />
        <circle cx="18.8" cy="18.5" r="1.15" fill="white" />
      </svg>
      <span className={`site-logo-text ${light ? "site-logo-text-light" : ""}`}>
        Shop<span className="site-logo-accent">Hub</span>
      </span>
    </span>
  );
}