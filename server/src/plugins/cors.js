import cors from '@fastify/cors';

export default async function corsPlugin(fastify) {
  const raw = process.env.CORS_ORIGINS || '';
  const whitelist = raw.split(',').map(s => s.trim()).filter(Boolean);

  const isAllowed = (origin) => {
    if (!origin) return true; // health checks / curl
    return whitelist.some(allowed => origin === allowed);
  };

  await fastify.register(cors, {
    origin(origin, cb) {
      if (isAllowed(origin)) cb(null, true);
      else cb(new Error('CORS: Origin not allowed'));
    },
    credentials: true,
    methods: ['GET','POST','PUT','DELETE','PATCH','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization']
  });
}
