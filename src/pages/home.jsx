import React from "react";
import Hero from "../components/hero";
import About from "../components/about";

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
    </div>
  );
}

export default home;
