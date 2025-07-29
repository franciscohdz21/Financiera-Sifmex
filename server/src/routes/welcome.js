import { Router } from 'express';
const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Bienvenido a Financiera-Sifmex (placeholder)' });
});

export default router;
