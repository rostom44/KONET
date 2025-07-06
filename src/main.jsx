import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./styles/root.css";
import App from "./App.jsx";
import Home from "./pages/home.jsx";
import Services from "./pages/services.jsx";
import About from "./pages/about.jsx";
import Contact from "./pages/contact.jsx";

const router = createBrowserRouter([
  {
    element: <App />,
    // errorElement: <div>Page not found</div>,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/services",
        element: <Services />,
      },
      {
        path: "/a propos",
        element: <About />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} basename="./" />
  </StrictMode>
);
