import { Outlet } from "react-router-dom";

import "./styles/App.css";
import Navbar from "./components/navbar.jsx";

function App() {
  return (
    <>
      <Navbar />
      <Outlet />
      <footer>
        <p> {new Date().getFullYear()} konet</p>
        <p>
          <a href="mailto:K7G7L@example.com">K7G7L@example.com</a>
        </p>
      </footer>
    </>
  );
}

export default App;
