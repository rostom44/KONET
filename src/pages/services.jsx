import { useEffect, useRef, useState } from "react";
import Loading from "../components/loading.jsx";
import Card from "../components/card.jsx";
import servicesData from "../data/service.json";
import BackToTop from "../components/BackToTop";
import "../styles/services.css";

function Services() {
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [expandedIds, setExpandedIds] = useState([]);
  const expansionQueue = useRef([]);

  useEffect(() => {
    // Simulate async fetch
    const timer = setTimeout(() => {
      setServices(servicesData.services);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleToggle = (id) => {
    setExpandedIds((prev) => {
      if (prev.includes(id)) {
        // Collapsing
        expansionQueue.current = expansionQueue.current.filter((x) => x !== id);
        return prev.filter((x) => x !== id);
      } else {
        // Expanding
        if (prev.length >= 3) {
          // Remove oldest expanded card when limit reached
          const oldest = expansionQueue.current.shift();
          expansionQueue.current.push(id);
          return prev.filter((x) => x !== oldest).concat(id);
        } else {
          // Normal expansion
          expansionQueue.current.push(id);
          return [...prev, id];
        }
      }
    });
  };

  const handleCollapseAll = () => {
    setExpandedIds([]);
    expansionQueue.current = [];
  };

  if (loading) return <Loading />;

  return (
    <section>
      <div className="services-header">
        <h1>Nos Services</h1>
        <button
          className="collapse-all-btn"
          onClick={handleCollapseAll}
          aria-label="Collapse all service details"
        >
          Collapse All
        </button>
      </div>
      <div className="services-list">
        {services.map((service) => (
          <Card
            key={service.id}
            service={service}
            expanded={expandedIds.includes(service.id)}
            onToggle={() => handleToggle(service.id)}
            ariaExpanded={expandedIds.includes(service.id)}
            ariaControls={`service-details-${service.id}`}
            ariaLabel={`Afficher les détails pour ${service.name}`}
          />
        ))}
      </div>
      <BackToTop />
    </section>
  );
}
export default Services;
