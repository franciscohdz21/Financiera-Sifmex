/**
 * GET /health -> { status: "ok", uptime, timestamp }
 * Útil para Render health checks y para diagnósticos.
 */
export default async function healthRoute(fastify) {
  fastify.get('/health', async () => ({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  }));
}
