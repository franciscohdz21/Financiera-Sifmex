// server/src/routes/auth.js
import bcrypt from 'bcryptjs';

export default async function authRoutes(fastify) {
  // POST /api/auth/login
  fastify.post('/api/auth/login', async (req, reply) => {
    try {
      const rawEmail = req.body?.email ?? '';
      const rawPassword = req.body?.password ?? '';

      const email = String(rawEmail).trim().toLowerCase();
      const password = String(rawPassword).trim(); // por si hay espacios pegados

      // 🔎 Log de intento
      console.log('[auth] login attempt', { email, passwordLength: password.length });

      if (!email || !password) {
        console.log('[auth] missing fields', { email, hasPassword: !!password });
        return reply.code(400).send({ error: 'Email and password required' });
      }

      const user = await fastify.prisma.user.findUnique({ where: { email } });
      console.log('[auth] lookup', { email, found: !!user });

      if (!user) {
        console.log('[auth] not found', { email });
        return reply.code(401).send({ error: 'Invalid credentials' });
      }

      const ok = await bcrypt.compare(password, user.password);
      console.log('[auth] compare', { email, ok });

      if (!ok) {
        console.log('[auth] password mismatch', { email });
        return reply.code(401).send({ error: 'Invalid credentials' });
      }

      const token = fastify.jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      console.log('[auth] success', { email, role: user.role });

      reply
        .setCookie('sifmex_token', token, {
          httpOnly: true,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          maxAge: 60 * 60 * 24 * 7,
        })
        .send({
          ok: true,
          user: { id: user.id, email: user.email, role: user.role },
        });
    } catch (err) {
      console.error('[auth] error', err);
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  });

  // GET /api/auth/me
  fastify.get('/api/auth/me', async (req, reply) => {
    try {
      const token = req.cookies?.sifmex_token;
      if (!token) {
        console.log('[auth] me: no token');
        return reply.code(401).send({ error: 'Unauthorized' });
      }

      const { id, email, role } = await fastify.jwt.verify(token);
      if (!id || !email || !role) {
        console.log('[auth] me: invalid token');
        return reply.code(401).send({ error: 'Unauthorized' });
      }

      console.log('[auth] me: success', { email, role });
      return { id, email, role };
    } catch (err) {
      console.error('[auth] me: error', err);
      return reply.code(401).send({ error: 'Unauthorized' });
    }
  });

  // POST /api/auth/logout
  fastify.post('/api/auth/logout', async (_req, reply) => {
    console.log('[auth] logout POST');
    reply.clearCookie('sifmex_token', { path: '/' }).send({ ok: true });
  });

  // GET /api/auth/logout
  fastify.get('/api/auth/logout', async (_req, reply) => {
    console.log('[auth] logout GET');
    reply.clearCookie('sifmex_token', { path: '/' }).send({ ok: true });
  });
}
