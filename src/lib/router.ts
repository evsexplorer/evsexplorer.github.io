import type { Language } from "../translations";

// A resolved page within the site, independent of language.
export type Route =
  | { name: "home" }
  | { name: "impressum" }
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
  else if (path === "/blog") route = { name: "blog" };
  else if (path.startsWith("/blog/"))
    route = { name: "post", slug: decodeURIComponent(path.slice("/blog/".length)) };
  else route = { name: "home" };

  return { lang, route };
}

/** Canonical pathname for a route in a given language. */
export function buildPath(route: Route, lang: Language): string {
  let path: string;
  switch (route.name) {
    case "home":
      path = "/";
      break;
    case "impressum":
      path = "/impressum";
      break;
    case "blog":
      path = "/blog";
      break;
    case "post":
      path = `/blog/${encodeURIComponent(route.slug)}`;
      break;
  }
  if (lang === "de") return path === "/" ? "/de/" : `/de${path}`;
  return path;
}

/**
 * Prefix a language-neutral in-app link (e.g. `/blog/x`, `/`, `/#product`) with
 * `/de` when in German. Pure-hash and external links pass through unchanged.
 */
export function localizeHref(path: string, lang: Language): string {
  if (lang !== "de" || !path.startsWith("/")) return path;
  const hashIdx = path.indexOf("#");
  const hash = hashIdx >= 0 ? path.slice(hashIdx) : "";
  const pure = hashIdx >= 0 ? path.slice(0, hashIdx) : path;
  const base = pure === "" || pure === "/" ? "/de/" : `/de${pure}`;
  return base + hash;
}
