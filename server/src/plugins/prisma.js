// server/src/plugins/prisma.js
import fp from 'fastify-plugin';
import pkg from '@prisma/client'; // CJS → usar default import
const { PrismaClient } = pkg;

// Crear una sola instancia para toda la app
const prisma = new PrismaClient();

export default fp(async function prismaPlugin(fastify) {
  // Exponer prisma en fastify
  fastify.decorate('prisma', prisma);

  // Cerrar conexión al apagar el servidor
  fastify.addHook('onClose', async (instance) => {
    try {
      await instance.prisma.$disconnect();
    } catch (err) {
      instance.log.error({ err }, 'Error disconnecting Prisma');
    }
  });
});
