import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth";
import { signJwt } from "@/lib/jwt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const dbUser = await prisma.users.findFirst({
    where: { email: email },
  });

  if (!dbUser) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const valid = await verifyPassword(password, dbUser.password);

  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token: string = signJwt({
    uid: dbUser.uid,
    email: dbUser.email,
  });

  const res = NextResponse.json({
    success: true,

    /* ===========================
       DEV ONLY (COMMENT OUT IN PROD)
       Used for Bruno / API testing
    =========================== */
    token: token,
  });

  res.cookies.set("auth_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return res;
}
