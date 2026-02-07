import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { verifyJwt, checkIfLoggedIn, isAdmin } from '@/lib/jwt';

// /api/users GET
export async function GET(req: Request) {
  
  const jwtPayload = checkIfLoggedIn(req)
  if(!(await isAdmin(jwtPayload))) {
    console.log("Not admin")
    return NextResponse.json("Not admin")
  }

  // return all users
  const users = await prisma.users.findMany({ take: 5 });
  return NextResponse.json(users);
}