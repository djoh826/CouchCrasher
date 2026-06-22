"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PropertySearchResult } from "@/lib/search/searchProperties";
import { searchProperties } from "@/lib/api/propertySearch";
import PropertyCard from "@/app/components/PropertyCard";
import "./RelatedStays.css";

interface RelatedStaysProps {
  currentPid: number;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
}

export default function RelatedStays({
  currentPid,
  latitude,
  longitude,
  city,
  state,
}: RelatedStaysProps) {
  const [stays, setStays] = useState<PropertySearchResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const results = await searchProperties({
          lat: latitude,
          lng: longitude,
          radiusKm: 40,
          page: 1,
          sort: "recommended",
        });
        // get 4 closest properties, exclude current property
        const filtered = results
          .filter((p) => p.pid !== currentPid)
          .slice(0, 4);
        setStays(filtered);
      } catch {
        console.log("Encountered error when loading related stays");
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [currentPid, latitude, longitude]);

  if (loading || stays.length === 0) return null;

  return (
    <section className="relatedStays">
      <div className="header">
        <div>
          <h2 className="title">Related Stays</h2>
        </div>

        <Link
          href={`/search?lat=${latitude}&lng=${longitude}&city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}`}
          className="viewAll"
        >
          View all
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      </div>

      <div className="grid">
        {stays.map((property) => (
          <PropertyCard key={property.pid} property={property} />
        ))}
      </div>
    </section>
  );
}
