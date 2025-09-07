import express from 'express';
const app = express();
app.use(express.json());

import welcomeRouter from './routes/welcome.js';
import clientsRouter from './routes/clients.js';
import loansRouter from './routes/loans.js';
import paymentsRouter from './routes/payments.js';

app.use('/api/welcome', welcomeRouter);
app.use('/api/clients', clientsRouter);
app.use('/api/loans', loansRouter);
app.use('/api/payments', paymentsRouter);

app.listen(4000, () =>
  console.log('API Financiera-Sifmex escuchando en PORT configurado (por defecto 4000)')
);
