import { useState } from "react";
import type { Language, Translation } from "../translations";
import logoMark from "../assets/logo-mark.png";

interface HeaderProps {
  t: Translation;
  language: Language;
  setLanguage: (lang: Language) => void;
}

export function Header({ t, language, setLanguage }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { href: "#product", label: t.nav.product },
    { href: "#features", label: t.nav.features },
    { href: "#api", label: t.nav.api },
    { href: "#ai", label: t.nav.ai },
    { href: "#contact", label: t.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-navy-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#top" className="flex items-center gap-2">
          <img src={logoMark} alt="" className="h-9 w-auto" />
          <span className="text-xl font-bold tracking-tight">
            <span className="text-navy-900">EVSE</span>
            <span className="text-lime-500">xplorer</span>
          </span>
        </a>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Main">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-navy-700 transition-colors hover:text-brand-600"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div
            className="flex overflow-hidden rounded-md border border-navy-200 text-sm font-medium"
            role="group"
            aria-label="Language"
          >
            {(["en", "de"] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLanguage(lang)}
                aria-pressed={language === lang}
                className={
                  language === lang
                    ? "bg-navy-900 px-3 py-1.5 text-white"
                    : "bg-white px-3 py-1.5 text-navy-700 transition-colors hover:bg-navy-50"
                }
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

          <a
            href="#contact"
            className="hidden rounded-md bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-600 sm:block"
          >
            {t.requestDemo}
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label="Menu"
            className="flex h-10 w-10 items-center justify-center rounded-md border border-navy-200 text-navy-700 transition-colors hover:bg-navy-50 lg:hidden"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {menuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="mobile-nav"
          className="border-t border-navy-100 bg-white lg:hidden"
          aria-label="Main"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3 sm:px-6">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-md px-3 py-2 text-base font-medium text-navy-700 transition-colors hover:bg-navy-50 hover:text-brand-600"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="mt-1 rounded-md bg-brand-500 px-3 py-2 text-center text-base font-semibold text-white shadow-sm transition-colors hover:bg-brand-600 sm:hidden"
            >
              {t.requestDemo}
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
