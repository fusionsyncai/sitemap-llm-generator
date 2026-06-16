# Sitemap & llms.txt Generator

Free tool by [FusionSync](https://www.fusionsync.ai) that crawls a public website and generates:

- `sitemap.xml` for search engine discovery
- `llms.txt` for AI/LLM discovery

Built with Next.js, TypeScript, and deterministic crawling engines (no API keys, no LLM).

## Features

- Same-origin HTTP crawler with bounded limits (pages, depth, time budget)
- Valid `sitemap.xml` output with optional `<lastmod>`
- `llms.txt` output grouped by site sections with titles and descriptions
- Live progress via Server-Sent Events
- SSRF protection and per-IP rate limiting
- Copy/download results from the UI
- SEO blog ("The Playbook") at `/blog` with article pages, JSON-LD, and a generated `sitemap.xml` / `robots.txt`

## Editing content

- Brand links, logo, and the Cal booking URL live in [`src/lib/brand.ts`](src/lib/brand.ts).
- Color theme is two CSS variables (`--accent-from` / `--accent-to`) in [`src/app/globals.css`](src/app/globals.css).
- Blog posts live in `src/content/blog/posts/` — add a `.tsx` file exporting `meta` + `Content`, then register it in [`src/content/blog/index.ts`](src/content/blog/index.ts).

## Tech stack

- [Next.js](https://nextjs.org/) (App Router)
- [@geosuite/sitemap-builder](https://github.com/TryGeoSuite/sitemap-builder)
- [@geosuite/llms-txt-generator](https://github.com/TryGeoSuite/llms-txt-generator)

## Getting started

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

```bash
NEXT_PUBLIC_SITE_URL=https://sitemap.fusionsync.ai
```

## Deploy

Deploy to Vercel. The API route is configured for a 60s function timeout in `vercel.json`.

## Limitations

- HTTP-only crawling (no JavaScript rendering)
- Same-origin links only
- Best for marketing sites, docs, and CMS-backed pages
- SPAs whose links only appear after client-side hydration may be incomplete

## Related tools

- [GEO Report](https://geo-report.fusionsync.ai)
- [FusionSync](https://fusionsync.ai)

## License

MIT
# sitemap-llm-generator
