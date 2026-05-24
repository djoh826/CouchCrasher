import "../info-page.css";

export default function Hosting() {
  const sections = [
    {
      id: "homes",
      title: "List Your Space",
      description:
        "Turn your home or extra space into a place for guests. Easily manage bookings, pricing, and availability in one spot.",
    },
    {
      id: "experiences",
      title: "Share Experiences",
      description:
        "Host unique activities for travelers—from local tours to cooking classes—and show what makes your city special.",
    },
    {
      id: "services",
      title: "Offer Extra Services",
      description:
        "Provide additional touches for your guests, like transportation, cleaning, or personalized recommendations.",
    },
    {
      id: "resources",
      title: "Hosting Resources",
      description:
        "Get tips, guides, and tools to help you succeed as a Couch Crasher host.",
    },
  ];

  return (
    <div className="info-page">
      <p className="info-page__eyebrow">Hosting</p>
      <h1 className="info-page__hero">Share your space with the world.</h1>
      <p className="info-page__lead">
        Whether it&#39;s a spare room or a full property, hosting on Couch
        Crasher is simple, flexible, and rewarding.
      </p>
      <hr className="info-page__divider" />

      <ul className="info-page__sidenav">
        {sections.map((s) => (
          <li key={s.id}>
            <a href={`#${s.id}`}>{s.title}</a>
          </li>
        ))}
      </ul>

      <div className="info-page__sections">
        {sections.map((s) => (
          <section id={s.id} key={s.id} className="info-page__section">
            <p className="info-page__section-label">Hosting</p>
            <h2>{s.title}</h2>
            <p>{s.description}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
