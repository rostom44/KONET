import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./styles/root.css";
import App from "./App.jsx";
import Home from "./pages/home.jsx";
import Services from "./pages/services.jsx";

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
      // {
      //   path: "/about",
      //   element: ,
      // },
      // {
      //   path: "/contact",
      //   element: ,
      // },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} basename="./" />
  </StrictMode>
);
