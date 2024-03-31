FROM node:21-alpine AS base
WORKDIR /app

# hadolint ignore=DL3018
RUN apk add --no-cache libc6-compat && \
    npm install -g pnpm@latest turbo@latest

HEALTHCHECK --interval=5s --timeout=1s \
    CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/health || exit 1

FROM base AS pruner
WORKDIR /app

COPY . .

RUN turbo prune api --docker

FROM base as deps
WORKDIR /app

COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

RUN pnpm fetch && \
    pnpm install

FROM deps AS builder

RUN pnpm run build && \
    pnpm prune --prod

FROM base AS dev
WORKDIR /app
ENV NODE_ENV=development
ENV PORT 3103
EXPOSE 3103

COPY --from=pruner --chown=node:node /app/out/full/ ./
COPY --from=deps --chown=node:node /app/ ./

USER node
CMD ["pnpm", "run", "dev"]


FROM base AS prod
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder --chown=node:node /app/full/package.json .
COPY --from=builder --chown=node:node /app/full/dist .

USER node
CMD ["node", "./dist/server.js"]
