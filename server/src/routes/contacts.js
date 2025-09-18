// server/src/routes/contacts.js
export default async function contactsRoutes(fastify, opts = {}) {
  const G = opts.guards || {};
  const guard = (arr) => (arr && arr.length ? { preHandler: arr } : {});

  const digitsOnly = (s) => String(s ?? '').replace(/\D+/g, '');
  const up = (s) => String(s ?? '').toUpperCase().trim();

  const allowedRoles = ['CLIENTE', 'AVAL', 'NINGUNO'];

  // --- helpers para nuevos campos ---
  const parseFallos = (v, { required = false } = {}) => {
    if (v === undefined || v === null || v === '') {
      if (required) throw new Error('fallos es requerido');
      return 0; // default
    }
    const n = Number(v);
    if (!Number.isInteger(n) || n < 0 || n > 5) {
      throw new Error("fallos debe ser un entero entre 0 y 5");
    }
    return n;
  };

  const parseNotas = (v) => {
    if (v === undefined || v === null) return null;
    const t = String(v).trim();
    if (!t) return null;
    if (t.length > 100) throw new Error("notas debe tener máximo 100 caracteres");
    return t;
  };

  // --------------------------
  // GET /api/contacts  (listar)
  // --------------------------
  // Acepta:
  //  - q  : buscador general (OR en lastName, curp, cellphone)
  //  - lastName | apellidos
  //  - curp
  //  - cellphone | phone | cel | celular
  //  - limit, offset
  fastify.get('/api/contacts', async (req, reply) => {
    try {
      const {
        q,
        lastName,
        apellidos,
        curp,
        cellphone,
        phone,
        cel,
        celular,
        limit = '50',
        offset = '0',
      } = req.query || {};

      const take = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 200);
      const skip = Math.max(parseInt(offset, 10) || 0, 0);

      const filtersAND = [];

      // ---- Filtro general q: OR sobre los tres campos ----
      const qStr = (q ?? '').toString().trim();
      if (qStr) {
        const qDigits = digitsOnly(qStr);
        const orQ = [
          { lastName: { contains: qStr, mode: 'insensitive' } },
          { curp: { contains: up(qStr), mode: 'insensitive' } },
        ];
        if (qDigits) {
          orQ.push({ cellphone: { contains: qDigits } });
        }
        filtersAND.push({ OR: orQ });
      }

      // ---- Filtros explícitos adicionales (AND con lo anterior) ----
      const ln = (lastName ?? apellidos)?.toString().trim();
      if (ln) {
        filtersAND.push({
          lastName: { contains: ln, mode: 'insensitive' },
        });
      }

      const cur = (curp ?? '').toString().trim();
      if (cur) {
        filtersAND.push({
          curp: { contains: up(cur), mode: 'insensitive' },
        });
      }

      const celRaw = (cellphone ?? phone ?? cel ?? celular ?? '').toString().trim();
      const celDigits = digitsOnly(celRaw);
      if (celDigits) {
        filtersAND.push({
          cellphone: { contains: celDigits },
        });
      }

      const where = filtersAND.length ? { AND: filtersAND } : {};

      const [items, total] = await Promise.all([
        fastify.prisma.contacts.findMany({
          where,
          orderBy: { id: 'desc' },
          skip,
          take,
        }),
        fastify.prisma.contacts.count({ where }),
      ]);

      // Prisma ya incluye fallos y notas en items si existen en el modelo
      return reply.send({ items, total, limit: take, offset: skip });
    } catch (err) {
      req.log?.error?.(err, 'Error listing contacts');
      return reply.code(500).send({ error: 'Internal error listing contacts' });
    }
  });

  // --------------------------
  // POST /api/contacts  (crear)
  // --------------------------
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
      // nuevos:
      fallos,
      notas,
    } = req.body || {};

    if (!cellphone || !curp) {
      return reply.code(400).send({ error: 'cellphone and curp are required' });
    }
    if (!allowedRoles.includes(role)) {
      return reply.code(400).send({ error: 'Invalid role' });
    }

    try {
      const data = {
        firstName: firstName || '',
        lastName: lastName || '',
        cellphone: digitsOnly(cellphone),
        curp: up(curp),
        streetNumber: streetNumber || null,
        colony: colony || null,
        city: city || null,
        state: state || null,
        role,
        // nuevos:
        fallos: parseFallos(fallos),
        notas: parseNotas(notas),
      };

      const created = await fastify.prisma.contacts.create({ data });
      return reply.code(201).send({ ok: true, item: created });
    } catch (e) {
      req.log?.error?.(e, 'Error creating contact');
      const msg = e?.message?.includes('fallos') || e?.message?.includes('notas')
        ? e.message
        : 'Failed to create contact';
      return reply.code(400).send({ error: msg });
    }
  });

  // ----------------------------------
  // PUT /api/contacts/:id  (actualizar)
  // ----------------------------------
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
      // nuevos:
      fallos,
      notas,
    } = req.body || {};

    if (cellphone !== undefined && !cellphone) {
      return reply.code(400).send({ error: 'cellphone cannot be empty' });
    }
    if (curp !== undefined && !curp) {
      return reply.code(400).send({ error: 'curp cannot be empty' });
    }
    if (role !== undefined && !allowedRoles.includes(role)) {
      return reply.code(400).send({ error: 'Invalid role' });
    }

    try {
      const data = {
        ...(firstName !== undefined ? { firstName } : {}),
        ...(lastName !== undefined ? { lastName } : {}),
        ...(cellphone !== undefined ? { cellphone: digitsOnly(cellphone) } : {}),
        ...(curp !== undefined ? { curp: up(curp) } : {}),
        ...(streetNumber !== undefined ? { streetNumber } : {}),
        ...(colony !== undefined ? { colony } : {}),
        ...(city !== undefined ? { city } : {}),
        ...(state !== undefined ? { state } : {}),
        ...(role !== undefined ? { role } : {}),
      };

      // nuevos opcionales
      if (fallos !== undefined) data.fallos = parseFallos(fallos, { required: false });
      if (notas !== undefined) data.notas = parseNotas(notas);

      const updated = await fastify.prisma.contacts.update({
        where: { id: Number(id) },
        data,
      });
      return { ok: true, item: updated };
    } catch (e) {
      req.log?.error?.(e, 'Error updating contact');
      if (e.code === 'P2025') {
        return reply.code(404).send({ error: 'Contact not found' });
      }
      const msg = e?.message?.includes('fallos') || e?.message?.includes('notas')
        ? e.message
        : 'Failed to update contact';
      return reply.code(400).send({ error: msg });
    }
  });

  // ------------------------------
  // DELETE /api/contacts/:id
  // ------------------------------
  fastify.delete('/api/contacts/:id', guard(G.remove), async (req, reply) => {
    const { id } = req.params || {};
    try {
      await fastify.prisma.contacts.delete({ where: { id: Number(id) } });
      return { ok: true };
    } catch (e) {
      req.log?.error?.(e, 'Error deleting contact');
      if (e.code === 'P2025') {
        return reply.code(404).send({ error: 'Contact not found' });
      }
      return reply.code(500).send({ error: 'Failed to delete contact' });
    }
  });
}
