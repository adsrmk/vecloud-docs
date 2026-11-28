# veCloud Docs

Customer documentation for the [veCloud Control Panel](https://panel.vecloud.eu), hosted at [docs.vecloud.eu](https://docs.vecloud.eu).

The standalone Next.js application lives in `apps/vecloud-docs`. It uses the official Fumadocs starter and published packages; the former framework checkout remains available on the `upstream-reference` branch.

```sh
cd apps/vecloud-docs
pnpm install --frozen-lockfile
pnpm dev
```

Content lives in `apps/vecloud-docs/content/docs`. Dutch is the default source (`page.mdx`); translations use `page.en.mdx`, `page.es.mdx`, `page.fr.mdx`, and `page.de.mdx`. Navigation follows the same pattern with `meta.json` and `meta.<locale>.json`. Keep all five versions of each guide in sync. Missing translations do not silently fall back to Dutch. Use relative MDX links to keep navigation in the selected language. Place original, sanitized screenshots in `public/screenshots` and include meaningful alt text. Never publish customer records, credentials or account details.

The root Dockerfile builds the documentation app. The [Railway configuration](../../.railway/railway.ts) defines the service and the production files that trigger a deploy from `dev`. Railway waits for the GitHub workflow to pass before it builds. Update the watch paths and the workflow's push filters together when adding another repository input to the Dockerfile. Preview configuration changes with `railway config plan` before applying them. GitHub also runs the documentation checks for changes to the app’s README, lint config and test scripts. The service uses no database or external search provider.

## Languages and layout

The docs use the Fumadocs Notebook layout with the panel’s Inter and Geist Mono fonts. The language menu keeps the current guide when switching languages. Search results are scoped to the selected language.

Public routes use `/nl/docs`, `/en/docs`, `/es/docs`, `/fr/docs`, and `/de/docs`. Existing `/docs/...` links redirect to `/nl/docs/...`; the root opens the Dutch overview. Canonical URLs, language alternates, the sitemap, Markdown exports and social images include the locale.

Run `pnpm lint`, `pnpm build`, `pnpm types:check` and `pnpm test:smoke` from this app directory. The smoke test checks every guide, translated titles, links, language-specific search, canonical and alternate links, redirects, Markdown, images and 404 responses against the production standalone artifact. Set `DOCS_SMOKE_BASE_URL=https://docs.vecloud.eu` to run the same read-only checks against the deployed site.
