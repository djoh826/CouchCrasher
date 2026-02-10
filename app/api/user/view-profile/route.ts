import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { checkIfLoggedIn, HttpError } from '@/lib/jwt';

// /api/user/view-profile GET
// View own profile details
export async function GET(req: Request) {
  
  try {
    const jwtPayload = checkIfLoggedIn(req)

    // return user by uid (from request's uid)
    const response = await prisma.users.findFirst({
        where: {
            uid: jwtPayload.uid
        }
    });
    return NextResponse.json(response);

  } catch (err) {
    if (err instanceof HttpError) {
      return NextResponse.json(
        { error: err.message },
        { status: err.status }
      );
    }
  }
}