import { useState, useEffect, useRef } from "react";

const images = [
  "/assets/clean1.avif",
  "/assets/clean2.avif",
  "/assets/clean3.jpg",
  "/assets/clean4.jpg",
];

function About() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timeoutRef = useRef(null);

  const nextSlide = () => {
    if (animating) return; // Prevent multiple clicks during animation

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setAnimating(true);
    setSlideIndex((prev) => (prev + 1) % images.length);

    // Reset animation state after CSS transition completes
    setTimeout(() => {
      setAnimating(false);
    }, 300);
  };

  const prevSlide = () => {
    if (animating) return; // Prevent multiple clicks during animation

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setAnimating(true);
    setSlideIndex((prev) => (prev - 1 + images.length) % images.length);

    // Reset animation state after CSS transition completes
    setTimeout(() => {
      setAnimating(false);
    }, 300);
  };

  const goToSlide = (idx) => {
    if (animating || idx === slideIndex) return; // Prevent unnecessary changes

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setAnimating(true);
    setSlideIndex(idx);

    // Reset animation state after CSS transition completes
    setTimeout(() => {
      setAnimating(false);
    }, 300);
  };

  // Auto-advance slideshow
  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Only set timeout if not currently animating
    if (!animating) {
      timeoutRef.current = setTimeout(() => {
        setSlideIndex((prev) => (prev + 1) % images.length);
      }, 3500);
    }

    // Cleanup on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [slideIndex, animating]);

  return (
    <div className="about">
      <h2>
        <span>KONET</span> est une entreprise spécialisée dans nettoyage
        professionnel
      </h2>

      <div className="slideshow-container">
        <div className="slideshow">
          {images.map((img, idx) => (
            <div
              className={`slide${idx === slideIndex ? " active" : ""}${animating && idx === slideIndex ? " anim" : ""}`}
              key={idx}
              style={{ display: idx === slideIndex ? "block" : "none" }}
            >
              <img
                src={img}
                alt={`clean${idx + 1}`}
                loading="lazy"
                onError={(e) => {
                  // Fallback for missing images
                  e.target.style.backgroundColor = "#f0f0f0";
                  e.target.alt = `Image ${idx + 1} not found`;
                }}
              />
            </div>
          ))}

          <button className="slideshow-btn prev" onClick={prevSlide}>
            &#10094;
          </button>

          <button className="slideshow-btn next" onClick={nextSlide}>
            &#10095;
          </button>
        </div>

        <div className="slideshow-dots">
          {images.map((_, idx) => (
            <span
              key={idx}
              className={`dot${idx === slideIndex ? " active" : ""}`}
              onClick={() => goToSlide(idx)}
            ></span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default About;
