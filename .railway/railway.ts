import { defineRailway, github, project, service } from "railway/iac";

export default defineRailway(() => {
  const Docs = service("Docs", {
    source: github("adsrmk/vecloud-docs", {
      branch: "dev",
      checkSuites: false,
    }),
    build: {
      buildEnvironment: "V3",
      builder: "DOCKERFILE",
      dockerfilePath: "Dockerfile",
      // Match the repository inputs copied by the root Dockerfile.
      watchPatterns: [
        "/Dockerfile",
        "/.dockerignore",
        "/apps/vecloud-docs/package.json",
        "/apps/vecloud-docs/pnpm-lock.yaml",
        "/apps/vecloud-docs/pnpm-workspace.yaml",
        "/apps/vecloud-docs/next.config.mjs",
        "/apps/vecloud-docs/next-adapter.mjs",
        "/apps/vecloud-docs/postcss.config.mjs",
        "/apps/vecloud-docs/source.config.ts",
        "/apps/vecloud-docs/proxy.ts",
        "/apps/vecloud-docs/tsconfig.json",
        "/apps/vecloud-docs/app/**",
        "/apps/vecloud-docs/components/**",
        "/apps/vecloud-docs/content/**",
        "/apps/vecloud-docs/lib/**",
        "/apps/vecloud-docs/public/**",
      ],
    },
    healthcheck: "/api/health",
    healthcheckTimeout: 60,
    replicas: { "europe-west4-drams3a": 1 },
    deploy: {
      limitOverride: { containers: { cpu: 2, memoryBytes: 4000000000 } },
      restartPolicyMaxRetries: 5,
    },
    domains: [{ domain: "docs.vecloud.eu", port: 3000 }],
    networking: { privateNetworkEndpoint: "docs" },
  });

  return project("VECloud Documentation", {
    variables: { managed: false },
    resources: [Docs],
  });
});
