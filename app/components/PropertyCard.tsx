import React from "react";
import Image from "next/image";
import { Property } from "@/types";
import "./PropertyCard.css";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const primaryPhoto =
    property.propertyphotos?.find((p) => p.isprimary) ||
    property.propertyphotos?.[0];

  const photoUrl = primaryPhoto?.photourl
    ? "https://" + primaryPhoto.photourl
    : null;

  console.log("URL = " + photoUrl);

  return (
    <div className="property-card">
      {photoUrl ? (
        <Image
          src={photoUrl}
          alt={property.name}
          width={400}
          height={250}
          style={{ objectFit: "cover", borderRadius: "16px 16px 0 0" }}
        />
      ) : (
        <div className="property-image placeholder">No image available</div>
      )}

      <div className="property-info">
        <h3 className="property-title">{property.name}</h3>
        <p className="property-location">
          {property.city}, {property.state}
        </p>
        <p className="property-details">
          {property.maxguests} guests • {property.numbedrooms} bedrooms •{" "}
          {property.numbathrooms} bathrooms
        </p>
        <p className="property-price">${property.nightlyfee} / night</p>
      </div>
    </div>
  );
}
