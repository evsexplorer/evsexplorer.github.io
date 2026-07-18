import { ArrowRight, Check } from "lucide-react";
import type { Translation } from "../translations";
import { Screenshot } from "./Screenshot";
import dashboardShot from "../assets/shots/dashboard.webp";

export function Hero({ t }: { t: Translation }) {
  return (
    <section id="top" className="relative overflow-hidden bg-gradient-to-b from-navy-50 to-white">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 lg:px-8 lg:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          {/* the keyword-bearing tagline is part of the h1 for SEO, styled as a pill */}
          <h1>
            <span className="inline-flex items-center rounded-full bg-navy-900 px-4 py-1.5 text-sm font-medium text-white">
              {t.tagline}
            </span>
            <span className="mt-6 block text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl">
              {t.heroTitle}
            </span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-navy-600">
            {t.heroDescription}
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-brand-500 px-7 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-brand-600"
            >
              {t.heroCtaPrimary}
              <ArrowRight className="size-5" />
            </a>
            <a
              href="#product"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-navy-300 px-7 py-3 font-semibold text-navy-900 transition-colors hover:border-navy-400 hover:bg-white"
            >
              {t.heroCtaSecondary}
            </a>
          </div>

          <ul className="mx-auto mt-8 flex max-w-2xl flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-navy-600">
            {t.heroHighlights.map((item) => (
              <li key={item} className="flex items-center gap-1.5">
                <Check className="size-4 text-lime-500" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mx-auto mt-14 max-w-5xl">
          <Screenshot src={dashboardShot} alt={t.heroImageAlt} eager />
        </div>
      </div>
    </section>
  );
}
