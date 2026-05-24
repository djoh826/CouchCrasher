"use client";
import { useState } from "react";
import { getProperties } from "@/lib/apiEndpoints";
import { Property } from "@/types";
import "./BookingForm.css";

export default function BookingForm() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [location, setLocation] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [guests, setGuests] = useState<string>("");

  const handleSearch = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      const results = await getProperties();
      setProperties(results);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="booking-form" aria-label="Search stays">
      <form className="search-form" onSubmit={handleSearch}>
        <div className="pill-bar">
          <div className="pill-field">
            <label htmlFor="location">Where</label>
            <input
              id="location"
              type="text"
              value={location}
              placeholder="Dallas"
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <span className="pill-divider" aria-hidden="true" />

          <div className="pill-field">
            <label htmlFor="date">When</label>
            <input
              id="date"
              type="text"
              value={date}
              placeholder="03/22/2026"
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <span className="pill-divider" aria-hidden="true" />

          <div className="pill-field">
            <label htmlFor="guests">Guests</label>
            <input
              id="guests"
              type="number"
              value={guests}
              placeholder="2"
              onChange={(e) => setGuests(e.target.value)}
            />
          </div>

          <button type="submit" className="search-btn" aria-label="Search">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span>Search</span>
          </button>
        </div>
      </form>
    </section>
  );
}
