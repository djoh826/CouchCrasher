import "../info-page.css";

export default function LeadershipPage() {
  const sections = [
    {
      label: "Our Approach",
      title: "Small team, big mission",
      description:
        "Couch Crasher is run by a lean, focused team that believes the best products come from staying close to the problem. We move fast, make deliberate decisions, and keep the people using our platform at the center of everything.",
    },
    {
      label: "Vision",
      title: "Where we're headed",
      description:
        "Our leadership is aligned around one goal: making travel feel more human. That means investing in trust, simplicity, and the kind of experiences that keep both hosts and guests coming back.",
    },
    {
      label: "Culture",
      title: "How we work",
      description:
        "We're a flat, collaborative team. Everyone has a voice in shaping the product and the company. We value honest feedback, clear communication, and work that makes a real difference for our community.",
    },
  ];

  return (
    <div className="info-page">
      <p className="info-page__eyebrow">Leadership</p>
      <h1 className="info-page__hero">Driven by purpose, not titles.</h1>
      <p className="info-page__lead">
        We&#39;re a small, focused team building something we genuinely believe
        in — a more personal, community-driven way to travel.
      </p>
      <hr className="info-page__divider" />

      <div className="info-page__team">
        {sections.map((s) => (
          <div key={s.title} className="info-page__team-card">
            <p className="info-page__section-label">{s.label}</p>
            <h2>{s.title}</h2>
            <p>{s.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
