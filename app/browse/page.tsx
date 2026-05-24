"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import PropertyGrid from "@/app/components/PropertyGrid";
import styles from "./page.module.css";
import { usePropertySearch } from "@/lib/hooks/usePropertySearch";
import { PropertySearchResult } from "@/lib/search/searchProperties";

const PropertyMap = dynamic(() => import("@/app/components/PropertyMap"), {
  ssr: false,
  loading: () => <div className={styles.mapPlaceholder} />,
});

const DALLAS: [number, number] = [32.7767, -96.797];

export default function Browse() {
  const [city, setCity] = useState("");

  const { data: properties, loading } = usePropertySearch({ city, page: 1 });

  const markers = (properties ?? [])
    .filter((p: PropertySearchResult) => p.latitude && p.longitude)
    .map((p: PropertySearchResult) => ({
      lat: p.latitude,
      lng: p.longitude,
      label: p.name,
      href: `/property/${p.pid}`,
    }));

  return (
    <section className={styles.browse}>
      <div className={styles.browseInner}>
        <div className={styles.browseHeader}>
          <h1 className={styles.browseTitle}>Browse Properties</h1>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Search by city..."
            className={styles.browseSearch}
          />
        </div>

        <div className={styles.browseLayout}>
          <div className={styles.browseResults}>
            {loading && <p>Loading properties...</p>}
            {!loading && properties && <PropertyGrid properties={properties} />}
          </div>

          <div className={styles.browseMap}>
            <PropertyMap
              markers={markers}
              center={DALLAS}
              zoom={11}
              height="100%"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
