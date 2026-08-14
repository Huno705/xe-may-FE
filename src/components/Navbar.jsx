import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { admin, logout } = useAuth();

  return (
    <nav className="nav-pill" aria-label="Điều hướng chính">
      <Link to="/" className="nav-pill__brand">
        <span className="nav-pill__mark" aria-hidden="true" />
        3sgo
      </Link>

      <ul className="nav-pill__links">
        <li>
          <NavLink to="/" end className="nav-pill__link">
            Bộ sưu tập
          </NavLink>
        </li>
      </ul>

      {admin ? (
        <div className="nav-pill__admin">
          <NavLink to="/admin" className="nav-pill__link">
            Quản lý
          </NavLink>
          <button type="button" className="nav-pill__logout" onClick={logout}>
            Đăng xuất
          </button>
        </div>
      ) : (
        <Link to="/login" className="nav-pill__cta">
          Đăng nhập
        </Link>
      )}
    </nav>
  );
}
