"use client";
import "./PropertyReviewSummary.css";

import { useEffect, useState } from "react";

interface Review {
  overallrating?: number | null;
}

export default function PropertyReviewSummary({
  propertyId,
}: {
  propertyId: number;
}) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/properties/${propertyId}/reviews`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setReviews(data);
      })
      .finally(() => setLoading(false));
  }, [propertyId]);

  const valid = reviews.filter((r) => r.overallrating != null);

  const avg =
    valid.length > 0
      ? valid.reduce((s, r) => s + (r.overallrating ?? 0), 0) / valid.length
      : 0;

  const count = valid.length;

  if (loading) return null; // or skeleton

  return (
    <div className="reviewSummary">
      <div className="reviewSummaryHeader">
        <span className="star">★</span>
        <span className="score">{avg > 0 ? avg.toFixed(1) : "New"}</span>
        <span className="dot">·</span>
        <span className="count">
          {count > 0
            ? `${count} review${count !== 1 ? "s" : ""}`
            : "No reviews yet"}
        </span>
      </div>
    </div>
  );
}
