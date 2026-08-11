import { useEffect, useState } from "react";
import { getMotorcycles } from "../api/motorcycles";
import MotorcycleCard from "../components/MotorcycleCard";
import "./Home.css";

export default function Home() {
  const [motorcycles, setMotorcycles] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    getMotorcycles()
      .then((data) => {
        setMotorcycles(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <div className="container home">
      <header className="home__header">
        <p className="home__eyebrow mono">Showroom · toàn bộ xe hiện có</p>
        <h1 className="home__title">Bộ sưu tập</h1>
      </header>

      {status === "loading" && (
        <p className="home__state">Đang tải danh sách xe…</p>
      )}

      {status === "error" && (
        <p className="home__state home__state--error">
          Không thể tải danh sách xe. Vui lòng thử lại sau.
        </p>
      )}

      {status === "ready" && motorcycles.length === 0 && (
        <p className="home__state">Hiện chưa có xe nào được trưng bày.</p>
      )}

      {status === "ready" && motorcycles.length > 0 && (
        <div className="moto-grid">
          {motorcycles.map((moto) => (
            <MotorcycleCard key={moto.id} motorcycle={moto} />
          ))}
        </div>
      )}
    </div>
  );
}
