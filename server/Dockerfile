# --- Base ---
FROM node:20-alpine AS base
WORKDIR /app
ENV NODE_ENV=production
RUN corepack enable

# --- Deps ---
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# --- Prisma generate ---
FROM deps AS prisma
WORKDIR /app
COPY prisma ./prisma
RUN pnpm prisma generate

# --- Runtime ---
FROM base AS runtime
WORKDIR /app

# node_modules con Prisma Client
COPY --from=deps /app/node_modules ./node_modules

# Copiamos esquema prisma (para migrate deploy)
COPY prisma ./prisma

# Copiamos el código fuente del server
COPY . .

ENV PORT=4000
EXPOSE 4000

# Si usas TypeScript con build, agrega aquí:
# RUN pnpm build

# Entrypoint (alineado a tu estructura real)
CMD ["node", "src/server.js"]
