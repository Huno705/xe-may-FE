import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSearch } from "../context/SearchContext";
import "./Navbar.css";

export default function Navbar() {
  const { admin, logout } = useAuth();
  const { query, setQuery } = useSearch();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMenuOpen(false);
  }, []);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const trimmed = query.trim();
    setQuery(trimmed);
    setMenuOpen(false);
    if (trimmed) {
      navigate(`/bo-suu-tap?q=${encodeURIComponent(trimmed)}`);
    } else {
      navigate("/bo-suu-tap");
    }
  };

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

        <form className="navbar__search" onSubmit={handleSearchSubmit}>
          <input
            type="search"
            className="navbar__searchInput"
            placeholder="Tìm kiếm xe..."
            aria-label="Tìm kiếm xe"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
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
              <NavLink to="/admin" className="navbar__action navbar__action--ghost" aria-label="Trang quản trị">
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

        <button
          type="button"
          className={`navbar__burger ${menuOpen ? "is-open" : ""}`}
          aria-label="Mở menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <div className={`navbar__drawer ${menuOpen ? "is-open" : ""}`}>
        <form className="navbar__drawerSearch" onSubmit={handleSearchSubmit}>
          <input
            type="search"
            placeholder="Tìm kiếm xe..."
            aria-label="Tìm kiếm xe"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" aria-label="Tìm kiếm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
          </button>
        </form>
        <ul className="navbar__drawerList" onClick={() => setMenuOpen(false)}>
          <li><NavLink to="/" end>TRANG CHỦ</NavLink></li>
          <li><NavLink to="/bo-suu-tap">BỘ SƯU TẬP</NavLink></li>
          <li><a href="#about">GIỚI THIỆU</a></li>
          <li><a href="#contact">LIÊN HỆ</a></li>
          <li><a href="#compare">SO SÁNH</a></li>
          <li><a href="#news">TIN TỨC</a></li>
          {admin ? (
            <>
              <li><NavLink to="/admin">TRANG QUẢN TRỊ</NavLink></li>
              <li><button type="button" onClick={logout}>ĐĂNG XUẤT</button></li>
            </>
          ) : (
            <li><Link to="/login">ĐĂNG NHẬP</Link></li>
          )}
        </ul>
      </div>
    </nav>
  );
}