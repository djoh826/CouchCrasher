"use client";

import { useState } from "react";
import Link from "next/link";
import { getProperties } from "@/lib/apiEndpoints";
import { Property } from "@/types";
// import { PropertyCard } from "@/components/PropertyCard";

export default function Home() {
  const [location, setLocation] = useState("");
  const [properties, setProperties] = useState<Property[]>([]);

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
    <div className="layout">
      <header className="site-header">
        <nav className="primary-nav" aria-label="Primary navigation">
          <ul className="nav-list">
            <li>
              <Link href="/browse">Browse properties</Link>
            </li>
            <li>
              <Link href="/host">Create a listing</Link>
            </li>
            <li>
              <Link href="/profile">Profile</Link>
            </li>
          </ul>
        </nav>
      </header>

      <main className="main-content">
        <section className="hero">
          <h1>Live comfortably like at home, wherever you go</h1>
          <Link href="/browse" className="cta-primary">
            Book now
          </Link>
        </section>

        <section className="search-box" aria-label="Search stays">
          <form className="search-form" onSubmit={handleSearch}>
            <div className="input-group">
              <label htmlFor="location">Where do you want to stay?</label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <button type="submit">Search</button>
          </form>
        </section>

        {/* <section className="search-results">
          {properties.map((p) => (
            <PropertyCard key={p.pid} property={p} />
          ))}
        </section> */}

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
