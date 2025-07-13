import { useEffect, useState } from "react";
import Loading from "../components/loading.jsx";
import servicesData from "../data/service.json";

function Service() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    // Simulate async fetch
    const timer = setTimeout(() => {
      setServices(servicesData.services);
    }, 1000); // simulate delay
    return () => clearTimeout(timer);
  }, []);

  // Responsive: 3 for mobile, 6 for desktop
  const getVisibleServices = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 768) {
        return services.slice(0, 3);
      } else {
        return services.slice(0, 6);
      }
    }
    return services.slice(0, 6); // fallback
  };

  const [visibleServices, setVisibleServices] = useState(getVisibleServices());

  useEffect(() => {
    const handleResize = () => {
      setVisibleServices(getVisibleServices());
    };
    window.addEventListener("resize", handleResize);
    setVisibleServices(getVisibleServices());
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line
  }, [services]);

  return (
    <div className="services-list">
      {visibleServices.map(({ id, name, icon, description }) => (
        <div className="service-card" key={id}>
          <h3>{name}</h3>
          <div className="service-icon">{icon}</div>
          <p>{description}</p>
        </div>
      ))}
    </div>
  );
}

export default Service;
