import type { Language } from "../translations";

const locales: Record<Language, string> = { en: "en-US", de: "de-DE" };

/** Format an ISO date (YYYY-MM-DD) as a long, localized date. */
export function formatDate(iso: string, language: Language): string {
  if (!iso) return "";
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(locales[language], {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}
