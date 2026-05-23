import { apiFetch } from "@/lib/api";
import { PropertySearchParams } from "@/lib/search/propertySearchTypes";
import { PropertySearchResult } from "@/lib/search/searchProperties";

export async function searchProperties(
  params: PropertySearchParams,
): Promise<PropertySearchResult[]> {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      query.append(key, String(value));
    }
  });

  return apiFetch<PropertySearchResult[]>(
    `/api/properties/search?${query.toString()}`,
  );
}
