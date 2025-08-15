// server/src/routes/contacts.js
export default async function contactsRoutes(fastify, opts = {}) {
  const G = opts.guards || {};
  const guard = (arr) => (arr && arr.length ? { preHandler: arr } : {});

  // GET /api/contacts
  // Query params:
  //  - lastName: buscar por apellidos (contiene, case-insensitive)
  //  - curp: buscar por curp (contiene, case-insensitive)
  //  - cellphone: buscar por celular (contiene, case-insensitive)
  //  - limit, offset: paginación opcional
  fastify.get('/api/contacts', async (req, reply) => {
    const {
      lastName = '',
      curp = '',
      cellphone = '',
      limit = '50',
      offset = '0',
    } = req.query || {};

    const take = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 200);
    const skip = Math.max(parseInt(offset, 10) || 0, 0);

    const where = {
      AND: [
        lastName
          ? { lastName: { contains: String(lastName), mode: 'insensitive' } }
          : {},
        curp ? { curp: { contains: String(curp), mode: 'insensitive' } } : {},
        cellphone
          ? { cellphone: { contains: String(cellphone), mode: 'insensitive' } }
          : {},
      ],
    };

    const [items, total] = await Promise.all([
      fastify.prisma.contacts.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      fastify.prisma.contacts.count({ where }),
    ]);

    return { items, total, limit: take, offset: skip };
  });

  // POST /api/contacts  (crear)  — protegido por rol si se pasa en opts.guards.create
  fastify.post('/api/contacts', guard(G.create), async (req, reply) => {
    const {
      firstName,
      lastName,
      cellphone,
      curp,
      streetNumber,
      colony,
      city,
      state,
      role = 'NINGUNO',
    } = req.body || {};

    // Validaciones mínimas
    if (!cellphone || !curp) {
      return reply.code(400).send({ error: 'cellphone and curp are required' });
    }
    // Valida enum role
    const allowedRoles = ['CLIENTE', 'AVAL', 'NINGUNO'];
    if (!allowedRoles.includes(role)) {
      return reply.code(400).send({ error: 'Invalid role' });
    }

    try {
      const created = await fastify.prisma.contacts.create({
        data: {
          firstName: firstName || '',
          lastName: lastName || '',
          cellphone,
          curp,
          streetNumber: streetNumber || null,
          colony: colony || null,
          city: city || null,
          state: state || null,
          role,
        },
      });
      return reply.code(201).send({ ok: true, item: created });
    } catch (e) {
      req.log.error(e, 'Error creating contact');
      return reply.code(500).send({ error: 'Failed to create contact' });
    }
  });

  // PUT /api/contacts/:id  (actualizar) — protegido por rol si se pasa en opts.guards.update
  fastify.put('/api/contacts/:id', guard(G.update), async (req, reply) => {
    const { id } = req.params || {};
    const {
      firstName,
      lastName,
      cellphone,
      curp,
      streetNumber,
      colony,
      city,
      state,
      role,
    } = req.body || {};

    // Validaciones básicas coherentes con POST
    if (cellphone !== undefined && !cellphone) {
      return reply.code(400).send({ error: 'cellphone cannot be empty' });
    }
    if (curp !== undefined && !curp) {
      return reply.code(400).send({ error: 'curp cannot be empty' });
    }
    if (role !== undefined) {
      const allowedRoles = ['CLIENTE', 'AVAL', 'NINGUNO'];
      if (!allowedRoles.includes(role)) {
        return reply.code(400).send({ error: 'Invalid role' });
      }
    }

    try {
      const updated = await fastify.prisma.contacts.update({
        where: { id: Number(id) },
        data: {
          ...(firstName !== undefined ? { firstName } : {}),
          ...(lastName !== undefined ? { lastName } : {}),
          ...(cellphone !== undefined ? { cellphone } : {}),
          ...(curp !== undefined ? { curp } : {}),
          ...(streetNumber !== undefined ? { streetNumber } : {}),
          ...(colony !== undefined ? { colony } : {}),
          ...(city !== undefined ? { city } : {}),
          ...(state !== undefined ? { state } : {}),
          ...(role !== undefined ? { role } : {}),
        },
      });
      return { ok: true, item: updated };
    } catch (e) {
      req.log.error(e, 'Error updating contact');
      if (e.code === 'P2025') {
        return reply.code(404).send({ error: 'Contact not found' });
      }
      return reply.code(500).send({ error: 'Failed to update contact' });
    }
  });

  // DELETE /api/contacts/:id  — protegido por rol si se pasa en opts.guards.remove
  fastify.delete('/api/contacts/:id', guard(G.remove), async (req, reply) => {
    const { id } = req.params || {};
    try {
      await fastify.prisma.contacts.delete({ where: { id: Number(id) } });
      return { ok: true };
    } catch (e) {
      req.log.error(e, 'Error deleting contact');
      if (e.code === 'P2025') {
        return reply.code(404).send({ error: 'Contact not found' });
      }
      return reply.code(500).send({ error: 'Failed to delete contact' });
    }
  });
}
