// server/prisma/normalizeEmails.mjs
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();

  let changed = 0;
  for (const u of users) {
    const lower = u.email.toLowerCase();
    if (lower !== u.email) {
      // si ya existe alguien con ese email en minúsculas, no forzamos para no romper la unique constraint
      const clash = await prisma.user.findUnique({ where: { email: lower } });
      if (clash) {
        console.warn(
          `[SKIP] No puedo cambiar "${u.email}" → "${lower}" porque ya existe ese correo. Revisa manualmente. (id=${u.id})`
        );
        continue;
      }

      await prisma.user.update({
        where: { id: u.id },
        data: { email: lower },
      });
      console.log(`[OK] ${u.email} → ${lower}`);
      changed++;
    }
  }

  console.log(`\nHecho. Correos actualizados: ${changed}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
