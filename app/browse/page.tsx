"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
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

        <div className={styles.browseResults}>
          {loading && (
            <p style={{ margin: 0, color: "#888", fontSize: "0.9rem" }}>
              Loading properties…
            </p>
          )}
          {!loading && properties && (
            <div className={styles.browseGrid}>
              {properties.map((p: PropertySearchResult) => (
                <Link
                  key={p.pid}
                  href={`/property/${p.pid}`}
                  style={{
                    borderRadius: "14px",
                    overflow: "hidden",
                    border: "1.5px solid #ececec",
                    background: "#fff",
                    textDecoration: "none",
                    color: "inherit",
                    display: "flex",
                    flexDirection: "column",
                    transition: "box-shadow 0.2s ease, transform 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      "0 6px 24px rgba(83,74,183,0.13)";
                    (e.currentTarget as HTMLElement).style.transform =
                      "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                    (e.currentTarget as HTMLElement).style.transform = "none";
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      height: "180px",
                      background: "#f0f0f0",
                    }}
                  >
                    <Image
                      src={
                        p.propertyphotos?.[0]
                          ? "https://" +
                            (p.propertyphotos[0].thumbnailurl ||
                              p.propertyphotos[0].photourl)
                          : "/placeholder.png"
                      }
                      alt={p.name}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                  </div>
                  <div
                    style={{
                      padding: "0.75rem 1rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "3px",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontWeight: 700,
                        fontSize: "0.95rem",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {p.name}
                    </p>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#999" }}>
                      {p.city}, {p.state}
                    </p>
                    <p
                      style={{
                        margin: "4px 0 0",
                        fontSize: "0.9rem",
                        fontWeight: 700,
                        color: "#534ab7",
                      }}
                    >
                      ${p.nightlyfee}{" "}
                      <span
                        style={{
                          fontWeight: 400,
                          color: "#aaa",
                          fontSize: "0.8rem",
                        }}
                      >
                        / night
                      </span>
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
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
    </section>
  );
}
