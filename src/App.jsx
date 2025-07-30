import { Outlet } from "react-router-dom";

import "./styles/App.css";
import Navbar from "./components/navbar.jsx";
import LocationChecker from "./components/location";
import Footer from "./components/footer";

function App() {
  return (
    <main>
      <Navbar />
      <LocationChecker />
      <Outlet />
      <Footer />
    </main>
  );
}

export default App;
