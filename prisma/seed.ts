import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing data…');

  // Root delete — cascades to guest, host, bookings, etc.
  await prisma.users.deleteMany();

  await seedUsers();

  await prisma.guest.create({
    data: {
      uid: 100,
    },
  });

  console.log('Seed complete');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

async function seedUsers() {
  console.log('Seeding users…');

  await prisma.users.createMany({
    data: [
      {
        uid: 1,
        name: 'John',
        email: 'john@test.com',
        password: 'password',
        dob: new Date('1995-01-01'),
        phone: '1234567890',
        ememail: 'john2@test.com',
      },
      {
        uid: 2,
        name: 'Carl',
        email: 'carl@test.com',
        password: 'password',
        dob: new Date('1992-05-10'),
        phone: '9876543210',
        ememail: 'carl2@test.com',
      },
    ],
  });

  console.log('Seeding guest…');
}
