import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  getMotorcycle,
  createMotorcycle,
  updateMotorcycle,
} from "../api/motorcycles";
import "./AdminMotorcycleForm.css";

export default function AdminMotorcycleForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    getMotorcycle(id)
      .then((data) => {
        setName(data.name);
        setPrice(String(data.price));
        setDescription(data.description || "");
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
        ← Quay lại danh sách
      </Link>

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
          />
        </label>

        <label className="admin-form__field">
          <span>Mô tả sản phẩm</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
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

        {error && <p className="admin-form__error" role="alert">{error}</p>}

        <div className="admin-form__actions">
          <button type="submit" className="admin-form__submit" disabled={submitting}>
            {submitting ? "Đang lưu…" : isEdit ? "Lưu thay đổi" : "Thêm xe"}
          </button>
          <Link to="/admin" className="admin-form__cancel">
            Hủy
          </Link>
        </div>
      </form>
    </div>
  );
}
