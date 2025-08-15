// server/src/plugins/jwt.js
import fp from 'fastify-plugin';
import fastifyCookie from '@fastify/cookie';
import fastifyJwt from '@fastify/jwt';

export default fp(async function jwtPlugin(fastify) {
  fastify.register(fastifyCookie, {
    hook: 'onRequest', // permite leer/enviar cookies
  });

  fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || 'development-secret-change-me',
    cookie: {
      cookieName: 'sifmex_token',
      signed: false,
    },
  });

  // Auth helpers centralizados
  fastify.decorate('auth', {
    // Verifica que haya sesión válida
    async verify(req, reply) {
      try {
        await req.jwtVerify();
      } catch (err) {
        return reply.code(401).send({ error: 'Unauthorized' });
      }
    },
    // Verifica que el usuario tenga uno de los roles requeridos
    roleGuard: (roles = []) => {
      return async (req, reply) => {
        try {
          await req.jwtVerify();
        } catch {
          return reply.code(401).send({ error: 'Unauthorized' });
        }
        const { role } = req.user || {};
        if (!roles.includes(role)) {
          return reply.code(403).send({ error: 'Forbidden: insufficient role' });
        }
      };
    },
  });
});
