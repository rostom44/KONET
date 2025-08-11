import { NavLink } from "react-router-dom";
import "../styles/hero.css";

function Hero() {
  return (
    <div className="hero">
      <div className="hero-overlay" />
      <div className="hero-content">
        <div className="text-overlay">
          <h1 className="hero-title">
            Frais, Propre
            <br />& Brillant
          </h1>
          <div className="hero-subtitle">
            <span className="konet">Konet</span> est là pour vous.
            <br />
            Nous offrons divers services pour nettoyer
            <br />
            tout ce dont vous avez besoin.
          </div>
        </div>
        <span className="priority-text mobile-priority">
          Notre Priorité c'est Votre Propreté
        </span>
        <div className="hero-buttons mobile-buttons">
          <NavLink to="/services" className="hero-btn">
            services
          </NavLink>
          <NavLink to="/contact" className="hero-btn">
            contact us
          </NavLink>
        </div>
      </div>

      {/* Desktop buttons - outside hero-content */}
      <div className="hero-buttons desktop-buttons">
        <NavLink to="/services" className="hero-btn">
          services
        </NavLink>
        <span className="priority-text desktop-priority">
          Notre Priorité c'est Votre Propreté
        </span>
        <NavLink to="/contact" className="hero-btn">
          contact us
        </NavLink>
      </div>
    </div>
  );
}

export default Hero;
