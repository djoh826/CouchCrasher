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
    <section className="hosting">
      <nav className="hosting-nav">
        <ul>
          {sections.map((section) => (
            <li key={section.id}>
              <a href={`#${section.id}`}>{section.title}</a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sections">
        {sections.map((section) => (
          <section id={section.id} key={section.id} className="section">
            <h2>{section.title}</h2>
            <p>{section.description}</p>
          </section>
        ))}
      </div>
    </section>
  );
}
