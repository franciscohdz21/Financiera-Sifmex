// server/src/server.js
import Fastify from 'fastify';
import cors from '@fastify/cors';
import 'dotenv/config';

import prismaPlugin from './plugins/prisma.js';
import jwtPlugin from './plugins/jwt.js';

import authRoutes from './routes/auth.js';
import contactsRoutes from './routes/contacts.js';

const fastify = Fastify({
  logger: true,
});

// --- CORS / cookies ---
await fastify.register(cors, {
  origin: process.env.CORS_ORIGIN || true,
  credentials: true,
});

// --- Plugins base ---
await fastify.register(prismaPlugin);
await fastify.register(jwtPlugin);

// --- Rutas públicas / auth ---
await fastify.register(authRoutes);

// --- Rutas app ---
await fastify.register(async function (instance) {
  // Patrón de guards para mutaciones de Contacts (ADMIN/ROOT)
  const guards = {
    create: [instance.auth.roleGuard(['ADMIN', 'ROOT'])],
    update: [instance.auth.roleGuard(['ADMIN', 'ROOT'])],
    remove: [instance.auth.roleGuard(['ADMIN', 'ROOT'])],
    read: [], // lectura abierta (o protégela con instance.auth.verify si prefieres)
  };

  await contactsRoutes(instance, { guards });
});

// --- Arranque ---
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || '0.0.0.0';

try {
  await fastify.listen({ port, host });
  fastify.log.info(`Server running on http://${host}:${port}`);
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
