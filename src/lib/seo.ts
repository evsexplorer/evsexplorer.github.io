import { translations, type Language } from "../translations";
import { getPost, listPosts, type Post } from "../content/blog";
import { buildPath, type Route } from "./router";

const SITE = "https://evsexplorer.com";
const OG_IMAGE = `${SITE}/og-image.png`;
const LOGO = `${SITE}/icon-512.png`;
const AUTHOR = "The EVSExplorer team";
const LANGS: Language[] = ["en", "de"];
const OG_LOCALE: Record<Language, string> = { en: "en_US", de: "de_DE" };

// Kept to the ~155 characters a search result actually shows, so this reads
// shorter than the hero paragraph it mirrors.
const homeDescription: Record<Language, string> = {
  en: "An OCPP 2.0.1 test CSMS for charge point and wallbox developers. Point a real station at it, inspect every message, automate via REST API. Cloud or self-hosted.",
  de: "OCPP-2.0.1-Test-CSMS für Ladestations- und Wallbox-Entwickler. Echte Station verbinden, jede Nachricht prüfen, alles per REST-API. Cloud oder eigene Hardware.",
};

// Keyword first, brand last: the product category is what gets searched for,
// the brand name is not (yet). Article titles keep the opposite order.
const homeTitle: Record<Language, string> = {
  en: "OCPP 2.0.1 Test CSMS for Charge Point Developers | EVSExplorer",
  de: "OCPP-2.0.1-Testtool für Ladestationen und Wallboxen | EVSExplorer",
};

const impressumDescription: Record<Language, string> = {
  en: "Legal notice (Impressum) and provider information for EVSExplorer.",
  de: "Impressum und Anbieterkennzeichnung von EVSExplorer.",
};

const datenschutzDescription: Record<Language, string> = {
  en: "Privacy policy for EVSExplorer: how personal data is processed on this website. No cookies, no tracking, no analytics.",
  de: "Datenschutzerklärung von EVSExplorer: wie personenbezogene Daten auf dieser Website verarbeitet werden. Keine Cookies, kein Tracking, keine Analyse.",
};

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
  if (route.name === "datenschutz") {
    return {
      title: `${t.datenschutz.title} - EVSExplorer`,
      description: datenschutzDescription[lang],
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
  const base: Route[] = [
    { name: "home" },
    { name: "blog" },
    { name: "impressum" },
    { name: "datenschutz" },
  ];
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
    lines.push(`<meta property="article:modified_time" content="${meta.post!.updated}" />`);
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

/**
 * The <head> for the 404.html SPA fallback. GitHub Pages serves that file both
 * as the body of a real 404 response and (with status 200) at /404.html itself,
 * so it must be noindex: what it ships is an empty shell that only fills in once
 * the client router runs. No canonical or hreflang either, since the one file
 * stands in for every non-prerendered path.
 */
export function fallbackHeadTags(lang: Language = "en"): string {
  const t = translations[lang];
  return [
    `<title>${esc(t.blog.notFoundTitle)} - EVSExplorer</title>`,
    `<meta name="robots" content="noindex, follow" />`,
  ].join("\n    ");
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
      dateModified: meta.post.updated,
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
  if (route.name === "blog") {
    // The article hub: an ItemList of the posts (newest first) so the index is
    // read as a collection pointing at the detail pages, not a wall of links.
    const posts = listPosts(lang);
    const list = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: t.blog.title,
      description: t.blog.subtitle,
      inLanguage: lang,
      url: absUrl(route, lang),
      numberOfItems: posts.length,
      itemListOrder: "https://schema.org/ItemListOrderDescending",
      itemListElement: posts.map((post, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: post.title,
        url: absUrl({ name: "post", slug: post.slug }, lang),
      })),
    };
    const crumbs = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "EVSExplorer", item: absUrl({ name: "home" }, lang) },
        { "@type": "ListItem", position: 2, name: t.blog.title, item: absUrl(route, lang) },
      ],
    };
    return [jsonLd(list), jsonLd(crumbs)];
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
      // No `offers`: pricing is "talk to us", and a price of 0 would have
      // search engines annotate a commercial product as free.
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
