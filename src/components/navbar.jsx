// Navbar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { slide as Menu } from "react-burger-menu";
import { FaPhoneAlt } from "react-icons/fa";
import "../styles/navbar.css";

function Navbar() {
  return (
    <header>
      <div className="navbar-container">
        <h1 className="logo">KONET</h1>

        {/* Desktop nav */}
        <nav className="nav-desktop">
          <NavLink to="/" end>
            Accueil
          </NavLink>
          <NavLink to="/services">Services</NavLink>
          <NavLink to="/a propos">À propos</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>

        <div className="phone">
          <a href="tel:+33xxxxxxx" className="phone-link">
            <span className="phone-number">+33 xxxxxxx</span>
            <span className="phone-icon">
              <FaPhoneAlt />
            </span>
          </a>
        </div>

        {/* Mobile burger menu */}
        <Menu right className="nav-mobile">
          <NavLink to="/" end>
            Accueil
          </NavLink>
          <NavLink to="/services">Services</NavLink>
          {/* <NavLink to="/about">À propos</NavLink> */}
        </Menu>
      </div>
    </header>
  );
}

export default Navbar;
