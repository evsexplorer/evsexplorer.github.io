import { Check, Sparkles } from "lucide-react";
import type { Translation } from "../translations";

// Verbatim excerpt from the skill file shipped with EVSExplorer.
const skillExcerpt = `# Driving the EVSExplorer API as an agent

## Token efficiency

List endpoints support server-side narrowing. Use it
instead of fetching everything and filtering yourself:

- \`limit=<n>\`: keeps the n most recent items.
- \`start_time\` / \`end_time\`: ISO 8601 range filters.
- \`exclude_actions=Heartbeat\`: drop noisy actions.
- \`fields=id,connected,chargingState\`: sparse field
  selection on GET /api/charge-points.

Start with limit=20 and widen only when you need more.

## Workflow: send a command and check its outcome

Commands are asynchronous. POST returns 202 with a
message_id immediately after the frame hits the wire,
the charge point answers later. Poll the command
resource to get the outcome.`;

export function AiSection({ t }: { t: Translation }) {
  return (
    <section id="ai" className="bg-white py-20" aria-labelledby="ai-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="inline-flex items-center gap-1.5 rounded-full bg-lime-100 px-3 py-1 text-sm font-semibold text-lime-800">
              <Sparkles className="size-4" aria-hidden />
              {t.aiKicker}
            </p>
            <h2 id="ai-heading" className="mt-4 text-3xl font-bold text-navy-900">
              {t.aiTitle}
            </h2>
            <p className="mt-4 leading-relaxed text-navy-600">{t.aiSubtitle}</p>
            <ul className="mt-6 space-y-3">
              {t.aiBullets.map((bullet) => (
                <li key={bullet} className="flex gap-3 text-navy-700">
                  <Check className="mt-1 size-4 shrink-0 text-lime-500" aria-hidden />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="overflow-hidden rounded-xl border border-navy-200 bg-navy-50 shadow-xl shadow-navy-900/10">
            <div className="flex items-center gap-1.5 border-b border-navy-100 bg-white px-4 py-2.5">
              <span className="size-2.5 rounded-full bg-navy-200" />
              <span className="size-2.5 rounded-full bg-navy-200" />
              <span className="size-2.5 rounded-full bg-navy-200" />
              <span className="ml-2 font-mono text-xs text-navy-500">skill.md</span>
            </div>
            <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-relaxed text-navy-800">
              <code>{skillExcerpt}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
