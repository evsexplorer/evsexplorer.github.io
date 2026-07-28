import type { Language, Translation } from "../translations";
import { localizeHref } from "../lib/router";
import logoMark from "../assets/logo-mark.png";

export function Footer({ t, language }: { t: Translation; language: Language }) {
  return (
    <footer className="bg-navy-925 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 text-center sm:px-6 lg:px-8">
        <div className="flex items-center gap-2.5">
          {/* light chip so the logo's dark-navy magnifying glass stays visible on the dark footer */}
          <span className="flex items-center justify-center rounded-lg bg-white p-1.5">
            <img src={logoMark} alt="" className="h-7 w-auto" />
          </span>
          <span className="text-lg font-bold tracking-tight">
            <span className="text-white">EVSE</span>
            <span className="text-lime-400">xplorer</span>
          </span>
        </div>
        <p className="text-sm text-navy-300">{t.footerClaim}</p>
        <p className="text-sm text-navy-400">{t.copyright}</p>
        <nav className="flex items-center gap-4 text-sm text-navy-400">
          <a
            href={localizeHref("/impressum", language)}
            className="transition-colors hover:text-lime-400"
          >
            {t.impressumLink}
          </a>
          <span aria-hidden="true" className="text-navy-600">
            ·
          </span>
          <a
            href={localizeHref("/datenschutz", language)}
            className="transition-colors hover:text-lime-400"
          >
            {t.datenschutzLink}
          </a>
        </nav>
      </div>
    </footer>
  );
}
