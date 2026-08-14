import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { admin, logout } = useAuth();

  return (
    <nav className="navbar" aria-label="Điều hướng chính">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand">
          <span className="navbar__brandIcon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" strokeLinecap="round" />
            </svg>
          </span>
          <span className="navbar__brandText">
            3sGo<span className="navbar__brandDot">.</span>
          </span>
        </Link>

        <ul className="navbar__menu">
          <li>
            <NavLink to="/" end className="navbar__menuLink">
              TRANG CHỦ
            </NavLink>
          </li>
          <li>
            <NavLink to="/bo-suu-tap" className="navbar__menuLink">
              BỘ SƯU TẬP
            </NavLink>
          </li>
          <li>
            <a href="#about" className="navbar__menuLink">
              GIỚI THIỆU
            </a>
          </li>
          <li>
            <a href="#contact" className="navbar__menuLink">
              LIÊN HỆ
            </a>
          </li>
          <li>
            <a href="#compare" className="navbar__menuLink">
              SO SÁNH
            </a>
          </li>
          <li>
            <a href="#news" className="navbar__menuLink">
              TIN TỨC
            </a>
          </li>
        </ul>

        <form className="navbar__search" onSubmit={(e) => e.preventDefault()}>
          <input
            type="search"
            className="navbar__searchInput"
            placeholder="Tìm kiếm xe..."
            aria-label="Tìm kiếm xe"
          />
          <button type="submit" className="navbar__searchBtn" aria-label="Tìm kiếm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
          </button>
        </form>

        <div className="navbar__actions">
          {admin ? (
            <>
              <NavLink to="/admin" className="navbar__action navbar__action--ghost">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 3h7v7H3zM14 3h7v4h-7zM14 11h7v10h-7zM3 14h7v7H3z" />
                </svg>
              </NavLink>
              <button type="button" className="navbar__action navbar__action--primary" onClick={logout}>
                Đăng xuất
              </button>
            </>
          ) : (
            <Link to="/login" className="navbar__action navbar__action--primary">
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}