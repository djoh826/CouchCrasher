"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import "./PropertyReviews.css";

interface ReviewUser {
  name: string;
  pictureurl?: string | null;
}

interface ReviewGuest {
  users: ReviewUser;
}

interface Review {
  prid: number;
  guestuid: number;
  propertyid: number;
  comment?: string | null;
  propreviewdate?: string | null;
  cleanlinessrating?: number | null;
  accuracyrating?: number | null;
  communicationrating?: number | null;
  checkinrating?: number | null;
  valuerating?: number | null;
  overallrating?: number | null;
  guest?: ReviewGuest;
}

interface Props {
  propertyId: number;
  avgRating: number;
  numRatings: number;
}

const RATING_LABELS: { key: keyof Review; label: string }[] = [
  { key: "cleanlinessrating", label: "Cleanliness" },
  { key: "accuracyrating", label: "Accuracy" },
  { key: "communicationrating", label: "Communication" },
  { key: "checkinrating", label: "Check-in" },
  { key: "valuerating", label: "Value" },
];

function Stars({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <span className="stars" aria-label={`${value} out of ${max}`}>
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={i < Math.round(value) ? "starFilled" : "starEmpty"}
        >
          ★
        </span>
      ))}
    </span>
  );
}

function RatingInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="ratingInputRow">
      <span className="ratingInputLabel">{label}</span>

      <span className="ratingInputStars">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            className={`starBtn ${
              n <= (hovered || value) ? "starBtnActive" : ""
            }`}
            onMouseEnter={() => setHovered(n)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(n)}
            aria-label={`${n} star`}
          >
            ★
          </button>
        ))}
      </span>
    </div>
  );
}

export default function PropertyReviews({
  propertyId,
  avgRating,
  numRatings,
}: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [form, setForm] = useState({
    comment: "",
    cleanlinessrating: 0,
    accuracyrating: 0,
    communicationrating: 0,
    checkinrating: 0,
    valuerating: 0,
    overallrating: 0,
  });

  useEffect(() => {
    fetch(`/api/properties/${propertyId}/reviews`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setReviews(data);
      })
      .finally(() => setLoading(false));
  }, [propertyId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError("");

    const requiredRatings = [
      form.cleanlinessrating,
      form.accuracyrating,
      form.communicationrating,
      form.checkinrating,
      form.valuerating,
      form.overallrating,
    ];

    if (requiredRatings.some((r) => r === 0)) {
      setSubmitError("Please fill in all rating categories.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`/api/properties/${propertyId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data.error || "Failed to submit review.");
      } else {
        setSubmitSuccess(true);
        setShowForm(false);

        setReviews((prev) => [data, ...prev]);

        setForm({
          comment: "",
          cleanlinessrating: 0,
          accuracyrating: 0,
          communicationrating: 0,
          checkinrating: 0,
          valuerating: 0,
          overallrating: 0,
        });
      }
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const valid = reviews.filter((r) => r.overallrating != null);

  const displayAvg =
    valid.length > 0
      ? valid.reduce((s, r) => s + r.overallrating!, 0) / valid.length
      : avgRating;

  const displayCount = reviews.length || numRatings;

  const categoryAvgs = RATING_LABELS.map(({ key, label }) => {
    const vals = reviews
      .map((r) => r[key] as number | null)
      .filter((v) => v != null) as number[];

    const avg = vals.length
      ? vals.reduce((a, b) => a + b, 0) / vals.length
      : null;

    return { label, avg };
  });

  return (
    <section className="section">
      <div className="header">
        <div className="headerLeft">
          <span className="headerStar">★</span>

          <span className="headerScore">
            {displayAvg > 0 ? displayAvg.toFixed(1) : "—"}
          </span>

          <span className="headerDot">·</span>

          <span className="headerCount">
            {displayCount} review{displayCount !== 1 ? "s" : ""}
          </span>
        </div>

        {!submitSuccess && (
          <button
            className="writeReviewBtn"
            onClick={() => setShowForm((v) => !v)}
          >
            {showForm ? "Cancel" : "Write a review"}
          </button>
        )}
      </div>

      {categoryAvgs.some((c) => c.avg !== null) && (
        <div className="categoryGrid">
          {categoryAvgs.map(({ label, avg }) =>
            avg !== null ? (
              <div key={label} className="categoryItem">
                <span className="categoryLabel">{label}</span>

                <div className="categoryBar">
                  <div
                    className="categoryBarFill"
                    style={{ width: `${(avg / 5) * 100}%` }}
                  />
                </div>

                <span className="categoryScore">{avg.toFixed(1)}</span>
              </div>
            ) : null,
          )}
        </div>
      )}

      {showForm && (
        <form className="form" onSubmit={handleSubmit}>
          <h3 className="formTitle">Share your experience</h3>

          <div className="formRatings">
            {RATING_LABELS.map(({ key, label }) => (
              <RatingInput
                key={key}
                label={label}
                value={form[key as keyof typeof form] as number}
                onChange={(v) =>
                  setForm((f) => ({
                    ...f,
                    [key]: v,
                  }))
                }
              />
            ))}

            <RatingInput
              label="Overall"
              value={form.overallrating}
              onChange={(v) =>
                setForm((f) => ({
                  ...f,
                  overallrating: v,
                }))
              }
            />
          </div>

          <textarea
            className="textarea"
            placeholder="Tell future guests about your stay…"
            value={form.comment}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                comment: e.target.value,
              }))
            }
            rows={4}
            maxLength={200}
          />

          <span className="charCount">{form.comment.length}/200</span>

          {submitError && <p className="formError">{submitError}</p>}

          <button type="submit" className="submitBtn" disabled={submitting}>
            {submitting ? "Submitting…" : "Submit review"}
          </button>
        </form>
      )}

      {submitSuccess && (
        <div className="successBanner">
          ✓ Your review has been submitted. Thank you!
        </div>
      )}

      {loading ? (
        <div className="loadingRow">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <p className="empty">
          No reviews yet. Be the first to share your experience!
        </p>
      ) : (
        <div className="reviewsGrid">
          {reviews.map((r) => (
            <div key={r.prid} className="reviewCard">
              <div className="reviewerRow">
                <div className="avatar">
                  {r.guest?.users?.pictureurl ? (
                    <Image
                      src={
                        r.guest.users.pictureurl.startsWith("http")
                          ? r.guest.users.pictureurl
                          : "https://" + r.guest.users.pictureurl
                      }
                      alt={r.guest.users.name}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <span className="avatarInitial">
                      {r.guest?.users?.name?.[0]?.toUpperCase() ?? "?"}
                    </span>
                  )}
                </div>

                <div>
                  <p className="reviewerName">
                    {r.guest?.users?.name ?? "Guest"}
                  </p>

                  {r.propreviewdate && (
                    <p className="reviewDate">
                      {new Date(r.propreviewdate).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </div>
              </div>

              {r.overallrating != null && <Stars value={r.overallrating} />}

              {r.comment && <p className="reviewComment">{r.comment}</p>}

              <div className="subRatings">
                {RATING_LABELS.map(({ key, label }) =>
                  r[key as keyof Review] != null ? (
                    <span key={key} className="subRating">
                      <span className="subRatingLabel">{label}</span>

                      <span className="subRatingValue">
                        {r[key as keyof Review] as number}
                      </span>
                    </span>
                  ) : null,
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
