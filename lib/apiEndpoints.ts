import { apiFetch } from "./api";
import { Property } from "@/types";

export type UserPropertiesResponse =
  | { status: "not_host" }
  | { status: "empty"; properties: Property[] }
  | { status: "ok"; properties: Property[] }
  | { status: "error"; error: string };

export const getProperties = (): Promise<Property[]> => {
  return apiFetch<Property[]>("/api/properties");
};
export const getPropertyById = (id: number) =>
  apiFetch<Property>(`/api/properties/${id}`);
export const getUserProperties = (
  token?: string,
): Promise<UserPropertiesResponse> => {
  return apiFetch<UserPropertiesResponse>(
    "/api/properties/user-properties",
    {},
    token,
  );
};
export const createBooking = (data: {
  propertyId: number;
  start: string;
  end: string;
  guests: number;
}) => apiFetch("/api/bookings", { method: "POST", body: JSON.stringify(data) });
