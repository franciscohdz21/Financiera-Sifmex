// Financiera-Sifmex/prisma/seedContacts.mjs
// Genera 30 contactos aleatorios en la tabla Contacts

import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

// Valores permitidos para el enum Rol
const roles = ['Cliente', 'Aval', 'Ninguno'];

async function main() {
  // 🧹 Limpia la tabla si quieres empezar desde cero (opcional)
  await prisma.contacts.deleteMany();

  // 🏗️ Crea 30 objetos con datos falsos
  const contactsData = Array.from({ length: 30 }).map(() => ({
    nombre:        faker.person.firstName().slice(0, 20),
    apellidos:     faker.person.lastName().slice(0, 30),
    celular:       faker.string.numeric({ length: 10 }),
    curp:          faker.string.alphanumeric(18).toUpperCase(),     // 18 ≤ 25 caracteres
    calleNumero:   faker.location.streetAddress({ useFullAddress: false }).slice(0, 20),
    colonia:       faker.location.city().slice(0, 20),
    ciudad:        faker.location.city().slice(0, 25),
    estado:        faker.location.state().slice(0, 20),
    rol:           roles[Math.floor(Math.random() * roles.length)],
  }));

  // 🚀 Inserta todos de un golpe
  await prisma.contacts.createMany({ data: contactsData });
  console.log('✅ 30 contactos insertados correctamente');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
