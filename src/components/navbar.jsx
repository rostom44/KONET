import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/navbar.css";

function navbar() {
  return (
    <header>
      <nav>
        <ul>
          <li>
            <NavLink to="/" end>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/services">Service</NavLink>
          </li>
          {/* <li>
            <NavLink to="/about">About</NavLink>
          </li> */}
        </ul>
      </nav>
    </header>
  );
}

export default navbar;
