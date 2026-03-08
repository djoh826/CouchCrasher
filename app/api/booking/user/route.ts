import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { checkIfLoggedIn, HttpError } from "@/lib/jwt";

// /api/booking/user GET
// Returns all bookings of currently logged in user
export async function GET(req: Request) {
  try {
    const jwtPayload = checkIfLoggedIn(req);

    // return all users
    const response = await prisma.booking.findMany({
      where: {
        guestuid: jwtPayload.uid,
      },
    });
    return NextResponse.json(response);
  } catch (err) {
    if (err instanceof HttpError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
  }
}
