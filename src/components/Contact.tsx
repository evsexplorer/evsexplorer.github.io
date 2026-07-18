import { ArrowRight, Mail, Rocket, Wrench, MessageCircle } from "lucide-react";
import type { Translation } from "../translations";

const pointIcons = [MessageCircle, Rocket, Wrench];
const pointColors = ["bg-navy-900", "bg-brand-500", "bg-lime-500"];

export function Contact({ t }: { t: Translation }) {
  const mailto = `mailto:${t.contactEmail}?subject=${encodeURIComponent(t.mailSubject)}`;

  return (
    <section id="contact" className="bg-navy-50 py-20" aria-labelledby="contact-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 id="contact-heading" className="text-3xl font-bold text-navy-900">
            {t.contactTitle}
          </h2>
          <p className="mt-4 text-lg text-navy-600">{t.contactSubtitle}</p>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl bg-white p-10 text-center shadow-xl shadow-navy-900/5 sm:p-12">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-brand-500">
              <Mail className="size-8 text-white" aria-hidden />
            </div>
            <h3 className="mt-6 text-xl font-semibold text-navy-900">
              {t.contactCardTitle}
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-navy-600">{t.contactCardText}</p>
            <p className="mt-6">
              <a
                href={mailto}
                className="font-medium text-brand-600 underline-offset-4 hover:underline"
              >
                {t.contactEmail}
              </a>
            </p>
            <a
              href={mailto}
              className="mt-8 inline-flex items-center gap-2 rounded-md bg-lime-500 px-8 py-3.5 font-semibold text-white shadow-sm transition-colors hover:bg-lime-600"
            >
              {t.contactButton}
              <ArrowRight className="size-5" aria-hidden />
            </a>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {t.contactPoints.map((point, i) => {
              const Icon = pointIcons[i];
              return (
                <div key={point.title} className="text-center">
                  <div
                    className={`mx-auto flex size-12 items-center justify-center rounded-lg ${pointColors[i]}`}
                  >
                    <Icon className="size-6 text-white" aria-hidden />
                  </div>
                  <h4 className="mt-4 font-semibold text-navy-900">{point.title}</h4>
                  <p className="mt-1.5 text-sm text-navy-600">{point.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
