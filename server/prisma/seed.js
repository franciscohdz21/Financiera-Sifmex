// server/prisma/seed.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const USERS = [
  { email: 'root@sifmex.local',       name: 'Root',       role: 'ROOT',       password: 'ROadzx01!' },
  { email: 'gerente@sifmex.local',    name: 'Gerente',    role: 'GERENTE',    password: 'GEadzx02!' },
  { email: 'admin@sifmex.local',      name: 'Admin',      role: 'ADMIN',      password: 'ADadzx03!' },
  { email: 'ejecutivo@sifmex.local',  name: 'Ejecutivo',  role: 'EJECUTIVO',  password: 'EJadzx04!' },
  { email: 'supervisor@sifmex.local', name: 'Supervisor', role: 'SUPERVISOR', password: 'SUadzx05!' }
];

async function upsertUser({ email, name, role, password }) {
  const password = await bcrypt.hash(password, 10); // cambia a tu campo si no es passwordHash

  await prisma.user.upsert({
    where:  { email },
    update: { name, role, password },
    create: { email, name, role, password },
  });

  console.log(`✓ Usuario listo: ${email} (${role})`);
}

async function main() {
  for (const u of USERS) {
    await upsertUser(u);
  }
  console.log('✅ Seed completado');
}

main()
  .catch((e) => { console.error('❌ Seed falló:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
