import { NextResponse } from "next/server";
import { checkIfLoggedIn } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { HttpError } from "@/lib/jwt";

// api/me
// Returns user information, used by frontend client
export async function GET(req: Request) {
  try {
    const jwt = checkIfLoggedIn(req);

    const user = await prisma.users.findUnique({
      where: { uid: jwt.uid },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (err) {
    if (err instanceof HttpError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
