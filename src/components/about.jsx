import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";

const images = [
  "/assets/clean1.avif",
  "/assets/clean2.avif",
  "/assets/clean3.jpg",
  "/assets/clean4.jpg",
];

// Descriptive alt texts for better accessibility
const imageAlts = [
  "Équipe de nettoyage professionnel en action - service de qualité KONET",
  "Nettoyage de bureau moderne - services professionnels KONET",
  "Matériel de nettoyage professionnel utilisé par KONET",
  "Nettoyage des surfaces - services professionnels KONET",
];

function About() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef(null);
  const slideshowRef = useRef(null);

  const nextSlide = () => {
    if (animating) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setAnimating(true);
    setSlideIndex((prev) => (prev + 1) % images.length);

    setTimeout(() => {
      setAnimating(false);
    }, 300);
  };

  const prevSlide = () => {
    if (animating) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setAnimating(true);
    setSlideIndex((prev) => (prev - 1 + images.length) % images.length);

    setTimeout(() => {
      setAnimating(false);
    }, 300);
  };

  const goToSlide = (idx) => {
    if (animating || idx === slideIndex) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setAnimating(true);
    setSlideIndex(idx);

    setTimeout(() => {
      setAnimating(false);
    }, 300);
  };

  // Handle keyboard navigation
  const handleKeyDown = (event, action, idx = null) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (action === "next") nextSlide();
      else if (action === "prev") prevSlide();
      else if (action === "goTo" && idx !== null) goToSlide(idx);
    }
  };

  // Pause/resume slideshow on hover/focus
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);
  const handleFocus = () => setIsPaused(true);
  const handleBlur = () => setIsPaused(false);

  // Auto-advance slideshow
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!animating && !isPaused) {
      timeoutRef.current = setTimeout(() => {
        setSlideIndex((prev) => (prev + 1) % images.length);
      }, 3500);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [slideIndex, animating, isPaused]);

  return (
    <div className="about">
      <h2>
        <span>KONET</span> est une entreprise spécialisée dans le nettoyage
        professionnel
      </h2>

      <div
        className="slideshow-container"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        <div
          className="slideshow"
          role="region"
          aria-label="Galerie photos des services KONET"
          aria-live="polite"
          ref={slideshowRef}
        >
          {images.map((img, idx) => (
            <div
              className={`slide${idx === slideIndex ? " active" : ""}${animating && idx === slideIndex ? " anim" : ""}`}
              key={idx}
              role="img"
              aria-hidden={idx !== slideIndex}
              style={{ display: idx === slideIndex ? "block" : "none" }}
            >
              <img
                src={img}
                alt={imageAlts[idx]}
                loading="lazy"
                onError={(e) => {
                  e.target.style.backgroundColor = "#f0f0f0";
                  e.target.alt = `Image ${idx + 1} non disponible`;
                }}
              />
            </div>
          ))}

          <button
            className="slideshow-btn prev"
            onClick={prevSlide}
            onKeyDown={(e) => handleKeyDown(e, "prev")}
            aria-label="Image précédente"
            type="button"
          >
            <span aria-hidden="true">&#10094;</span>
          </button>

          <button
            className="slideshow-btn next"
            onClick={nextSlide}
            onKeyDown={(e) => handleKeyDown(e, "next")}
            aria-label="Image suivante"
            type="button"
          >
            <span aria-hidden="true">&#10095;</span>
          </button>
        </div>

        <div
          className="slideshow-dots"
          role="tablist"
          aria-label="Sélectionner une image"
        >
          {images.map((_, idx) => (
            <button
              key={idx}
              className={`dot${idx === slideIndex ? " active" : ""}`}
              onClick={() => goToSlide(idx)}
              onKeyDown={(e) => handleKeyDown(e, "goTo", idx)}
              role="tab"
              aria-selected={idx === slideIndex}
              aria-label={`Afficher l'image ${idx + 1}`}
              type="button"
            />
          ))}
        </div>
      </div>
      <NavLink
        to="/services"
        className="about-link"
        aria-label="En savoir plus sur nos services de nettoyage professionnel"
      >
        En savoir plus
      </NavLink>
    </div>
  );
}

export default About;
