import { useState, useEffect } from "react";
import { FiArrowUp } from "react-icons/fi";

function BackToTop() {
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 120);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <button
      className={`back-to-top-btn${hovered ? " hovered" : ""}`}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Remonter en haut de la page"
    >
      <FiArrowUp size={28} />
      <span className={`back-to-top-tooltip${hovered ? " show" : ""}`}>
        Remonter en haut
      </span>
    </button>
  );
}

export default BackToTop;
