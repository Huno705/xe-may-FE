import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { admin, checking } = useAuth();

  if (checking) {
    return <div className="container" style={{ paddingTop: "8rem" }}>Đang kiểm tra đăng nhập…</div>;
  }

  if (!admin) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
