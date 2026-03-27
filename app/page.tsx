"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import BookingForm from "@/app/components/BookingForm";
import PropertyGrid from "@/app/components/PropertyGrid";
import { Property } from "@/types";
import { getProperties } from "@/lib/apiEndpoints";
import "./page.css";

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await getProperties();
        setProperties(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load properties.");
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  return (
    <div className="layout">
      <main className="main-content">
        <section className="hero">
          <h1>Live comfortably like at home, wherever you go</h1>
          {/* <Link href="/browse" className="cta-primary">
            Book now
          </Link> */}
        </section>

        <BookingForm />

        <section className="featured-properties">
          <h2>Featured Stays</h2>
          {loading && <p>Loading properties...</p>}
          {error && <p>{error}</p>}
          {!loading && !error && (
            <PropertyGrid properties={properties} limit={4} />
          )}
        </section>

        <section className="host-cta">
          <h2>Interested in hosting?</h2>
          <Link href="/host" className="cta-secondary">
            List your property
          </Link>
        </section>
      </main>
    </div>
  );
}
