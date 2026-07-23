import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { App } from "./App";
import { parsePath } from "./lib/router";
import "./index.css";

const { route, lang } = parsePath(window.location.pathname);
const rootEl = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App initialRoute={route} initialLang={lang} />
  </StrictMode>
);

// Prerendered pages ship server-rendered markup, so hydrate them. The dev server
// and the 404 fallback serve an empty root, so mount fresh there.
if (rootEl.hasChildNodes()) {
  hydrateRoot(rootEl, app);
} else {
  createRoot(rootEl).render(app);
}
