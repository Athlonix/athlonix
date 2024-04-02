FROM node:21-alpine AS base
WORKDIR /app

ENV PORT 3100
EXPOSE 3100

# hadolint ignore=DL3018
RUN apk add --no-cache libc6-compat && \
    npm install -g pnpm@latest turbo@latest

FROM base AS pruner
WORKDIR /app

COPY . .

RUN turbo prune admin --docker

FROM base as deps
WORKDIR /app

COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

RUN pnpm fetch && \
    pnpm install

FROM deps AS builder
WORKDIR /app

COPY --from=pruner --chown=node:node /app/out/full/ ./

RUN pnpm turbo run build --filter admin && \
    pnpm prune --prod

FROM base AS dev
WORKDIR /app
ENV NODE_ENV=development

COPY --from=pruner --chown=node:node /app/out/full/ ./
COPY --from=deps --chown=node:node /app/ ./

USER node
CMD ["pnpm", "run", "dev"]


FROM base AS prod
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=builder --chown=node:node /app/apps/admin/next.config.js .
COPY --from=builder --chown=node:node /app/apps/admin/package.json .
COPY --from=builder --chown=node:node /app/apps/admin/.next/standalone ./
COPY --from=builder --chown=node:node /app/apps/admin/.next/static ./apps/admin/.next/static
COPY --from=builder --chown=node:node /app/apps/admin/public ./apps/admin/public

USER node
CMD ["node", "apps/admin/server.js"]
