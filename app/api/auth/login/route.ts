import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth";
import { signJwt } from "@/lib/jwt";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

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

  const cookieStore = await cookies();

  cookieStore.set("auth_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  // Return token when not in prod so I can test api
  // if (process.env.NODE_ENV !== "production") {
  return NextResponse.json({ success: true, token });
  // }

  // return NextResponse.json({ success: true });
}
