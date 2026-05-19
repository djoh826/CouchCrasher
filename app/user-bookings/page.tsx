"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { getUserBookings } from "@/lib/apiEndpoints";
import { Booking } from "@/types";

type UserBookingsResponse = {
  pastBookings: Booking[];
  upcomingBookings: Booking[];
};

export default function UserBookings() {
  const [data, setData] = useState<UserBookingsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [pastOpen, setPastOpen] = useState(false);

  useEffect(() => {
    getUserBookings()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className={styles.container}>Loading...</div>;
  if (!data) return <div className={styles.container}>No bookings found.</div>;

  const { upcomingBookings, pastBookings } = data;

  const fmt = (d: string | Date) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const BookingCard = ({ b }: { b: Booking }) => {
    const thumb = b.property?.propertyphotos?.[0]?.thumbnailurl;
    return (
      <div className={styles.card}>
        {thumb && (
          <img
            src={"https://" + thumb}
            alt={b.property?.name}
            className={styles.cardThumb}
          />
        )}
        <div className={styles.cardMeta}>
          <p className={styles.property}>
            {b.property?.name ?? `Property #${b.propertyid}`}
          </p>
          <p className={styles.dates}>
            {b.property && `${b.property.city}, ${b.property.state} · `}
            {fmt(b.checkin)} → {fmt(b.checkout)}
          </p>
        </div>
        <a href={`/property/${b.propertyid}`} className={styles.viewLink}>
          View
        </a>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.bookings}>
        <h1>My bookings</h1>

        {upcomingBookings.length > 0 && (
          <section>
            <p className={styles.sectionTitle}>Upcoming</p>
            {upcomingBookings.map((b) => (
              <BookingCard key={b.bid} b={b} />
            ))}
          </section>
        )}

        {pastBookings.length > 0 && (
          <section>
            <button
              className={styles.dropdownHeader}
              onClick={() => setPastOpen((o) => !o)}
            >
              <p className={styles.sectionTitle}>Past stays</p>
              <span
                style={{
                  transform: pastOpen ? "rotate(180deg)" : "none",
                  transition: "0.2s",
                }}
              >
                ▾
              </span>
            </button>
            {pastOpen &&
              pastBookings.map((b) => <BookingCard key={b.bid} b={b} />)}
          </section>
        )}
      </div>
    </div>
  );
}
