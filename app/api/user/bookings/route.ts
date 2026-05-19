import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { checkIfLoggedIn, HttpError } from "@/lib/jwt";
import { Booking } from "@/types";

type pastAndUpcomingBookings = {
  pastBookings: Booking[];
  upcomingBookings: Booking[];
};

// /api/user-bookings GET
export async function GET(req: Request) {
  try {
    console.log("BOOKINGS API HIT");
    console.log(req.headers.get("cookie"));
    console.log("COOKIE HEADER:", req.headers.get("cookie"));
    const jwtPayload = checkIfLoggedIn(req);

    // return all bookings where user is a guest
    const response = await prisma.booking.findMany({
      where: {
        guestuid: jwtPayload.uid,
      },
      include: {
        property: {
          select: {
            name: true,
            city: true,
            state: true,
            propertyphotos: {
              where: { isprimary: true },
              select: { thumbnailurl: true },
              take: 1,
            },
          },
        },
      },
    });

    // sort into past and upcoming bookings
    if (response != null) {
      const bookings: pastAndUpcomingBookings = {
        pastBookings: [],
        upcomingBookings: [],
      };

      const currentDate = new Date();

      response.forEach((booking) => {
        if (booking.checkout < currentDate) {
          bookings.pastBookings.push(booking);
        } else {
          bookings.upcomingBookings.push(booking);
        }
      });

      return NextResponse.json(bookings);
    } else {
      return NextResponse.json(null);
    }
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
