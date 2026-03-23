"use client";

import { useEffect, useState } from "react";
import { getProperties } from "@/lib/apiEndpoints";
import { Property } from "@/types";
import Image from "next/image";

export default function Browse() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        // /api/properties GET
        const data = await getProperties();
        setProperties(data);
      } catch (err) {
        setError("Failed to load properties.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    <section className="browse">
      <div className="search-bar" />

      <div className="results">
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}

        {!loading &&
          !error &&
          properties.map((property) => (
            <div key={property.pid} className="property-card">
              <h3>{property.name}</h3>
              <p>
                {property.city}, {property.state}
              </p>
              <p>${property.nightlyfee} / night</p>
              <Image
                width={"50"}
                height={"50"}
                alt={"Property photo of " + property.name}
                src={
                  "https://" + String(property.propertyphotos?.[0].thumbnailurl)
                }
              />
            </div>
          ))}
      </div>
    </section>
  );
}
