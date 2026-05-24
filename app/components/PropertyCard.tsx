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
          <div className="property-image-wrap">
            <Image
              src={photoUrl}
              alt={property.name}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        ) : (
          <div className="property-image-wrap placeholder">
            No image available
          </div>
        )}

        <div className="property-info">
          <h3 className="property-title">{property.name}</h3>
          <p className="property-location">
            {property.city}, {property.state}
          </p>

          <div className="property-rating">
            <span className="rating-star">★</span>
            <span className="rating-score">4.8</span>
            <span className="rating-reviews">· 32 reviews</span>
          </div>

          {property.distance_km !== undefined && (
            <p className="property-distance">
              {property.distance_km.toFixed(1)} km away
            </p>
          )}

          <div className="property-footer">
            <p className="property-details">{property.maxguests} guests</p>
            <p className="property-price">${property.nightlyfee} / night</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
