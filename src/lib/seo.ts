import { translations, type Language } from "../translations";
import { getPost, listPosts, type Post } from "../content/blog";
import { buildPath, type Route } from "./router";

const SITE = "https://evsexplorer.com";
const OG_IMAGE = `${SITE}/og-image.png`;
const LOGO = `${SITE}/icon-512.png`;
const AUTHOR = "The EVSExplorer team";
const LANGS: Language[] = ["en", "de"];
const OG_LOCALE: Record<Language, string> = { en: "en_US", de: "de_DE" };

const homeDescription: Record<Language, string> = {
  en: "EVSExplorer is an OCPP 2.0.1 CSMS companion for developing and testing charging stations. Inspect every message, analyze connection stability, fire any request, and automate it all through a REST API.",
  de: "EVSExplorer ist der OCPP-2.0.1-CSMS-Begleiter für die Entwicklung und das Testen von Ladestationen. Jede Nachricht inspizieren, Verbindungsstabilität analysieren, jeden Request absetzen und alles über eine REST-API automatisieren.",
};

const homeTitle: Record<Language, string> = {
  en: "EVSExplorer - OCPP 2.0.1 Testing & Monitoring for Charging Stations",
  de: "EVSExplorer - OCPP 2.0.1 Testen & Überwachen von Ladestationen",
};

const impressumDescription: Record<Language, string> = {
  en: "Legal notice (Impressum) and provider information for EVSExplorer.",
  de: "Impressum und Anbieterkennzeichnung von EVSExplorer.",
};

const HOME_KEYWORDS =
  "OCPP, OCPP 2.0.1, ocpp compliance testing, automated charge point testing, EVSE monitoring, charge point monitoring, WebSocket server, EV charging infrastructure, OCPP protocol testing";

export interface PageMeta {
  title: string;
  description: string;
  /** Languages in which this route exists (for hreflang alternates). */
  langs: Language[];
  route: Route;
  lang: Language;
  post?: Post;
}

/** Structured metadata for a route in a language (used by client and prerender). */
export function pageMeta(route: Route, lang: Language): PageMeta {
  const t = translations[lang];
  if (route.name === "post") {
    const post = getPost(route.slug, lang);
    if (post) {
      return {
        title: `${post.title} - EVSExplorer`,
        description: post.description,
        langs: post.langs,
        route,
        lang,
        post,
      };
    }
    return {
      title: `${t.blog.notFoundTitle} - EVSExplorer`,
      description: t.blog.notFoundText,
      langs: LANGS,
      route,
      lang,
    };
  }
  if (route.name === "blog") {
    return { title: `${t.blog.title} - EVSExplorer`, description: t.blog.subtitle, langs: LANGS, route, lang };
  }
  if (route.name === "impressum") {
    return {
      title: `${t.impressum.title} - EVSExplorer`,
      description: impressumDescription[lang],
      langs: LANGS,
      route,
      lang,
    };
  }
  return { title: homeTitle[lang], description: homeDescription[lang], langs: LANGS, route, lang };
}

/** Every prerenderable {route, lang} across both languages. */
export function allRoutes(): { route: Route; lang: Language }[] {
  const out: { route: Route; lang: Language }[] = [];
  const base: Route[] = [{ name: "home" }, { name: "blog" }, { name: "impressum" }];
  for (const lang of LANGS) for (const route of base) out.push({ route, lang });
  for (const post of listPosts("en")) {
    for (const lang of post.langs) out.push({ route: { name: "post", slug: post.slug }, lang });
  }
  return out;
}

const absUrl = (route: Route, lang: Language) => `${SITE}${buildPath(route, lang)}`;

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function jsonLd(data: unknown): string {
  // Escape "<" so a stray "</script>" in a value cannot break out of the tag.
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return `<script type="application/ld+json">${json}</script>`;
}

