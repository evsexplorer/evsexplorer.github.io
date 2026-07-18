import { Check, Cpu } from "lucide-react";
import type { Translation } from "../translations";

const codeSample = `# Register a charge point identity
curl -X POST http://bench-pi:8081/api/charge-points \\
     -H 'Content-Type: application/json' \\
     -d '{"id": "PROTO-0042", "name": "Prototype 42"}'

# Fire an OCPP request at the station
curl -X POST http://bench-pi:8081/api/charge-points/PROTO-0042/commands/TriggerMessage \\
     -d '{"requestedMessage": "BootNotification"}'
# 202 Accepted  {"message_id": "4f2a97c1-..."}

# Poll the result and assert on the reply
curl http://bench-pi:8081/api/charge-points/PROTO-0042/commands/4f2a97c1-...
# {"status": "completed", "response": {"status": "Accepted"}}`;

export function ApiSection({ t }: { t: Translation }) {
  return (
    <section id="api" className="bg-navy-925 py-20" aria-labelledby="api-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 id="api-heading" className="text-3xl font-bold text-white">
              {t.apiTitle}
            </h2>
            <p className="mt-4 leading-relaxed text-navy-200">{t.apiSubtitle}</p>
            <ul className="mt-6 space-y-3">
              {t.apiBullets.map((bullet) => (
                <li key={bullet} className="flex gap-3 text-navy-100">
                  <Check className="mt-1 size-4 shrink-0 text-lime-400" aria-hidden />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 flex items-start gap-3 rounded-lg border border-navy-700 bg-navy-900 p-4 text-sm text-navy-200">
              <Cpu className="mt-0.5 size-5 shrink-0 text-brand-400" aria-hidden />
              {t.apiFootnote}
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-navy-700 bg-navy-950 shadow-2xl">
            <div className="flex items-center gap-1.5 border-b border-navy-800 px-4 py-2.5">
              <span className="size-2.5 rounded-full bg-navy-700" />
              <span className="size-2.5 rounded-full bg-navy-700" />
              <span className="size-2.5 rounded-full bg-navy-700" />
              <span className="ml-2 text-xs text-navy-400">bench-automation.sh</span>
            </div>
            <pre className="overflow-x-auto p-5 text-[13px] leading-relaxed text-navy-100">
              <code>{codeSample}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
