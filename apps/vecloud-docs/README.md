# veCloud Docs

Customer documentation for the [veCloud Control Panel](https://panel.vecloud.eu), hosted at [docs.vecloud.eu](https://docs.vecloud.eu).

The standalone Next.js application lives in `apps/vecloud-docs`. It uses the official Fumadocs starter and published packages; the upstream framework remains in this fork for reference and updates.

```sh
cd apps/vecloud-docs
pnpm install --frozen-lockfile
pnpm dev
```

Content lives in `apps/vecloud-docs/content/docs`, navigation in `meta.json`. Place original, sanitized screenshots in `public/images/control-panel` and include meaningful alt text. Never publish customer records, credentials or account details.

The root Dockerfile builds only the documentation app. Railway uses `/api/health` for readiness. Updates on `dev` run the veCloud Docs checks and deploy through the linked GitHub service. No database, portal secrets or paid search provider is required.

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
