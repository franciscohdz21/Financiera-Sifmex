import { Router } from 'express';
const router = Router();

/**
 * GET /api/loans
 * Devuelve un placeholder para el listado de préstamos.
 */
router.get('/', (req, res) => {
  res.json({ message: '💸 Préstamos placeholder' });
});

export default router;
