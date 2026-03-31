"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import styles from "./page.module.css";

interface PropertyPhoto {
  photourl: string;
  isprimary: boolean;
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

  const primaryPhoto =
    property.propertyphotos?.find((p) => p.isprimary) ||
    property.propertyphotos?.[0];
  const photoUrl = primaryPhoto?.photourl
    ? "https://" + primaryPhoto.photourl
    : null;

  return (
    <section className={styles.propertyPage}>
      {photoUrl ? (
        <Image
          src={photoUrl}
          alt={property.name}
          width={800}
          height={400}
          style={{ objectFit: "cover", borderRadius: "16px" }}
        />
      ) : (
        <div className={styles.placeholder}>No image available</div>
      )}

      <h1>{property.name}</h1>
      <p>{property.description}</p>

      <ul>
        <li>
          <strong>Guests:</strong> {property.maxguests}
        </li>
        <li>
          <strong>Bedrooms:</strong> {property.numbedrooms}
        </li>
        <li>
          <strong>Bathrooms:</strong> {property.numbathrooms}
        </li>
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
        <li>
          <strong>Coordinates:</strong> {property.latitude},{" "}
          {property.longitude}
        </li>
      </ul>
    </section>
  );
}
