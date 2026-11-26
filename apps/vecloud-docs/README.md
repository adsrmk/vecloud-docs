# veCloud Docs

Customer documentation for the [veCloud Control Panel](https://panel.vecloud.eu), hosted at [docs.vecloud.eu](https://docs.vecloud.eu).

The standalone Next.js application lives in `apps/vecloud-docs`. It uses the official Fumadocs starter and published packages; the upstream framework remains in this fork for reference and updates.

```sh
cd apps/vecloud-docs
pnpm install --frozen-lockfile
pnpm dev
```

Content lives in `apps/vecloud-docs/content/docs`. Dutch is the default source (`page.mdx`); translations use `page.en.mdx`, `page.es.mdx`, `page.fr.mdx`, and `page.de.mdx`. Navigation follows the same pattern with `meta.json` and `meta.<locale>.json`. All eight guides are available in all five languages. Missing translations do not silently fall back to Dutch. Use relative MDX links to keep navigation in the selected language. Place original, sanitized screenshots in `public/images/control-panel` and include meaningful alt text. Never publish customer records, credentials or account details.

The root Dockerfile builds only the documentation app. The linked Railway service uses the repository root, Dockerfile builder, `PORT=3000` with domain target port 3000, one replica in Amsterdam (`europe-west4-drams3a`), `/api/health` for readiness (60 seconds), and restart-on-failure with five retries. These settings are stored on the Railway service; the deprecated `railway.json` format is not used. Updates on `dev` run the veCloud Docs checks and deploy through the linked GitHub service. No database, portal secrets or paid search provider is required.

## Languages and layout

The docs use the Fumadocs Notebook layout with the panel’s Inter and Geist Mono fonts. The language menu keeps the current guide when switching languages. Search results are scoped to the selected language.

Public routes use `/nl/docs`, `/en/docs`, `/es/docs`, `/fr/docs`, and `/de/docs`. Existing `/docs/...` links redirect to `/nl/docs/...`; the root opens the Dutch overview. Canonical URLs, language alternates, the sitemap, Markdown exports and social images include the locale.

Run `pnpm lint`, `pnpm build`, `pnpm types:check` and `pnpm test:smoke` from this app directory. The smoke test checks all 40 guides, translated titles, links, language-specific search, canonical and alternate links, redirects, Markdown, images and 404 responses against the production standalone artifact. Set `DOCS_SMOKE_BASE_URL=https://docs.vecloud.eu` to run the same read-only checks against the deployed site.

## Fumadocs upstream

# .vecloud-docs-starter

This is a Next.js application generated with
[Create Fumadocs](https://github.com/fuma-nama/fumadocs).

Run development server:

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open http://localhost:3000 with your browser to see the result.

## Explore

In the project, you can see:

- `lib/source.ts`: Code for content source adapter, [`loader()`](https://fumadocs.dev/docs/headless/source-api) provides the interface to access your content.
- `lib/layout.shared.tsx`: Shared options for layouts, optional but preferred to keep.

| Route                     | Description                                            |
| ------------------------- | ------------------------------------------------------ |
| `app/(home)`              | The route group for your landing page and other pages. |
| `app/docs`                | The documentation layout and pages.                    |
| `app/api/search/route.ts` | The Route Handler for search.                          |

### Fumadocs MDX

Collections are defined with the [Macro API](https://fumadocs.dev/docs/mdx/macro) in `lib/source.ts`.

Read the [Introduction](https://fumadocs.dev/docs/mdx) for further details.

## Learn More

To learn more about Next.js and Fumadocs, take a look at the following
resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js
  features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Fumadocs](https://fumadocs.dev) - learn about Fumadocs
