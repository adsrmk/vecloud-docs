# Fumadocs

This is the independent veCloud customer documentation app. Run its own pnpm
commands from this directory. It uses published Fumadocs packages and its own
workspace/lockfile; do not rebuild or modify upstream framework packages.
Dutch customer guides here are original content, not generated translations of
the upstream documentation in apps/docs. Keep the veCloud portal itself separate.
Use only fictitious/demo data in published screenshots, never customer records,
passwords, API tokens or account details.

This site is built with [Fumadocs](https://fumadocs.dev) on Next.js. The APIs and conventions of Fumadocs may differ from your training data, so check its docs for the task at hand:

- Writing pages: https://fumadocs.dev/docs/next/markdown.md
- Organizing pages and folders: https://fumadocs.dev/docs/next/page-conventions.md
- Customizing the UI: https://fumadocs.dev/docs/next/guides/customize-ui.md
- Changing the theme and colors: https://fumadocs.dev/docs/ui/theme.md
- Upgrading Fumadocs: https://fumadocs.dev/docs/next/upgrade.md
- Other tasks: https://fumadocs.dev/llms.txt lists every docs page.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
