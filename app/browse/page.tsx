"use client";

import { useState } from "react";
import PropertyGrid from "@/app/components/PropertyGrid";
import styles from "./page.module.css";
import { usePropertySearch } from "@/lib/hooks/usePropertySearch";
import { PropertySearchResult } from "@/lib/search/searchProperties";

export default function Browse() {
  const [city, setCity] = useState("");

  const { data: properties, loading } = usePropertySearch({
    city,
    page: 1,
  });

  return (
    <section className={styles.browse}>
      <div className={styles.resultsWrapper}>
        {/* Search input */}
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Search by city..."
          style={{
            padding: "10px",
            marginBottom: "16px",
            width: "100%",
            maxWidth: "400px",
          }}
        />

        {loading && <p>Loading properties...</p>}

        {!loading && properties && <PropertyGrid properties={properties} />}
      </div>
    </section>
  );
}
