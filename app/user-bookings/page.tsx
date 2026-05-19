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

  return (
    <div className={styles.container}>
      <div className={styles.bookings}>
        <h1>My bookings</h1>

        {upcomingBookings.length > 0 && (
          <section>
            <p className={styles.sectionTitle}>Upcoming</p>
            {upcomingBookings.map((b) => (
              <div key={b.bid} className={styles.card}>
                <div className={styles.cardMeta}>
                  <p className={styles.property}>{b.propertyid}</p>
                  <p className={styles.dates}>
                    {fmt(b.checkin)} → {fmt(b.checkout)}
                  </p>
                </div>
                <span className={styles.badgeUpcoming}>Upcoming</span>
              </div>
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
              pastBookings.map((b) => (
                <div key={b.bid} className={styles.card}>
                  <div className={styles.cardMeta}>
                    <p className={styles.property}>{b.propertyid}</p>
                    <p className={styles.dates}>
                      {fmt(b.checkin)} → {fmt(b.checkout)}
                    </p>
                  </div>
                  <span className={styles.badgePast}>Past</span>
                </div>
              ))}
          </section>
        )}
      </div>
    </div>
  );
}
