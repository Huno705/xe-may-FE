import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

export default function Login() {
  const { admin, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </label>

        {error && <p className="login__error" role="alert">{error}</p>}

        <button type="submit" className="login__submit" disabled={submitting}>
          {submitting ? "Đang đăng nhập…" : "Đăng nhập"}
        </button>
      </form>
    </div>
  );
}
