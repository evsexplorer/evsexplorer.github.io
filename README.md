# EVSExplorer website

Single-page marketing website for [EVSExplorer](https://www.evsexplorer.com) —
an OCPP 2.0.1 CSMS companion for developing and testing charging stations. The
content, screenshots and color theme come from the actual product
(see the `evsexplorer-ui` repository).

**Stack:** Vite 6 · React 19 · TypeScript · Tailwind CSS v4.

## Development

Requires **Node.js ≥ 20**.

```sh
npm install
npm run dev        # http://localhost:3000
npm run build      # production build into build/
npm run typecheck  # tsc only
```

## Deployment

Pushes to `master` trigger the GitHub Actions workflow in
`.github/workflows/build-deploy.yml`, which builds the site and deploys the
`build/` directory to GitHub Pages. Everything in `public/` (favicons,
`manifest.json`, `robots.txt`, `sitemap.xml`, the Open Graph image) is copied
into the build automatically by Vite.

## Content notes

- The product screenshots in `src/assets/shots/` were captured from a live
  EVSExplorer instance with anonymized charge point identities.
- The site is bilingual (EN/DE, `?lang=` query parameter); all copy lives in
  `src/translations.ts`.
- SEO metadata (meta tags, Open Graph, JSON-LD structured data) is static in
  `index.html`.
