FROM node:22-alpine AS base
WORKDIR /app

ARG PORT
ENV PORT ${PORT}
EXPOSE ${PORT}

# hadolint ignore=DL3018,DL3016
RUN apk add --no-cache gcompat && \
    npm install -g turbo && \
    npm cache clean -f && \
    corepack enable pnpm

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
WORKDIR /app

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL ${NEXT_PUBLIC_API_URL}

COPY --from=pruner --chown=node:node /app/out/full/ ./

RUN pnpm turbo run build --filter client && \
    pnpm prune --prod

FROM base AS dev
WORKDIR /app
ENV NODE_ENV development

COPY --from=pruner --chown=node:node /app/out/full/ ./
COPY --from=deps --chown=node:node /app/ ./

USER node
CMD ["node", "--run", "dev"]


FROM base AS prod
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder --chown=node:node /app/apps/client/next.config.js .
COPY --from=builder --chown=node:node /app/apps/client/package.json .
COPY --from=builder --chown=node:node /app/apps/client/.next/standalone ./
COPY --from=builder --chown=node:node /app/apps/client/.next/static ./apps/client/.next/static
COPY --from=builder --chown=node:node /app/apps/client/public ./apps/client/public

USER node
CMD ["node", "apps/client/server.js"]
