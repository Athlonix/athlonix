FROM node:21-alpine AS base
WORKDIR /app

# hadolint ignore=DL3018
RUN apk add --no-cache libc6-compat && \
    npm install -g pnpm@latest turbo@latest

FROM base AS pruner
WORKDIR /app

COPY . .

RUN turbo prune client --docker

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
ENV PORT 3102
EXPOSE 3102

COPY --from=pruner --chown=node:node /app/out/full/ ./
COPY --from=deps --chown=node:node /app/ ./

USER node
CMD ["pnpm", "run", "dev"]


FROM base AS prod
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder --chown=node:node /app/full/next.config.js .
COPY --from=builder --chown=node:node /app/full/package.json .
COPY --from=builder --chown=node:node /app/full/.next .
COPY --from=builder --chown=node:node /app/full/.next/static ./standalone/.next/static
COPY --from=builder --chown=node:node /app/full/public ./standalone/public

USER node
CMD ["node", "./standalone/server.js"]
