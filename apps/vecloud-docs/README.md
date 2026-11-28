# veCloud Docs

Customer documentation for the [veCloud Control Panel](https://panel.vecloud.eu), hosted at [docs.vecloud.eu](https://docs.vecloud.eu).

The standalone Next.js application lives in `apps/vecloud-docs`. It uses the official Fumadocs starter and published packages; the former framework checkout remains available on the `upstream-reference` branch.

```sh
cd apps/vecloud-docs
pnpm install --frozen-lockfile
pnpm dev
```

Content lives in `apps/vecloud-docs/content/docs`. Use `page.<locale>.mdx` and `meta.<locale>.json` for each of the five locales (`en`, `nl`, `es`, `fr`, `de`). Keep all language versions in sync. Use relative MDX links to keep navigation in the selected language. Place original, sanitized screenshots in `public/screenshots` and include meaningful alt text. Never publish customer records, credentials or account details.

The root Dockerfile builds the documentation app. The [Railway configuration](../../.railway/railway.ts) defines the service and the production files that trigger a deploy from `dev`. Railway waits for the GitHub workflow to pass before it builds. Update the watch paths and the workflow's push filters together when adding another repository input to the Dockerfile. Preview configuration changes with `railway config plan` before applying them. GitHub also runs the documentation checks for changes to the app’s README, lint config and test scripts. The service uses no database or external search provider.

## Languages and layout

The docs use the Fumadocs Notebook layout with the panel’s Inter and Geist Mono fonts. The language menu keeps the current guide when switching languages. Search results are scoped to the selected language.

English is the default at `/docs`, and the root opens that overview. Existing `/en/docs/...` links redirect to the corresponding `/docs/...` pages. Dutch, Spanish, French and German use `/nl/docs`, `/es/docs`, `/fr/docs` and `/de/docs`. The sitemap, canonical URLs and Markdown links use the public paths.

Run `pnpm lint`, `pnpm build`, `pnpm types:check` and `pnpm test:smoke` from this app directory. The smoke test checks every guide, translated titles, links, language-specific search, canonical and alternate links, redirects, Markdown, images and 404 responses against the production standalone artifact. Set `DOCS_SMOKE_BASE_URL=https://docs.vecloud.eu` to run the same read-only checks against the deployed site.
