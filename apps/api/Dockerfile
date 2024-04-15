FROM node:21-alpine AS base
WORKDIR /app

ENV PORT 3101
EXPOSE 3101

# hadolint ignore=DL3018
RUN apk add --no-cache libc6-compat && \
    npm install -g pnpm@latest turbo@latest

HEALTHCHECK --interval=30s --timeout=5s \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3101/health || exit 1

FROM base AS pruner
WORKDIR /app

COPY . .

RUN turbo prune api --docker

FROM base as deps
WORKDIR /app

COPY /apps/api/tsconfig.json .
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

RUN pnpm fetch && \
    pnpm install

FROM deps AS builder
WORKDIR /app

COPY --from=pruner --chown=node:node /app/out/full/ ./

RUN pnpm turbo run build --filter api && \
    pnpm prune --prod && \
    pnpm --filter api deploy --prod --ignore-scripts ./out

FROM base AS dev
WORKDIR /app
ENV NODE_ENV=development

COPY --from=pruner --chown=node:node /app/out/full/ ./
COPY --from=deps --chown=node:node /app/ ./

USER node
CMD ["pnpm", "run", "dev"]


FROM base AS prod
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder --chown=node:node /app/out/package.json .
COPY --from=builder --chown=node:node /app/out/node_modules/ ./node_modules
COPY --from=builder --chown=node:node /app/apps/api/dist/ ./dist

USER node
CMD ["node", "dist/src/index.js"]
