// server/prisma/seedUsers.mjs
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const USERS = [
  { email: 'root@sifmex.local',       name: 'Root',       role: 'ROOT',       password: 'ROadzx01-' },
  { email: 'gerente@sifmex.local',    name: 'Gerente',    role: 'GERENTE',    password: 'GEadzx02-' },
  { email: 'admin@sifmex.local',      name: 'Admin',      role: 'ADMIN',      password: 'ADadzx03-' },
  { email: 'ejecutivo@sifmex.local',  name: 'Ejecutivo',  role: 'EJECUTIVO',  password: 'EJadzx04-' },
  { email: 'supervisor@sifmex.local', name: 'Supervisor', role: 'SUPERVISOR', password: 'SUadzx05-' }
];

async function upsertUser(u) {
  const hash = await bcrypt.hash(u.password, 10);

  await prisma.user.upsert({
    where: { email: u.email },
    update: { name: u.name, role: u.role, password: hash },
    create: { email: u.email, name: u.name, role: u.role, password: hash }
  });

  console.log(`✓ Usuario listo: ${u.email} (${u.role})`);
}

async function main() {
  for (const u of USERS) {
    await upsertUser(u);
  }
  console.log('✅ Seed completado');
}

main()
  .catch((e) => {
    console.error('❌ Seed falló:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
