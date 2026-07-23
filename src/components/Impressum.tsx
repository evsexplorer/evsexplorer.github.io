import type { Language, Translation } from "../translations";
import { localizeHref } from "../lib/router";

// Legally required provider details (German Impressum, § 5 DDG).
// Optional fields (phone, vatId, register, responsible) are hidden when left "".
const provider = {
  name: "Matthias Brachmann",
  addressLines: [
    "Alte Renninger Str. 117",
    "71263 Weil der Stadt",
    "Germany",
  ],
  email: "hello@evsexplorer.com",
  phone: "+49 179 537 1932", // e.g. "+49 30 1234567"
  vatId: "", // USt-IdNr., e.g. "DE123456789"
  registerCourt: "", // e.g. "Amtsgericht Berlin (Charlottenburg)" — companies only
  registerNumber: "", // e.g. "HRB 123456" — companies only
  responsible: "", // person responsible for content; defaults to the name above
};

function Address({ name, lines }: { name: string; lines: string[] }) {
  return (
    <address className="mt-2 not-italic leading-relaxed">
      <span className="font-medium text-navy-900">{name}</span>
      <br />
      {lines.map((line) => (
        <span key={line}>
          {line}
          <br />
        </span>
      ))}
    </address>
  );
}

export function Impressum({ t, language }: { t: Translation; language: Language }) {
  const im = t.impressum;

  return (
    <main className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <a
          href={localizeHref("/", language)}
          className="text-sm font-medium text-brand-600 transition-colors hover:text-brand-700 hover:underline"
        >
          ← {im.backToHome}
        </a>

        <h1 className="mt-6 text-3xl font-bold text-navy-900">{im.title}</h1>
        <p className="mt-2 text-navy-500">{im.subtitle}</p>

        <div className="mt-10 space-y-8 text-navy-700">
          <section>
            <h2 className="text-lg font-semibold text-navy-900">
              {im.providerHeading}
            </h2>
            <Address name={provider.name} lines={provider.addressLines} />
          </section>

          <section>
            <h2 className="text-lg font-semibold text-navy-900">
              {im.contactHeading}
            </h2>
            <dl className="mt-2 space-y-1">
              <div className="flex gap-3">
                <dt className="w-16 shrink-0 text-navy-500">{im.emailLabel}</dt>
                <dd>
                  <a
                    href={`mailto:${provider.email}`}
                    className="text-brand-600 transition-colors hover:text-brand-700 hover:underline"
                  >
                    {provider.email}
                  </a>
                </dd>
              </div>
              {provider.phone && (
                <div className="flex gap-3">
                  <dt className="w-16 shrink-0 text-navy-500">
                    {im.phoneLabel}
                  </dt>
                  <dd>
                    <a
                      href={`tel:${provider.phone.replace(/\s+/g, "")}`}
                      className="text-brand-600 transition-colors hover:text-brand-700 hover:underline"
                    >
                      {provider.phone}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </section>

          {(provider.registerCourt || provider.registerNumber) && (
            <section>
              <h2 className="text-lg font-semibold text-navy-900">
                {im.registerHeading}
              </h2>
              <dl className="mt-2 space-y-1">
                {provider.registerCourt && (
                  <div className="flex gap-3">
                    <dt className="w-40 shrink-0 text-navy-500">
                      {im.registerCourtLabel}
                    </dt>
                    <dd>{provider.registerCourt}</dd>
                  </div>
                )}
                {provider.registerNumber && (
                  <div className="flex gap-3">
                    <dt className="w-40 shrink-0 text-navy-500">
                      {im.registerNumberLabel}
                    </dt>
                    <dd>{provider.registerNumber}</dd>
                  </div>
                )}
              </dl>
            </section>
          )}

          {provider.vatId && (
            <section>
              <h2 className="text-lg font-semibold text-navy-900">
                {im.vatHeading}
              </h2>
              <p className="mt-2">
                {im.vatText}
                <br />
                {provider.vatId}
              </p>
            </section>
          )}

          <section>
            <h2 className="text-lg font-semibold text-navy-900">
              {im.responsibleHeading}
            </h2>
            <Address
              name={provider.responsible || provider.name}
              lines={provider.addressLines}
            />
          </section>

          <section>
            <h2 className="text-lg font-semibold text-navy-900">
              {im.disputeHeading}
            </h2>
            <p className="mt-2">{im.disputeText}</p>
          </section>
        </div>
      </div>
    </main>
  );
}
