import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { logoSrc } from "./components/brand/AppLogo.jsx";

// Favicon from src/assets/updated_logo_nobg.png (Vite resolves URL at build time)
function setFavicon(href) {
  let link = document.querySelector("link[rel='icon']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.type = "image/png";
  link.href = href;
}
setFavicon(logoSrc);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
