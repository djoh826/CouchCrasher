export type PropertySearchParams = {
  city?: string;
  state?: string;

  lat?: number;
  lng?: number;
  radiusKm?: number;

  minPrice?: number;
  maxPrice?: number;

  guests?: number;

  page?: number;

  sort?: "recommended" | "price_asc" | "price_desc" | "rating";

  checkIn?: string;
  checkOut?: string;
};
