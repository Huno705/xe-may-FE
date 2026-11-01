import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import quan12Image1 from "../assets/hero-section/quan-12-1.webp";
import quan12Image2 from "../assets/hero-section/quan-12-2.webp";
import quan8Image1 from "../assets/hero-section/quan-8-1.webp";
import quan8Image2 from "../assets/hero-section/quan-8-2.webp";
import phuNhuanImage1 from "../assets/hero-section/phu-nhuan-1.webp";
import phuNhuanImage2 from "../assets/hero-section/phu-nhuan-2.webp";
import "./HeroCarousel.css";

const HERO_IMAGES = [
  { src: quan12Image1, alt: "Showroom xe điện 3sGo Quận 12 - ảnh 1" },
  { src: quan12Image2, alt: "Showroom xe điện 3sGo Quận 12 - ảnh 2" },
  { src: quan8Image1, alt: "Showroom xe điện 3sGo Quận 8 - ảnh 1" },
  { src: quan8Image2, alt: "Showroom xe điện 3sGo Quận 8 - ảnh 2" },
  { src: phuNhuanImage1, alt: "Showroom xe điện 3sGo Phú Nhuận - ảnh 1" },
  { src: phuNhuanImage2, alt: "Showroom xe điện 3sGo Phú Nhuận - ảnh 2" },
];

const AUTOPLAY_DELAY = 5000;

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const [playbackPaused, setPlaybackPaused] = useState(false);
  const isPaused = isHovered || hasFocus || playbackPaused;

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
      setHasFocus(false);
    }
  };

  return (
    <section
      className="heroCarousel"
      aria-label="Hình ảnh nổi bật của 3sGo"
      aria-roledescription="carousel"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setHasFocus(true)}
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
              className="heroCarousel__backdrop"
              src={image.src}
              alt=""
              aria-hidden="true"
              loading={index === 0 ? "eager" : "lazy"}
            />
            <img
              className="heroCarousel__image"
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
        <p className="heroCarousel__eyebrow mono">Xe điện 3SGO</p>
        <h1 className="heroCarousel__title">Lựa chọn xe điện dành cho bạn</h1>
        <p className="heroCarousel__description">Hỗ trợ nợ xấu
        </p>
        <Link className="heroCarousel__cta" to="/bo-suu-tap">
          Khám phá bộ sưu tập
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      {HERO_IMAGES.length > 1 && (
        <div className="heroCarousel__controls">
          <button
            className="heroCarousel__playback"
            type="button"
            onClick={() => setPlaybackPaused((paused) => !paused)}
            aria-label={playbackPaused ? "Tiếp tục chuyển ảnh tự động" : "Tạm dừng chuyển ảnh tự động"}
            aria-pressed={playbackPaused}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              {playbackPaused ? <path d="m8 5 11 7-11 7Z" /> : <path d="M6 5h4v14H6zM14 5h4v14h-4z" />}
            </svg>
          </button>
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
          <span className="heroCarousel__counter" aria-label={`Ảnh ${currentIndex + 1} trên ${HERO_IMAGES.length}`}>
            {currentIndex + 1} / {HERO_IMAGES.length}
          </span>
          <div className="heroCarousel__arrows">
            <button type="button" onClick={showPrevious} aria-label="Ảnh trước">
              <span aria-hidden="true">←</span>
            </button>
            <button type="button" onClick={showNext} aria-label="Ảnh tiếp theo">
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
