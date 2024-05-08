# Athlonix Turborepo

[![API Test](https://github.com/Athlonix/athlonix/actions/workflows/api-test.yml/badge.svg?branch=main)](https://github.com/Athlonix/athlonix/actions/workflows/api-test.yml)
[![Continuous Integration](https://github.com/Athlonix/athlonix/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/Athlonix/athlonix/actions/workflows/ci.yml)
[![CD api](https://github.com/Athlonix/athlonix/actions/workflows/cd-api.yml/badge.svg?branch=main)](https://github.com/Athlonix/athlonix/actions/workflows/cd-api.yml)
[![CD admin](https://github.com/Athlonix/athlonix/actions/workflows/cd-admin.yml/badge.svg?branch=main)](https://github.com/Athlonix/athlonix/actions/workflows/cd-admin.yml)
[![CD client](https://github.com/Athlonix/athlonix/actions/workflows/cd-client.yml/badge.svg?branch=main)](https://github.com/Athlonix/athlonix/actions/workflows/cd-client.yml)

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `admin`: a [Next.js](https://nextjs.org/) app
- `client`: another [Next.js](https://nextjs.org/) app
- `api`: a [hono](https://hono.dev/) API
- `@repo/ui`: a stub React component library shared by both `admin` and `client` applications
- `@repo/biome-config`: Fast linting and formatting configurations for the monorepo
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo
- `@repo/types`: shared TypeScript supabase types

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [Biome](https://biome.dev) for linting and formatting
- [Supabase](https://supabase.io) for the database

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
