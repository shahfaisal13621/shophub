import { useState, useCallback, useEffect, useRef, createContext, useContext } from "react";
import { Routes, Route, useLocation } from "react-router";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { WishlistProvider } from "./context/WishlistContext.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Toast from "./components/Toast.jsx";
import QuickViewModal from "./components/QuickViewModal.jsx";
import PageTransition from "./components/PageTransition.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Cart from "./pages/Cart.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Checkout from "./pages/Checkout.jsx";
import Orders from "./pages/Orders.jsx";
import ManageProducts from "./pages/ManageProducts.jsx";
import NotFound from "./pages/NotFound.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

const ToastContext = createContext(() => {});
export function useToast() {
  return useContext(ToastContext);
}

const QuickViewContext = createContext(() => {});
export function useQuickView() {
  return useContext(QuickViewContext);
}

const PAGE_TITLES = [
  { test: (p) => p === "/", title: "ShopHub – Home" },
  { test: (p) => p === "/products", title: "ShopHub – Shop" },
  { test: (p) => p.startsWith("/products/"), title: "ShopHub – Product details" },
  { test: (p) => p === "/cart", title: "ShopHub – Cart" },
  { test: (p) => p === "/wishlist", title: "ShopHub – Wishlist" },
  { test: (p) => p === "/login", title: "ShopHub – Log in" },
  { test: (p) => p === "/signup", title: "ShopHub – Sign up" },
  { test: (p) => p === "/checkout", title: "ShopHub – Checkout" },
  { test: (p) => p === "/orders", title: "ShopHub – Orders" },
  { test: (p) => p === "/admin/products", title: "ShopHub – Manage products" },
  { test: (p) => p === "/admin/dashboard", title: "ShopHub – Admin dashboard" },
];

function getPageTitle(pathname) {
  const match = PAGE_TITLES.find((entry) => entry.test(pathname));
  return match ? match.title : "ShopHub – Page not found";
}

export default function App() {
  const location = useLocation();
  const mainRef = useRef(null);

  const [toastMessage, setToastMessage] = useState("");
  const notify = useCallback((message) => setToastMessage(message), []);

  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const openQuickView = useCallback((product) => setQuickViewProduct(product), []);
  const closeQuickView = useCallback(() => setQuickViewProduct(null), []);

  useEffect(() => {
    document.title = getPageTitle(location.pathname);
    mainRef.current?.focus();
  }, [location.pathname]);

  return (
    <ToastContext.Provider value={notify}>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <QuickViewContext.Provider value={openQuickView}>
              <div className="shop-shell">
                <a href="#main-content" className="visually-hidden-focusable skip-link">
                  Skip to main content
                </a>
                <Navbar />
                <main id="main-content" tabIndex={-1} ref={mainRef}>
                  <div className="shop-container shop-section">
                    <ErrorBoundary key={location.pathname}>
                      <AnimatePresence mode="wait" initial={false}>
                        <Routes location={location} key={location.pathname}>
                          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
                          <Route path="/products" element={<PageTransition><Products /></PageTransition>} />
                          <Route path="/products/:id" element={<PageTransition><ProductDetails /></PageTransition>} />
                          <Route path="/cart" element={<PageTransition><Cart /></PageTransition>} />
                          <Route path="/wishlist" element={<PageTransition><Wishlist /></PageTransition>} />
                          <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
                          <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
                          <Route path="/checkout" element={<ProtectedRoute><PageTransition><Checkout /></PageTransition></ProtectedRoute>} />
                          <Route path="/orders" element={<ProtectedRoute><PageTransition><Orders /></PageTransition></ProtectedRoute>} />
                          <Route path="/admin/products" element={<AdminRoute><PageTransition><ManageProducts /></PageTransition></AdminRoute>} />
                          <Route path="/admin/dashboard" element={<AdminRoute><PageTransition><AdminDashboard /></PageTransition></AdminRoute>} />
                          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
                        </Routes>
                      </AnimatePresence>
                    </ErrorBoundary>
                  </div>
                </main>
                <Footer />
              </div>
              <QuickViewModal product={quickViewProduct} onClose={closeQuickView} />
            </QuickViewContext.Provider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
      <Toast message={toastMessage} onDismiss={() => setToastMessage("")} />
    </ToastContext.Provider>
  );
}