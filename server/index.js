// Financiera-Sifmex/server/index.js
import Fastify from 'fastify';
import cors from '@fastify/cors';
import contactsRoutes from './routes/contacts.js';

const fastify = Fastify({ logger: true });

// Permite peticiones desde el frontend (http://localhost:5173 por defecto en Vite)
await fastify.register(cors, { origin: true });

// Rutas de la API
await fastify.register(contactsRoutes, { prefix: '/api' });

const PORT = process.env.PORT || 4000;
fastify.listen({ port: PORT, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`🚀 Server ready at ${address}`);
});
