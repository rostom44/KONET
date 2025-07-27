import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { slide as Menu } from "react-burger-menu";
import { FaPhoneAlt } from "react-icons/fa";
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

        <div className="phone">
          <a href="tel:+33xxxxxxx" className="phone-link">
            <span className="phone-number">+33 xxxxxxx</span>
            <span className="phone-icon">
              <FaPhoneAlt />
            </span>
          </a>
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

          {/* Mobile phone section */}
          <div className="mobile-phone-section">
            <a href="tel:+33xxxxxxx" className="mobile-phone-button">
              <span className="phone-number">+33 xxxxxxx</span>
              <span className="phone-icon">
                <FaPhoneAlt />
              </span>
            </a>
          </div>
        </Menu>
      </div>
    </header>
  );
}

export default Navbar;
