FROM node:24-bookworm-slim AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm install --global pnpm@11.25.0
COPY apps/vecloud-docs/package.json apps/vecloud-docs/pnpm-lock.yaml apps/vecloud-docs/pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY apps/vecloud-docs/next.config.mjs apps/vecloud-docs/next-adapter.mjs \
     apps/vecloud-docs/postcss.config.mjs apps/vecloud-docs/source.config.ts \
     apps/vecloud-docs/proxy.ts apps/vecloud-docs/tsconfig.json ./
COPY apps/vecloud-docs/app ./app
COPY apps/vecloud-docs/components ./components
COPY apps/vecloud-docs/content ./content
COPY apps/vecloud-docs/lib ./lib
RUN pnpm build

FROM node:24-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 HOSTNAME=0.0.0.0
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --chown=node:node apps/vecloud-docs/public ./public
USER node
EXPOSE 3000
CMD ["node", "server.js"]
