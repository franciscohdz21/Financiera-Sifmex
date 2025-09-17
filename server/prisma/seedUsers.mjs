// server/prisma/seedUsers.mjs
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const users = [
    {
      email: 'root@sifmex.local',
      name: 'Root',
      role: 'ROOT',
      password: 'ROadzx01-',
    },
    {
      email: 'gerente@sifmex.local',
      name: 'Gerente',
      role: 'GERENTE',
      password: 'GEadzx02-',
    },
    {
      email: 'admin@sifmex.local',
      name: 'Admin',
      role: 'ADMIN',
      password: 'ADadzx03-',
    },
    {
      email: 'ejecutivo@sifmex.local',
      name: 'Ejecutivo',
      role: 'EJECUTIVO',
      password: 'EJadzx04-',
    },
    {
      email: 'supervisor@sifmex.local',
      name: 'Supervisor',
      role: 'SUPERVISOR',
      password: 'SUadzx05-',
    },
  ];

  for (const u of users) {
    const passwordHash = await bcrypt.hash(u.password, 10);

    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: { password: passwordHash, role: u.role, name: u.name },
      create: {
        email: u.email,
        name: u.name,
        role: u.role,
        password: passwordHash,
      },
    });

    console.log(`Seeded user: ${user.email} (${user.role})`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
