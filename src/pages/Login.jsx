import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

export default function Login() {
  const { admin, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (admin) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/admin");
    } catch {
      setError("Email hoặc mật khẩu không đúng.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container login">
      <form className="login__form" onSubmit={handleSubmit}>
        <h1 className="login__title">Đăng nhập quản trị</h1>
        <p className="login__subtitle">Chỉ dành cho quản trị viên showroom.</p>

        <label className="login__field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
          />
        </label>

        <label className="login__field">
          <span>Mật khẩu</span>
          <span className="login__passwordControl">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              className="login__passwordToggle"
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              aria-pressed={showPassword}
              onClick={() => setShowPassword((visible) => !visible)}
            >
              {showPassword ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="m3 3 18 18" strokeLinecap="round" />
                  <path d="M10.6 10.7a2 2 0 0 0 2.7 2.7" strokeLinecap="round" />
                  <path d="M9.9 4.2A10.9 10.9 0 0 1 12 4c5.5 0 9 5.2 9 5.2a14.8 14.8 0 0 1-2.1 2.7M6.6 6.7A15.8 15.8 0 0 0 3 9.2s3.5 5.2 9 5.2c1.2 0 2.3-.2 3.3-.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M3 12s3.5-5.2 9-5.2S21 12 21 12s-3.5 5.2-9 5.2S3 12 3 12Z" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="2.2" />
                </svg>
              )}
            </button>
          </span>
        </label>

        {error && <p className="login__error" role="alert">{error}</p>}

        <button type="submit" className="login__submit" disabled={submitting}>
          {submitting ? "Đang đăng nhập…" : "Đăng nhập"}
        </button>
      </form>
    </div>
  );
}
