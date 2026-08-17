import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getMotorcycles } from "../api/motorcycles";
import { getBranches } from "../api/branches";
import { useBranchFilter } from "../context/BranchContext";
import { useSearch } from "../context/SearchContext";
import MotorcycleCard from "../components/MotorcycleCard";
import ContactInfo from "../components/ContactInfo";
import "./Home.css";

const PAGE_SIZE = 15;

export default function Collection() {
  const [motorcycles, setMotorcycles] = useState([]);
  const [branches, setBranches] = useState([]);
  const [status, setStatus] = useState("loading");
  const { selectedBranch, setSelectedBranch } = useBranchFilter();
  const { query, setQuery } = useSearch();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    Promise.all([getMotorcycles(), getBranches()])
      .then(([motoData, branchData]) => {
        setMotorcycles(motoData);
        setBranches(branchData);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  useEffect(() => {
    const urlQuery = searchParams.get("q") || "";
    if (urlQuery !== query) {
      setQuery(urlQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    const urlQuery = searchParams.get("q") || "";
    if (query !== urlQuery) {
      const next = new URLSearchParams(searchParams);
      if (query) next.set("q", query);
      else next.delete("q");
      setSearchParams(next, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const handleClearSearch = () => {
    setQuery("");
  };

  const normalizedQuery = query.trim().toLowerCase();

  const filteredMotorcycles = useMemo(() => {
    return motorcycles.filter((m) => {
      if (selectedBranch !== null && m.branch_id !== selectedBranch) {
        return false;
      }
      if (normalizedQuery) {
        const haystack = `${m.name || ""} ${m.description || ""}`.toLowerCase();
        if (!haystack.includes(normalizedQuery)) return false;
      }
      return true;
    });
  }, [motorcycles, selectedBranch, normalizedQuery]);

  const hasFilter = selectedBranch !== null || normalizedQuery.length > 0;

  const totalPages = Math.max(1, Math.ceil(filteredMotorcycles.length / PAGE_SIZE));
  const initialPage = (() => {
    const raw = parseInt(searchParams.get("page") || "1", 10);
    if (Number.isNaN(raw) || raw < 1) return 1;
    return raw;
  })();
  const [currentPage, setCurrentPage] = useState(initialPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedBranch, normalizedQuery]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    const pageParam = parseInt(searchParams.get("page") || "1", 10);
    if (!Number.isNaN(pageParam) && pageParam !== currentPage) {
      const next = new URLSearchParams(searchParams);
      if (currentPage > 1) next.set("page", String(currentPage));
      else next.delete("page");
      setSearchParams(next, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const paginatedMotorcycles = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredMotorcycles.slice(start, start + PAGE_SIZE);
  }, [filteredMotorcycles, currentPage]);

  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages) return;
    setCurrentPage(nextPage);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getPageNumbers = () => {
    const pages = new Set([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);
    const result = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);
    const withEllipsis = [];
    for (let i = 0; i < result.length; i++) {
      if (i > 0 && result[i] - result[i - 1] > 1) withEllipsis.push("...");
      withEllipsis.push(result[i]);
    }
    return withEllipsis;
  };

  return (
    <div className="container home">
      <ContactInfo />

      <div className="home__headerSection">
        <header className="home__header">
          <p className="home__eyebrow mono">Showroom · toàn bộ xe hiện có</p>
          <h1 className="home__title">Bộ sưu tập</h1>
        </header>

        {branches.length > 0 && (
          <div className="home__branchTabsContainer">
            <div className="home__branchTabs">
              <button
                type="button"
                className={`home__branchTab ${selectedBranch === null ? "is-active" : ""}`}
                onClick={() => setSelectedBranch(null)}
              >
                Tất cả
              </button>
              {branches.map((branch) => (
                <button
                  key={branch.id}
                  type="button"
                  className={`home__branchTab ${selectedBranch === branch.id ? "is-active" : ""}`}
                  onClick={() => setSelectedBranch(branch.id)}
                >
                  {branch.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {normalizedQuery && (
          <div className="home__searchBadge" role="status">
            <span>
              Kết quả cho: <strong>"{query}"</strong>
            </span>
            <button type="button" onClick={handleClearSearch} aria-label="Xoá từ khoá">
              ×
            </button>
          </div>
        )}
      </div>

      {status === "loading" && (
        <p className="home__state">Đang tải danh sách xe…</p>
      )}

      {status === "error" && (
        <p className="home__state home__state--error">
          Không thể tải danh sách xe. Vui lòng thử lại sau.
        </p>
      )}

      {status === "ready" && filteredMotorcycles.length === 0 && (
        <p className="home__state">
          {hasFilter
            ? "Không tìm thấy xe phù hợp với bộ lọc hiện tại."
            : "Hiện chưa có xe nào được trưng bày."}
        </p>
      )}

      {status === "ready" && filteredMotorcycles.length > 0 && (
        <>
          <div className="home__resultMeta">
            Hiển thị <strong>{paginatedMotorcycles.length}</strong> / {filteredMotorcycles.length} xe
            {totalPages > 1 && (
              <span className="home__resultMetaPage">
                · Trang {currentPage} / {totalPages}
              </span>
            )}
          </div>

          <div className="moto-grid">
            {paginatedMotorcycles.map((moto) => (
              <MotorcycleCard key={moto.id} motorcycle={moto} />
            ))}
          </div>

          {totalPages > 1 && (
            <nav className="pagination" aria-label="Phân trang">
              <button
                type="button"
                className="pagination__btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Trang trước"
              >
                ‹
              </button>
              {getPageNumbers().map((item, index) =>
                item === "..." ? (
                  <span key={`ellipsis-${index}`} className="pagination__ellipsis">
                    …
                  </span>
                ) : (
                  <button
                    key={item}
                    type="button"
                    className={`pagination__btn ${item === currentPage ? "is-active" : ""}`}
                    onClick={() => handlePageChange(item)}
                    aria-current={item === currentPage ? "page" : undefined}
                  >
                    {item}
                  </button>
                )
              )}
              <button
                type="button"
                className="pagination__btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Trang sau"
              >
                ›
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  );
}