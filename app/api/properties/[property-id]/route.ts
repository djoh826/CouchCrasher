import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { HttpError } from "@/lib/jwt";

interface PropertyParams {
  "property-id": string;
}

// GET /api/properties/[property-id]
// Gets property by id
export async function GET(req: Request, context: { params: PropertyParams }) {
  try {
    const params = await context.params;
    const propertyId = params["property-id"];
    if (!propertyId) {
      return NextResponse.json(
        { error: "Property ID not provided" },
        { status: 400 },
      );
    }

    const pid = Number(propertyId);
    if (isNaN(pid)) {
      return NextResponse.json(
        { error: "Property ID must be a number" },
        { status: 400 },
      );
    }

    const property = await prisma.property.findUnique({
      where: { pid },
      include: { propertyphotos: true },
    });

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(property);
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
