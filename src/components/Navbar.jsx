import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSearch } from "../context/SearchContext";
import { STORE_LOCATIONS } from "../data/storeLocations";
import logo3sgo from "../assets/3sgo-logo.png";
import "./Navbar.css";

const NAV_ITEMS = [
  { to: "/", label: "Trang chủ", end: true },
  { to: "/bo-suu-tap", label: "Bộ sưu tập" },
  { section: "about", label: "Giới thiệu" },
  { section: "contact", label: "Liên hệ" },
  { section: "payment", label: "Chính sách trả góp" },
  { section: "news", label: "Tin tức" },
];

const HEADER_BRANCHES = ["quan-12", "quan-8", "phu-nhuan"].map((id) => {
  const store = STORE_LOCATIONS.find((store) => store.id === id);
  return id === "phu-nhuan"
    ? { ...store, address: "328 Luỹ Bán Bích, Tân Phú, TP.HCM" }
    : store;
});

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export default function Navbar() {
  const { admin, logout } = useAuth();
  const { query, setQuery } = useSearch();
  const [menuOpen, setMenuOpen] = useState(false);
  const mastheadRef = useRef(null);
  const navRef = useRef(null);
  const burgerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);

    if (!location.hash) return undefined;

    const frame = window.requestAnimationFrame(() => {
      const target = document.getElementById(location.hash.slice(1));
      if (target) {
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        target.scrollIntoView({ block: "start", behavior: reduceMotion ? "instant" : "smooth" });
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [location.key, location.hash]);

  // Keep floating branch details below the actual nav, including while scrolling.
  useEffect(() => {
    const root = document.documentElement;
    const previousHeight = root.style.getPropertyValue("--site-nav-height");
    const previousBottom = root.style.getPropertyValue("--site-nav-bottom");
    let frame = null;

    const updatePosition = () => {
      frame = null;
      const rect = navRef.current.getBoundingClientRect();
      root.style.setProperty("--site-nav-height", `${rect.height}px`);
      root.style.setProperty("--site-nav-bottom", `${Math.max(rect.height, rect.bottom)}px`);
    };

    const scheduleUpdate = () => {
      if (frame === null) frame = window.requestAnimationFrame(updatePosition);
    };

    const observer = new ResizeObserver(scheduleUpdate);
    observer.observe(mastheadRef.current);
    observer.observe(navRef.current);
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    updatePosition();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frame !== null) window.cancelAnimationFrame(frame);
      if (previousHeight) root.style.setProperty("--site-nav-height", previousHeight);
      else root.style.removeProperty("--site-nav-height");
      if (previousBottom) root.style.setProperty("--site-nav-bottom", previousBottom);
      else root.style.removeProperty("--site-nav-bottom");
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        burgerRef.current?.focus();
      }
    };
    const handlePointerDown = (event) => {
      if (!navRef.current?.contains(event.target)) setMenuOpen(false);
    };
    const desktop = window.matchMedia("(min-width: 68rem)");
    const handleDesktop = () => {
      if (desktop.matches) setMenuOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    desktop.addEventListener("change", handleDesktop);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
      desktop.removeEventListener("change", handleDesktop);
    };
  }, [menuOpen]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const trimmed = query.trim();
    setQuery(trimmed);
    setMenuOpen(false);
    navigate(trimmed ? `/bo-suu-tap?q=${encodeURIComponent(trimmed)}` : "/bo-suu-tap");
  };

  const renderMenuItems = () => NAV_ITEMS.map((item) => {
    if (item.section) {
      const path = item.section === "contact" && location.pathname === "/bo-suu-tap"
        ? "/bo-suu-tap"
        : "/";
      const active = location.pathname === path && location.hash === `#${item.section}`;
      return (
        <li key={item.section}>
          <Link
            to={`${path}#${item.section}`}
            className={`navbar__menuLink${active ? " is-active" : ""}`}
            aria-current={active ? "location" : undefined}
            onClick={() => setMenuOpen(false)}
          >
            {item.label}
          </Link>
        </li>
      );
    }
    return (
      <li key={item.to}>
        <NavLink
          to={item.to}
          end={item.end}
          aria-current={location.hash ? false : "page"}
          className={({ isActive }) =>
            `navbar__menuLink${isActive && !location.hash ? " is-active" : ""}`}
          onClick={() => setMenuOpen(false)}
        >
          {item.label}
        </NavLink>
      </li>
    );
  });

  return (
    <>
      <header className="siteMasthead" ref={mastheadRef}>
        <div className="siteMasthead__inner container">
          <Link to="/" className="siteMasthead__brand" aria-label="3sGo Xe Điện — Trang chủ">
            <img src={logo3sgo} alt="3SGO Xe Điện" width="112" height="112" />
          </Link>

          <div className="siteMasthead__info">
            <p className="siteMasthead__title">Hệ thống xe điện 3sGo</p>
            <ul
              id="navbar-branches"
              className="siteMasthead__branches"
              aria-label="Địa chỉ ba chi nhánh"
            >
              {HEADER_BRANCHES.map((store) => (
                <li key={store.id}>
                  <a
                    className="siteMasthead__branch"
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${store.name}, ${store.address}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Xem bản đồ ${store.shortName}: ${store.address}`}
                  >
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                      <circle cx="12" cy="10" r="2.5" />
                    </svg>
                    <span className="siteMasthead__branchCopy">
                      <strong>{store.shortName.replace("Chi nhánh ", "")}</strong>
                      <span>
                        {store.address.replace(" 700000", "").replace(", Việt Nam", "").replace("Hồ Chí Minh", "TP.HCM")}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="siteMasthead__support">
            <span className="siteMasthead__supportLabel">Hotline tư vấn</span>
            <a className="siteMasthead__hotline" href="tel:0393797989">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="m7 3 3 5-2 2a14 14 0 0 0 6 6l2-2 5 3v3a1 1 0 0 1-1 1C10.6 21 3 13.4 3 4a1 1 0 0 1 1-1Z" />
              </svg>
              <span>0393.79.79.89</span>
            </a>
            <span className="siteMasthead__website">xedien3sgo.com</span>
            {admin && (
              <div className="siteMasthead__account">
                <Link to="/admin">Quản trị</Link>
                <button type="button" onClick={logout}>Đăng xuất</button>
              </div>
            )}
          </div>
        </div>
      </header>

      <nav className="navbar" aria-label="Điều hướng chính" ref={navRef}>
        <div className="navbar__inner container">
          <button
            ref={burgerRef}
            type="button"
            className={`navbar__burger${menuOpen ? " is-open" : ""}`}
            aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
            aria-controls="navbar-mobile-menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </button>

          <ul className="navbar__menu">{renderMenuItems()}</ul>

          <form className="navbar__search" role="search" onSubmit={handleSearchSubmit}>
            <label className="sr-only" htmlFor="navbar-search">Tìm kiếm xe</label>
            <input
              id="navbar-search"
              name="q"
              type="search"
              className="navbar__searchInput"
              placeholder="Tìm kiếm xe…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <button type="submit" className="navbar__searchBtn" aria-label="Tìm kiếm">
              <SearchIcon />
            </button>
          </form>
        </div>

        <div id="navbar-mobile-menu" className="navbar__drawer" hidden={!menuOpen}>
          <ul className="navbar__drawerList container">
            {renderMenuItems()}
            {admin ? (
              <>
                <li><Link className="navbar__menuLink" to="/admin" onClick={() => setMenuOpen(false)}>Trang quản trị</Link></li>
                <li>
                  <button className="navbar__menuLink" type="button" onClick={() => { setMenuOpen(false); logout(); }}>
                    Đăng xuất
                  </button>
                </li>
              </>
            ) : (
              <li><Link className="navbar__menuLink" to="/login" onClick={() => setMenuOpen(false)}>Đăng nhập</Link></li>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
}
