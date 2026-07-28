import type { Language, Translation } from "../translations";
import { localizeHref } from "../lib/router";
import { provider } from "./Impressum";

function Address({ name, lines }: { name?: string; lines: string[] }) {
  return (
    <address className="mt-2 not-italic leading-relaxed">
      {name && (
        <>
          <span className="font-medium text-navy-900">{name}</span>
          <br />
        </>
      )}
      {lines.map((line) => (
        <span key={line}>
          {line}
          <br />
        </span>
      ))}
    </address>
  );
}

function Section({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-navy-900">{heading}</h2>
      <div className="mt-2 space-y-3">{children}</div>
    </section>
  );
}

function ExternalLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-brand-600 transition-colors hover:text-brand-700 hover:underline"
    >
      {label}
    </a>
  );
}

export function Datenschutz({
  t,
  language,
}: {
  t: Translation;
  language: Language;
}) {
  const d = t.datenschutz;

  return (
    <main className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <a
          href={localizeHref("/", language)}
          className="text-sm font-medium text-brand-600 transition-colors hover:text-brand-700 hover:underline"
        >
          ← {d.backToHome}
        </a>

        <h1 className="mt-6 text-3xl font-bold text-navy-900">{d.title}</h1>
        <p className="mt-2 text-navy-500">{d.subtitle}</p>
        <p className="mt-1 text-sm text-navy-400">{d.updated}</p>

        <div className="mt-10 space-y-8 text-navy-700">
          <Section heading={d.introHeading}>
            <p>{d.introText}</p>
          </Section>

          <Section heading={d.controllerHeading}>
            <p>{d.controllerIntro}</p>
            <Address name={provider.name} lines={provider.addressLines} />
            <p>
              {t.impressum.emailLabel}:{" "}
              <a
                href={`mailto:${provider.email}`}
                className="text-brand-600 transition-colors hover:text-brand-700 hover:underline"
              >
                {provider.email}
              </a>
            </p>
          </Section>

          <Section heading={d.hostingHeading}>
            <p>{d.hostingText}</p>
            <p>{d.hostingPurpose}</p>
            <p>{d.hostingLegalBasis}</p>
            <p>{d.hostingTransfer}</p>
            <div>
              <span className="text-navy-500">{d.hostingProviderLabel}</span>
              <Address lines={d.hostingProvider} />
            </div>
            <p>
              <ExternalLink
                href={d.hostingPrivacyLinkUrl}
                label={d.hostingPrivacyLinkLabel}
              />
            </p>
          </Section>

          <Section heading={d.tlsHeading}>
            <p>{d.tlsText}</p>
          </Section>

          <Section heading={d.contactHeading}>
            <p>{d.contactText}</p>
          </Section>

          <Section heading={d.noTrackingHeading}>
            <p>{d.noTrackingText}</p>
          </Section>

          <Section heading={d.rightsHeading}>
            <p>{d.rightsIntro}</p>
            <ul className="ml-5 list-disc space-y-1">
              {d.rightsItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p>{d.rightsOutro}</p>
          </Section>

          <Section heading={d.complaintHeading}>
            <p>{d.complaintText}</p>
            <Address lines={d.complaintAuthority} />
            <p>
              <ExternalLink
                href={d.complaintLinkUrl}
                label={d.complaintLinkLabel}
              />
            </p>
          </Section>
        </div>
      </div>
    </main>
  );
}
