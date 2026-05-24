"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import BookingForm from "@/app/components/BookingForm";
import PropertyGrid from "@/app/components/PropertyGrid";
import { PropertySearchResult } from "@/lib/search/searchProperties";
import { searchProperties } from "@/lib/api/propertySearch";
import "./page.css";

export default function Home() {
  const [properties, setProperties] = useState<PropertySearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async (): Promise<void> => {
      try {
        const data = await searchProperties({
          page: 1,
          sort: "rating",
        });
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
          <p className="hero-tagline">Find your next favourite couch</p>
          <h1 className="hero-headline">
            <span className="hero-headline__bold">Live like a local.</span>
            <span className="hero-headline__light">
              {" "}
              Feel at home, everywhere.
            </span>
          </h1>
        </section>

        <BookingForm />

        <section className="featured-properties">
          <h2>Featured Properties</h2>
          <div className="results-wrapper">
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {!loading && !error && (
              <PropertyGrid properties={properties} limit={5} />
            )}
          </div>
        </section>

        <section className="host-cta">
          <div className="host-cta__left">
            <svg
              className="host-cta__icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M24 6L6 22h6v20h10V30h4v12h10V22h6L24 6z"
                fill="var(--accent)"
                fillOpacity="0.12"
                stroke="var(--accent)"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <rect
                x="19"
                y="30"
                width="10"
                height="12"
                rx="2"
                fill="var(--accent)"
                fillOpacity="0.2"
                stroke="var(--accent)"
                strokeWidth="1.5"
              />
              <circle
                cx="34"
                cy="18"
                r="4"
                fill="var(--accent)"
                fillOpacity="0.15"
                stroke="var(--accent)"
                strokeWidth="1.5"
              />
            </svg>
            <div className="host-cta__text">
              <h2>Interested in hosting?</h2>
              <p>
                Earn extra income by listing your space. It only takes a few
                minutes to get started.
              </p>
            </div>
          </div>
          <Link href="/host" className="cta-host">
            List your property
          </Link>
        </section>
      </main>
    </div>
  );
}
