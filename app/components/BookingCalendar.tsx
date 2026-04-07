"use client";

import React, { useEffect, useState } from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css"; // ✅ Import here

type TimeSlot = {
  startdate: string;
  enddate: string;
};

type BookingCalendarProps = {
  propertyId: number;
};

type DisabledRange =
  | Date
  | { from: Date; to: Date }
  | ((date: Date) => boolean);

export default function BookingCalendar({ propertyId }: BookingCalendarProps) {
  const [dateRange, setDateRange] = useState<Date[]>([]);
  const [disabledRanges, setDisabledRanges] = useState<DisabledRange[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch busy slots
  useEffect(() => {
    const fetchBusyDates = async () => {
      try {
        const res = await fetch(
          `/api/property-timeslots?propertyId=${propertyId}`,
        );
        const data: TimeSlot[] = await res.json();

        const ranges: DisabledRange[] = data.map((slot) => ({
          from: new Date(slot.startdate),
          to: new Date(slot.enddate),
        }));

        setDisabledRanges(ranges);
      } catch (err) {
        console.error("Failed to fetch busy dates", err);
      }
    };

    fetchBusyDates();
  }, [propertyId]);

  const handleBooking = async () => {
    if (dateRange.length !== 2) {
      alert("Please select a check-in and check-out date");
      return;
    }

    const [startDate, endDate] = dateRange;

    setLoading(true);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId, startDate, endDate }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Booking failed");
        return;
      }

      alert("Booking successful!");
      setDateRange([]);
      window.location.reload();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Flatpickr
        value={dateRange}
        options={{
          mode: "range",
          minDate: "today",
          dateFormat: "Y-m-d",
          disable: disabledRanges,
        }}
        onChange={(dates: Date[]) => setDateRange(dates)}
        className="border p-2 rounded-md w-full"
      />

      <button
        onClick={handleBooking}
        disabled={loading}
        className="bg-blue-600 text-white p-2 rounded-md disabled:opacity-50"
      >
        {loading ? "Booking..." : "Book Now"}
      </button>
    </div>
  );
}
