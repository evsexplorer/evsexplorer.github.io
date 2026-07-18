import {
  Activity,
  BarChart3,
  Boxes,
  Braces,
  History,
  LayoutDashboard,
  MessageSquareReply,
  Server,
  ShieldAlert,
  ShieldCheck,
  Terminal,
  Unplug,
} from "lucide-react";
import type { Translation } from "../translations";

const icons = [
  Server, // OCPP 2.0.1 CSMS
  ShieldCheck, // Schema validation
  LayoutDashboard, // Live dashboard
  MessageSquareReply, // Auto-responses
  Activity, // Connection analytics
  Unplug, // WebSocket control
  BarChart3, // Transactions & meter values
  ShieldAlert, // Security events
  Boxes, // Device model browser
  Terminal, // Command console
  History, // Message history
  Braces, // REST API
];

const iconColors = ["bg-brand-500", "bg-lime-500", "bg-navy-900"];

export function Features({ t }: { t: Translation }) {
  return (
    <section id="features" className="bg-white py-20" aria-labelledby="features-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <h2 id="features-heading" className="text-3xl font-bold text-navy-900">
            {t.featuresTitle}
          </h2>
          <p className="mt-4 text-lg text-navy-600">{t.featuresSubtitle}</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {t.features.map((feature, i) => {
            const Icon = icons[i];
            return (
              <div
                key={feature.title}
                className="rounded-xl border border-navy-100 p-6 transition-shadow hover:shadow-md"
              >
                <div className={`inline-flex rounded-lg p-2.5 ${iconColors[i % 3]}`}>
                  <Icon className="size-5 text-white" aria-hidden />
                </div>
                <h3 className="mt-4 font-semibold text-navy-900">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
