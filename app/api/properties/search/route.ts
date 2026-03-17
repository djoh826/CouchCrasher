import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { NextResponse } from "next/server";

// /api/properties/search?city=dallas&page=1
// Returns property search results (cached with Redis)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const city = searchParams.get("city") ?? "";
    const page = Number(searchParams.get("page") ?? "1");
    const pageSize = 10;

    // create cache key based on query
    const cacheKey = `property-search:${city}:${page}`;

    // check redis cache first
    const cached = await redis.get(cacheKey);

    if (cached !== null) {
      return NextResponse.json(cached);
    }

    // query database if cache miss
    const properties = await prisma.property.findMany({
      where: {
        city: {
          contains: city,
          mode: "insensitive",
        },
      },
      take: pageSize,
      skip: (page - 1) * pageSize,
    });

    // store results in redis for 60 seconds
    await redis.set(cacheKey, JSON.stringify(properties), {
      ex: 60,
    });

    return NextResponse.json(properties);
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
