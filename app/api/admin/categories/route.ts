import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { checkIfLoggedIn, HttpError, checkIfadmin } from "@/lib/jwt";

// /api/admin/categories POST
// Creates categories that properties can use
export async function POST(req: Request) {
  try {
    const jwtPayload = checkIfLoggedIn(req);
    await checkIfadmin(jwtPayload);

    const { name } = await req.json();

    const response = await prisma.category.createMany({
      data: {
        categoryid: Math.floor(Date.now() / 1000),
        name: name,
      },
    });

    return NextResponse.json(response);
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

// /api/admin/categories?categoryId=1 DELETE
// Deletes a category
export async function DELETE(req: Request) {
  try {
    const jwtPayload = checkIfLoggedIn(req);
    await checkIfadmin(jwtPayload);
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");

    // deletes categories with ids
    const response = await prisma.category.delete({
      where: {
        categoryid: Number(categoryId),
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
