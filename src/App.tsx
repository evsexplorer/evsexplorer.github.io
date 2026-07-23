import { useEffect, useState } from "react";
import { translations, type Language } from "./translations";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Personas } from "./components/Personas";
import { Tour } from "./components/Tour";
import { Features } from "./components/Features";
import { ApiSection } from "./components/ApiSection";
import { AiSection } from "./components/AiSection";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { Impressum } from "./components/Impressum";

const titles: Record<Language, string> = {
  en: "EVSExplorer - OCPP 2.0.1 Testing & Monitoring for Charging Stations",
  de: "EVSExplorer - OCPP 2.0.1 Testen & Überwachen von Ladestationen",
};

function initialLanguage(): Language {
  const param = new URLSearchParams(window.location.search).get("lang");
  if (param === "de" || param === "en") return param;
  return navigator.language.toLowerCase().startsWith("de") ? "de" : "en";
}

type Route = "home" | "impressum";

function currentRoute(): Route {
  return window.location.hash === "#impressum" ? "impressum" : "home";
}

export function App() {
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const [route, setRoute] = useState<Route>(currentRoute);
  const t = translations[language];

  useEffect(() => {
    const onHashChange = () => setRoute(currentRoute());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    if (route === "impressum") {
      window.scrollTo(0, 0);
      return;
    }
    // Coming back to the landing page via a section anchor (e.g. a header nav
    // click on the Impressum page): the browser's native scroll fired while the
    // Impressum view was still mounted, so the target section did not exist yet
    // and it fell back to the top. Now that the sections are rendered, scroll to
    // the target ourselves.
    const hash = window.location.hash;
    if (hash && hash !== "#impressum" && hash !== "#top") {
      document.getElementById(hash.slice(1))?.scrollIntoView();
    }
  }, [route]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.title =
      route === "impressum"
        ? `${t.impressum.title} - EVSExplorer`
        : titles[language];
    const url = new URL(window.location.href);
    url.searchParams.set("lang", language);
    window.history.replaceState(null, "", url);
  }, [language, route, t]);

  return (
    <>
      <Header t={t} language={language} setLanguage={setLanguage} />
      {route === "impressum" ? (
        <Impressum t={t} />
      ) : (
        <main>
          <Hero t={t} />
          <Personas t={t} />
          <Tour t={t} />
          <Features t={t} />
          <ApiSection t={t} />
          <AiSection t={t} />
          <Contact t={t} />
        </main>
      )}
      <Footer t={t} />
    </>
  );
}
