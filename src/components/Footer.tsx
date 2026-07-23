import type { Translation } from "../translations";
import logoMark from "../assets/logo-mark.png";

export function Footer({ t }: { t: Translation }) {
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
        <a
          href="#impressum"
          className="text-sm text-navy-400 transition-colors hover:text-lime-400"
        >
          {t.impressumLink}
        </a>
      </div>
    </footer>
  );
}
