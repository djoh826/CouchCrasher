"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

interface PropertyPhoto {
  photourl: string;
  isprimary: boolean;
  order?: number; // photo order 1-5
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
  propertyphotos?: PropertyPhoto[];
}

export default function PropertyPage() {
  const params = useParams();
  const propertyId = params["property-id"];
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProperty() {
      try {
        const res = await fetch(`/api/properties/${propertyId}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Failed to load property");
        } else {
          setProperty(data);
        }
      } catch (err) {
        console.error(err);
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

  const handleShare = () => {
    // TODO: make this not just take the window's url
    navigator.clipboard.writeText(window.location.href);
    console.log("Share button clicked for:", property.name);
  };

  const handleFavorite = () => {
    // TODO: implement favorite functionality
    // POST /api/favorites { propertyId: property.id }
    console.log("Favorite button clicked for:", property.name);
  };

  // Build the carousel images array (order 1-5)
  const carouselImages: string[] = [];
  for (let i = 1; i <= 5; i++) {
    const photo = property.propertyphotos?.find((p) => p.order === i);
    carouselImages.push(
      photo?.photourl ? "https://" + photo.photourl : "/placeholder.png", // fallback
    );
  }

  return (
    <section className={styles.propertyPage}>
      <span className={styles.heading}>
        <h1 className={styles.title}>
          <span style={{ fontWeight: "bold" }}>{property.name}</span> -{" "}
          {property.description}
        </h1>
        <p style={{ marginLeft: "auto" }}>
          🔗 <button onClick={handleShare}>Share </button> ❤️{" "}
          <button onClick={handleFavorite}>Favorite</button>
        </p>
      </span>

      <div className={styles.photoCarousel}>
        {carouselImages.map((url, idx) => (
          <Image
            key={idx}
            className={styles[`item${idx + 1}`]}
            src={url}
            alt={`Photo ${idx + 1} of ${property.name}`}
            width={400}
            height={300}
            style={{
              objectFit: "cover",
              borderRadius: "12px",
            }}
          />
        ))}
      </div>

      <section className={styles.propertyDescription}>
        <p style={{ color: "var(--text)", marginBottom: "0" }}>
          Stay in {property.city}, {property.state} with up to{" "}
          {property.maxguests} Guests, {property.numbedrooms} Bedrooms, and{" "}
          {property.numbathrooms} Bathrooms
        </p>
      </section>

      <ul>
        <li>
          <strong>Cancellation Period:</strong> {property.cancelperiod}
        </li>
        <li>
          <strong>Refund Rate:</strong> {property.refundrate}
        </li>
        <li>
          <strong>Nightly Fee:</strong> ${property.nightlyfee.toFixed(2)}
        </li>
        <li>
          <strong>Cleaning Fee:</strong> ${property.cleaningfee.toFixed(2)}
        </li>
        <li>
          <strong>Service Fee:</strong> ${property.servicefee.toFixed(2)}
        </li>
        <li>
          <strong>Address:</strong> {property.street}, {property.city},{" "}
          {property.state}, {property.zipcode}, {property.country}
        </li>
      </ul>
    </section>
  );
}
