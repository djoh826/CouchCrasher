"use client";

import { useEffect, useState } from "react";
import PropertyGrid from "@/app/components/PropertyGrid";
import { Property } from "@/types";
import { getProperties } from "@/lib/apiEndpoints";
import styles from "./page.module.css";

export default function Browse() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await getProperties();
        setProperties(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load properties.");
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  return (
    <section className={styles.browse}>
      <div className={styles.resultsWrapper}>
        {loading && <p>Loading properties...</p>}
        {error && <p>{error}</p>}
        {!loading && !error && <PropertyGrid properties={properties} />}
      </div>
    </section>
  );
}
