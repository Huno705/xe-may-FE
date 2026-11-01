import { useEffect, useId, useState } from "react";
import { Link } from "react-router-dom";
import { getLatestMotorcycles } from "../api/motorcycles";
import MotorcycleCard from "./MotorcycleCard";
import "./FavoriteMotorcycles.css";

export default function FavoriteMotorcycles() {
  const titleId = useId();
  const [motorcycles, setMotorcycles] = useState([]);
  const [status, setStatus] = useState("loading");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");

    getLatestMotorcycles({ signal: controller.signal })
      .then((data) => {
        if (controller.signal.aborted) return;
        setMotorcycles(data);
        setStatus("ready");
      })
      .catch((error) => {
        if (controller.signal.aborted || error.code === "ERR_CANCELED") return;
        setStatus("error");
      });

    return () => controller.abort();
  }, [retryCount]);

  return (
    <section className="favoriteMotorcycles" aria-labelledby={titleId}>
      <h2 id={titleId} className="favoriteMotorcycles__title">Sản phẩm yêu thích</h2>

      {status === "loading" && (
        <p className="favoriteMotorcycles__state" role="status">Đang tải danh sách xe…</p>
      )}

      {status === "error" && (
        <div className="favoriteMotorcycles__state">
          <p role="alert">Không thể tải danh sách xe. Vui lòng thử lại.</p>
          <button
            className="favoriteMotorcycles__retry"
            type="button"
            onClick={() => setRetryCount((count) => count + 1)}
          >
            Thử lại
          </button>
        </div>
      )}

      {status === "ready" && motorcycles.length === 0 && (
        <p className="favoriteMotorcycles__state" role="status">Hiện chưa có xe nào được trưng bày.</p>
      )}

      {status === "ready" && motorcycles.length > 0 && (
        <div className="favoriteMotorcycles__grid">
          {motorcycles.map((motorcycle) => (
            <MotorcycleCard key={motorcycle.id} motorcycle={motorcycle} />
          ))}
        </div>
      )}

      <div className="favoriteMotorcycles__more">
        <Link className="favoriteMotorcycles__moreLink" to="/bo-suu-tap">
          Xem thêm
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
