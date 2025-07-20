import "../styles/hero.css";

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
        <span className="priority-text mobile-priority">
          Notre Priorité c'est Votre Propreté
        </span>
        <div className="hero-buttons mobile-buttons">
          <button className="hero-btn">services</button>
          <button className="hero-btn">contact us</button>
        </div>
      </div>

      {/* Desktop buttons - outside hero-content */}
      <div className="hero-buttons desktop-buttons">
        <button className="hero-btn">services</button>
        <span className="priority-text desktop-priority">
          Notre Priorité c'est Votre Propreté
        </span>
        <button className="hero-btn">contact us</button>
      </div>
    </div>
  );
}

export default Hero;
