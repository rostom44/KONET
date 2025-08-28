import { useEffect, useState } from "react";
import Hero from "../components/hero";
import About from "../components/about";
import Services from "../components/service";
import BackToTop from "../components/BackToTop";
import "../styles/home.css";

function Home() {
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(".animate-on-scroll");
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div>
      <section
        id="hero-section"
        className={`animate-on-scroll ${isVisible["hero-section"] ? "visible" : ""}`}
      >
        <Hero />
      </section>
      <section
        id="about-headline"
        className={`animate-on-scroll ${isVisible["about-headline"] ? "visible" : ""}`}
      >
        <h2 className="headlines">qui sommes-nous ?</h2>
      </section>
      <section
        id="about-section"
        className={`animate-on-scroll ${isVisible["about-section"] ? "visible" : ""}`}
      >
        <About />
      </section>
      <section
        id="services-headline"
        className={`animate-on-scroll ${isVisible["services-headline"] ? "visible" : ""}`}
      >
        <h2 className="headlines">nos services ?</h2>
      </section>
      <section
        id="services-section"
        className={`animate-on-scroll ${isVisible["services-section"] ? "visible" : ""}`}
      >
        <Services />
      </section>
      <BackToTop />
    </div>
  );
}

export default Home;
