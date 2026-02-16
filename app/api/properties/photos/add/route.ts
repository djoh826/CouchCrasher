import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { checkIfLoggedIn, HttpError } from "@/lib/jwt";

// /api/photos/add POST
export async function POST(req: Request) {
  try {
    const jwtPayload = checkIfLoggedIn(req);

    const {
      propertyId,
      photoUrls,
    }: {
      propertyId: number;
      photoUrls: string[];
    } = await req.json();

    const uid = jwtPayload.uid;

    // Validate that user is the host of the property
    const isUserHostOfProperty = await prisma.property.findFirst({
      where: {
        hostuid: uid,
        pid: propertyId,
      },
    });

    if (!isUserHostOfProperty) {
      throw new HttpError(401, "User is not host of this property");
    }

    const createdPhotos = await prisma.propertyphotos.createMany({
      data: photoUrls.map((url) => ({
        photourl: url,
        propertyid: propertyId,
      })),
    });

    return NextResponse.json({ success: true, created: createdPhotos.count });
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
