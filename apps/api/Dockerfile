FROM node:22-alpine AS base
WORKDIR /app

ARG PORT
ENV PORT=${PORT}
EXPOSE ${PORT}

# hadolint ignore=DL3018,DL3016
RUN apk add --no-cache gcompat && \
    npm install -g turbo && \
    npm cache clean -f && \
    corepack enable pnpm

HEALTHCHECK --interval=30s --timeout=5s \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3101/health || exit 1

FROM base AS pruner
WORKDIR /app

COPY . .

RUN turbo prune api --docker

FROM base AS deps
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
CMD ["node", "--run", "dev"]


FROM base AS prod
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder --chown=node:node /app/out/package.json .
COPY --from=builder --chown=node:node /app/out/node_modules/ ./node_modules
COPY --from=builder --chown=node:node /app/apps/api/dist/ ./dist

USER node
CMD ["node", "dist/src/index.js"]
