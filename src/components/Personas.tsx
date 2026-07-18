import { ClipboardList, Code2, FlaskConical } from "lucide-react";
import type { Translation } from "../translations";

const icons = [Code2, FlaskConical, ClipboardList];
const iconStyles = [
  "bg-brand-500",
  "bg-lime-500",
  "bg-navy-900",
];

export function Personas({ t }: { t: Translation }) {
  return (
    <section className="bg-white py-20" aria-labelledby="personas-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <h2 id="personas-heading" className="text-3xl font-bold text-navy-900">
            {t.personasTitle}
          </h2>
          <p className="mt-4 text-lg text-navy-600">{t.personasSubtitle}</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {t.personas.map((persona, i) => {
            const Icon = icons[i];
            return (
              <div
                key={persona.title}
                className="rounded-xl border border-navy-100 bg-navy-50/50 p-8"
              >
                <div className={`inline-flex rounded-lg p-3 ${iconStyles[i]}`}>
                  <Icon className="size-6 text-white" aria-hidden />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-navy-900">
                  {persona.title}
                </h3>
                <p className="mt-3 leading-relaxed text-navy-600">
                  {persona.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
