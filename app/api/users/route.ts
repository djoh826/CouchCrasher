import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const users = await prisma.users.findMany({ take: 5 });
  return NextResponse.json(users);
}
