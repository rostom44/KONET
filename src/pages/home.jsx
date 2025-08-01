import Hero from "../components/hero";
import About from "../components/about";
import Services from "../components/service";
import BackToTop from "../components/BackToTop";
import "../styles/home.css";

function home() {
  return (
    <div>
      <Hero />
      <h2
        style={{
          textAlign: "center",
          textTransform: "capitalize",
          fontSize: "2rem",
          margin: "2rem",
        }}
      >
        qui sommes-nous ?
      </h2>
      <About />
      <h2
        style={{
          textAlign: "center",
          textTransform: "capitalize",
          fontSize: "2rem",
          margin: "2rem",
        }}
      >
        nous services ?
      </h2>
      <Services />
      <BackToTop />
    </div>
  );
}

export default home;
