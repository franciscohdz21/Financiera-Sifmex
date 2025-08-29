# --- Base: Debian slim (mejor con Prisma/OpenSSL) ---
FROM node:20-bookworm-slim AS base
WORKDIR /app
ENV NODE_ENV=production
RUN apt-get update \
 && apt-get install -y --no-install-recommends openssl ca-certificates \
 && rm -rf /var/lib/apt/lists/* \
 && corepack enable

# --- Deps ---
FROM base AS deps
WORKDIR /app
# Copiamos solo lo necesario para instalar deps
COPY package.json pnpm-lock.yaml ./
# Instala solo dependencias de runtime (incluye @prisma/client, NO devDeps)
RUN pnpm install --prod --no-optional

# --- Runtime ---
FROM base AS runtime
WORKDIR /app

# Traemos node_modules resueltos
COPY --from=deps /app/node_modules ./node_modules

# Copiamos prisma y código
COPY prisma ./prisma
COPY . .

# 👇 Genera Prisma Client dentro de la imagen (misma versión que @prisma/client)
# Usa versión fija del CLI compatible con tu @prisma/client (5.22.0)
RUN pnpm dlx prisma@5.22.0 generate

ENV PORT=4000
EXPOSE 4000

# Fallback (Render puede sobreescribir con Docker Command)
CMD ["node", "src/server.js"]
