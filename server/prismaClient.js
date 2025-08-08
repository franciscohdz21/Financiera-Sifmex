// Financiera-Sifmex/server/prismaClient.js
import { PrismaClient } from '@prisma/client';

const prisma = globalThis.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;   // Evita múltiples conexiones en hot-reload
}

export default prisma;
