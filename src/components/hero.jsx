import React from "react";

function Hero() {
  return (
    <div className="hero">
      <div className="hero-overlay" />
      <img className="hero-img" src="/assets/clean1.jpg" alt="cleaning" />
      <div className="hero-content">
        <h1>
          fresh,
          <br />
          propre
          <br />
          et brillant
        </h1>
        <p>Notre Priorité Votre Propreté</p>
        <div className="hero-buttons">
          <button>services</button>
          <button>contact us</button>
        </div>
      </div>
    </div>
  );
}

export default Hero;
