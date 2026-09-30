# ==============================================================================
# DOCKERFILE - HOSTINGER VPS / CLOUD (NEXT.JS 14 APP ROUTER STANDALONE)
# ==============================================================================

FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 1. Dépendances
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

# 2. Construction
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Variables build-time (avec fallbacks par défaut)
ARG NEXT_PUBLIC_SUPABASE_URL=https://bgdoudwqamjxlzawqtkl.supabase.co
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_7krLDedweBPHtlAPtli9Vw_TPN6my_k
ARG NEXT_PUBLIC_ADMIN_PIN=2026
ARG NEXT_PUBLIC_WEDDING_TITLE="Radene & Kevin"
ARG NEXT_PUBLIC_WEDDING_DATE="2026-12-05T11:00:00+00:00"
ARG NEXT_PUBLIC_WEDDING_LOCATION="Eglise Protestante du Sénégal, Paroisse de Dieuppeul, Dakar"

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

# 3. Runner de Production
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copie des fichiers standalone et assets statiques
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
