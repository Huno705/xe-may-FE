import { useEffect, useState } from "react";
import { getMotorcycles } from "../api/motorcycles";
import { getBranches } from "../api/branches";
import MotorcycleCard from "../components/MotorcycleCard";
import "./Home.css";

export default function Home() {
  const [motorcycles, setMotorcycles] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    Promise.all([getMotorcycles(), getBranches()])
      .then(([motoData, branchData]) => {
        setMotorcycles(motoData);
        setBranches(branchData);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  const filteredMotorcycles = selectedBranch
    ? motorcycles.filter((m) => m.branch_id === selectedBranch)
    : motorcycles;

  return (
    <div className="container home">
      <header className="home__header">
        <p className="home__eyebrow mono">Showroom · toàn bộ xe hiện có</p>
        <h1 className="home__title">Bộ sưu tập</h1>
      </header>

      {branches.length > 0 && (
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
      )}

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
          {selectedBranch
            ? "Chi nhánh này hiện chưa có xe nào."
            : "Hiện chưa có xe nào được trưng bày."}
        </p>
      )}

      {status === "ready" && filteredMotorcycles.length > 0 && (
        <div className="moto-grid">
          {filteredMotorcycles.map((moto) => (
            <MotorcycleCard key={moto.id} motorcycle={moto} />
          ))}
        </div>
      )}
    </div>
  );
}
