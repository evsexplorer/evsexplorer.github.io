import type { Language } from "../translations";

// A resolved page within the site, independent of language.
export type Route =
  | { name: "home" }
  | { name: "impressum" }
  | { name: "datenschutz" }
  | { name: "blog" }
  | { name: "post"; slug: string };

/**
 * Parse a pathname into a language and a route. German lives under a `/de`
 * prefix, everything else is English at the root. Unknown paths resolve to
 * `home` (the prerender only emits known routes, and 404.html client-routes the
 * rest).
 */
export function parsePath(pathname: string): { lang: Language; route: Route } {
  let path = pathname.replace(/\/+$/, "");
  if (path === "") path = "/";

  let lang: Language = "en";
  if (path === "/de" || path.startsWith("/de/")) {
    lang = "de";
    path = path.slice(3) || "/";
  }

  let route: Route;
  if (path === "/") route = { name: "home" };
  else if (path === "/impressum") route = { name: "impressum" };
  else if (path === "/datenschutz") route = { name: "datenschutz" };
  else if (path === "/blog") route = { name: "blog" };
  else if (path.startsWith("/blog/"))
    route = { name: "post", slug: decodeURIComponent(path.slice("/blog/".length)) };
  else route = { name: "home" };

  return { lang, route };
}

/**
 * Canonical pathname for a route in a given language. Always trailing-slashed:
 * GitHub Pages 301-redirects a bare directory path (e.g. `/blog/x`) to its
 * trailing-slash form, so a canonical/sitemap URL without the slash sends
 * crawlers through an extra redirect hop back to itself.
 */
export function buildPath(route: Route, lang: Language): string {
  let path: string;
  switch (route.name) {
    case "home":
      path = "/";
      break;
    case "impressum":
      path = "/impressum/";
      break;
    case "datenschutz":
      path = "/datenschutz/";
      break;
    case "blog":
      path = "/blog/";
      break;
    case "post":
      path = `/blog/${encodeURIComponent(route.slug)}/`;
      break;
  }
  if (lang === "de") return path === "/" ? "/de/" : `/de${path}`;
  return path;
}

/**
 * Resolve a language-neutral in-app link (e.g. `/blog/x`, `/`, `/#product`) to
 * its trailing-slashed, `/de`-prefixed (when German) form. Pure-hash and
 * external links pass through unchanged.
 *
 * A query string or hash is split off first, so the slash lands on the path and
 * not after `?page=2`. Links to static files (`/og-image.png`) are left alone
 * entirely: they have neither a trailing-slash form nor a `/de` variant.
 */
export function localizeHref(path: string, lang: Language): string {
  if (!path.startsWith("/")) return path;
  const sepIdx = path.search(/[?#]/);
  const suffix = sepIdx >= 0 ? path.slice(sepIdx) : "";
  let pure = sepIdx >= 0 ? path.slice(0, sepIdx) : path;
  if (pure === "") pure = "/";

  // A last segment ending in a short alphabetic extension is a file, not a
  // route. Digits are excluded on purpose so version-ish slugs (`/blog/ocpp-2.0.1`)
  // stay routes.
  const lastSegment = pure.slice(pure.lastIndexOf("/") + 1);
  if (/\.[a-z]{2,4}$/i.test(lastSegment)) return path;

  if (!pure.endsWith("/")) pure += "/";
  if (lang === "de") pure = pure === "/" ? "/de/" : `/de${pure}`;
  return pure + suffix;
}
