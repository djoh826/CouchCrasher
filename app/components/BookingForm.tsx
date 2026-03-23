"use client";
import { useState } from "react";
import { getProperties } from "@/lib/apiEndpoints";
import { Property } from "@/types";
import "./BookingForm.css";

export default function BookingForm() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const results = await getProperties(); // optionally filter by location
      setProperties(results);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <section className="booking-form" aria-label="Search stays">
      <form className="search-form" onSubmit={handleSearch}>
        <div className="input-group">
          <label htmlFor="location">Where do you want to stay?</label>
          <input
            id="location"
            type="text"
            value={location}
            placeholder="Dallas"
            onChange={(e) => setLocation(e.target.value)}
          />
          <label htmlFor="date">When?</label>
          <input
            id="date"
            type="text"
            value={date}
            placeholder="03/22/2026"
            onChange={(e) => setDate(e.target.value)}
          />
          <label htmlFor="guests">How many guests?</label>
          <input
            id="guests"
            type="number"
            value={guests}
            placeholder="Dallas"
            onChange={(e) => setGuests(e.target.value)}
          />
        </div>

        <button type="submit" className="search">
          Search
        </button>
      </form>
    </section>
  );
}
