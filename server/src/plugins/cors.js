// server/src/plugins/cors.js
import fp from 'fastify-plugin';
import cors from '@fastify/cors';

// Normaliza y valida el origen de la petición contra una lista
function buildOriginChecker(originsEnv) {
  if (!originsEnv) {
    // DEV: refleja cualquier origin (sirve con credentials)
    return (origin, cb) => cb(null, true);
  }

  const allowList = originsEnv
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .map(s => s.replace(/\/+$/, '')); // sin "/" final

  return (origin, cb) => {
    if (!origin) return cb(null, true); // curl, server-to-server, etc.
    const o = origin.replace(/\/+$/, '');
    cb(null, allowList.includes(o));
  };
}

export default fp(async function corsPlugin(fastify) {
  const originsEnv = process.env.CORS_ORIGINS || process.env.CORS_ORIGIN || '';
  const origin = buildOriginChecker(originsEnv);

  await fastify.register(cors, {
    origin,                       // función que refleja o valida
    credentials: true,            // necesario si usas cookies/JWT
    methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization']
  });
});
