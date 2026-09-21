import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const footerActions = [
  {
    label: "Gọi tư vấn",
    detail: "0393.79.79.89",
    href: "tel:0393797989",
    external: true,
  },
  {
    label: "Nhắn Zalo",
    detail: "Phản hồi trực tiếp",
    href: "https://zalo.me/0813797781",
    external: true,
    newTab: true,
  },
  {
    label: "Xem chi nhánh",
    detail: "3 điểm tại TP.HCM",
    href: "/#contact",
    external: true,
  },
  {
    label: "Bộ sưu tập",
    detail: "Chọn mẫu xe phù hợp",
    href: "/bo-suu-tap",
  },
];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M14 7l5 5-5 5" />
    </svg>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const updateBackToTop = () => setShowBackToTop(window.scrollY > 400);

    updateBackToTop();
    window.addEventListener("scroll", updateBackToTop, { passive: true });

    return () => window.removeEventListener("scroll", updateBackToTop);
  }, []);

  const scrollToTop = () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <footer className="siteFooter" aria-labelledby="footer-statement">
      <div className="siteFooter__inner container">
        <div className="siteFooter__lead">
          <div className="siteFooter__statementBlock">
            <h2 id="footer-statement" className="siteFooter__statement">
              Xe điện 3sGo
            </h2>

            <Link to="/" className="siteFooter__wordmark" aria-label="3sGo Xe Điện — Trang chủ">
              <small>Hỗ trợ nợ xấu</small>
            </Link>
          </div>

        </div>

        <nav className="siteFooter__actions" aria-label="Liên hệ và khám phá 3sGo">
          {footerActions.map((action) => {
            const content = (
              <>
                <span className="siteFooter__actionCopy">
                  <strong>{action.label}</strong>
                  <span className={action.label === "Gọi tư vấn" ? "tabular-nums" : undefined}>
                    {action.detail}
                  </span>
                </span>
                <ArrowIcon />
              </>
            );

            return action.external ? (
              <a
                key={action.label}
                className="siteFooter__action"
                href={action.href}
                target={action.newTab ? "_blank" : undefined}
                rel={action.newTab ? "noopener noreferrer" : undefined}
              >
                {content}
              </a>
            ) : (
              <Link key={action.label} className="siteFooter__action" to={action.href}>
                {content}
              </Link>
            );
          })}
        </nav>

        <div className="siteFooter__meta">
          <p>© {currentYear} 3sGo Xe Điện</p>
          <p>Quận 8 · Quận 12 · Phú Nhuận</p>
        </div>
      </div>

      <button
        type="button"
        className={`backToTop${showBackToTop ? " is-visible" : ""}`}
        aria-label="Lên đầu trang"
        title="Lên đầu trang"
        onClick={scrollToTop}
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="m6 14 6-6 6 6" />
        </svg>
      </button>
    </footer>
  );
}
