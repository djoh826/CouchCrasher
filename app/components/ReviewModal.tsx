"use client";

import { useState } from "react";
import "./ReviewModal.css";

interface ReviewModalProps {
  booking: {
    bid: number;
    propertyid: number;
    property?: {
      name: string;
      city: string;
      state: string;
      propertyphotos?: { thumbnailurl: string }[];
    } | null;
  };
  onClose: () => void;
  onSuccess: () => void;
}

type Tab = "property" | "host";

interface StarRatingProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
}

function StarRating({ label, value, onChange }: StarRatingProps) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="starRow">
      <span className="starLabel">{label}</span>
      <div className="stars">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            className={`star ${n <= (hovered || value) ? "starFilled" : ""}`}
            onMouseEnter={() => setHovered(n)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(n)}
            aria-label={`${n} star${n !== 1 ? "s" : ""}`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ReviewModal({
  booking,
  onClose,
  onSuccess,
}: ReviewModalProps) {
  const [tab, setTab] = useState<Tab>("property");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState({
    property: false,
    host: false,
  });

  // Property review state
  const [cleanliness, setCleanliness] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [communication, setCommunication] = useState(0);
  const [checkin, setCheckin] = useState(0);
  const [value, setValue] = useState(0);
  const [overall, setOverall] = useState(0);
  const [propComment, setPropComment] = useState("");

  // Host review state
  const [hostRating, setHostRating] = useState(0);
  const [hostComment, setHostComment] = useState("");

  const propertyRatingsComplete = overall > 0;
  const hostRatingComplete = hostRating > 0;
  const bothDone = submitted.property && submitted.host;

  async function submitPropertyReview() {
    if (!propertyRatingsComplete) {
      setError("Please give an overall rating before submitting.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingid: booking.bid,
          propertyid: booking.propertyid,
          propertyReview: {
            comment: propComment || null,
            cleanlinessrating: cleanliness || null,
            accuracyrating: accuracy || null,
            communicationrating: communication || null,
            checkinrating: checkin || null,
            valuerating: value || null,
            overallrating: overall,
          },
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to submit property review.");
        return;
      }

      setSubmitted((s) => ({ ...s, property: true }));
      setTab("host");
    } finally {
      setSubmitting(false);
    }
  }

  async function submitHostReview() {
    if (!hostRatingComplete) {
      setError("Please give a rating for the host.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingid: booking.bid,
          propertyid: booking.propertyid,
          hostReview: {
            rating: hostRating,
            comment: hostComment || null,
          },
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to submit host review.");
        return;
      }

      setSubmitted((s) => ({ ...s, host: true }));
    } finally {
      setSubmitting(false);
    }
  }

  const thumb = booking.property?.propertyphotos?.[0]?.thumbnailurl;

  return (
    <div className="backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modalHeader">
          <div className="modalMeta">
            {thumb && (
              <img
                src={"https://" + thumb}
                alt={booking.property?.name}
                className="modalThumb"
              />
            )}
            <div>
              <p className="modalPropertyName">
                {booking.property?.name ?? `Property #${booking.propertyid}`}
              </p>
              {booking.property && (
                <p className="modalPropertyLocation">
                  {booking.property.city}, {booking.property.state}
                </p>
              )}
            </div>
          </div>

          <button className="closeBtn" onClick={onClose} type="button">
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${tab === "property" ? "tabActive" : ""} ${
              submitted.property ? "tabDone" : ""
            }`}
            onClick={() => setTab("property")}
            type="button"
          >
            {submitted.property ? "✓ " : ""}Property
          </button>

          <button
            className={`tab ${tab === "host" ? "tabActive" : ""} ${
              submitted.host ? "tabDone" : ""
            }`}
            onClick={() => setTab("host")}
            type="button"
          >
            {submitted.host ? "✓ " : ""}Host
          </button>
        </div>

        {/* Success state */}
        {bothDone ? (
          <div className="successBody">
            <span className="successIcon">✓</span>
            <p className="successTitle">Thanks for your reviews!</p>
            <p className="successSub">
              Your feedback helps other guests and the host.
            </p>
            <button className="doneBtn" onClick={onSuccess} type="button">
              Done
            </button>
          </div>
        ) : (
          <div className="modalBody">
            {/* Property tab */}
            {tab === "property" && (
              <div className="formSection">
                {submitted.property ? (
                  <p className="alreadySubmitted">
                    Property review submitted. Switch to the Host tab.
                  </p>
                ) : (
                  <>
                    <p className="formTitle">Rate your stay</p>

                    <StarRating
                      label="Overall"
                      value={overall}
                      onChange={setOverall}
                    />
                    <StarRating
                      label="Cleanliness"
                      value={cleanliness}
                      onChange={setCleanliness}
                    />
                    <StarRating
                      label="Accuracy"
                      value={accuracy}
                      onChange={setAccuracy}
                    />
                    <StarRating
                      label="Communication"
                      value={communication}
                      onChange={setCommunication}
                    />
                    <StarRating
                      label="Check-in"
                      value={checkin}
                      onChange={setCheckin}
                    />
                    <StarRating
                      label="Value"
                      value={value}
                      onChange={setValue}
                    />

                    <textarea
                      className="textarea"
                      placeholder="Share your experience (optional)"
                      value={propComment}
                      onChange={(e) => setPropComment(e.target.value)}
                      maxLength={200}
                      rows={4}
                    />

                    <p className="charCount">{propComment.length}/200</p>

                    {error && <p className="error">{error}</p>}

                    <button
                      className="submitBtn"
                      onClick={submitPropertyReview}
                      disabled={submitting || !propertyRatingsComplete}
                      type="button"
                    >
                      {submitting ? "Submitting…" : "Submit property review"}
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Host tab */}
            {tab === "host" && (
              <div className="formSection">
                {submitted.host ? (
                  <p className="alreadySubmitted">Host review submitted.</p>
                ) : (
                  <>
                    <p className="formTitle">Rate your host</p>

                    <StarRating
                      label="Host rating"
                      value={hostRating}
                      onChange={setHostRating}
                    />

                    <textarea
                      className="textarea"
                      placeholder="Tell others about your host (optional)"
                      value={hostComment}
                      onChange={(e) => setHostComment(e.target.value)}
                      maxLength={200}
                      rows={4}
                    />

                    <p className="charCount">{hostComment.length}/200</p>

                    {error && <p className="error">{error}</p>}

                    <button
                      className="submitBtn"
                      onClick={submitHostReview}
                      disabled={submitting || !hostRatingComplete}
                      type="button"
                    >
                      {submitting ? "Submitting…" : "Submit host review"}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
