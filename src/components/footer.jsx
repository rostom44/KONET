import { NavLink } from "react-router-dom";
import "../styles/footer.css";

function footer() {
  return (
    <footer>
      <p className="copyright">
        {" "}
        © {new Date().getFullYear()} <span className="footer-logo">KONET</span>{" "}
        <br />
        since 20xx
      </p>
      <p>
        <span className="footer-email">Contact us:</span>{" "}
        <a href="tel:+33xxxxxxx">+33 xxxxxxx</a> |{" "}
        <a href="mailto:K7G7L@example.com">K7G7L@example.com</a>
      </p>
      <NavLink to="/conditions-générales" className="footer-link">
        Conditions Générales
      </NavLink>
    </footer>
  );
}

export default footer;
