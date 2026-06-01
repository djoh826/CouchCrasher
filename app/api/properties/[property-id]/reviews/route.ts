import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { checkIfLoggedIn, HttpError } from "@/lib/jwt";

// GET /api/properties/[property-id]/reviews
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ "property-id": string }> },
) {
  try {
    const { "property-id": propertyIdParam } = await params;
    const propertyId = parseInt(propertyIdParam);

    if (isNaN(propertyId)) {
      return NextResponse.json(
        { error: "Invalid property ID" },
        { status: 400 },
      );
    }

    const reviews = await prisma.propertyreview.findMany({
      where: { propertyid: propertyId },
      include: {
        propertyreviewphotos: true,
        guest: {
          include: {
            users: {
              select: { name: true, pictureurl: true },
            },
          },
        },
      },
      orderBy: { propreviewdate: "desc" },
    });

    return NextResponse.json(reviews);
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

// POST /api/properties/[property-id]/reviews
export async function POST(
  req: Request,
  { params }: { params: Promise<{ "property-id": string }> },
) {
  try {
    const { "property-id": propertyIdParam } = await params;
    const propertyId = parseInt(propertyIdParam);
    if (isNaN(propertyId)) {
      return NextResponse.json(
        { error: "Invalid property ID" },
        { status: 400 },
      );
    }

    const jwtPayload = checkIfLoggedIn(req);
    const uid = jwtPayload.uid;

    const guest = await prisma.guest.findUnique({ where: { uid } });
    if (!guest) {
      return NextResponse.json(
        { error: "Only guests can leave reviews" },
        { status: 403 },
      );
    }

    const booking = await prisma.booking.findFirst({
      where: {
        guestuid: uid,
        propertyid: propertyId,
        checkout: { lt: new Date() },
        cancellationdate: null,
      },
    });
    if (!booking) {
      return NextResponse.json(
        { error: "You must have completed a stay to leave a review" },
        { status: 403 },
      );
    }

    const existing = await prisma.propertyreview.findFirst({
      where: { guestuid: uid, propertyid: propertyId },
    });
    if (existing) {
      return NextResponse.json(
        { error: "You have already reviewed this property" },
        { status: 409 },
      );
    }

    const body = await req.json();
    const {
      comment,
      cleanlinessrating,
      accuracyrating,
      communicationrating,
      checkinrating,
      valuerating,
      overallrating,
    } = body;

    const ratingFields = [
      cleanlinessrating,
      accuracyrating,
      communicationrating,
      checkinrating,
      valuerating,
      overallrating,
    ];
    for (const r of ratingFields) {
      if (r !== undefined && (r < 1 || r > 5)) {
        return NextResponse.json(
          { error: "Ratings must be between 1 and 5" },
          { status: 400 },
        );
      }
    }

    const maxReview = await prisma.propertyreview.findFirst({
      orderBy: { prid: "desc" },
      select: { prid: true },
    });
    const prid = (maxReview?.prid ?? 0) + 1;

    const review = await prisma.propertyreview.create({
      data: {
        prid,
        guestuid: uid,
        propertyid: propertyId,
        comment: comment ?? null,
        propreviewdate: new Date(),
        cleanlinessrating: cleanlinessrating ?? null,
        accuracyrating: accuracyrating ?? null,
        communicationrating: communicationrating ?? null,
        checkinrating: checkinrating ?? null,
        valuerating: valuerating ?? null,
        overallrating: overallrating ?? null,
      },
      include: {
        propertyreviewphotos: true,
        guest: {
          include: {
            users: { select: { name: true, pictureurl: true } },
          },
        },
      },
    });

    const allReviews = await prisma.propertyreview.findMany({
      where: { propertyid: propertyId, overallrating: { not: null } },
      select: { overallrating: true },
    });
    const numratings = allReviews.length;
    const avgratings =
      numratings > 0
        ? allReviews.reduce((sum, r) => sum + (r.overallrating ?? 0), 0) /
          numratings
        : 0;

    await prisma.property.update({
      where: { pid: propertyId },
      data: { numratings, avgratings },
    });

    return NextResponse.json(review, { status: 201 });
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
