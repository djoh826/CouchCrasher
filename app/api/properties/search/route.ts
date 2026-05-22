import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { PropertySearchParams } from "@/lib/search/propertySearchTypes";
import { buildPropertySearchCacheKey } from "@/lib/cache/propertySearchCache";
import { searchProperties } from "@/lib/search/searchProperties";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const raw: Record<string, string> = Object.fromEntries(
      searchParams.entries(),
    );

    const params: PropertySearchParams = {
      city: raw.city,
      state: raw.state,

      lat: raw.lat ? Number(raw.lat) : undefined,
      lng: raw.lng ? Number(raw.lng) : undefined,
      radiusKm: raw.radiusKm ? Number(raw.radiusKm) : undefined,

      minPrice: raw.minPrice ? Number(raw.minPrice) : undefined,
      maxPrice: raw.maxPrice ? Number(raw.maxPrice) : undefined,

      guests: raw.guests ? Number(raw.guests) : undefined,

      page: raw.page ? Number(raw.page) : 1,

      sort: raw.sort as PropertySearchParams["sort"],

      checkIn: raw.checkIn,
      checkOut: raw.checkOut,
    };

    const cacheKey = buildPropertySearchCacheKey(params);

    const cached = await redis.get<string>(cacheKey);

    if (cached !== null && typeof cached === "string") {
      try {
        const parsed: unknown = JSON.parse(cached);
        return NextResponse.json(parsed);
      } catch (err) {
        console.error("Redis cache parse failed, ignoring cache:", err);
      }
    }

    const results = await searchProperties(params);

    await redis.set(cacheKey, JSON.stringify(results), {
      ex: 60,
    });

    return NextResponse.json(results);
  } catch (err) {
    console.error("Search API error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
