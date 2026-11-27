# VECloud Docs

Customer documentation for the [VECloud Control Panel](https://panel.vecloud.eu).
Railway hosts the [documentation site](https://docs.vecloud.eu/).

The standalone Next.js app lives in [apps/vecloud-docs](apps/vecloud-docs).
Run the development server from that directory with Node.js 24 and the pnpm
version declared in its package manifest.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

The [app README](apps/vecloud-docs/README.md) describes content editing and checks.

The site uses [Fumadocs](https://fumadocs.dev/). The original MIT license is
included in [LICENSE](LICENSE). The former framework checkout is available on
the `upstream-reference` branch.
