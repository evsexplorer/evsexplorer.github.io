import { renderToString } from "react-dom/server";
import { App } from "./App";
import { parsePath } from "./lib/router";

/** Render a route's app markup for the prerender step. */
export function render(pathname: string): { appHtml: string } {
  const { route, lang } = parsePath(pathname);
  const appHtml = renderToString(<App initialRoute={route} initialLang={lang} />);
  return { appHtml };
}

// Re-exported so the prerender script (which imports this SSR bundle) can reach
// the content-loader-backed helpers without touching import.meta.glob itself.
export { allRoutes, headTags, fallbackHeadTags, pageMeta, SITE } from "./lib/seo";
export { buildPath } from "./lib/router";
