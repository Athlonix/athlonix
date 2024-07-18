FROM node:22.4-alpine AS base
WORKDIR /app

ARG PORT
ENV PORT=${PORT}
EXPOSE ${PORT}

# hadolint ignore=DL3018,DL3016
RUN apk add --no-cache gcompat && \
    npm install -g turbo && \
    npm cache clean -f && \
    corepack enable pnpm

FROM base AS pruner
WORKDIR /app

COPY . .

RUN turbo prune admin --docker

FROM base AS deps
WORKDIR /app

COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

RUN pnpm fetch && \
    pnpm install

FROM deps AS builder
WORKDIR /app

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_ATHLONIX_STORAGE_URL
ARG SUPABASE_DOMAIN
ARG NEXT_PUBLIC_SOCKET_ENDPOINT

ENV NEXT_PUBLIC_SOCKET_ENDPOINT=${NEXT_PUBLIC_SOCKET_ENDPOINT}
ENV SUPABASE_DOMAIN=${SUPABASE_DOMAIN}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_ATHLONIX_STORAGE_URL=${NEXT_PUBLIC_ATHLONIX_STORAGE_URL}

COPY --from=pruner --chown=node:node /app/out/full/ ./

RUN pnpm turbo run build --filter admin && \
    pnpm prune --prod && \
    pnpm --filter admin deploy --prod --ignore-scripts ./out

FROM base AS dev
WORKDIR /app
ENV NODE_ENV=development

COPY --from=pruner --chown=node:node /app/out/full/ ./
COPY --from=deps --chown=node:node /app/ ./

USER node
CMD ["node", "--run", "dev"]


FROM base AS prod
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder --chown=node:node /app/apps/admin/next.config.js .
COPY --from=builder --chown=node:node /app/apps/admin/package.json .
COPY --from=builder --chown=node:node /app/apps/admin/.next/standalone ./
COPY --from=builder --chown=node:node /app/apps/admin/.next/static ./apps/admin/.next/static
COPY --from=builder --chown=node:node /app/apps/admin/public ./apps/admin/public

USER node
CMD ["node", "apps/admin/server.js"]
