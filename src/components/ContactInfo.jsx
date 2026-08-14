import "./ContactInfo.css";

const ZaloIcon = () => (
  <svg viewBox="0 0 40 40" aria-hidden="true">
    <circle cx="20" cy="20" r="20" fill="#0068FF" />
    <path
      d="M20 8C12.82 8 7 13.05 7 19.3c0 3.6 1.95 6.8 5 8.85l-1.05 4.05 4.55-2.35c1.4.4 2.9.6 4.5.6 7.18 0 13-5.05 13-11.3C33 13.05 27.18 8 20 8Z"
      fill="#fff"
    />
    <text
      x="20"
      y="23"
      textAnchor="middle"
      fontFamily="Inter, sans-serif"
      fontWeight="700"
      fontSize="9"
      fill="#0068FF"
    >
      Zalo
    </text>
  </svg>
);

export default function ContactInfo() {
  return (
    <section className="contactInfo" aria-label="Thông tin liên hệ">
      <div className="contactInfo__hotline">
        <span className="contactInfo__hotlineLabel">Hotline:</span>
        <a className="contactInfo__hotlineNumber" href="tel:0393797989">
          0393.79.79.89
        </a>
      </div>
    </section>
  );
}