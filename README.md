# Athlonix Turborepo

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `admin`: a [Next.js](https://nextjs.org/) app
- `client`: another [Next.js](https://nextjs.org/) app
- `api`: a [hono](https://hono.dev/) API
- `@repo/ui`: a stub React component library shared by both `admin` and `client` applications
- `@repo/biome-config`: Fast linting and formatting configurations for the monorepo
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [Biome](https://biome.dev) for linting and formatting

### Build

To build all apps and packages, run the following command:

```sh
pnpm build
```

### Develop

To develop all apps and packages, run the following command:

```sh
pnpm dev
```

### Format and Lint

To lint & format all apps and packages, run the following command:

```sh
pnpm lint
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)
