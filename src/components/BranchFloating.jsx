import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getBranches } from "../api/branches";
import { useBranchFilter } from "../context/BranchContext";
import "./BranchFloating.css";

const ZaloIcon = () => (
  <svg viewBox="0 0 40 40" aria-hidden="true">
    <circle cx="20" cy="20" r="20" fill="#0068FF" />
    <path
      d="M20 8C12.82 8 7 13.05 7 19.3c0 3.6 1.95 6.8 5 8.85l-1.05 4.05 4.55-2.35c1.4.4 2.9.6 4.5.6 7.18 0 13-5.05 13-11.3C33 13.05 27.18 8 20 8Z"
      fill="#fff"
    />
    <text
      x="20"
      y="23"
      textAnchor="middle"
      fontFamily="Inter, sans-serif"
      fontWeight="700"
      fontSize="9"
      fill="#0068FF"
    >
      Zalo
    </text>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 40 40" aria-hidden="true">
    <circle cx="20" cy="20" r="20" fill="#1877F2" />
    <path
      d="M22.5 32v-9h3l.5-4h-3.5v-2.5c0-1.1.4-1.8 1.9-1.8H26V11.2c-.4-.05-1.5-.2-2.8-.2-2.8 0-4.7 1.7-4.7 4.8V19h-3v4h3v9h4Z"
      fill="#fff"
    />
  </svg>
);

const FALLBACK_DETAILS = {
  "Quận 12": {
    phone: "0813.79.77.81",
    phoneRaw: "0813797781",
    zalo: "https://zalo.me/0813797781",
    facebookName: "Xe Điện 3sGo Quận 12 - Hỗ Trợ Nậu Xớ",
    facebookUrl: "https://www.facebook.com/share/19HKvSsEE4/?mibextid=wwXIfr",
    subtitle: "Xe Điện Lướt - Quận 12",
  },
  "Quận 8": {
    phone: "0786.79.79.89",
    phoneRaw: "0786797989",
    zalo: "https://zalo.me/0325678300",
    facebookName: "Xe Điện 3sGo Quận 8 - Hỗ Trợ Nậu Xớ",
    facebookUrl: "https://www.facebook.com/share/185KY6Hux9/?mibextid=wwXIfr",
    subtitle: "Xe Điện Lướt - Quận 8",
  },
};

export default function BranchFloating() {
  const { pathname } = useLocation();
  const { selectedBranch } = useBranchFilter();
  const [branches, setBranches] = useState([]);
  const showAtMobilePageEnd =
    pathname === "/" ||
    pathname === "/bo-suu-tap" ||
    pathname.startsWith("/xe/");

  useEffect(() => {
    getBranches().then(setBranches).catch(() => setBranches([]));
  }, []);

  const visibleBranches =
    selectedBranch === null
      ? branches
      : branches.filter((b) => b.id === selectedBranch);

  if (visibleBranches.length === 0) return null;

  return (
    <aside
      className={`branchFloat${showAtMobilePageEnd ? " branchFloat--mobile-page" : ""}`}
      aria-label="Thông tin chi nhánh"
    >
      {visibleBranches.map((branch) => {
        const details = FALLBACK_DETAILS[branch.name] || {};
        const subtitle = details.subtitle || branch.name;
        return (
          <article key={branch.id} className="branchFloat__card">
            <h3 className="branchFloat__title">
              <span>{subtitle}</span>
            </h3>

            <ul className="branchFloat__list">
              {details.phone && (
                <li className="branchFloat__row">
                  <span className="branchFloat__label">SĐT:</span>
                  <a
                    className="branchFloat__value branchFloat__link"
                    href={`tel:${details.phoneRaw || details.phone}`}
                  >
                    {details.phone}
                  </a>
                </li>
              )}

              {details.zalo && (
                <li className="branchFloat__row">
                  <span className="branchFloat__label">Zalo:</span>
                  <a
                    className="branchFloat__zalo"
                    href={details.zalo}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Zalo ${branch.name}`}
                  >
                    <ZaloIcon />
                  </a>
                </li>
              )}

              {details.facebookName && (
                <li className="branchFloat__row">
                  <span className="branchFloat__label">Facebook:</span>
                  <span className="branchFloat__value">{details.facebookName}</span>
                </li>
              )}

              {details.facebookUrl && (
                <li className="branchFloat__row">
                  <span className="branchFloat__label">Link:</span>
                  <a
                    className="branchFloat__facebook"
                    href={details.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Facebook ${branch.name}`}
                  >
                    <FacebookIcon />
                  </a>
                </li>
              )}
            </ul>
          </article>
        );
      })}
    </aside>
  );
}
