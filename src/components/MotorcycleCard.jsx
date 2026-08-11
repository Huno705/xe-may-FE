import { Link } from "react-router-dom";
import { formatPrice } from "../utils/format";
import "./MotorcycleCard.css";

export default function MotorcycleCard({ motorcycle }) {
  const image = motorcycle.images?.[0];

  return (
    <Link to={`/xe/${motorcycle.id}`} className="moto-card fade-up">
      <div className="moto-card__media">
        {image ? (
          <img src={image} alt={motorcycle.name} loading="lazy" />
        ) : (
          <div className="moto-card__placeholder">Chưa có hình</div>
        )}
      </div>
      <div className="moto-card__meta">
        <h3 className="moto-card__name">{motorcycle.name}</h3>
        <p className="moto-card__price tabular-nums">{formatPrice(motorcycle.price)}</p>
      </div>
    </Link>
  );
}
