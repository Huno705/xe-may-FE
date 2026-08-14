import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getMotorcycle } from "../api/motorcycles";
import { formatPrice } from "../utils/format";
import Lightbox from "../components/Lightbox";
import "./MotorcycleDetail.css";

export default function MotorcycleDetail() {
  const { id } = useParams();
  const [moto, setMoto] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [status, setStatus] = useState("loading");
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    getMotorcycle(id)
      .then((data) => {
        setMoto(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [id]);

  if (status === "loading") {
    return <p className="container detail__state">Đang tải thông tin xe…</p>;
  }

  if (status === "error" || !moto) {
    return (
      <div className="container detail__state">
        <p>Không tìm thấy xe này.</p>
        <Link to="/" className="detail__back">← Quay lại bộ sưu tập</Link>
      </div>
    );
  }

  const images = moto.images?.length ? moto.images : [];

  return (
    <div className="container detail">
      <Link to="/" className="detail__back">← Quay lại bộ sưu tập</Link>

      <div className="detail__layout">
        <div className="detail__gallery">
          <div className="detail__mainImage">
            {images.length > 0 ? (
              <button
                type="button"
                className="detail__mainImageBtn"
                onClick={() => setLightboxOpen(true)}
                aria-label="Xem ảnh lớn hơn"
              >
                <img src={images[activeImage]} alt={moto.name} />
              </button>
            ) : (
              <div className="detail__placeholder">Chưa có hình ảnh</div>
            )}
          </div>

          {images.length > 1 && (
            <div className="detail__thumbs" role="tablist" aria-label="Hình ảnh xe">
              {images.map((src, index) => (
                <button
                  key={src}
                  type="button"
                  role="tab"
                  aria-selected={index === activeImage}
                  className={`detail__thumb ${index === activeImage ? "is-active" : ""}`}
                  onClick={() => setActiveImage(index)}
                >
                  <img src={src} alt={`${moto.name} - ảnh ${index + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="detail__info">
          <h1 className="detail__name">{moto.name}</h1>
          <p className="detail__price tabular-nums">{formatPrice(moto.price)}</p>
          {moto.branches?.name && (
            <p className="detail__branch">
              <span className="detail__branchLabel">Chi nhánh:</span> {moto.branches.name}
            </p>
          )}
          {(moto.saigon_deposit > 0 || moto.province_deposit > 0) && (
            <div className="detail__deposits">
              <h2 className="detail__sectionTitle">Đặt cọc</h2>
              {moto.saigon_deposit > 0 && (
                <p className="detail__deposit">
                  <span className="detail__depositLabel">Sài Gòn đưa trước:</span>{" "}
                  <span className="detail__depositValue tabular-nums">
                    {formatPrice(moto.saigon_deposit)}
                  </span>
                </p>
              )}
              {moto.province_deposit > 0 && (
                <p className="detail__deposit">
                  <span className="detail__depositLabel">Tỉnh đưa trước:</span>{" "}
                  <span className="detail__depositValue tabular-nums">
                    {formatPrice(moto.province_deposit)}
                  </span>
                </p>
              )}
            </div>
          )}
          {moto.description && (
            <p className="detail__description">{moto.description}</p>
          )}
        </div>
      </div>

      {lightboxOpen && images.length > 0 && (
        <Lightbox
          images={images}
          startIndex={activeImage}
          alt={moto.name}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}
