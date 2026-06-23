import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { HttpError, checkIfLoggedIn } from "@/lib/jwt";

// POST /api/reviews
// Submit a property review and/or a host review for a past booking
export async function POST(req: Request) {
  try {
    const jwtPayload = checkIfLoggedIn(req);
    const guestuid = jwtPayload.uid;

    const body = await req.json();
    const { bookingid, propertyid, propertyReview, hostReview } = body;

    if (!bookingid || !propertyid) {
      return NextResponse.json(
        { error: "bookingid and propertyid are required" },
        { status: 400 },
      );
    }

    // Verify the booking belongs to this guest
    const booking = await prisma.booking.findFirst({
      where: { bid: bookingid, guestuid },
    });
    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found or not yours" },
        { status: 403 },
      );
    }

    // Get the property to find the hostuid
    const property = await prisma.property.findUnique({
      where: { pid: propertyid },
      select: { hostuid: true },
    });
    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 },
      );
    }
    const hostuid = property.hostuid;

    const results: Record<string, unknown> = {};

    // Insert property review if provided
    if (propertyReview) {
      const {
        comment,
        cleanlinessrating,
        accuracyrating,
        communicationrating,
        checkinrating,
        valuerating,
        overallrating,
      } = propertyReview;

      // Generate next prid
      const maxPrid = await prisma.propertyreview.aggregate({
        _max: { prid: true },
      });
      const nextPrid = (maxPrid._max.prid ?? 0) + 1;

      const created = await prisma.propertyreview.create({
        data: {
          prid: nextPrid,
          guestuid,
          propertyid,
          comment: comment ?? null,
          propreviewdate: new Date(),
          cleanlinessrating: cleanlinessrating ?? null,
          accuracyrating: accuracyrating ?? null,
          communicationrating: communicationrating ?? null,
          checkinrating: checkinrating ?? null,
          valuerating: valuerating ?? null,
          overallrating: overallrating ?? null,
        },
      });

      // Update property aggregate ratings
      const agg = await prisma.propertyreview.aggregate({
        where: { propertyid },
        _avg: { overallrating: true },
        _count: { prid: true },
      });
      await prisma.property.update({
        where: { pid: propertyid },
        data: {
          avgratings: agg._avg.overallrating ?? 0,
          numratings: agg._count.prid,
        },
      });

      results.propertyReview = created;
    }

    // Insert host review if provided
    if (hostReview) {
      const { rating, comment } = hostReview;

      if (rating == null) {
        return NextResponse.json(
          { error: "Host review requires a rating" },
          { status: 400 },
        );
      }

      // Generate next ghrid
      const maxGhrid = await prisma.guestorhostreview.aggregate({
        _max: { ghrid: true },
      });
      const nextGhrid = (maxGhrid._max.ghrid ?? 0) + 1;

      const created = await prisma.guestorhostreview.create({
        data: {
          ghrid: nextGhrid,
          guestuid,
          hostuid,
          comment: comment ?? "",
          rating,
          reviewdate: new Date(),
        },
      });

      // Update host aggregate ratings
      const agg = await prisma.guestorhostreview.aggregate({
        where: { hostuid },
        _avg: { rating: true },
        _count: { ghrid: true },
      });
      await prisma.host.update({
        where: { uid: hostuid },
        data: {
          avghostratings: agg._avg.rating ?? 0,
          numhostratings: agg._count.ghrid,
        },
      });

      results.hostReview = created;
    }

    return NextResponse.json(results, { status: 201 });
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
