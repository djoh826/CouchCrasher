import PropertyCard from "./PropertyCard";
import { PropertySearchResult } from "@/lib/search/searchProperties";
import "./PropertyGrid.css";

interface PropertyGridProps {
  properties: PropertySearchResult[];
  limit?: number;
}

export default function PropertyGrid({ properties, limit }: PropertyGridProps) {
  const displayed = limit ? properties.slice(0, limit) : properties;

  return (
    <div className="property-grid">
      {displayed.map((property) => (
        <PropertyCard key={property.pid} property={property} />
      ))}
    </div>
  );
}
