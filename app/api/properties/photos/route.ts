import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { checkIfLoggedIn, HttpError, checkIfAdmin } from "@/lib/jwt";

// /api/photos?propertyId=123 GET
// Returns photos for a specific property
export async function GET(req: Request) {
  try {
    const jwtPayload = checkIfLoggedIn(req);
    const { searchParams } = new URL(req.url);
    const propertyId = searchParams.get("propertyId");

    if (!propertyId) {
      throw new HttpError(400, "Bad request, Missing propertyId");
    }

    // return all photos of respective property
    const response = await prisma.propertyphotos.findMany({
      where: {
        propertyid: Number(propertyId),
      },
    });

    return NextResponse.json(response);
  } catch (err) {
    if (err instanceof HttpError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
  }
}

// /api/photos POST
// Add photos to a specific property. Only usable by host of the property (or admin)
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

    // Validate that user is the host of the property
    const isUserHostOfProperty = await prisma.property.findFirst({
      where: {
        hostuid: jwtPayload.uid,
        pid: propertyId,
      },
    });

    if (!isUserHostOfProperty && !(await checkIfAdmin(jwtPayload))) {
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

// /api/photos DELETE
// Deletes photos for a specific property
export async function DELETE(req: Request) {
  try {
    const jwtPayload = checkIfLoggedIn(req);
    const body = await req.json();
    const { photoIds, propertyId }: { photoIds: number[]; propertyId: number } =
      body;

    // check if host of property or admin
    const isUserHostOfProperty = await prisma.property.findFirst({
      where: {
        hostuid: jwtPayload.uid,
        pid: propertyId,
      },
    });

    if (!isUserHostOfProperty && !(await checkIfAdmin(jwtPayload))) {
      throw new HttpError(401, "User is not host of this property or an admin");
    }

    // deletes photos with ids
    const response = await prisma.propertyphotos.deleteMany({
      where: {
        photoid: {
          in: photoIds,
        },
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
