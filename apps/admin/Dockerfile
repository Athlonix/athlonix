# Base image
FROM node:21-alpine AS base
WORKDIR /app

EXPOSE ${PORT}
ENV PORT ${PORT}

# hadolint ignore=DL3018
RUN apk add --no-cache libc6-compat && \
    npm i -g pnpm@latest

COPY --chown=node:node package.json pnpm-lock.yaml ./

# Development
FROM base AS dev
ENV NODE_ENV development

RUN pnpm fetch && \
    pnpm install

COPY --chown=node:node . .

USER node
CMD ["pnpm", "run", "dev"]


# Builder
FROM base AS builder
WORKDIR /app

RUN pnpm fetch --frozen-lockfile && \
    pnpm install --frozen-lockfile && \
    pnpm store prune

COPY --chown=node:node . .

RUN pnpm run build


# Production
FROM base AS prod
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN mkdir .next && \
    chown node:node .next

COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

USER node
CMD ["node", "server.js"]
