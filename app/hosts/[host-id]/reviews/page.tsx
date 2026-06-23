"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";

interface HostData {
  uid: number;
  name: string;
  pictureurl?: string | null;
  avghostratings?: number | null;
  numhostratings?: number | null;
  avgpropertyrating?: number | null;
  properties: { pid: number; name: string; city: string; state: string }[];
}

interface ReviewGuest {
  uid: number;
  name: string;
  pictureurl?: string | null;
}

interface Review {
  ghrid: number;
  guestuid: number;
  hostuid: number;
  comment: string;
  rating: number;
  reviewdate?: string | null;
  guest?: ReviewGuest | null;
}

function Avatar({
  src,
  name,
  size,
}: {
  src?: string | null;
  name: string;
  size: number;
}) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  if (src) {
    return (
      <div className={styles.avatar} style={{ width: size, height: size }}>
        <Image
          src={src.startsWith("http") ? src : "https://" + src}
          alt={name}
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
    );
  }
  return (
    <div
      className={`${styles.avatar} ${styles.avatarFallback}`}
      style={{ width: size, height: size, fontSize: size * 0.35 }}
    >
      {initials}
    </div>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className={styles.stars}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={n <= rating ? styles.starFilled : styles.starEmpty}
        >
          ★
        </span>
      ))}
    </span>
  );
}

function fmt(d?: string | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

const PROPERTIES_PREVIEW = 5;

export default function HostReviewsPage() {
  const params = useParams();
  const hostId = params["host-id"];

  const [host, setHost] = useState<HostData | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAllProperties, setShowAllProperties] = useState(false);

  useEffect(() => {
    fetch(`/api/hosts/${hostId}/reviews`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else {
          setHost(data.host);
          setReviews(data.reviews);
        }
      })
      .catch(() => setError("Failed to load."))
      .finally(() => setLoading(false));
  }, [hostId]);

  if (loading)
    return (
      <div className={styles.page}>
        <p className={styles.status}>Loading...</p>
      </div>
    );
  if (error || !host)
    return (
      <div className={styles.page}>
        <p className={styles.status} style={{ color: "red" }}>
          {error || "Host not found."}
        </p>
      </div>
    );

  return (
    <div className={styles.page}>
      {/* Back link */}
      <Link href="javascript:history.back()" className={styles.backLink}>
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
        >
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        Back
      </Link>

      <div className={styles.layout}>
        {/* Left sidebar — host profile card */}
        <aside className={styles.sidebar}>
          <div className={styles.profileCard}>
            <Avatar src={host.pictureurl} name={host.name} size={88} />
            <h1 className={styles.hostName}>{host.name}</h1>

            <div className={styles.statGrid}>
              {host.avghostratings != null && (
                <div className={styles.stat}>
                  <span className={styles.statVal}>
                    ★ {host.avghostratings.toFixed(2)}
                  </span>
                  <span className={styles.statLabel}>Host rating</span>
                </div>
              )}
              {host.numhostratings != null && (
                <div className={styles.stat}>
                  <span className={styles.statVal}>{host.numhostratings}</span>
                  <span className={styles.statLabel}>
                    Review{host.numhostratings !== 1 ? "s" : ""}
                  </span>
                </div>
              )}
              {host.avgpropertyrating != null && (
                <div className={styles.stat}>
                  <span className={styles.statVal}>
                    ★ {host.avgpropertyrating.toFixed(2)}
                  </span>
                  <span className={styles.statLabel}>Avg property</span>
                </div>
              )}
            </div>

            {host.properties.length > 0 && (
              <div className={styles.propertiesSection}>
                <p className={styles.propertiesLabel}>Properties</p>
                {(showAllProperties
                  ? host.properties
                  : host.properties.slice(0, PROPERTIES_PREVIEW)
                ).map((p) => (
                  <Link
                    key={p.pid}
                    href={`/property/${p.pid}`}
                    className={styles.propertyLink}
                  >
                    <span className={styles.propertyName}>{p.name}</span>
                    <span className={styles.propertyLocation}>
                      {p.city}, {p.state}
                    </span>
                  </Link>
                ))}
                {host.properties.length > PROPERTIES_PREVIEW &&
                  !showAllProperties && (
                    <button
                      className={styles.showMoreBtn}
                      onClick={() => setShowAllProperties(true)}
                      type="button"
                    >
                      <span className={styles.showMoreDots}>•••</span>
                      <span>
                        {host.properties.length - PROPERTIES_PREVIEW} more
                      </span>
                    </button>
                  )}
              </div>
            )}
          </div>
        </aside>

        {/* Right — reviews list */}
        <main className={styles.reviewsMain}>
          <h2 className={styles.reviewsTitle}>
            {reviews.length} review{reviews.length !== 1 ? "s" : ""} for{" "}
            {host.name}
          </h2>

          {reviews.length === 0 ? (
            <p className={styles.noReviews}>No reviews yet.</p>
          ) : (
            <div className={styles.reviewsList}>
              {reviews.map((r) => (
                <div key={r.ghrid} className={styles.reviewCard}>
                  <div className={styles.reviewHeader}>
                    <div className={styles.reviewerInfo}>
                      <Avatar
                        src={r.guest?.pictureurl}
                        name={r.guest?.name ?? "Guest"}
                        size={40}
                      />
                      <div>
                        <p className={styles.reviewerName}>
                          {r.guest?.name ?? "Anonymous"}
                        </p>
                        <p className={styles.reviewDate}>{fmt(r.reviewdate)}</p>
                      </div>
                    </div>
                    <Stars rating={r.rating} />
                  </div>
                  {r.comment && (
                    <p className={styles.reviewComment}>{r.comment}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
