import ContactInfo from "../components/ContactInfo";
import HeroCarousel from "../components/HeroCarousel";
import FavoriteMotorcycles from "../components/FavoriteMotorcycles";
import StoreLocations from "../components/StoreLocations";
import TikTokProfileEmbed from "../components/TikTokProfileEmbed";
import "./Home.css";

export default function Home() {
  return (
    <div className="container home">
      <HeroCarousel />
      <ContactInfo />
      <FavoriteMotorcycles />
      <TikTokProfileEmbed />
      <StoreLocations />
    </div>
  );
}
