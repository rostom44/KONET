import { useState, useEffect } from "react";
import { FiHome, FiTool, FiPhone, FiArrowLeft, FiSearch } from "react-icons/fi";
import "../styles/error.css";

export default function ErrorPage() {
  const [suggestedPages, setSuggestedPages] = useState([]);

  // Simulate finding suggested pages based on current URL
  useEffect(() => {
    const currentPath = window.location.pathname.toLowerCase();
    const suggestions = [];

    // Smart suggestions based on URL patterns
    if (currentPath.includes("service")) {
      suggestions.push({ name: "Services", path: "/services" });
    }
    if (currentPath.includes("contact")) {
      suggestions.push({ name: "Contact", path: "/contact" });
    }
    if (currentPath.includes("about")) {
      suggestions.push({ name: "À propos", path: "/a propos" });
    }

    // Add popular pages if no specific suggestions
    if (suggestions.length === 0) {
      suggestions.push({ name: "Services", path: "/services" });
    }

    setSuggestedPages(suggestions);
  }, []);

  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/";
    }
  };

  const handleLinkClick = (path) => {
    window.location.href = path;
  };

  return (
    <div className="error-page">
      <div className="error-animation">
        <div className="error-icon">
          <FiSearch size={48} />
        </div>
        <h1 className="error-title">404</h1>
      </div>

      <div className="error-content">
        <h2 className="error-subtitle">Page introuvable</h2>
        <p className="error-message">
          Désolé, la page que vous cherchez n'existe pas ou a été déplacée.
        </p>
      </div>

      {/* Smart suggestions */}
      {suggestedPages.length > 0 && (
        <div className="error-suggestions">
          <p className="suggestions-title">Vous cherchiez peut-être :</p>
          <div className="suggestions-links">
            {suggestedPages.map((page, index) => (
              <button
                key={index}
                className="suggestion-link"
                onClick={() => handleLinkClick(page.path)}
              >
                {page.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main navigation */}
      <div className="error-options">
        <button onClick={handleGoBack} className="error-link secondary">
          <FiArrowLeft size={18} />
          Retour
        </button>
        <button
          className="error-link primary"
          onClick={() => handleLinkClick("/")}
        >
          <FiHome size={18} />
          Accueil
        </button>
        <button
          className="error-link"
          onClick={() => handleLinkClick("/services")}
        >
          <FiTool size={18} />
          Services
        </button>
        <button
          className="error-link"
          onClick={() => handleLinkClick("/contact")}
        >
          <FiPhone size={18} />
          Contact
        </button>
      </div>

      {/* Additional help */}
      <div className="error-help">
        <p className="help-text">
          Besoin d'aide ? Appelez-nous au <strong>04 XX XX XX XX</strong>
        </p>
        {/* 
          <span className="help-separator">|</span>
          <button className="help-link" onClick={() => handleLinkClick('/contact')}>
            Signaler un problème
          </button>
        </div>
        */}
      </div>
    </div>
  );
}
