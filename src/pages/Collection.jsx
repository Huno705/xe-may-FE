import { useEffect, useState } from "react";
import { getMotorcycles } from "../api/motorcycles";
import { getBranches } from "../api/branches";
import { useBranchFilter } from "../context/BranchContext";
import MotorcycleCard from "../components/MotorcycleCard";
import ContactInfo from "../components/ContactInfo";
import "./Home.css";

export default function Collection() {
  const [motorcycles, setMotorcycles] = useState([]);
  const [branches, setBranches] = useState([]);
  const [status, setStatus] = useState("loading");
  const { selectedBranch, setSelectedBranch } = useBranchFilter();

  useEffect(() => {
    Promise.all([getMotorcycles(), getBranches()])
      .then(([motoData, branchData]) => {
        setMotorcycles(motoData);
        setBranches(branchData);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  const filteredMotorcycles = selectedBranch !== null
    ? motorcycles.filter((m) => m.branch_id === selectedBranch)
    : motorcycles;

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
          {selectedBranch !== null
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