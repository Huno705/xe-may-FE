import { useMemo, useState } from "react";
import { STORE_LOCATIONS } from "../data/storeLocations";
import "./StoreLocations.css";

export default function StoreLocations() {
  const [selectedId, setSelectedId] = useState(STORE_LOCATIONS[0].id);
  const selectedStore = STORE_LOCATIONS.find((store) => store.id === selectedId)
    || STORE_LOCATIONS[0];

  const mapUrls = useMemo(() => {
    const query = encodeURIComponent(`${selectedStore.name}, ${selectedStore.address}`);
    return {
      embed: `https://maps.google.com/maps?hl=vi&q=${query}&z=16&output=embed`,
      directions: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selectedStore.address)}`,
    };
  }, [selectedStore]);

  return (
    <section id="contact" className="storeLocations" aria-labelledby="store-locations-title">
      <header className="storeLocations__header">
        <div>
          <p className="storeLocations__eyebrow mono">3SGO · Hồ Chí Minh</p>
          <h2 id="store-locations-title" className="storeLocations__title">
            Hệ thống chi nhánh
          </h2>
        </div>
      </header>

      <div className="storeLocations__stage">
        <iframe
          key={selectedStore.id}
          className="storeLocations__map"
          src={mapUrls.embed}
          title={`Bản đồ ${selectedStore.name}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />

        <div className="storeLocations__panel" aria-label="Chọn chi nhánh">
          {STORE_LOCATIONS.map((store) => {
            const isActive = store.id === selectedStore.id;
            return (
              <button
                key={store.id}
                type="button"
                className={`storeLocations__branch${isActive ? " is-active" : ""}`}
                aria-pressed={isActive}
                onClick={() => setSelectedId(store.id)}
              >
                <span className="storeLocations__pin" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" strokeLinejoin="round" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                </span>
                <span className="storeLocations__branchCopy">
                  <strong>{store.shortName}</strong>
                  <span>{store.address}</span>
                </span>
              </button>
            );
          })}

          <a
            className="storeLocations__directions"
            href={mapUrls.directions}
            target="_blank"
            rel="noopener noreferrer"
          >
            Chỉ đường đến {selectedStore.shortName.replace("Chi nhánh ", "")}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M7 17 17 7M8 7h9v9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
