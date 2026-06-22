"use client";

import Image from "next/image";
import Link from "next/link";
import "./HostSection.css";

interface HostSectionProps {
  hostUid: number;
  name: string;
  pictureurl?: string | null;
  avghostratings?: number | null;
  numhostratings?: number | null;
  avgpropertyrating?: number | null;
}

function StarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="#f5a623"
      stroke="#f5a623"
      strokeWidth="1"
      aria-hidden="true"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function Avatar({
  src,
  name,
  size,
}: {
  src?: string | null;
  name: string;
  size: "sm" | "lg";
}) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const px = size === "lg" ? 96 : 40;

  if (src) {
    return (
      <div
        className={size === "lg" ? "avatarLg" : "avatarSm"}
        style={{ width: px, height: px }}
      >
        <Image
          src={src.startsWith("http") ? src : "https://" + src}
          alt={name}
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
    );
  }

  return (
    <div
      className={`${size === "lg" ? "avatarLg" : "avatarSm"} avatarFallback`}
      style={{ width: px, height: px }}
    >
      {initials}
    </div>
  );
}

export function HostPill({
  name,
  pictureurl,
  avghostratings,
  numhostratings,
}: Omit<HostSectionProps, "hostUid" | "avgpropertyrating">) {
  function handleClick() {
    document
      .getElementById("meet-the-host")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <button className="pill" onClick={handleClick} type="button">
      <Avatar src={pictureurl} name={name} size="sm" />

      <div className="pillText">
        <span className="pillName">{name}</span>

        {avghostratings != null && numhostratings != null && (
          <span className="pillMeta">
            <StarIcon />
            {avghostratings.toFixed(1)} · {numhostratings} host review
            {numhostratings !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="pillChevron"
        aria-hidden="true"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
  );
}

export function HostSection({
  hostUid,
  name,
  pictureurl,
  avghostratings,
  numhostratings,
  avgpropertyrating,
}: HostSectionProps) {
  return (
    <section id="meet-the-host" className="section">
      <h2 className="sectionTitle">Meet your host</h2>

      <div className="card">
        <div className="cardLeft">
          <Avatar src={pictureurl} name={name} size="lg" />

          <div className="cardName">{name}</div>

          <Link href={`/hosts/${hostUid}/reviews`} className="reviewsLink">
            View host reviews
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>

        <div className="cardDivider" />

        <div className="cardStats">
          {avghostratings != null && (
            <div className="stat">
              <span className="statValue">
                <StarIcon />
                {avghostratings.toFixed(2)}
              </span>

              <span className="statLabel">Host rating</span>
            </div>
          )}

          {numhostratings != null && (
            <div className="stat">
              <span className="statValue">{numhostratings}</span>

              <span className="statLabel">
                Host review{numhostratings !== 1 ? "s" : ""}
              </span>
            </div>
          )}

          {avgpropertyrating != null && (
            <div className="stat">
              <span className="statValue">
                <StarIcon />
                {avgpropertyrating.toFixed(2)}
              </span>

              <span className="statLabel">Avg property rating</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
