import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";
import FormField from "../components/FormField.jsx";
import AuthBrandPanel from "../components/AuthBrandPanel.jsx";

export default function Signup() {
  const { signup } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const returnTo = location.state?.from || "/";

  function validate() {
    const nextErrors = {};
    if (!name.trim()) nextErrors.name = "Name is required.";
    if (!email.trim()) nextErrors.email = "Email is required.";
    if (password.length < 6) nextErrors.password = "Password must be at least 6 characters.";
    if (confirm !== password) nextErrors.confirm = "Passwords do not match.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      await signup(name, email, password);
      navigate(returnTo, { replace: true });
    } catch {
      setFormError("Could not create account. The email may already be in use.");
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
              <h1 className="h4 mb-4">Create your account</h1>
              <form onSubmit={handleSubmit} noValidate>
                <FormField id="signup-name" label="Name" value={name} onChange={setName} error={errors.name} autoComplete="name" />
                <FormField id="signup-email" label="Email" type="email" value={email} onChange={setEmail} error={errors.email} autoComplete="email" />
                <FormField id="signup-password" label="Password" type="password" value={password} onChange={setPassword} error={errors.password} autoComplete="new-password" />
                <FormField id="signup-confirm" label="Confirm password" type="password" value={confirm} onChange={setConfirm} error={errors.confirm} autoComplete="new-password" />
                {formError && <p className="text-danger small" role="alert">{formError}</p>}
                <button type="submit" className="btn btn-primary w-100 btn-glow" disabled={submitting}>
                  {submitting ? "Creating account..." : "Create account"}
                </button>
              </form>
              <p className="text-center small mt-3 mb-0">
                Already registered? <Link to="/login" state={{ from: returnTo }}>Log in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}