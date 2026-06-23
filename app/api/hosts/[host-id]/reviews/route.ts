import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { HttpError } from "@/lib/jwt";

// GET /api/hosts/[host-id]/reviews
// Returns host info + all reviews left for them
export async function GET(
  req: Request,
  context: { params: Promise<{ "host-id": string }> },
) {
  try {
    const params = await context.params;
    const hostId = Number(params["host-id"]);
    if (isNaN(hostId)) {
      return NextResponse.json({ error: "Invalid host ID" }, { status: 400 });
    }

    const host = await prisma.host.findUnique({
      where: { uid: hostId },
      include: {
        users: {
          select: { name: true, pictureurl: true },
        },
        property: {
          select: { pid: true, name: true, city: true, state: true },
        },
      },
    });

    if (!host) {
      return NextResponse.json({ error: "Host not found" }, { status: 404 });
    }

    const reviews = await prisma.guestorhostreview.findMany({
      where: { hostuid: hostId },
      orderBy: { reviewdate: "desc" },
    });

    // Fetch reviewer names in one query
    const guestUids = [...new Set(reviews.map((r) => r.guestuid))];
    const guests = await prisma.users.findMany({
      where: { uid: { in: guestUids } },
      select: { uid: true, name: true, pictureurl: true },
    });
    const guestMap = Object.fromEntries(guests.map((g) => [g.uid, g]));

    const reviewsWithGuest = reviews.map((r) => ({
      ...r,
      guest: guestMap[r.guestuid] ?? null,
    }));

    return NextResponse.json({
      host: {
        uid: host.uid,
        name: host.users.name,
        pictureurl: host.users.pictureurl,
        avghostratings: host.avghostratings,
        numhostratings: host.numhostratings,
        avgpropertyrating: host.avgpropertyrating,
        properties: host.property,
      },
      reviews: reviewsWithGuest,
    });
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
