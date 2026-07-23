// Static prerender step. Runs after the Vite client build and the Vite SSR
// build: for every {route, lang} it renders the app to HTML, injects the
// per-route <head>, and writes build/<path>/index.html. Also emits a 404.html
// SPA fallback and a sitemap.xml covering both languages.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";

const BUILD = "build";
const ssrEntry = pathToFileURL(join(process.cwd(), "dist-ssr", "entry-server.js")).href;
const { render, allRoutes, headTags, buildPath, pageMeta, SITE } = await import(ssrEntry);

const shell = await readFile(join(BUILD, "index.html"), "utf8");

function compose(lang, head, appHtml) {
  let html = shell.replace('<html lang="en"', `<html lang="${lang}"`);
  html = html.includes("<!--app-head-->")
    ? html.replace("<!--app-head-->", head)
    : html.replace("</head>", `${head}\n  </head>`);
  return html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
}

function outFile(path) {
  const clean = path.replace(/^\/+|\/+$/g, "");
  return clean === "" ? join(BUILD, "index.html") : join(BUILD, clean, "index.html");
}

const routes = allRoutes();
for (const { route, lang } of routes) {
  const path = buildPath(route, lang);
  const { appHtml } = render(path);
  const html = compose(lang, headTags(route, lang), appHtml);
  const file = outFile(path);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html, "utf8");
}

// 404 fallback: empty app shell that client-routes any non-prerendered path.
await writeFile(join(BUILD, "404.html"), compose("en", headTags({ name: "home" }, "en"), ""), "utf8");

// Sitemap covering every page in both languages with hreflang alternates.
const today = new Date().toISOString().slice(0, 10);
const seen = new Set();
const entries = [];
for (const { route, lang } of routes) {
  const loc = SITE + buildPath(route, lang);
  if (seen.has(loc)) continue;
  seen.add(loc);
  const meta = pageMeta(route, lang);
  const lastmod = meta.post ? meta.post.date : today;
  const alts = meta.langs
    .map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${SITE + buildPath(route, l)}"/>`)
    .join("\n");
  entries.push(
    `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${route.name === "home" ? "1.0" : "0.7"}</priority>\n${alts}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE + buildPath(route, "en")}"/>\n  </url>`,
  );
}
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join("\n")}\n</urlset>\n`;
await writeFile(join(BUILD, "sitemap.xml"), sitemap, "utf8");

console.log(`Prerendered ${routes.length} pages, 404.html and sitemap.xml (${entries.length} URLs).`);
