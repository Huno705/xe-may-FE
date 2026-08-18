import "./Footer.css";

export default function Footer() {
  return (
    <footer className="foot-line">
      <p className="container">
        © {new Date().getFullYear()} 3sGo Showroom
      </p>
    </footer>
  );
}
