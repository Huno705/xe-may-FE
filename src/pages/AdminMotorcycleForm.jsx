import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  getMotorcycle,
  createMotorcycle,
  updateMotorcycle,
} from "../api/motorcycles";
import { getBranches } from "../api/branches";
import "./AdminMotorcycleForm.css";

export default function AdminMotorcycleForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [saigonDeposit, setSaigonDeposit] = useState("");
  const [provinceDeposit, setProvinceDeposit] = useState("");
  const [branchId, setBranchId] = useState("");
  const [branches, setBranches] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getBranches()
      .then(setBranches)
      .catch(() => setBranches([]));
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    getMotorcycle(id)
      .then((data) => {
        setName(data.name);
        setPrice(String(data.price));
        setDescription(data.description || "");
        setSaigonDeposit(String(data.saigon_deposit || 0));
        setProvinceDeposit(String(data.province_deposit || 0));
        setBranchId(data.branch_id || "");
        setExistingImages(data.images || []);
      })
      .catch(() => setError("Không thể tải thông tin xe."))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleFilesChange = (event) => {
    setNewFiles(Array.from(event.target.files || []));
  };

  const removeExistingImage = (url) => {
    setExistingImages((prev) => prev.filter((img) => img !== url));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!name.trim() || !price) {
      setError("Vui lòng nhập tên xe và giá.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("price", price);
      formData.append("description", description.trim());
      formData.append("saigon_deposit", saigonDeposit || "0");
      formData.append("province_deposit", provinceDeposit || "0");
      formData.append("branch_id", branchId || "");

      if (isEdit) {
        formData.append("existingImages", JSON.stringify(existingImages));
      }

      newFiles.forEach((file) => formData.append("images", file));

      if (isEdit) {
        await updateMotorcycle(id, formData);
      } else {
        await createMotorcycle(formData);
      }

      navigate("/admin");
    } catch {
      setError("Không thể lưu thông tin xe. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="container admin-form__state">Đang tải…</p>;
  }

  return (
    <div className="container admin-form">
      <Link to="/admin" className="admin-form__back">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Quay lại danh sách
      </Link>

      <div className="admin-form__card">
        <h1 className="admin-form__title">
          {isEdit ? "Sửa thông tin xe" : "Thêm xe mới"}
        </h1>

        <form className="admin-form__form" onSubmit={handleSubmit}>
          <label className="admin-form__field">
            <span>Tên xe</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="VD: Honda Winner X"
            />
          </label>

          <label className="admin-form__field">
            <span>Giá (VNĐ)</span>
            <input
              type="number"
              min="0"
              step="1000"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              placeholder="VD: 28900000"
            />
          </label>

          <label className="admin-form__field">
            <span>Sài Gòn đưa trước (VNĐ)</span>
            <input
              type="number"
              min="0"
              step="1000"
              value={saigonDeposit}
              onChange={(e) => setSaigonDeposit(e.target.value)}
              placeholder="VD: 5000000"
            />
          </label>

          <label className="admin-form__field">
            <span>Tỉnh đưa trước (VNĐ)</span>
            <input
              type="number"
              min="0"
              step="1000"
              value={provinceDeposit}
              onChange={(e) => setProvinceDeposit(e.target.value)}
              placeholder="VD: 8000000"
            />
          </label>

          <label className="admin-form__field">
            <span>Chi nhánh</span>
            <select
              value={branchId}
              onChange={(e) => setBranchId(e.target.value)}
            >
              <option value="">-- Chọn chi nhánh --</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </label>

          <label className="admin-form__field">
            <span>Mô tả sản phẩm</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              placeholder="Nhập mô tả chi tiết về xe..."
            />
          </label>

          {isEdit && existingImages.length > 0 && (
            <div className="admin-form__field">
              <span>Hình ảnh hiện tại</span>
              <div className="admin-form__imageGrid">
                {existingImages.map((url) => (
                  <div key={url} className="admin-form__imageItem">
                    <img src={url} alt="" />
                    <button
                      type="button"
                      className="admin-form__removeImage"
                      onClick={() => removeExistingImage(url)}
                      aria-label="Xoá hình ảnh này"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <label className="admin-form__field">
            <span>{isEdit ? "Thêm hình ảnh mới" : "Hình ảnh (1 hoặc nhiều)"}</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFilesChange}
            />
            {newFiles.length > 0 && (
              <p className="admin-form__fileCount">{newFiles.length} tệp đã chọn</p>
            )}
          </label>

          {error && (
            <div className="admin-form__error" role="alert">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 8v4M12 16h.01"/>
              </svg>
              {error}
            </div>
          )}

          <div className="admin-form__actions">
            <button type="submit" className="admin-form__submit" disabled={submitting}>
              {submitting ? "Đang lưu…" : isEdit ? "Lưu thay đổi" : "Thêm xe"}
            </button>
            <Link to="/admin" className="admin-form__cancel">
              Hủy bỏ
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
