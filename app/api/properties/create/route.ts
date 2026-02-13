import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { checkIfLoggedIn, isHost, HttpError } from "@/lib/jwt";

// /api/propertes/create POST
// Creates a property
export async function POST(req: Request) {
  const body = await req.json();
  const {
    name,
    maxguests,
    numbedrooms,
    description,
    numbathrooms,
    cancelperiod,
    nightlyfee,
    cleaningfee,
    servicefee,
    street,
    city,
    state,
    zipcode,
    country,
    latitude,
    longitude,
  } = body;

  try {
    const jwtPayload = checkIfLoggedIn(req);
    await isHost(jwtPayload);

    const property = await prisma.property.create({
      data: {
        pid: Math.floor(Date.now() / 1000),
        name,
        maxguests,
        numbedrooms,
        description,
        numbathrooms,
        cancelperiod,
        nightlyfee,
        cleaningfee,
        servicefee,
        street,
        city,
        state,
        zipcode,
        country,
        latitude,
        longitude,
        host: {
          connect: { uid: jwtPayload.uid },
        },
      },
    });

    return NextResponse.json(property);
  } catch (err) {
    if (err instanceof HttpError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
  }
}
