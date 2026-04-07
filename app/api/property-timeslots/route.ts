// /app/api/property-timeslots/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { HttpError } from "@/lib/jwt";

// /api/property-timeslots GET
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const propertyId = searchParams.get("propertyId");

    if (!propertyId) {
      throw new HttpError(400, "Missing propertyId");
    }

    const busySlots = await prisma.propertytimeslots.findMany({
      where: {
        propertyid: Number(propertyId),
      },
      select: {
        startdate: true,
        enddate: true,
      },
    });

    return NextResponse.json(busySlots);
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
