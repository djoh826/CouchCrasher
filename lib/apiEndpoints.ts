import { apiFetch } from "./api";
import { Property, Booking } from "@/types";

export type UserPropertiesResponse =
  | { status: "not_host" }
  | { status: "empty"; properties: Property[] }
  | { status: "ok"; properties: Property[] }
  | { status: "error"; error: string };
export type UserBookingsResponse = {
  pastBookings: Booking[];
  upcomingBookings: Booking[];
};

export const getProperties = (): Promise<Property[]> => {
  return apiFetch<Property[]>("/api/properties");
};
export const getPropertyById = (id: number) =>
  apiFetch<Property>(`/api/properties/${id}`);
export const getUserProperties = (): Promise<UserPropertiesResponse> => {
  return apiFetch<UserPropertiesResponse>("/api/properties/user-properties");
};
export const createBooking = (data: {
  propertyId: number;
  start: string;
  end: string;
  guests: number;
}) => apiFetch("/api/bookings", { method: "POST", body: JSON.stringify(data) });
export const getUserBookings = (): Promise<UserBookingsResponse> => {
  return apiFetch<UserBookingsResponse>("/api/user/bookings");
};
