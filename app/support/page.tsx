import "../info-page.css";

export default function Support() {
  const sections = [
    {
      id: "help-center",
      title: "Help Center",
      description:
        "Find answers to common questions about bookings, hosting, payments, and using Couch Crasher.",
    },
    {
      id: "safety",
      title: "Safety Support",
      description:
        "Get help if you're dealing with a safety concern. Our team can guide you through the steps to resolve issues and stay safe.",
    },
    {
      id: "report",
      title: "Report a Concern",
      description:
        "Let us know if something isn't right. You can report issues with listings, guests, hosts, or platform behavior.",
    },
    {
      id: "anti-discrimination",
      title: "Anti-Discrimination Policy",
      description:
        "Couch Crasher is committed to an inclusive community. Learn about our anti-discrimination policies and how we enforce them.",
    },
    {
      id: "insurance",
      title: "Travel Insurance",
      description:
        "Understand what travel protections are available and how insurance can help cover unexpected issues during your trip.",
    },
  ];

  return (
    <div className="info-page">
      <p className="info-page__eyebrow">Support</p>
      <h1 className="info-page__hero">How can we help?</h1>
      <p className="info-page__lead">
        Browse topics below or jump straight to the section you need.
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
            <p className="info-page__section-label">Support</p>
            <h2>{s.title}</h2>
            <p>{s.description}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
