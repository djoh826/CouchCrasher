import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { verifyJwt, checkIfLoggedIn } from '@/lib/jwt';

// /api/users GET
export async function GET(req: Request) {
  
  const jwtPayload = checkIfLoggedIn(req)

  // Optionally, you can check if the user exists in DB
  const user = await prisma.users.findUnique({ where: { uid: jwtPayload.uid } });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 401 });
  }

  // If verified, return the users
  const users = await prisma.users.findMany({ take: 5 });
  return NextResponse.json(users);
}