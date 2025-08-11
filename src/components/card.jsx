import { FiChevronDown } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";

function Card({
  service,
  expanded,
  onToggle,
  ariaExpanded,
  ariaControls,
  ariaLabel,
  fullWidth,
}) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const cardRef = useRef(null);
  const observerRef = useRef(null);

  // Handle animation state
  useEffect(() => {
    if (expanded !== undefined) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [expanded]);

  // Intersection Observer for scroll-triggered animations
  useEffect(() => {
    if (cardRef.current) {
      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in");
            observerRef.current?.unobserve(entry.target);
          }
        },
        { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
      );

      observerRef.current.observe(cardRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const handleClick = async (e) => {
    e.preventDefault();
    if (!isAnimating && !isLoading) {
      setIsLoading(true);
      // Small delay to show loading state
      setTimeout(() => {
        onToggle();
        setIsLoading(false);
      }, 150);
    }
  };

  const handleKeyDown = async (e) => {
    if ((e.key === "Enter" || e.key === " ") && !isAnimating && !isLoading) {
      e.preventDefault();
      setIsLoading(true);
      setTimeout(() => {
        onToggle();
        setIsLoading(false);
      }, 150);
    }
  };

  return (
    <article
      ref={cardRef}
      className={`service-card${fullWidth ? " service-card--fullwidth" : ""}${
        isAnimating ? " animating" : ""
      }${isLoading ? " loading" : ""}`}
      tabIndex={-1}
      aria-live={expanded ? "polite" : undefined}
      role="region"
      aria-labelledby={`service-title-${service.id}`}
    >
      <header
        className="service-header"
        onClick={handleClick}
        aria-expanded={ariaExpanded}
        aria-controls={ariaControls}
        aria-label={ariaLabel}
        role="button"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        {fullWidth ? (
          // Expanded layout - horizontal
          <>
            <div className="service-icon">
              {service.icon && service.icon !== "path" ? (
                <img src={service.icon} alt={`${service.name} icon`} />
              ) : (
                <span
                  style={{ color: "#fff", fontSize: 36 }}
                  aria-hidden="true"
                >
                  &#128736;
                </span>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <h2 id={`service-title-${service.id}`}>{service.name}</h2>
              <p>{service.description || "Description à venir..."}</p>
              <div className={`service-arrow${expanded ? " expanded" : ""}`}>
                <FiChevronDown aria-hidden="true" />
              </div>
            </div>
          </>
        ) : (
          // Compact layout - vertical
          <>
            <h2 id={`service-title-${service.id}`}>{service.name}</h2>
            <div className="service-icon">
              {service.icon && service.icon !== "path" ? (
                <img src={service.icon} alt={`${service.name} icon`} />
              ) : (
                <span
                  style={{ color: "#fff", fontSize: 36 }}
                  aria-hidden="true"
                >
                  &#128736;
                </span>
              )}
            </div>
            <p>{service.description || "Description à venir..."}</p>
            <div className={`service-arrow${expanded ? " expanded" : ""}`}>
              <FiChevronDown aria-hidden="true" />
            </div>
          </>
        )}
      </header>

      <section
        className={`service-details${expanded ? "" : " collapsed"}`}
        id={ariaControls}
        aria-hidden={!expanded}
      >
        {expanded && (
          <>
            <p>{service.content || "Plus de détails à venir..."}</p>
            {service.hint && (
              <div className="service-hint">
                <span>Remarque :</span> {service.hint}
              </div>
            )}
          </>
        )}
      </section>
    </article>
  );
}

export default Card;
