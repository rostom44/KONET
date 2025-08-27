import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { slide as Menu } from "react-burger-menu";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaRegCopy,
  FaCheck,
} from "react-icons/fa";
import "../styles/navbar.css";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [copiedItems, setCopiedItems] = useState({});

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

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);

      setCopiedItems((prev) => ({ ...prev, [type]: true }));
      setTimeout(() => {
        setCopiedItems((prev) => ({ ...prev, [type]: false }));
      }, 2000);
    } catch (err) {
      console.error("Clipboard API failed: ", err); // Log the error
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand("copy");
        setCopiedItems((prev) => ({ ...prev, [type]: true }));
        setTimeout(() => {
          setCopiedItems((prev) => ({ ...prev, [type]: false }));
        }, 2000);
      } catch (err) {
        console.error("Failed to copy text: ", err);
      }
      document.body.removeChild(textArea);
    }
  };

  const handleCopyClick = (e, text, type) => {
    e.preventDefault();
    e.stopPropagation();
    copyToClipboard(text, type);
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
              <span
                className="copy-icon"
                title={copiedItems.phone ? "Copied!" : "Copy phone"}
                onClick={(e) => handleCopyClick(e, "+33 xxxxxxx", "phone")}
                style={{ cursor: "pointer" }}
              >
                {copiedItems.phone ? (
                  <FaCheck size={16} className="copy-icon-svg copied" />
                ) : (
                  <FaRegCopy size={16} className="copy-icon-svg" />
                )}
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
              <span
                className="copy-icon"
                title={copiedItems.email ? "Copied!" : "Copy email"}
                onClick={(e) => handleCopyClick(e, "contact@konet.fr", "email")}
                style={{ cursor: "pointer" }}
              >
                {copiedItems.email ? (
                  <FaCheck size={16} className="copy-icon-svg copied" />
                ) : (
                  <FaRegCopy size={16} className="copy-icon-svg" />
                )}
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
            <a
              href="https://www.google.com/maps/place/Lyon"
              target="_blank"
              rel="noopener noreferrer"
              className="mobile-contact-button"
            >
              <span className="contact-text">Lyon</span>
              <span className="contact-icon">
                <FaMapMarkerAlt />
              </span>
            </a>
          </div>
        </Menu>
      </div>
    </header>
  );
}

export default Navbar;
