import { PropertySearchParams } from "@/lib/search/propertySearchTypes";

type CacheableValue = string | number | boolean | null | undefined;

type CacheParams = Record<string, CacheableValue>;

function normalizeParams(params: PropertySearchParams): CacheParams {
  return {
    city: params.city?.toLowerCase(),
    state: params.state?.toLowerCase(),

    lat: params.lat,
    lng: params.lng,
    radiusKm: params.radiusKm,

    minPrice: params.minPrice,
    maxPrice: params.maxPrice,

    guests: params.guests,

    page: params.page,

    sort: params.sort,

    checkIn: params.checkIn,
    checkOut: params.checkOut,
  };
}

export function buildPropertySearchCacheKey(
  params: PropertySearchParams,
): string {
  const normalized = normalizeParams(params);

  const sortedKeys = Object.keys(normalized).sort() as (keyof CacheParams)[];

  const stableObject: CacheParams = {};

  for (const key of sortedKeys) {
    const value = normalized[key];
    if (value !== undefined) {
      stableObject[key] = value;
    }
  }

  return `property-search:${JSON.stringify(stableObject)}`;
}
