import PropertyCard from "./PropertyCard";
import { Property } from "@/types";
import "./PropertyGrid.css";

interface PropertyGridProps {
  properties: Property[];
  limit?: number;
}

export default function PropertyGrid({ properties, limit }: PropertyGridProps) {
  const displayed = limit ? properties.slice(0, limit) : properties;
  return (
    <div className="property-grid">
      {displayed.map((property, index) => (
        <PropertyCard
          key={property?.pid ? property.pid : index}
          property={property}
        />
      ))}
    </div>
  );
}
