import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getBranches,
  createBranch,
  updateBranch,
  deleteBranch,
} from "../api/branches";
import "./AdminBranches.css";

const emptyForm = { name: "", address: "", map_url: "" };

export default function AdminBranches() {
  const [branches, setBranches] = useState([]);
  const [status, setStatus] = useState("loading");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmId, setConfirmId] = useState(null);

  const load = () => {
    setStatus("loading");
    getBranches()
      .then((data) => {
        setBranches(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  };

  useEffect(() => {
    load();
  }, []);

  const startEdit = (branch) => {
    setEditingId(branch.id);
    setForm({
      name: branch.name || "",
      address: branch.address || "",
      map_url: branch.map_url || "",
    });
    setError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Vui lòng nhập tên chi nhánh.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const payload = {
        name: form.name.trim(),
        address: form.address.trim(),
        map_url: form.map_url.trim(),
      };
      if (editingId) {
        const updated = await updateBranch(editingId, payload);
        setBranches((prev) =>
          prev.map((b) => (b.id === updated.id ? updated : b)).sort((a, b) => a.name.localeCompare(b.name))
        );
      } else {
        const created = await createBranch(payload);
        setBranches((prev) =>
          [...prev, created].sort((a, b) => a.name.localeCompare(b.name))
        );
      }
      cancelEdit();
    } catch (err) {
      setError(err.response?.data?.error || "Không thể lưu chi nhánh.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteBranch(id);
      setBranches((prev) => prev.filter((b) => b.id !== id));
    } catch {
      // ignore
    } finally {
      setConfirmId(null);
    }
  };

  return (
    <div className="container admin-branches">
      <Link to="/admin" className="admin-branches__back">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Quay lại danh sách xe
      </Link>

      <div className="admin-branches__card">
        <header className="admin-branches__header">
          <div>
            <p className="admin-branches__eyebrow mono">Cài đặt hệ thống</p>
            <h1 className="admin-branches__title">Quản lý chi nhánh</h1>
          </div>
        </header>

        <form className="admin-branches__form" onSubmit={handleSubmit}>
          <div className="admin-branches__formGrid">
            <label className="admin-branches__field">
              <span>Tên chi nhánh *</span>
              <input
                type="text"
                value={form.name}
                onChange={handleChange("name")}
                required
                placeholder="VD: Quận 12"
              />
            </label>
            <label className="admin-branches__field admin-branches__field--wide">
              <span>Địa chỉ</span>
              <input
                type="text"
                value={form.address}
                onChange={handleChange("address")}
                placeholder="Số nhà, đường, phường, quận..."
              />
            </label>
            <label className="admin-branches__field admin-branches__field--wide">
              <span>Liên kết Google Maps</span>
              <input
                type="url"
                value={form.map_url}
                onChange={handleChange("map_url")}
                placeholder="https://maps.google.com/?q=..."
              />
            </label>
          </div>

          {error && (
            <div className="admin-branches__error" role="alert">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
              {error}
            </div>
          )}

          <div className="admin-branches__formActions">
            {editingId && (
              <button type="button" className="admin-branches__cancelBtn" onClick={cancelEdit}>
                Hủy
              </button>
            )}
            <button type="submit" className="admin-branches__submitBtn" disabled={submitting}>
              {submitting
                ? "Đang lưu…"
                : editingId
                ? "Lưu thay đổi"
                : "Thêm chi nhánh"}
            </button>
          </div>
        </form>

        <div className="admin-branches__listWrap">
          {status === "loading" && <p className="admin-branches__state">Đang tải…</p>}
          {status === "error" && (
            <p className="admin-branches__state admin-branches__state--error">
              Không thể tải chi nhánh.
            </p>
          )}

          {status === "ready" && branches.length === 0 && (
            <p className="admin-branches__state">Chưa có chi nhánh nào.</p>
          )}

          {status === "ready" && branches.length > 0 && (
            <table className="admin-branches__table">
              <thead>
                <tr>
                  <th scope="col">Tên</th>
                  <th scope="col">Địa chỉ</th>
                  <th scope="col">Bản đồ</th>
                  <th scope="col">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {branches.map((branch) => (
                  <tr key={branch.id}>
                    <td>{branch.name}</td>
                    <td>{branch.address || "—"}</td>
                    <td>
                      {branch.map_url ? (
                        <a
                          className="admin-branches__mapLink"
                          href={branch.map_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Mở Maps ↗
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      <div className="admin-branches__actions">
                        <button
                          type="button"
                          className="admin-branches__editBtn"
                          onClick={() => startEdit(branch)}
                        >
                          Sửa
                        </button>
                        {confirmId === branch.id ? (
                          <>
                            <button
                              type="button"
                              className="admin-branches__confirmBtn"
                              onClick={() => handleDelete(branch.id)}
                            >
                              Xác nhận
                            </button>
                            <button
                              type="button"
                              className="admin-branches__cancelBtn"
                              onClick={() => setConfirmId(null)}
                            >
                              Hủy
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            className="admin-branches__deleteBtn"
                            onClick={() => setConfirmId(branch.id)}
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
    </div>
  );
}