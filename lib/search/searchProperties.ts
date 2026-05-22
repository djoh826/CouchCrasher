import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { PropertySearchParams } from "@/lib/search/propertySearchTypes";

export type PropertySearchResult = {
  pid: number;
  name: string;
  city: string;
  state: string;
  nightlyfee: number;
  avgratings: number;
  maxguests: number;
  latitude: number;
  longitude: number;
  headline: string | null;

  propertyphotos: {
    photourl: string;
    thumbnailurl: string;
  }[];

  distance_km?: number;
};

const PAGE_SIZE = 12;

export async function searchProperties(
  params: PropertySearchParams,
): Promise<PropertySearchResult[]> {
  const {
    city,
    state,
    lat,
    lng,
    radiusKm = 25,
    minPrice = 0,
    maxPrice = 100000,
    guests = 1,
    page = 1,
    sort = "recommended",
  } = params;

  const skip = (page - 1) * PAGE_SIZE;

  let orderBy: Prisma.propertyOrderByWithRelationInput = {
    avgratings: "desc",
  };

  if (sort === "price_asc") orderBy = { nightlyfee: "asc" };
  if (sort === "price_desc") orderBy = { nightlyfee: "desc" };
  if (sort === "rating") orderBy = { avgratings: "desc" };

  if (typeof lat === "number" && typeof lng === "number") {
    return prisma.$queryRaw<PropertySearchResult[]>`
  SELECT
    p.*,
    ST_Distance(
      p.location,
      ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography
    ) / 1000 AS distance_km
  FROM property p
  WHERE
    ST_DWithin(
      p.location,
      ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography,
      ${radiusKm * 1000}
    )
    AND p.nightlyfee BETWEEN ${minPrice} AND ${maxPrice}
    AND p.maxguests >= ${guests}
    ${city ? Prisma.sql`AND LOWER(p.city) = LOWER(${city})` : Prisma.empty}
    ${state ? Prisma.sql`AND LOWER(p.state) = LOWER(${state})` : Prisma.empty}
  ORDER BY distance_km ASC
  LIMIT ${PAGE_SIZE}
  OFFSET ${skip};
`;
  }

  return prisma.property.findMany({
    where: {
      ...(city && {
        city: { contains: city, mode: "insensitive" },
      }),
      ...(state && {
        state: { equals: state, mode: "insensitive" },
      }),
      nightlyfee: { gte: minPrice, lte: maxPrice },
      maxguests: { gte: guests },
    },
    orderBy,
    take: PAGE_SIZE,
    skip,
    select: {
      pid: true,
      name: true,
      city: true,
      state: true,
      nightlyfee: true,
      avgratings: true,
      maxguests: true,
      latitude: true,
      longitude: true,
      headline: true,
      propertyphotos: {
        where: { isprimary: true },
        take: 1,
        select: {
          photourl: true,
          thumbnailurl: true,
        },
      },
    },
  });
}
