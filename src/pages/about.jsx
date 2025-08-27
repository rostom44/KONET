import React, { useEffect, useState } from "react";
import BackToTop from "../components/BackToTop";
import "../styles/about.css";

const AboutPage = () => {
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(".animate-on-scroll");
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="about-container">
      {/* Who We Are Section */}
      <section
        id="who-we-are"
        className={`section animate-on-scroll ${isVisible["who-we-are"] ? "visible" : ""}`}
      >
        <div className="content-wrapper">
          <div className="section-header">
            <h2>Qui Sommes-Nous ?</h2>
            <span className="section-icon">🧼</span>
          </div>

          <div className="section-content">
            <div className="text-content">
              <p className="intro-text">
                Nous sommes <strong>KONET</strong>, une équipe locale basée à
                Lyon, spécialisée dans les services de nettoyage professionnel
                pour les particuliers et les entreprises.
              </p>

              <div className="values-grid">
                <div className="value-card">
                  <div className="value-icon">🔒</div>
                  <h3>Fiabilité</h3>
                  <p>Une équipe ponctuelle et digne de confiance</p>
                </div>
                <div className="value-card">
                  <div className="value-icon">🤫</div>
                  <h3>Discrétion</h3>
                  <p>Respect total de votre intimité et espace</p>
                </div>
                <div className="value-card">
                  <div className="value-icon">✨</div>
                  <h3>Attention aux détails</h3>
                  <p>Chaque recoin compte pour nous</p>
                </div>
              </div>

              <p className="team-description">
                Notre équipe est composée de professionnels formés, assurés et
                rigoureusement sélectionnés. Nous sommes fiers de notre esprit
                d'équipe et de notre engagement envers l'excellence.
              </p>
            </div>

            <div className="image-content">
              <div className="team-image-placeholder">
                <img
                  className="team-image-placeholder"
                  src="./assets/team.jpg"
                  alt="L'Équipe KONET logo"
                />
                <div className="image-overlay">
                  <span>L'Équipe KONET</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section
        id="our-mission"
        className={`section section-dark animate-on-scroll ${isVisible["our-mission"] ? "visible" : ""}`}
      >
        <div className="content-wrapper">
          <div className="section-header">
            <span className="section-icon">🎯</span>
            <h2>Notre Mission</h2>
          </div>

          <div className="mission-content">
            <p className="mission-statement">
              Notre mission est simple : apporter la tranquillité d'esprit à nos
              clients en leur offrant des espaces impeccables où les gens
              peuvent se sentir à l'aise, en sécurité et productifs.
            </p>

            <div className="mission-reasons">
              <h3>Pourquoi nous nettoyons ?</h3>
              <p>
                Nous croyons qu'un espace propre réduit le stress, améliore la
                santé et crée un environnement plus positif. Ce n'est pas
                seulement une question de propreté, c'est une question de
                bien-être.
              </p>
            </div>

            <div className="commitments">
              <h3>Nos Engagements</h3>
              <div className="commitment-list">
                <div className="commitment-item">
                  <span className="check-icon">✅</span>
                  <span>Produits écologiques certifiés</span>
                </div>
                <div className="commitment-item">
                  <span className="check-icon">✅</span>
                  <span>Garantie de ponctualité</span>
                </div>
                <div className="commitment-item">
                  <span className="check-icon">✅</span>
                  <span>Satisfaction garantie ou remboursement</span>
                </div>
                <div className="commitment-item">
                  <span className="check-icon">✅</span>
                  <span>Personnel formé et assuré</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section
        id="our-story"
        className={`section animate-on-scroll ${isVisible["our-story"] ? "visible" : ""}`}
      >
        <div className="content-wrapper">
          <div className="section-header">
            <span className="section-icon">📖</span>
            <h2>Notre Histoire</h2>
          </div>

          <div className="story-timeline">
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h3>Le Début</h3>
                <p>
                  Tout a commencé avec une passion pour l'organisation et la
                  propreté, et le désir d'aider les familles et les entreprises
                  à gagner du temps précieux.
                </p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h3>Notre Croissance</h3>
                <p>
                  D'une petite entreprise familiale avec quelques clients
                  fidèles, nous sommes devenus un service local de confiance,
                  tout en gardant cette touche personnelle qui nous définit.
                </p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h3>Aujourd'hui</h3>
                <p>
                  Nous comprenons ce que c'est que de rentrer chez soi fatigué
                  et de voir encore des tâches ménagères qui attendent. C'est
                  pourquoi nous faisons ce que nous faisons : vous libérer du
                  temps pour ce qui compte vraiment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section
        id="why-choose-us"
        className={`section section-accent animate-on-scroll ${isVisible["why-choose-us"] ? "visible" : ""}`}
      >
        <div className="content-wrapper">
          <div className="section-header">
            <span className="section-icon">💡</span>
            <h2>Pourquoi Choisir KONET ?</h2>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔄</div>
              <h3>Fiabilité</h3>
              <p>Service régulier et ponctuel</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌱</div>
              <h3>Écologique</h3>
              <p>Produits respectueux de l'environnement</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📅</div>
              <h3>Flexibilité</h3>
              <p>Horaires adaptés à vos besoins</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👨‍🏫</div>
              <h3>Professionnels</h3>
              <p>Équipe formée et certifiée</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="content-wrapper">
          <h2>Prêt à Transformer Votre Espace ?</h2>
          <p>Contactez-nous dès aujourd'hui pour un rendez-vous rapide.</p>
          <div className="cta-buttons">
            <button className="btn btn-secondary">Nous Contacter</button>
          </div>
        </div>
      </section>
      <BackToTop />
    </div>
  );
};

export default AboutPage;
