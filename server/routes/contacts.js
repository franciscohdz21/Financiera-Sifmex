// Financiera-Sifmex/server/routes/contacts.js
import prisma from '../prismaClient.js';

/**
 *  /api/contacts
 *    GET           → lista de contactos (filtrado opcional por ?q=)
 *    POST          → nuevo contacto  (JSON body)      ← try/catch con mensaje
 *  /api/contacts/:id
 *    GET           → detalle
 *    PUT           → actualizar                         ← try/catch con mensaje
 *    DELETE        → eliminar
 */
export default async function contactsRoutes(fastify, _opts) {
  // ────────────────────────────────  GET lista (filtra por apellidos/curp/celular)
  fastify.get('/contacts', async (request) => {
    const { q } = request.query;
    const where = q
      ? {
          OR: [
            { apellidos: { contains: q, mode: 'insensitive' } },
            { curp:      { contains: q, mode: 'insensitive' } },
            { celular:   { contains: q } }
          ]
        }
      : {};
    return prisma.contacts.findMany({ where, orderBy: { id: 'asc' } });
  });

  // ────────────────────────────────  GET único
  fastify.get('/contacts/:id', ({ params }) =>
    prisma.contacts.findUnique({ where: { id: Number(params.id) } })
  );

  // ────────────────────────────────  POST crear (con mensaje de error)
  fastify.post('/contacts', async (req, reply) => {
    try {
      const created = await prisma.contacts.create({ data: req.body });
      reply.code(201).send(created);
    } catch (e) {
      fastify.log.error(e);
      reply.code(400).send({ error: e?.message || 'Error al crear contacto' });
    }
  });

  // ────────────────────────────────  PUT actualizar (con mensaje de error)
  fastify.put('/contacts/:id', async (req, reply) => {
    try {
      const updated = await prisma.contacts.update({
        where: { id: Number(req.params.id) },
        data: req.body
      });
      reply.send(updated);
    } catch (e) {
      fastify.log.error(e);
      reply.code(400).send({ error: e?.message || 'Error al actualizar contacto' });
    }
  });

  // ────────────────────────────────  DELETE eliminar
  fastify.delete('/contacts/:id', async ({ params }, reply) => {
    await prisma.contacts.delete({ where: { id: Number(params.id) } });
    reply.code(204).send();
  });
}
