import { apiFetch } from "./api";
import { Property } from "@/types";

export const getProperties = (): Promise<Property[]> => {
  return apiFetch<Property[]>("/api/properties");
};
export const getPropertyById = (id: number) =>
  apiFetch<Property>(`/api/properties/${id}`);
export const createBooking = (data: {
  propertyId: number;
  start: string;
  end: string;
  guests: number;
}) => apiFetch("/api/bookings", { method: "POST", body: JSON.stringify(data) });
