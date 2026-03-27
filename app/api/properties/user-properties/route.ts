import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { HttpError, checkIfLoggedIn, isHost } from "@/lib/jwt";

// /api/properties/user-properties GET
// Returns all properties of the user. Returns status of:
// not_host (user is not a host)
// empty (user has no properties yet)
// ok (user has at least 1 property)
export async function GET(req: Request) {
  try {
    const jwtPayload = checkIfLoggedIn(req);
    const isUserAHost = await isHost(jwtPayload);

    if (!isUserAHost) {
      console.log("User is not a host");
      return NextResponse.json({ status: "not_host" });
    }

    // fetch properties of user
    const properties = await prisma.property.findMany({
      where: {
        hostuid: jwtPayload.uid,
      },
      select: {
        pid: true,
        name: true,
        street: true,
        city: true,
        state: true,
        propertyphotos: {
          select: {
            thumbnailurl: true,
          },
        },
      },
    });

    // user has no properties yet
    if (properties.length === 0) {
      return NextResponse.json({
        status: "empty",
        properties: [],
      });
    }

    // user has at least 1 property
    return NextResponse.json({
      status: "ok",
      properties,
    });
  } catch (err) {
    if (err instanceof HttpError) {
      return NextResponse.json(
        { status: "error", error: err.message },
        { status: err.status },
      );
    }

    console.error(err);

    return NextResponse.json(
      { status: "error", error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
