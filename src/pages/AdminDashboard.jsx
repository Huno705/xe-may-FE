import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMotorcycles, deleteMotorcycle } from "../api/motorcycles";
import { formatPrice } from "../utils/format";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [motorcycles, setMotorcycles] = useState([]);
  const [status, setStatus] = useState("loading");
  const [deletingId, setDeletingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  const load = () => {
    setStatus("loading");
    getMotorcycles()
      .then((data) => {
        setMotorcycles(data);
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

  return (
    <div className="container admin">
      <header className="admin__header">
        <div>
          <p className="admin__eyebrow mono">Quản lý showroom</p>
          <h1 className="admin__title">Danh sách xe</h1>
        </div>
        <Link to="/admin/xe/moi" className="admin__addBtn">
          + Thêm xe mới
        </Link>
      </header>

      {status === "loading" && <p className="admin__state">Đang tải…</p>}
      {status === "error" && (
        <p className="admin__state admin__state--error">Không thể tải danh sách xe.</p>
      )}

      {status === "ready" && motorcycles.length === 0 && (
        <p className="admin__state">Chưa có xe nào. Bấm "Thêm xe mới" để bắt đầu.</p>
      )}

      {status === "ready" && motorcycles.length > 0 && (
        <table className="admin__table">
          <thead>
            <tr>
              <th scope="col">Hình</th>
              <th scope="col">Tên xe</th>
              <th scope="col">Giá</th>
              <th scope="col" className="sr-only">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {motorcycles.map((moto) => (
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
  );
}
