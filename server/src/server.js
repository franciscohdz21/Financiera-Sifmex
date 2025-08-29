// server/src/server.js
import Fastify from 'fastify';
import 'dotenv/config';

// Plugins propios
import prismaPlugin from './plugins/prisma.js';
import jwtPlugin from './plugins/jwt.js';

// Rutas
import authRoutes from './routes/auth.js';
import contactsRoutes from './routes/contacts.js';

const fastify = Fastify({
  logger: true,
});

/**
 * CORS
 * Usamos nuestro plugin local que lee CORS_ORIGINS de env.
 * IMPORTANTE: Asegúrate de tener creado server/src/plugins/cors.js
 * y de haber instalado @fastify/cors en el paquete del server.
 */
{
  const corsPlugin = (await import('./plugins/cors.js')).default;
  await fastify.register(corsPlugin);
}

/**
 * Healthcheck
 * IMPORTANTE: Asegúrate de tener creado server/src/routes/health.js
 */
{
  const healthRoute = (await import('./routes/health.js')).default;
  await fastify.register(healthRoute);
}

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
const port = Number(process.env.PORT || 4000);
const host = process.env.HOST || '0.0.0.0';

try {
  await fastify.listen({ port, host });
  fastify.log.info(`✅ Server running on http://localhost:${port}`);
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
