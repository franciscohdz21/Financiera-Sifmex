// server/prisma/seedUsers.mjs
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  const entries = [
    {
      email: process.env.SEED_ROOT_EMAIL || 'root@sifmex.local',
      pass: process.env.SEED_ROOT_PASSWORD || 'root123!',
      role: 'ROOT',
      name: 'Root User',
    },
    {
      email: process.env.SEED_ADMIN_EMAIL || 'admin@sifmex.local',
      pass: process.env.SEED_ADMIN_PASSWORD || 'admin123!',
      role: 'ADMIN',
      name: 'Admin User',
    },
    {
      email: process.env.SEED_VIEWER_EMAIL || 'viewer@sifmex.local',
      pass: process.env.SEED_VIEWER_PASSWORD || 'viewer123!',
      role: 'VIEWER',
      name: 'Viewer User',
    },
  ];

  for (const u of entries) {
    const hash = await bcrypt.hash(u.pass, 10);
    await prisma.user.upsert({
      where: { email: u.email },
      update: { password: hash, role: u.role, name: u.name },
      create: { email: u.email, password: hash, role: u.role, name: u.name },
    });
    console.log(`Seeded user: ${u.email} (${u.role})`);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
