// server/src/routes/auth.js
import bcrypt from 'bcryptjs';

export default async function authRoutes(fastify) {
  // POST /api/auth/login
  fastify.post('/api/auth/login', async (req, reply) => {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return reply.code(400).send({ error: 'Email and password required' });
    }

    const user = await fastify.prisma.user.findUnique({ where: { email } });
    if (!user) return reply.code(401).send({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return reply.code(401).send({ error: 'Invalid credentials' });

    const token = fastify.jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    reply
      .setCookie('sifmex_token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 días
      })
      .send({ ok: true });
  });

  // GET /api/auth/me — robusto (401 cuando no hay token), sin preHandler
  fastify.get('/api/auth/me', async (req, reply) => {
    try {
      const token = req.cookies?.sifmex_token;
      if (!token) return reply.code(401).send({ error: 'Unauthorized' });

      const payload = await fastify.jwt.verify(token);
      const { id, email, role } = payload || {};
      if (!id || !email || !role) return reply.code(401).send({ error: 'Unauthorized' });

      return { id, email, role };
    } catch {
      return reply.code(401).send({ error: 'Unauthorized' });
    }
  });

  // POST /api/auth/logout
  fastify.post('/api/auth/logout', async (_req, reply) => {
    reply.clearCookie('sifmex_token', { path: '/' }).send({ ok: true });
  });

  // (Opcional) GET /api/auth/logout — por si llamas con GET en vez de POST
  fastify.get('/api/auth/logout', async (_req, reply) => {
    reply.clearCookie('sifmex_token', { path: '/' }).send({ ok: true });
  });
}
