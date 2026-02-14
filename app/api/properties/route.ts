import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { checkIfLoggedIn, HttpError } from "@/lib/jwt";

// /api/properties GET
// Gets all properties
export async function GET(req: Request) {
  try {
    const jwtPayload = checkIfLoggedIn(req);

    // return all properties
    const response = await prisma.property.findMany({
      select: {
        name: true,
        street: true,
        city: true,
        state: true,
      },
    });
    return NextResponse.json(response);
  } catch (err) {
    if (err instanceof HttpError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
  }
}
