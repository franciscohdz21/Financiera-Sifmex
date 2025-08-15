// server/src/plugins/prisma.js
import fp from 'fastify-plugin';
import { PrismaClient } from '@prisma/client';

export default fp(async function prismaPlugin(fastify) {
  const prisma = new PrismaClient();

  fastify.decorate('prisma', prisma);

  fastify.addHook('onClose', async (instance, done) => {
    try {
      await instance.prisma.$disconnect();
    } catch (e) {
      instance.log.error(e, 'Error disconnecting Prisma');
    }
    done();
  });
});
