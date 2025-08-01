import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { slide as Menu } from "react-burger-menu";
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import "../styles/navbar.css";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50); // Circle appears after 50px scroll
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMenuStateChange = (state) => {
    setMenuOpen(state.isOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
    // Remove focus from burger menu elements to prevent aria-hidden warning
    setTimeout(() => {
      const burgerButton = document.querySelector("#react-burger-cross-btn");
      const activeElement = document.activeElement;
      if (
        burgerButton &&
        activeElement &&
        (activeElement === burgerButton || burgerButton.contains(activeElement))
      ) {
        activeElement.blur();
      }
    }, 100);
  };

  return (
    <header>
      <div className={`navbar-container ${isScrolled ? "scrolled" : ""}`}>
        <h1 className="logo">KONET</h1>

        {/* Desktop nav */}
        <nav className="nav-desktop">
          <NavLink to="/" end>
            Accueil
          </NavLink>
          <NavLink to="/services">Services</NavLink>
          <NavLink to="/a propos">À propos</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>

        {/* Desktop contact section */}
        <div className="contact-section">
          <div className="phone-circle">
            <span className="phone-icon-circle">
              <FaPhoneAlt />
            </span>
            <a href="tel:+33xxxxxxx" className="phone-link">
              <span className="phone-number">+33 xxxxxxx</span>
              <span className="phone-icon">
                <FaPhoneAlt />
              </span>
            </a>
          </div>
          <div className="email-circle">
            <span className="email-icon-circle">
              <FaEnvelope />
            </span>
            <a href="mailto:contact@konet.fr" className="email-link">
              <span className="email-text">contact@konet.fr</span>
              <span className="email-icon">
                <FaEnvelope />
              </span>
            </a>
          </div>
        </div>

        {/* Mobile burger menu */}
        <Menu
          right
          className="nav-mobile"
          isOpen={menuOpen}
          onStateChange={handleMenuStateChange}
        >
          <NavLink to="/" end onClick={closeMenu}>
            Accueil
          </NavLink>
          <NavLink to="/services" onClick={closeMenu}>
            Services
          </NavLink>
          <NavLink to="/a propos" onClick={closeMenu}>
            À propos
          </NavLink>
          <NavLink to="/contact" onClick={closeMenu}>
            Contact
          </NavLink>

          {/* Mobile contact section */}
          <div className="mobile-contact-section">
            <a href="tel:+33xxxxxxx" className="mobile-contact-button">
              <span className="contact-text">+33 xxxxxxx</span>
              <span className="contact-icon">
                <FaPhoneAlt />
              </span>
            </a>
            <a href="mailto:contact@konet.fr" className="mobile-contact-button">
              <span className="contact-text">contact@konet.fr</span>
              <span className="contact-icon">
                <FaEnvelope />
              </span>
            </a>
          </div>
        </Menu>
      </div>
    </header>
  );
}

export default Navbar;
