import { Link } from "react-router-dom";
import { formatPrice } from "../utils/format";
import "./MotorcycleCard.css";

export default function MotorcycleCard({ motorcycle }) {
  const image = motorcycle.images?.[0];
  const hasDeposits = (motorcycle.saigon_deposit > 0 || motorcycle.province_deposit > 0);
  const branchName = motorcycle.branches?.name;

  return (
    <Link to={`/xe/${motorcycle.id}`} className="moto-card fade-up">
      <div className="moto-card__media">
        {image ? (
          <img src={image} alt={motorcycle.name} loading="lazy" />
        ) : (
          <div className="moto-card__placeholder">Chưa có hình</div>
        )}
        {branchName && (
          <span className="moto-card__branch">{branchName}</span>
        )}
      </div>
      <div className="moto-card__meta">
        <h3 className="moto-card__name">{motorcycle.name}</h3>
        <p className="moto-card__price tabular-nums">{formatPrice(motorcycle.price)}</p>
        {hasDeposits && (
          <div className="moto-card__deposits">
            {motorcycle.saigon_deposit > 0 && (
              <span className="moto-card__deposit">
                Sài Gòn đưa trước:{" "}
                <span className="moto-card__deposit-value">
                  {formatPrice(motorcycle.saigon_deposit)}
                </span>
              </span>
            )}
            {motorcycle.province_deposit > 0 && (
              <span className="moto-card__deposit">
                Tỉnh đưa trước:{" "}
                <span className="moto-card__deposit-value">
                  {formatPrice(motorcycle.province_deposit)}
                </span>
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
