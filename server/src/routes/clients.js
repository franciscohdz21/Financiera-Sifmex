import { Router } from 'express';
const router = Router();

/**
 * GET /api/clients
 * Devuelve un placeholder para el listado de clientes.
 */
router.get('/', (req, res) => {
  res.json({ message: '👥 Clientes placeholder' });
});

export default router;
