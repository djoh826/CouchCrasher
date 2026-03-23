import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { HttpError } from "@/lib/jwt";

// /api/properties GET
// Gets all properties
export async function GET() {
  try {
    const response = await prisma.property.findMany({
      select: {
        name: true,
        street: true,
        city: true,
        state: true,
        nightlyfee: true,
        propertyphotos: {
          select: {
            thumbnailurl: true,
          },
        },
      },
    });
    return NextResponse.json(response);
  } catch (err) {
    if (err instanceof HttpError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }

    console.error(err);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