/** The full per-route <head> inner HTML injected by the prerender. */
export function headTags(route: Route, lang: Language): string {
  const meta = pageMeta(route, lang);
  const canonical = absUrl(route, lang);
  const isPost = route.name === "post" && !!meta.post;
  const lines: string[] = [];

  lines.push(`<title>${esc(meta.title)}</title>`);
  lines.push(`<meta name="description" content="${esc(meta.description)}" />`);
  lines.push(`<meta name="author" content="${esc(AUTHOR)}" />`);
  lines.push(
    `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />`,
  );
  if (route.name === "home") lines.push(`<meta name="keywords" content="${esc(HOME_KEYWORDS)}" />`);
  if (isPost && meta.post!.tags.length)
    lines.push(`<meta name="keywords" content="${esc(["OCPP 2.0.1", ...meta.post!.tags].join(", "))}" />`);

  lines.push(`<link rel="canonical" href="${canonical}" />`);
  for (const l of meta.langs)
    lines.push(`<link rel="alternate" hreflang="${l}" href="${absUrl(route, l)}" />`);
  lines.push(`<link rel="alternate" hreflang="x-default" href="${absUrl(route, "en")}" />`);

  // Open Graph
  lines.push(`<meta property="og:type" content="${isPost ? "article" : "website"}" />`);
  lines.push(`<meta property="og:url" content="${canonical}" />`);
  lines.push(`<meta property="og:title" content="${esc(meta.title)}" />`);
  lines.push(`<meta property="og:description" content="${esc(meta.description)}" />`);
  lines.push(`<meta property="og:image" content="${OG_IMAGE}" />`);
  lines.push(`<meta property="og:image:width" content="1200" />`);
  lines.push(`<meta property="og:image:height" content="630" />`);
  lines.push(`<meta property="og:site_name" content="EVSExplorer" />`);
  lines.push(`<meta property="og:locale" content="${OG_LOCALE[lang]}" />`);
  lines.push(
    `<meta property="og:locale:alternate" content="${OG_LOCALE[lang === "en" ? "de" : "en"]}" />`,
  );
  if (isPost) {
    lines.push(`<meta property="article:published_time" content="${meta.post!.date}" />`);
    for (const tag of meta.post!.tags) lines.push(`<meta property="article:tag" content="${esc(tag)}" />`);
  }

  // Twitter
  lines.push(`<meta name="twitter:card" content="summary_large_image" />`);
  lines.push(`<meta name="twitter:title" content="${esc(meta.title)}" />`);
  lines.push(`<meta name="twitter:description" content="${esc(meta.description)}" />`);
  lines.push(`<meta name="twitter:image" content="${OG_IMAGE}" />`);

  lines.push(...structuredData(route, lang, meta));
  return lines.join("\n    ");
}

function structuredData(route: Route, lang: Language, meta: PageMeta): string[] {
  const t = translations[lang];
  if (route.name === "post" && meta.post) {
    const url = absUrl(route, lang);
    const article = {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      headline: meta.post.title,
      description: meta.post.description,
      datePublished: meta.post.date,
      dateModified: meta.post.date,
      inLanguage: lang,
      author: { "@type": "Organization", name: AUTHOR },
      publisher: {
        "@type": "Organization",
        name: "EVSExplorer",
        logo: { "@type": "ImageObject", url: LOGO },
      },
      mainEntityOfPage: url,
      url,
      image: OG_IMAGE,
    };
    const crumbs = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "EVSExplorer", item: absUrl({ name: "home" }, lang) },
        { "@type": "ListItem", position: 2, name: t.blog.title, item: absUrl({ name: "blog" }, lang) },
        { "@type": "ListItem", position: 3, name: meta.post.title, item: url },
      ],
    };
    return [jsonLd(article), jsonLd(crumbs)];
  }
  if (route.name === "home") {
    const app = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "EVSExplorer",
      applicationCategory: "DeveloperApplication",
      applicationSubCategory: "OCPP Testing Software",
      operatingSystem: "Web-based",
      description: homeDescription[lang],
      url: absUrl({ name: "home" }, lang),
      inLanguage: lang,
      author: { "@type": "Organization", name: AUTHOR },
      offers: {
        "@type": "Offer",
        availability: "https://schema.org/InStock",
        price: "0",
        priceCurrency: "USD",
        description: "Contact us for pricing",
      },
      screenshot: OG_IMAGE,
    };
    const org = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "EVSExplorer",
      url: SITE,
      logo: LOGO,
      sameAs: ["https://github.com/evsexplorer"],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "sales",
        email: "hello@evsexplorer.com",
      },
    };
    return [jsonLd(app), jsonLd(org)];
  }
  return [];
}

export { SITE };
