import "./Footer.css";

export default function Footer() {
  return (
    <footer className="foot-line">
      <p className="container">
        © {new Date().getFullYear()} MOTO Showroom
      </p>
    </footer>
  );
}
