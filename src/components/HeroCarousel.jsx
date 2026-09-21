import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./HeroCarousel.css";

const heroImageModules = import.meta.glob(
  "../assets/hero-section/*.{png,jpg,jpeg,JPG,JPEG}",
  { eager: true, import: "default" },
);

const HERO_IMAGES = Object.entries(heroImageModules)
  .sort(([pathA], [pathB]) => pathA.localeCompare(pathB))
  .map(([, src], index) => ({
    src,
    alt: `Không gian và xe điện tại showroom 3sGo ${index + 1}`,
  }));

const AUTOPLAY_DELAY = 5000;

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (
      isPaused
      || HERO_IMAGES.length < 2
      || window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setCurrentIndex((index) => (index + 1) % HERO_IMAGES.length);
    }, AUTOPLAY_DELAY);

    return () => window.clearInterval(timer);
  }, [isPaused]);

  if (HERO_IMAGES.length === 0) return null;

  const showPrevious = () => {
    setCurrentIndex((index) => (index - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);
  };

  const showNext = () => {
    setCurrentIndex((index) => (index + 1) % HERO_IMAGES.length);
  };

  const handleBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsPaused(false);
    }
  };

  return (
    <section
      className="heroCarousel"
      aria-label="Hình ảnh nổi bật của 3sGo"
      aria-roledescription="carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={handleBlur}
    >
      <div
        className="heroCarousel__track"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        aria-live="off"
      >
        {HERO_IMAGES.map((image, index) => (
          <div
            className="heroCarousel__slide"
            key={image.src}
            aria-hidden={index !== currentIndex}
          >
            <img
              src={image.src}
              alt={index === currentIndex ? image.alt : ""}
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "auto"}
            />
          </div>
        ))}
      </div>

      <div className="heroCarousel__shade" aria-hidden="true" />

      <div className="heroCarousel__content">
        <p className="heroCarousel__eyebrow mono">Xe máy điện 3SGO</p>
        <h1 className="heroCarousel__title">Lựa chọn xe điện dành cho bạn</h1>
        <p className="heroCarousel__description">Hỗ trợ nợ xấu
        </p>
        <Link className="heroCarousel__cta" to="/bo-suu-tap">
          Khám phá bộ sưu tập
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      {HERO_IMAGES.length > 1 && (
        <>
          <div className="heroCarousel__arrows">
            <button type="button" onClick={showPrevious} aria-label="Ảnh trước">
              <span aria-hidden="true">←</span>
            </button>
            <button type="button" onClick={showNext} aria-label="Ảnh tiếp theo">
              <span aria-hidden="true">→</span>
            </button>
          </div>

          <div className="heroCarousel__dots" aria-label="Chọn ảnh">
            {HERO_IMAGES.map((image, index) => (
              <button
                key={image.src}
                type="button"
                className={index === currentIndex ? "is-active" : ""}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Xem ảnh ${index + 1}`}
                aria-current={index === currentIndex ? "true" : undefined}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
