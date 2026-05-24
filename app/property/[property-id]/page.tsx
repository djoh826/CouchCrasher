"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import styles from "./page.module.css";
import BookingCalendar from "@/app/components/BookingCalendar";

interface PropertyPhoto {
  photourl: string;
  isprimary: boolean;
  order?: number;
}

interface Property {
  pid: number;
  name: string;
  description: string;
  maxguests: number;
  numbedrooms: number;
  numbathrooms: number;
  cancelperiod: string;
  refundrate: number;
  nightlyfee: number;
  cleaningfee: number;
  servicefee: number;
  street: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
  latitude: number;
  longitude: number;
  headline: string;
  propertyphotos?: PropertyPhoto[];
}

export default function PropertyPage() {
  const params = useParams();
  const propertyId = params["property-id"];

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    async function fetchProperty() {
      try {
        const res = await fetch(`/api/properties/${propertyId}`);
        const data = await res.json();

        if (!res.ok) setError(data.error || "Failed to load property");
        else setProperty(data);
      } catch {
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchProperty();
  }, [propertyId]);

  if (loading) return <p>Loading property...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!property) return <p>No property found.</p>;

  const carouselImages: string[] = [];
  for (let i = 1; i <= 5; i++) {
    const photo = property.propertyphotos?.find((p) => p.order === i);
    carouselImages.push(
      photo?.photourl ? "https://" + photo.photourl : "/placeholder.png",
    );
  }

  return (
    <section className={styles.propertyPage}>
      <span className={styles.heading}>
        <h1 className={styles.title}>
          <span style={{ fontWeight: "bold" }}>{property.name}</span> -{" "}
          {property.headline}
        </h1>
      </span>

      <div className={styles.photoCarousel}>
        {carouselImages.map((url, idx) => (
          <div
            key={idx}
            className={`${styles.tile} ${styles["tile" + (idx + 1)]}`}
            onClick={() => setActiveIndex(idx)}
          >
            <Image
              src={url}
              alt={`Photo ${idx + 1}`}
              fill
              sizes="(max-width: 1050px) 100vw, 1050px"
              style={{ objectFit: "cover" }}
            />
          </div>
        ))}
      </div>

      {activeIndex !== null && (
        <div className={styles.lightbox}>
          <div
            className={styles.lightboxBackdrop}
            onClick={() => setActiveIndex(null)}
          />

          <button
            className={styles.closeBtn}
            onClick={() => setActiveIndex(null)}
          >
            ×
          </button>

          <div className={styles.lightboxInner}>
            <Image
              src={carouselImages[activeIndex]}
              alt="expanded"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>
      )}

      <section className={styles.propertyDescription}>
        <div className={styles.leftHalf}>
          <p style={{ color: "var(--text)", marginBottom: "0" }}>
            <em>
              Stay in {property.city}, {property.state} with up to{" "}
              {property.maxguests} Guests, {property.numbedrooms} Bedrooms, and{" "}
              {property.numbathrooms} Bathrooms
            </em>
          </p>
          <hr />
          <p>{property.description}</p>
        </div>

        <div className={styles.rightHalf}>
          <div className={styles.book}>
            <p>$123 for 2 nights</p>
            <BookingCalendar propertyId={Number(propertyId)} />
          </div>
        </div>
      </section>
    </section>
  );
}
