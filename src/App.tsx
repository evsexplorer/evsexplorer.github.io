import { useEffect, useState } from "react";
import { translations, type Language } from "./translations";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Personas } from "./components/Personas";
import { Tour } from "./components/Tour";
import { Features } from "./components/Features";
import { ApiSection } from "./components/ApiSection";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";

const titles: Record<Language, string> = {
  en: "EVSExplorer - Professional OCPP Testing & Monitoring",
  de: "EVSExplorer - Professionelles OCPP Testen & Überwachen",
};

function initialLanguage(): Language {
  const param = new URLSearchParams(window.location.search).get("lang");
  if (param === "de" || param === "en") return param;
  return navigator.language.toLowerCase().startsWith("de") ? "de" : "en";
}

export function App() {
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const t = translations[language];

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = titles[language];
    const url = new URL(window.location.href);
    url.searchParams.set("lang", language);
    window.history.replaceState(null, "", url);
  }, [language]);

  return (
    <>
      <Header t={t} language={language} setLanguage={setLanguage} />
      <main>
        <Hero t={t} />
        <Personas t={t} />
        <Tour t={t} />
        <Features t={t} />
        <ApiSection t={t} />
        <Contact t={t} />
      </main>
      <Footer t={t} />
    </>
  );
}
