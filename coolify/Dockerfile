# ==============================================================================
# DOCKERFILE POUR DEPLOIEMENT COOLIFY / DOCKER (NEXT.JS 14 APP ROUTER)
# ==============================================================================

FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 1. Dépendances
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

# 2. Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Variables build-time (avec valeurs par défaut pour autoriser le build sans fail)
ARG NEXT_PUBLIC_SUPABASE_URL=https://placeholder-project.supabase.co
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder-anon-key
ARG NEXT_PUBLIC_ADMIN_PIN=2026

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

# 3. Runner Production
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copie des fichiers optimisés standalone Next.js
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
