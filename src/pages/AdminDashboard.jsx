import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getMotorcycles, deleteMotorcycle } from "../api/motorcycles";
import { getBranches, createBranch, deleteBranch } from "../api/branches";
import { formatPrice } from "../utils/format";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [motorcycles, setMotorcycles] = useState([]);
  const [branches, setBranches] = useState([]);
  const [status, setStatus] = useState("loading");
  const [deletingId, setDeletingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [newBranchName, setNewBranchName] = useState("");
  const [addingBranch, setAddingBranch] = useState(false);
  const [branchError, setBranchError] = useState("");
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBranchId, setSelectedBranchId] = useState("");

  const load = () => {
    setStatus("loading");
    Promise.all([getMotorcycles(), getBranches()])
      .then(([motoData, branchData]) => {
        setMotorcycles(motoData);
        setBranches(branchData);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteMotorcycle(id);
      setMotorcycles((prev) => prev.filter((m) => m.id !== id));
    } catch {
      // no-op: keep the item visible so the admin can retry
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  const handleAddBranch = async (e) => {
    e.preventDefault();
    if (!newBranchName.trim()) return;

    setAddingBranch(true);
    setBranchError("");
    try {
      const newBranch = await createBranch(newBranchName.trim());
      setBranches((prev) => [...prev, newBranch].sort((a, b) => a.name.localeCompare(b.name)));
      setNewBranchName("");
    } catch (err) {
      setBranchError(err.response?.data?.error || "Không thể thêm chi nhánh.");
    } finally {
      setAddingBranch(false);
    }
  };

  const handleDeleteBranch = async (id) => {
    try {
      await deleteBranch(id);
      setBranches((prev) => prev.filter((b) => b.id !== id));
      setSelectedBranchId((current) => (current === id ? "" : current));
      setConfirmId(null);
    } catch {
      // ignore
    }
  };

  const openBranchModal = () => {
    setShowBranchModal(true);
    document.body.style.overflow = "hidden";
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredMotorcycles = useMemo(() => {
    return motorcycles.filter((m) => {
      const matchesBranch = selectedBranchId === ""
        || (selectedBranchId === "unassigned" ? !m.branch_id : m.branch_id === selectedBranchId);

      if (!matchesBranch) return false;
      if (!normalizedQuery) return true;

      const name = (m.name || "").toLowerCase();
      const description = (m.description || "").toLowerCase();
      const branchName = (m.branches?.name || "").toLowerCase();
      return (
        name.includes(normalizedQuery) ||
        description.includes(normalizedQuery) ||
        branchName.includes(normalizedQuery)
      );
    });
  }, [motorcycles, normalizedQuery, selectedBranchId]);

  const selectedBranchName = selectedBranchId === "unassigned"
    ? "Chưa phân chi nhánh"
    : branches.find((branch) => branch.id === selectedBranchId)?.name;

  const clearSearch = () => setSearchQuery("");

  const closeBranchModal = () => {
    setShowBranchModal(false);
    setConfirmId(null);
    setNewBranchName("");
    setBranchError("");
    document.body.style.overflow = "";
  };

  return (
    <div className="container admin">
      <div className="admin__container">
      <header className="admin__header">
        <div>
          <p className="admin__eyebrow mono">Quản lý showroom</p>
          <h1 className="admin__title">Danh sách xe</h1>
        </div>
        <div className="admin__headerActions">
          <button type="button" className="admin__branchBtn" onClick={openBranchModal}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 21h18M3 7v14M21 7v14M9 21V10h6v11M12 7V3"/>
            </svg>
            Quản lý chi nhánh
          </button>
          <Link to="/admin/xe/moi" className="admin__addBtn">
            + Thêm xe mới
          </Link>
        </div>
      </header>

      {/* Branch Management Modal */}
      {showBranchModal && (
        <div className="modal-overlay" onClick={closeBranchModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <div>
                <h2 className="modal__title">
                  <svg className="modal__titleIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 21h18M3 7v14M21 7v14M9 21V10h6v11M12 7V3"/>
                  </svg>
                  Quản lý chi nhánh
                </h2>
                <p className="modal__subtitle">{branches.length} chi nhánh</p>
              </div>
              <button type="button" className="modal__close" onClick={closeBranchModal} aria-label="Đóng">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div className="modal__body">
              <form className="admin__branchForm" onSubmit={handleAddBranch}>
                <div className="admin__inputWrapper">
                  <svg className="admin__inputIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 8v8M8 12h8"/>
                  </svg>
                  <input
                    type="text"
                    value={newBranchName}
                    onChange={(e) => setNewBranchName(e.target.value)}
                    placeholder="Nhập tên chi nhánh mới..."
                    disabled={addingBranch}
                  />
                </div>
                <button type="submit" className="admin__addBranchBtn" disabled={addingBranch || !newBranchName.trim()}>
                  {addingBranch ? (
                    <span className="admin__spinner"></span>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5v14M5 12h14"/>
                      </svg>
                      Thêm
                    </>
                  )}
                </button>
              </form>
              {branchError && (
                <div className="admin__branchError">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 8v4M12 16h.01"/>
                  </svg>
                  {branchError}
                </div>
              )}

              {branches.length === 0 ? (
                <div className="admin__emptyBranches">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 21h18M3 7v14M21 7v14M9 21V10h6v11M12 7V3"/>
                  </svg>
                  <p>Chưa có chi nhánh nào</p>
                  <span>Thêm chi nhánh đầu tiên để bắt đầu quản lý</span>
                </div>
              ) : (
                <div className="admin__branchGrid">
                  {branches.map((branch) => (
                    <div key={branch.id} className="admin__branchCard">
                      <div className="admin__branchCardContent">
                        <div className="admin__branchIcon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                            <circle cx="12" cy="10" r="3"/>
                          </svg>
                        </div>
                        <div className="admin__branchInfo">
                          <span className="admin__branchName">{branch.name}</span>
                        </div>
                      </div>
                      {confirmId === branch.id ? (
                        <div className="admin__branchConfirm">
                          <span>Xoá?</span>
                          <button
                            type="button"
                            className="admin__confirmDeleteBtn"
                            onClick={() => handleDeleteBranch(branch.id)}
                          >
                            Xác nhận
                          </button>
                          <button
                            type="button"
                            className="admin__cancelDeleteBtn"
                            onClick={() => setConfirmId(null)}
                          >
                            Hủy
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="admin__deleteBranchBtn"
                          onClick={() => setConfirmId(branch.id)}
                          aria-label={`Xoá chi nhánh ${branch.name}`}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {status === "loading" && <p className="admin__state">Đang tải…</p>}
      {status === "error" && (
        <p className="admin__state admin__state--error">Không thể tải danh sách xe.</p>
      )}

      {status === "ready" && motorcycles.length > 0 && (
        <div className="admin__filterBar">
          <div className="admin__searchBar">
            <svg className="admin__searchIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên, mô tả hoặc chi nhánh..."
              className="admin__searchInput"
              aria-label="Tìm kiếm xe"
            />
            {searchQuery && (
              <button
                type="button"
                className="admin__searchClear"
                onClick={clearSearch}
                aria-label="Xoá từ khoá"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
            {(normalizedQuery || selectedBranchId) && (
              <span className="admin__searchCount">
                {filteredMotorcycles.length} / {motorcycles.length} kết quả
              </span>
            )}
          </div>

          <div className="admin__branchFilter">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M3 21h18M5 21V7l7-4 7 4v14M9 10h.01M15 10h.01M9 14h.01M15 14h.01M10 21v-3h4v3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <select
              value={selectedBranchId}
              onChange={(event) => setSelectedBranchId(event.target.value)}
              aria-label="Lọc xe theo chi nhánh"
            >
              <option value="">Tất cả chi nhánh</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>{branch.name}</option>
              ))}
              <option value="unassigned">Chưa phân chi nhánh</option>
            </select>
            <svg className="admin__branchFilterArrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="m7 10 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      )}

      {status === "ready" && motorcycles.length === 0 && (
        <p className="admin__state">Chưa có xe nào. Bấm "Thêm xe mới" để bắt đầu.</p>
      )}

      {status === "ready" && motorcycles.length > 0 && filteredMotorcycles.length === 0 && (
        <p className="admin__state">
          Không tìm thấy xe phù hợp
          {normalizedQuery ? ` với “${searchQuery.trim()}”` : ""}
          {selectedBranchName ? ` tại ${selectedBranchName}` : ""}.
        </p>
      )}

      {status === "ready" && filteredMotorcycles.length > 0 && (
        <table className="admin__table">
          <thead>
            <tr>
              <th scope="col">Hình</th>
              <th scope="col">Tên xe</th>
              <th scope="col">Giá</th>
              <th scope="col">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredMotorcycles.map((moto) => (
              <tr key={moto.id}>
                <td>
                  <div className="admin__thumb">
                    {moto.images?.[0] ? (
                      <img src={moto.images[0]} alt={moto.name} />
                    ) : (
                      <span className="admin__thumbEmpty" aria-hidden="true" />
                    )}
                  </div>
                </td>
                <td>{moto.name}</td>
                <td className="tabular-nums">{formatPrice(moto.price)}</td>
                <td>
                  <div className="admin__actions">
                    <Link to={`/admin/xe/${moto.id}`} className="admin__editLink">
                      Sửa
                    </Link>

                    {confirmId === moto.id ? (
                      <>
                        <button
                          type="button"
                          className="admin__confirmBtn"
                          disabled={deletingId === moto.id}
                          onClick={() => handleDelete(moto.id)}
                        >
                          {deletingId === moto.id ? "Đang xoá…" : "Xác nhận xoá"}
                        </button>
                        <button
                          type="button"
                          className="admin__cancelBtn"
                          onClick={() => setConfirmId(null)}
                        >
                          Hủy
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        className="admin__deleteBtn"
                        onClick={() => setConfirmId(moto.id)}
                      >
                        Xoá
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      </div>
    </div>
  );
}
