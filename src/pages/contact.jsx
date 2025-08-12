import React from "react";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaLinkedin,
  FaFacebook,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";
import "../styles/contact.css";

function Contact() {
  return (
    <main className="contact-page">
      {/* Mobile logo */}
      <section className="contact-logo-wrapper mobile-logo animate-pop">
        <div className="contact-logo-circle">
          <img src="/logo.avif" alt="Logo KONET" className="contact-logo" />
        </div>
      </section>
      <section className="contact-intro animate-fade">
        {/* Left column / Intro */}
        <h1 className="contact-title">Contactez-nous</h1>
        <p className="contact-subtitle">
          Prenez contact et nous répondrons à toutes vos questions dans les plus
          brefs délais.
        </p>

        <div className="contact-options">
          <a className="contact-card" href="tel:+33xxxxxxxxx">
            <span className="contact-icon">
              <FaPhone />
            </span>
            <span className="contact-text">+33 x xx xx xx xx</span>
          </a>

          <a className="contact-card" href="mailto:contact@konet.com">
            <span className="contact-icon">
              <FaEnvelope />
            </span>
            <span className="contact-text">contact@konet.com</span>
          </a>

          <a
            className="contact-card"
            href="https://www.google.com/maps/place/Lyon"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="contact-icon">
              <FaMapMarkerAlt />
            </span>
            <span className="contact-text">Lyon (zone d’intervention)</span>
          </a>
        </div>
      </section>

      {/* Socials */}
      <aside className="contact-side animate-fade">
        <h4 className="social-title">Suivez-nous</h4>
        <div className="social-links">
          <a className="social-link" href="https://linkedin.com">
            <FaLinkedin />
          </a>
          <a className="social-link" href="https://facebook.com">
            <FaFacebook />
          </a>
          <a className="social-link" href="https://instagram.com">
            <FaInstagram />
          </a>
          <a className="social-link" href="https://twitter.com">
            <FaTwitter />
          </a>
        </div>
        <div className="privacy-notice">
          <small>
            * Nous ne collectons aucune donnée personnelle via ce site. Toute
            communication se fait par téléphone ou email.
          </small>
        </div>
      </aside>

      {/* Desktop logo (hidden on mobile) */}
      <section className="contact-logo-wrapper desktop-logo animate-pop">
        <div className="contact-logo-circle">
          <img src="/logo.avif" alt="Logo KONET" className="contact-logo" />
        </div>
      </section>
    </main>
  );
}

export default Contact;
