import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import {
  checkIfLoggedIn,
  HttpError,
  isAdmin,
  checkIfHostOfProperty,
} from "@/lib/jwt";
import { redis } from "@/lib/redis";
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
  let lockKey = "";

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

    const start = new Date(startDate);
    const end = new Date(endDate);

    lockKey = `lock:property:${propertyId}`;
    const lockTimeout = 5000;

    const lockAcquired = await redis.set(lockKey, "locked", {
      NX: true,
      PX: lockTimeout,
    });

    if (lockAcquired !== "OK") {
      return NextResponse.json(
        { error: "Property is being booked by someone else, try again." },
        { status: 409 },
      );
    }

    // Transaction start
    const booking = await prisma.$transaction(async (tx) => {
      const isPropertyUnavailable = await tx.propertytimeslots.findFirst({
        where: {
          propertyid: propertyId,
          startdate: { lt: end },
          enddate: { gt: start },
        },
      });

      if (isPropertyUnavailable) {
        throw new HttpError(401, "Property is busy then");
      }

      const isUserAGuestYet = await tx.guest.findFirst({
        where: { uid: jwtPayload.uid },
      });

      if (!isUserAGuestYet) {
        await tx.guest.create({
          data: { uid: jwtPayload.uid },
        });
      }

      const createdBooking = await tx.booking.create({
        data: {
          bid: Math.floor(Date.now() / 1000),
          guestuid: jwtPayload.uid,
          propertyid: propertyId,
          checkin: start,
          checkout: end,
        },
      });

      await tx.propertytimeslots.create({
        data: {
          propertyid: propertyId,
          startdate: start,
          enddate: end,
        },
      });

      return createdBooking;
    });

    return NextResponse.json(booking);
  } catch (err) {
    if (err instanceof HttpError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  } finally {
    if (lockKey) {
      try {
        const currentValue = await redis.get(lockKey);

        // Delete if still locked
        if (currentValue === "locked") {
          await redis.del(lockKey);
        }
      } catch {
        // Ignore Redis cleanup errors
      }
    }
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
