import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Loading from "../components/loading.jsx";
import Card from "../components/card.jsx";
import servicesData from "../data/service.json";
import BackToTop from "../components/BackToTop";
import "../styles/services.css";

function Services() {
  const location = useLocation();
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

  // On mount, check for selected service in URL and expand/scroll to it
  useEffect(() => {
    if (!loading && services.length > 0) {
      const params = new URLSearchParams(location.search);
      const selectedId = params.get("selected");
      if (selectedId) {
        // Find the matching service id as string or number
        const match = services.find((s) => String(s.id) === String(selectedId));
        if (match) {
          const matchId = String(match.id);
          setExpandedIds((prev) => {
            if (prev.includes(matchId)) return prev;
            let next = [...prev, matchId];
            if (next.length > 3) next = next.slice(next.length - 3);
            return next;
          });
          // Update expansionQueue
          if (!expansionQueue.current.includes(matchId)) {
            expansionQueue.current.push(matchId);
            if (expansionQueue.current.length > 3)
              expansionQueue.current.shift();
          }
          setTimeout(() => {
            const el = document.getElementById(`service-card-${matchId}`);
            if (el) {
              el.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          }, 200);
        }
      }
    }
  }, [loading, services, location.search]);

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
        {services.map((service) => {
          const sid = String(service.id);
          return (
            <div id={`service-card-${sid}`} key={sid}>
              <Card
                service={service}
                expanded={expandedIds.includes(sid)}
                onToggle={() => handleToggle(sid)}
                ariaExpanded={expandedIds.includes(sid)}
                ariaControls={`service-details-${sid}`}
                ariaLabel={`Afficher les détails pour ${service.name}`}
              />
            </div>
          );
        })}
      </div>
      <BackToTop />
    </section>
  );
}
export default Services;
