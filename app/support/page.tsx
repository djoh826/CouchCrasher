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
    <section className="support">
      <nav>
        <ul>
          {sections.map((section) => (
            <li key={section.id}>
              <a href={`#${section.id}`}>{section.title}</a>
            </li>
          ))}
        </ul>
      </nav>

      <div>
        {sections.map((section) => (
          <section key={section.id} id={section.id}>
            <h2>{section.title}</h2>
            <p>{section.description}</p>
          </section>
        ))}
      </div>
    </section>
  );
}
