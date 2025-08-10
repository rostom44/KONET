import { NavLink } from "react-router-dom";
import "../styles/footer.css";

function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-col brand">
          <h2 className="brand-name">KONET</h2>
          <p className="tagline">Empowering cleaning experiences</p>
          <p className="tag-year">since 20xx</p>
        </div>

        <div className="footer-col contact">
          <h3>Contact</h3>
          <a href="tel:+33xxxxxxx">+33 xxxxxxx</a>
          <a href="mailto:Konet@example.com">K7G7L@example.com</a>
        </div>

        <div className="footer-col legal">
          <h3>Legal</h3>
          <NavLink to="/conditions-générales" className="footer-link">
            Conditions Générales
          </NavLink>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} KONET — All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
