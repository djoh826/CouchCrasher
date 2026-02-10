import { PrismaClient } from '@prisma/client';
import { hashPassword } from '@/lib/auth'
import { checkIfLoggedIn, isAdmin, HttpError } from '@/lib/jwt';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// /api/admin/seed
// This resets the db for dev use
export async function GET(req: Request) {
  try {
    const jwtPayload = checkIfLoggedIn(req)
    if (!isAdmin(jwtPayload)) throw new HttpError(401, "Unauthorized")

    console.log('Clearing existing data…');

    await prisma.users.deleteMany();

    await seedUsers();
  } catch (err) {
    if (err instanceof HttpError) {
        return NextResponse.json(
            { error: err.message },
            { status: err.status }
        );
    } else {
        return 'Unexpected error occurred'
    }
  }

  console.log('Seed complete');

  return new NextResponse('Seed successfully completed.')
}

async function seedUsers() {
  console.log('Seeding users…');

  const users = [
    {
      uid: 1,
      name: 'John Admin',
      email: 'admin@gmail.com',
      password: 'admin',
      dob: new Date('1995-01-01'),
      phone: '1234567890',
      ememail: 'john2@gmail.com',
      isadmin: true,
    },
    {
      uid: 2,
      name: 'Carl Renter',
      email: 'renter@gmail.com',
      password: 'renter',
      dob: new Date('1992-05-10'),
      phone: '9876543210',
      ememail: 'carl2@gmail.com',
    },
    {
      uid: 3,
      name: 'Jim Owner',
      email: 'owner@gmail.com',
      password: 'owner',
      dob: new Date('1992-05-10'),
      phone: '9876543210',
      ememail: 'jim2@gmail.com',
    },
  ];

  // Hash passwords first
  const usersWithHashedPasswords = await Promise.all(
    users.map(async (u) => ({
      ...u,
      password: await hashPassword(u.password),
    }))
  );

  // Insert users
  await prisma.users.createMany({
    data: usersWithHashedPasswords,
  });

  console.log('Users seeded');
}