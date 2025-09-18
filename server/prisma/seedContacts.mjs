// server/prisma/seedContacts.mjs
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const firstNames = ['Miguel', 'Hector', 'Beto', 'Manuel', 'Abel', 'Diego', 'Sultan', 'Max', 'Ana', 'Luis', 'Carla', 'Pedro', 'Lucia', 'Jorge', 'Elena'];
const lastNames  = ['Gomez', 'Hernandez', 'Lopez', 'Martinez', 'Fernandez', 'Sanchez', 'Ramirez', 'Cruz', 'Vargas', 'Ramos', 'Mendoza'];
const colonies   = ['Centro', 'Del Valle', 'Roma', 'Juriquilla', 'Cimatario', 'Tecnologico'];
const cities     = ['Queretaro', 'CDMX', 'Guadalajara', 'Monterrey', 'Puebla', 'Leon'];
const states     = ['Qro', 'CDMX', 'Jal', 'NL', 'Pue', 'Gto'];
const roles      = ['CLIENTE', 'AVAL', 'NINGUNO'];

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function digits(n) {
  let s = '';
  for (let i = 0; i < n; i++) s += Math.floor(Math.random() * 10);
  return s;
}
function randomCurp() {
  // Curp falsa simplificada (solo para datos de prueba)
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const l = () => letters[Math.floor(Math.random() * letters.length)];
  return `${l()}${l()}${l()}${l()}${digits(6)}${l()}${l()}${digits(2)}${l()}${digits(3)}`;
}
function randomFallos() {
  // Entero 0..5
  return Math.floor(Math.random() * 6);
}
function randomNotas(i) {
  // 60% de probabilidad de tener nota; máx 100 chars
  if (Math.random() < 0.4) return null;
  const base = `Nota de prueba #${i + 1}: seguimiento de contacto, llamada pendiente.`;
  return base.slice(0, 100);
}

async function main() {
  const total = 30;

  // (Opcional) Limpia antes de sembrar:
  // await prisma.contacts.deleteMany();

  for (let i = 0; i < total; i++) {
    const firstName = rand(firstNames);
    const lastName  = rand(lastNames);
    const cellphone = '55' + digits(8);
    const curp      = randomCurp();
    const street    = `${Math.floor(Math.random() * 999)} ${rand(['Calle', 'Av.', 'Priv.'])} ${rand(colonies)}`;

    await prisma.contacts.create({
      data: {
        firstName,
        lastName,
        cellphone,
        curp,
        streetNumber: street,
        colony: rand(colonies),
        city: rand(cities),
        state: rand(states),
        role: rand(roles),

        // Nuevos campos:
        fallos: randomFallos(),
        notas: randomNotas(i),
      },
    });
  }
  console.log(`Seeded ${total} contacts`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
