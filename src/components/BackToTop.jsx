import { useState, useEffect } from "react";
import { FiArrowUp } from "react-icons/fi";
import "../styles/BackToTop.css";

function BackToTop() {
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrolledPercent = docHeight > 0 ? scrollY / docHeight : 0;
      setVisible(scrolledPercent > 0.25);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (isMobile) {
      setHovered(true);
      setTimeout(() => setHovered(false), 600);
    }
  };

  if (!visible) return null;

  return (
    <button
      className={`back-to-top-btn${hovered ? " hovered" : ""}`}
      onClick={handleClick}
      onMouseEnter={() => {
        if (!isMobile) setHovered(true);
      }}
      onMouseLeave={() => {
        if (!isMobile) setHovered(false);
      }}
      aria-label="Remonter en haut de la page"
      tabIndex={0}
    >
      <FiArrowUp size={28} />
      <span className={`back-to-top-tooltip${hovered ? " show" : ""}`}>
        Remonter en haut
      </span>
    </button>
  );
}

export default BackToTop;
