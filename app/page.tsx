"use client";
import Link from "next/link";
import BookingForm from "./components/BookingForm";
import "./page.css";

export default function Home() {
  return (
    <div className="layout">
      <main className="main-content">
        <section className="hero">
          <h1>Live comfortably like at home, wherever you go</h1>
          <Link href="/browse" className="cta-primary">
            Book now
          </Link>
        </section>

        <BookingForm />

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
