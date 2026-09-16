import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";
import FormField from "../components/FormField.jsx";
import AuthBrandPanel from "../components/AuthBrandPanel.jsx";

export default function Login() {
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const returnTo = location.state?.from || "/";

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate(returnTo, { replace: true });
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-xl-10">
        <div className="auth-shell row g-0">
          <div className="col-lg-6 d-none d-lg-flex">
            <AuthBrandPanel />
          </div>

          <div className="col-12 col-lg-6 auth-form-panel">
            <div className="w-100 mx-auto" style={{ maxWidth: 400 }}>
              <h1 className="h4 mb-4">Welcome back</h1>
              <form onSubmit={handleSubmit} noValidate>
                <FormField id="login-email" label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" />
                <FormField id="login-password" label="Password" type="password" value={password} onChange={setPassword} autoComplete="current-password" />
                {error && <p className="text-danger small" role="alert">{error}</p>}
                <button type="submit" className="btn btn-primary w-100 btn-glow" disabled={submitting}>
                  {submitting ? "Logging in..." : "Log in"}
                </button>
              </form>
              <p className="text-center small mt-3 mb-0">
                New here? <Link to="/signup" state={{ from: returnTo }}>Sign up</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}