import { FiChevronDown } from "react-icons/fi";

function Card({
  service,
  expanded,
  onToggle,
  ariaExpanded,
  ariaControls,
  ariaLabel,
}) {
  return (
    <div className="service-card">
      <div
        className="service-header"
        onClick={onToggle}
        style={{ width: "100%", cursor: "pointer" }}
        aria-expanded={ariaExpanded}
        aria-controls={ariaControls}
        aria-label={ariaLabel}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
      >
        <h2>{service.name}</h2>
        <div className="service-icon">
          {service.icon && service.icon !== "path" ? (
            <img src={service.icon} alt="icon" />
          ) : (
            <span style={{ color: "#fff", fontSize: 36 }}>&#128736;</span>
          )}
        </div>
        <p style={{ marginBottom: 0 }}>
          {service.description || "Description à venir..."}
        </p>
        <div className={`service-arrow${expanded ? " expanded" : ""}`}>
          <FiChevronDown />
        </div>
      </div>
      <div
        className={`service-details${expanded ? "" : " collapsed"}`}
        id={ariaControls}
      >
        <p>{service.content || "Plus de détails à venir..."}</p>
        {service.hint && (
          <div className="service-hint">
            <span>remarque :</span> {service.hint}
          </div>
        )}
      </div>
    </div>
  );
}

export default Card;
