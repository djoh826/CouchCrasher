import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import {
  checkIfLoggedIn,
  HttpError,
  isAdmin,
  checkIfHostOfProperty,
} from "@/lib/jwt";

// /api/properties/categories?propertyId=123 GET
// Returns categories for a specific property
export async function GET(req: Request) {
  try {
    checkIfLoggedIn(req);
    const { searchParams } = new URL(req.url);
    const propertyId = searchParams.get("propertyId");

    if (!propertyId) {
      throw new HttpError(400, "Bad request, Missing propertyId");
    }

    // select all categories associated with property
    const response = await prisma.propertycategories.findMany({
      where: {
        propertyid: Number(propertyId),
      },
      select: {
        category: true,
      },
    });

    return NextResponse.json(response);
  } catch (err) {
    if (err instanceof HttpError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
  }
}

// /api/properties/categories POST
// Add categeories to a specific property. Only usable by host of the property (or admin)
export async function POST(req: Request) {
  try {
    const jwtPayload = checkIfLoggedIn(req);

    const {
      propertyId,
      categoryIds,
    }: {
      propertyId: number;
      categoryIds: number[];
    } = await req.json();

    // Validate that user is the host of the property
    const isUserHostOfProperty = checkIfHostOfProperty(jwtPayload, propertyId);

    if (!isUserHostOfProperty && !(await isAdmin(jwtPayload))) {
      throw new HttpError(401, "User is not host of this property or an admin");
    }

    const categoryCount = await prisma.propertycategories.createMany({
      data: categoryIds.map((id) => ({
        categoryid: id,
        propertyid: propertyId,
      })),
    });

    return NextResponse.json({ success: true, created: categoryCount.count });
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

// /api/properties/categories DELETE
// Deletes categories for a specific property
export async function DELETE(req: Request) {
  try {
    const jwtPayload = checkIfLoggedIn(req);
    const body = await req.json();
    const {
      categoryIds,
      propertyId,
    }: { categoryIds: number[]; propertyId: number } = body;

    // check if host of property or admin
    const isUserHostOfProperty = checkIfHostOfProperty(jwtPayload, propertyId);

    if (!isUserHostOfProperty && !(await isAdmin(jwtPayload))) {
      throw new HttpError(401, "User is not host of this property or an admin");
    }

    // deletes categories with ids
    const response = await prisma.propertycategories.deleteMany({
      where: {
        categoryid: {
          in: categoryIds,
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
