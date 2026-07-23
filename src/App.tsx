import { useEffect, useState } from "react";
import { translations, type Language } from "./translations";
import { parsePath, buildPath, type Route } from "./lib/router";
import { pageMeta } from "./lib/seo";
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
import { Blog } from "./components/Blog";
import { BlogPost } from "./components/BlogPost";

export function App({
  initialRoute,
  initialLang,
}: {
  initialRoute: Route;
  initialLang: Language;
}) {
  const [language, setLanguage] = useState<Language>(initialLang);
  const [route, setRoute] = useState<Route>(initialRoute);
  const [nav, setNav] = useState(0);
  const t = translations[language];

  // Client-side navigation to an in-app URL.
  function go(href: string) {
    const url = new URL(href, window.location.href);
    const { lang, route: r } = parsePath(url.pathname);
    window.history.pushState(null, "", url.pathname + url.search + url.hash);
    setLanguage(lang);
    setRoute(r);
    setNav((n) => n + 1);
  }

  // Intercept same-origin link clicks so navigation stays a SPA transition.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      )
        return;
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;
      const target = anchor.getAttribute("target");
      if (target && target !== "_self") return;
      if (anchor.hasAttribute("download")) return;
      const href = anchor.getAttribute("href");
      if (!href) return;
      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) return;
      e.preventDefault();
      go(url.pathname + url.search + url.hash);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    function onPop() {
      const { lang, route: r } = parsePath(window.location.pathname);
      setLanguage(lang);
      setRoute(r);
      setNav((n) => n + 1);
    }
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // After each navigation, scroll to the hash target (home sections) or the top.
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash !== "#top") {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView();
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [nav]);

  // Keep the document language, title and description in sync on the client
  // (the prerendered HTML already carries the correct values for crawlers).
  useEffect(() => {
    document.documentElement.lang = language;
    const meta = pageMeta(route, language);
    document.title = meta.title;
    let desc = document.querySelector('meta[name="description"]');
    if (!desc) {
      desc = document.createElement("meta");
      desc.setAttribute("name", "description");
      document.head.appendChild(desc);
    }
    desc.setAttribute("content", meta.description);
  }, [route, language]);

  const switchLanguage = (lang: Language) => go(buildPath(route, lang));

  return (
    <>
      <Header t={t} language={language} setLanguage={switchLanguage} />
      {route.name === "impressum" ? (
        <Impressum t={t} language={language} />
      ) : route.name === "blog" ? (
        <Blog t={t} language={language} />
      ) : route.name === "post" ? (
        <BlogPost t={t} language={language} slug={route.slug} />
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
      <Footer t={t} language={language} />
    </>
  );
}
