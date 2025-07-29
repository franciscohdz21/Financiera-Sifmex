import { Router } from 'express';
const router = Router();

/**
 * GET /api/payments
 * Devuelve un placeholder para el listado de pagos.
 */
router.get('/', (req, res) => {
  res.json({ message: '💰 Pagos placeholder' });
});

export default router;
