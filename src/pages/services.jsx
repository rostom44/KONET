import { useEffect, useRef, useState, useCallback } from "react";
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
    const timer = setTimeout(() => {
      setServices(servicesData.services);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading && services.length > 0) {
      const params = new URLSearchParams(location.search);
      const selectedId = params.get("selected");
      if (selectedId) {
        const match = services.find((s) => String(s.id) === String(selectedId));
        if (match) {
          const matchId = String(match.id);
          setExpandedIds((prev) => {
            if (prev.includes(matchId)) return prev;
            let next = [...prev, matchId];
            if (next.length > 3) next = next.slice(next.length - 3);
            return next;
          });
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

  // Scroll to card when expanding
  const handleToggle = (id, scrollToCard = false) => {
    setExpandedIds((prev) => {
      if (prev.includes(id)) {
        expansionQueue.current = expansionQueue.current.filter((x) => x !== id);
        return prev.filter((x) => x !== id);
      }
      if (prev.length >= 3) {
        const oldest = expansionQueue.current.shift();
        expansionQueue.current.push(id);
        return prev.filter((x) => x !== oldest).concat(id);
      }
      expansionQueue.current.push(id);
      return [...prev, id];
    });
    if (scrollToCard) {
      setTimeout(() => {
        const el = document.getElementById(`service-card-${id}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 350); // Wait for DOM update/animation
    }
  };

  const handleCollapseAll = () => {
    setExpandedIds([]);
    expansionQueue.current = [];
  };

  // Responsive: get cards per row based on window width
  const getCardsPerRow = useCallback(() => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 700) return 1;
      if (window.innerWidth < 1000) return 2;
      return 3;
    }
    return 3;
  }, []);

  const [cardsPerRow, setCardsPerRow] = useState(getCardsPerRow());
  useEffect(() => {
    const handleResize = () => setCardsPerRow(getCardsPerRow());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [getCardsPerRow]);

  // Improved: On desktop, expanded cards always at the top, closed cards below in rows
  function getImprovedRows(services, expandedIds, cardsPerRow) {
    // On mobile, keep old behavior
    if (cardsPerRow === 1) {
      const result = [];
      let buffer = [];
      for (let i = 0; i < services.length; i++) {
        const sid = String(services[i].id);
        if (expandedIds.includes(sid)) {
          if (buffer.length) {
            result.push({ type: "row", cards: buffer });
            buffer = [];
          }
          result.push({ type: "expanded", card: services[i] });
        } else {
          buffer.push(services[i]);
          if (buffer.length === cardsPerRow) {
            result.push({ type: "row", cards: buffer });
            buffer = [];
          }
        }
      }
      if (buffer.length) result.push({ type: "row", cards: buffer });
      return result;
    }
    // Desktop: expanded cards at top, closed cards below
    const expanded = services.filter((s) => expandedIds.includes(String(s.id)));
    const closed = services.filter((s) => !expandedIds.includes(String(s.id)));
    const result = [];
    // Add each expanded card as a full-width row
    expanded.forEach((service) => {
      result.push({ type: "expanded", card: service });
    });
    // Add closed cards in rows
    let buffer = [];
    for (let i = 0; i < closed.length; i++) {
      buffer.push(closed[i]);
      if (buffer.length === cardsPerRow) {
        result.push({ type: "row", cards: buffer });
        buffer = [];
      }
    }
    if (buffer.length) result.push({ type: "row", cards: buffer });
    return result;
  }

  const landscapeRows = getImprovedRows(services, expandedIds, cardsPerRow);

  if (loading) return <Loading />;

  return (
    <section>
      <div className="services-header">
        <h1>Nos Services</h1>
        <button
          className="collapse-all-btn"
          onClick={handleCollapseAll}
          aria-label="Fermer tous les détails de services"
        >
          Fermer tous
        </button>
      </div>
      <div className="services-list">
        {landscapeRows.map((row, idx) => {
          if (row.type === "row") {
            return (
              <div className="services-row" key={"row-" + idx}>
                {row.cards.map((service) => {
                  const sid = String(service.id);
                  const isExpanded = expandedIds.includes(sid);
                  return (
                    <div
                      id={`service-card-${sid}`}
                      key={sid}
                      className="service-card-container"
                    >
                      <Card
                        service={service}
                        expanded={isExpanded}
                        onToggle={(scroll) => handleToggle(sid, scroll)}
                        ariaExpanded={isExpanded}
                        ariaControls={`service-details-${sid}`}
                        ariaLabel={`Afficher les détails pour ${service.name}`}
                        fullWidth={false}
                      />
                    </div>
                  );
                })}
              </div>
            );
          } else if (row.type === "expanded") {
            const service = row.card;
            const sid = String(service.id);
            return (
              <div className="services-row" key={"expanded-" + sid}>
                <div
                  id={`service-card-${sid}`}
                  className="service-card-container"
                  style={{ width: "100%" }}
                >
                  <Card
                    service={service}
                    expanded={true}
                    onToggle={(scroll) => handleToggle(sid, scroll)}
                    ariaExpanded={true}
                    ariaControls={`service-details-${sid}`}
                    ariaLabel={`Afficher les détails pour ${service.name}`}
                    fullWidth={true}
                  />
                </div>
              </div>
            );
          } else {
            return null;
          }
        })}
      </div>
      <BackToTop />
    </section>
  );
}

export default Services;
