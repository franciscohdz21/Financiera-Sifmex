// Financiera-Sifmex/server/routes/contacts.js
import prisma from '../prismaClient.js';

/**
 *  /api/contacts
 *    GET           → lista de contactos (filtrado opcional por ?q=)
 *    POST          → nuevo contacto  (JSON body)
 *  /api/contacts/:id
 *    GET           → detalle
 *    PUT           → actualizar
 *    DELETE        → eliminar
 */
export default async function contactsRoutes(fastify, _opts) {
  // ────────────────────────────────  GET lista
  fastify.get('/contacts', async (request) => {
    const { q } = request.query;
    const where = q
      ? {
          OR: [
            { apellidos: { contains: q, mode: 'insensitive' } },
            { celular: { contains: q } },
            { curp: { contains: q, mode: 'insensitive' } }
          ]
        }
      : {};
    return prisma.contacts.findMany({ where, orderBy: { id: 'asc' } });
  });

  // ────────────────────────────────  GET único
  fastify.get('/contacts/:id', ({ params }) =>
    prisma.contacts.findUnique({ where: { id: Number(params.id) } })
  );

  // ────────────────────────────────  POST crear
  fastify.post('/contacts', async ({ body }, reply) => {
    const contact = await prisma.contacts.create({ data: body });
    reply.code(201);
    return contact;
  });

  // ────────────────────────────────  PUT actualizar
  fastify.put('/contacts/:id', async ({ params, body }, reply) => {
    const updated = await prisma.contacts.update({
      where: { id: Number(params.id) },
      data: body
    });
    return updated;
  });

  // ────────────────────────────────  DELETE eliminar
  fastify.delete('/contacts/:id', async ({ params }, reply) => {
    await prisma.contacts.delete({ where: { id: Number(params.id) } });
    reply.code(204);
  });
}
