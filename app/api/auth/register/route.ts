import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { NextResponse } from "next/server";

// /api/auth/register POST
export async function POST(req: Request) {
  const body = await req.json();
  const { email, password, name, phone, dob } = body;

  const existing = await prisma.users.findFirst({
    where: { email: email },
  });

  if (existing) {
    return NextResponse.json(
      { error: "Email already in use" },
      { status: 400 },
    );
  }

  const hashed = await hashPassword(password);

  const user = await prisma.users.create({
    data: {
      uid: Math.floor(Date.now() / 1000), // just using date for now
      email: email,
      password: hashed,
      name: name,
      phone: phone,
      dob: new Date(dob),
      ememail: email,
    },
  });

  return NextResponse.json({ id: user.uid });
}
