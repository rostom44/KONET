import React from "react";

function Hero() {
  return (
    <div className="hero">
      <div className="hero-overlay" />
      <div className="hero-content">
        <h1 className="hero-title">
          fresh
          <br />
          propre
          <br />
          et brillant
        </h1>
        <div className="hero-subtitle">
          <span className="konet">konet</span> est la pour vous
          <br />
          nous offrons divers services pour nettoyer ce dont vous avez besoin
        </div>
        <div className="hero-buttons">
          <button className="hero-btn">services</button>
          <span className="priority-text">
            Notre Priorité c'est Votre Propreté
          </span>
          <button className="hero-btn">contact us</button>
        </div>
      </div>
    </div>
  );
}

export default Hero;
