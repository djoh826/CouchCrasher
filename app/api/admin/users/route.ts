import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { checkIfLoggedIn, checkIfadmin, HttpError } from "@/lib/jwt";

// /api/users GET
export async function GET(req: Request) {
  try {
    const jwtPayload = checkIfLoggedIn(req);
    await checkIfadmin(jwtPayload);

    // return all users
    const users = await prisma.users.findMany({ take: 100 });
    return NextResponse.json(users);
  } catch (err) {
    if (err instanceof HttpError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
  }
}
