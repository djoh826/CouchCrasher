import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import {
  checkIfLoggedIn,
  HttpError,
  isAdmin,
  checkIfHostOfProperty,
} from "@/lib/jwt";

// /api/booking?bookingId=123&propertyId=123 GET
// Returns all booking information
export async function GET(req: Request) {
  try {
    const jwtPayload = checkIfLoggedIn(req);
    const { searchParams } = new URL(req.url);
    const bookingId = searchParams.get("bookingId");
    const propertyId = searchParams.get("propertyId");

    if (!bookingId) {
      throw new HttpError(400, "Bad request, Missing booking id");
    }

    const isUserGuestOfThisBooking = await prisma.booking.findFirst({
      where: {
        guestuid: jwtPayload.uid,
        bid: Number(bookingId),
      },
    });

    if (
      !isUserGuestOfThisBooking &&
      !(await isAdmin(jwtPayload)) &&
      !(await checkIfHostOfProperty(jwtPayload, Number(propertyId)))
    ) {
      console.error(
        "User is not the guest of this booking, the host, or an admin",
      );
      throw new HttpError(401, "Unauthorized");
    }

    // return all booking information
    const response = await prisma.booking.findFirst({
      where: {
        bid: Number(bookingId),
      },
    });

    return NextResponse.json(response);
  } catch (err) {
    if (err instanceof HttpError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
  }
}

// /api/booking POST
// Creates a booking entry
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

    // parse dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    // check if property is available
    const isPropertyUnavailable = await prisma.propertytimeslots.findFirst({
      where: {
        propertyid: propertyId,
        startdate: { lt: end },
        enddate: { gt: start },
      },
    });

    console.log("Available? : " + isPropertyUnavailable);

    if (isPropertyUnavailable) {
      console.error(`Property is busy between $(startDate) and $(endDate)`);
      throw new HttpError(401, "Property is busy then");
    }

    const isUserAGuestYet = await prisma.guest.findFirst({
      where: {
        uid: jwtPayload.uid,
      },
    });
    if (!isUserAGuestYet) {
      await prisma.guest.create({
        data: {
          uid: jwtPayload.uid,
        },
      });
    }

    const createBooking = await prisma.booking.create({
      data: {
        bid: Math.floor(Date.now() / 1000),
        guestuid: jwtPayload.uid,
        propertyid: propertyId,
        checkin: start,
        checkout: end,
      },
    });

    if (!createBooking) {
      console.error("Error creating booking");
      return NextResponse.json({ success: false });
    }
    return NextResponse.json(createBooking);
  } catch (err) {
    if (err instanceof HttpError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// /api/booking DELETE
// Deletes booking (requires host or admin or user)
export async function DELETE(req: Request) {
  try {
    const jwtPayload = checkIfLoggedIn(req);
    const body = await req.json();
    const { bookingId, propertyId }: { bookingId: number; propertyId: number } =
      body;

    const isUserGuestOfThisBooking = await prisma.booking.findFirst({
      where: {
        guestuid: jwtPayload.uid,
        bid: Number(bookingId),
      },
    });

    if (
      !isUserGuestOfThisBooking &&
      !(await isAdmin(jwtPayload)) &&
      !(await checkIfHostOfProperty(jwtPayload, Number(propertyId)))
    ) {
      console.error(
        "User is not the guest of this booking, the host, or an admin",
      );
      throw new HttpError(401, "Unauthorized");
    }

    // deletes booking
    const response = await prisma.booking.delete({
      where: {
        bid: bookingId,
      },
    });

    return NextResponse.json(response);
  } catch (err) {
    if (err instanceof HttpError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    } else {
      return NextResponse.error();
    }
  }
}
