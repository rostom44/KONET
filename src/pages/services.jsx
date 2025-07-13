import { useEffect, useState } from "react";
import Loading from "../components/loading.jsx";
import servicesData from "../data/service.json";
import "../styles/services.css";

function Services() {
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);

  useEffect(() => {
    // Simulate async fetch
    const timer = setTimeout(() => {
      setServices(servicesData.services);
      setLoading(false);
    }, 1000); // simulate delay

    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loading />;

  return (
    <section>
      <h1>Nos Services</h1>
      <ul>
        {services.map((service) => (
          <li key={service.id}>
            <h2>{service.name}</h2>
            <p>{service.description || "Description à venir..."}</p>
            {/* Optional: show icon or hint if needed */}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Services;
