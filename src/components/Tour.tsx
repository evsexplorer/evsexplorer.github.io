import { Check } from "lucide-react";
import type { Translation } from "../translations";
import { Screenshot } from "./Screenshot";
import messagesShot from "../assets/shots/messages.webp";
import connectionsShot from "../assets/shots/connections.webp";
import transactionShot from "../assets/shots/transaction.webp";
import consoleShot from "../assets/shots/console.webp";

const shots = [messagesShot, connectionsShot, transactionShot, consoleShot];

export function Tour({ t }: { t: Translation }) {
  return (
    <section id="product" className="bg-navy-50 py-20" aria-labelledby="tour-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 id="tour-heading" className="text-3xl font-bold text-navy-900">
            {t.tourTitle}
          </h2>
          <p className="mt-4 text-lg text-navy-600">{t.tourSubtitle}</p>
        </div>

        <div className="space-y-20">
          {t.tour.map((item, i) => (
            <div
              key={item.title}
              className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
            >
              <div className={i % 2 === 1 ? "lg:order-2" : undefined}>
                <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
                  {item.kicker}
                </p>
                <h3 className="mt-2 text-2xl font-bold text-navy-900">
                  {item.title}
                </h3>
                <p className="mt-4 leading-relaxed text-navy-600">
                  {item.description}
                </p>
                <ul className="mt-6 space-y-3">
                  {item.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3 text-navy-700">
                      <Check className="mt-1 size-4 shrink-0 text-lime-500" aria-hidden />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={i % 2 === 1 ? "lg:order-1" : undefined}>
                <Screenshot src={shots[i]} alt={item.alt} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
