// /app/api/property-timeslots/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  HttpError,
  checkIfLoggedIn,
  checkIfHostOfProperty,
  isAdmin,
} from "@/lib/jwt";

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

// /api/property-timeslots POST
export async function POST(req: Request) {
  try {
    const jwtPayload = checkIfLoggedIn(req);

    const {
      propertyId,
      startDate,
      endDate,
    }: {
      propertyId: number;
      startDate: Date;
      endDate: Date;
    } = await req.json();

    const isUserHostOfProperty = checkIfHostOfProperty(jwtPayload, propertyId);

    if (!isUserHostOfProperty && !(await isAdmin(jwtPayload))) {
      throw new HttpError(401, "User is not host of this property or an admin");
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const response = await prisma.propertytimeslots.create({
      data: {
        propertyid: propertyId,
        startdate: start,
        enddate: end,
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
