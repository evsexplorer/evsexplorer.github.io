import { Check, Sparkles } from "lucide-react";
import type { Translation } from "../translations";

// Recreated from a real Claude CLI session against a bench instance; hostnames
// and charge point identities match the demo identities of the screenshots.
const transcript: Array<{ kind: "user" | "agent" | "meta"; text: string }> = [
  {
    kind: "user",
    text: "I have an EVSExplorer instance at bench-pi:8081. Fetch the skill.md from http://bench-pi:8081/api/skill.md and tell me which devices are online.",
  },
  { kind: "agent", text: "I'll fetch that skill file from the local API." },
  { kind: "meta", text: "Ran 1 shell command" },
  {
    kind: "agent",
    text: "Now I understand the API. Let me query the charge points endpoint filtered for connection status.",
  },
  { kind: "meta", text: "Ran 1 shell command" },
  {
    kind: "agent",
    text: "Of the 7 registered charge points, only one is currently online:\n– MyBox — connected, state: Idle\n\nThe other 6 are offline (disconnected), among them:\n– CBOX 01 (Idle)\n– CBOX 02 (Charging — likely stale, since it's disconnected)",
  },
  { kind: "meta", text: "✳ Cooked for 15s" },
  { kind: "user", text: "When was CBOX 01 last connected?" },
  { kind: "meta", text: "Ran 1 shell command" },
  {
    kind: "agent",
    text: "CBOX 01 was last connected on 2026-07-16 at 12:14 UTC, then disconnected at 06:32 UTC the next day (reason: no_status_rcvd, disconnect initiated remotely) — so it's been offline for about a day.",
  },
  { kind: "meta", text: "✳ Brewed for 7s" },
  { kind: "user", text: "What's the configured MessageTimeout on that charge point?" },
  { kind: "meta", text: "Ran 1 shell command" },
  {
    kind: "agent",
    text: "messageTimeoutSeconds is 30 (the default) — that's the window the CSMS waits for a response to a CSMS-initiated request before it's classified late.",
  },
  { kind: "meta", text: "✳ Brewed for 6s" },
  { kind: "user", text: "How long is MyBox connected?" },
  { kind: "meta", text: "Ran 2 shell commands" },
  {
    kind: "agent",
    text: "MyBox reconnected at 2026-07-18 13:57:51 UTC and has been connected for about 12 minutes (as of now, 14:09:56 UTC).",
  },
  { kind: "meta", text: "✳ Cooked for 12s" },
  { kind: "user", text: "Reboot that charge point" },
  { kind: "meta", text: "Ran 1 shell command" },
  { kind: "agent", text: "Reset command sent. Checking the outcome." },
  { kind: "meta", text: "Ran 1 shell command" },
  {
    kind: "agent",
    text: "The charge point accepted the Reset (Immediate) command — status Accepted, command completed. It should be rebooting now.",
  },
  { kind: "meta", text: "✳ Crunched for 31s" },
  { kind: "user", text: "Check if it reconnected" },
  { kind: "meta", text: "Ran 1 shell command" },
  {
    kind: "agent",
    text: "Not yet — it disconnected (going_away, remote-initiated) at 14:11:02 UTC in response to the reset, but hasn't reconnected. It's currently rebooting. Want me to keep polling?",
  },
];

export function AiSection({ t }: { t: Translation }) {
  return (
    <section id="ai" className="bg-white py-20" aria-labelledby="ai-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
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

          {/* h-0 + min-h-full: the left column defines the row height, the transcript scrolls inside */}
          <div className="flex flex-col lg:h-0 lg:min-h-full">
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-navy-700 bg-navy-950 shadow-2xl">
              <div className="flex shrink-0 items-center gap-1.5 border-b border-navy-800 px-4 py-2.5">
                <span className="size-2.5 rounded-full bg-navy-700" />
                <span className="size-2.5 rounded-full bg-navy-700" />
                <span className="size-2.5 rounded-full bg-navy-700" />
                <span className="ml-2 font-mono text-xs text-navy-400">agent session</span>
              </div>
              <div className="max-h-96 min-h-0 flex-1 space-y-3 overflow-y-auto p-5 font-mono text-[13px] leading-relaxed lg:max-h-none">
                {transcript.map((line, i) => {
                  if (line.kind === "user") {
                    return (
                      <p key={i} className="rounded-md bg-navy-800 px-3 py-2 text-navy-50">
                        <span className="mr-2 text-lime-400" aria-hidden>
                          ❯
                        </span>
                        {line.text}
                      </p>
                    );
                  }
                  if (line.kind === "meta") {
                    return (
                      <p key={i} className="pl-5 text-xs text-navy-500">
                        {line.text}
                      </p>
                    );
                  }
                  return (
                    <p key={i} className="flex gap-2 whitespace-pre-line text-navy-100">
                      <span className="text-brand-400" aria-hidden>
                        ●
                      </span>
                      <span>{line.text}</span>
                    </p>
                  );
                })}
              </div>
            </div>
            <p className="mt-3 shrink-0 text-center text-sm text-navy-500">{t.aiTranscriptCaption}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
