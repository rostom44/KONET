import React, { useState, useEffect, useRef } from "react";

const images = [
  "/assets/clean1.jpg",
  "/assets/clean1.jpg",
  "/assets/clean1.jpg",
];

function About() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timeoutRef = useRef(null);

  const nextSlide = () => {
    setAnimating(true);
    setTimeout(() => {
      setSlideIndex((prev) => (prev + 1) % images.length);
      setAnimating(false);
    }, 400);
  };

  const prevSlide = () => {
    setAnimating(true);
    setTimeout(() => {
      setSlideIndex((prev) => (prev - 1 + images.length) % images.length);
      setAnimating(false);
    }, 400);
  };

  const goToSlide = (idx) => {
    setAnimating(true);
    setTimeout(() => {
      setSlideIndex(idx);
      setAnimating(false);
    }, 400);
  };

  useEffect(() => {
    timeoutRef.current = setTimeout(nextSlide, 3500);
    return () => clearTimeout(timeoutRef.current);
  }, [slideIndex]);

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
              className={`slide${
                idx === slideIndex ? " active" : ""
              }${animating && idx === slideIndex ? " anim" : ""}`}
              key={idx}
              style={{ display: idx === slideIndex ? "block" : "none" }}
            >
              <img src={img} alt={`clean${idx + 1}`} />
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
