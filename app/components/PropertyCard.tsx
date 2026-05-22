import React from "react";
import Image from "next/image";
import Link from "next/link";
import { PropertySearchResult } from "@/lib/search/searchProperties";
import "./PropertyCard.css";

interface PropertyCardProps {
  property: PropertySearchResult;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const primaryPhoto = property.propertyphotos?.[0];

  const photoUrl = primaryPhoto?.photourl
    ? "https://" + primaryPhoto.photourl
    : null;

  return (
    <Link href={`/property/${property.pid}`} className="property-card-link">
      <div className="property-card">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={property.name}
            width={400}
            height={250}
            style={{
              objectFit: "cover",
              borderRadius: "16px 16px 0 0",
            }}
          />
        ) : (
          <div className="property-image placeholder">No image available</div>
        )}

        <div className="property-info">
          <h3 className="property-title">{property.name}</h3>

          <p className="property-location">
            {property.city}, {property.state}
          </p>

          <p className="property-details">{property.maxguests} guests</p>

          <p className="property-price">${property.nightlyfee} / night</p>

          {property.distance_km !== undefined && (
            <p className="property-distance">
              {property.distance_km.toFixed(1)} km away
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
