import "../info-page.css";

export default function ValuesPage() {
  const values = [
    {
      title: "Community First",
      description: "We believe travel should connect people and cultures.",
    },
    {
      title: "Trust & Safety",
      description:
        "Creating a safe environment for hosts and guests is our top priority.",
    },
    {
      title: "Simplicity",
      description: "We build products that are easy and intuitive to use.",
    },
    {
      title: "Accessibility",
      description: "Travel should be available to everyone.",
    },
  ];

  return (
    <div className="info-page">
      <p className="info-page__eyebrow">Our Values</p>
      <h1 className="info-page__hero">What we stand for.</h1>
      <p className="info-page__lead">
        These principles guide every decision we make — from product to policy.
      </p>
      <hr className="info-page__divider" />

      <ul className="info-page__values">
        {values.map((v) => (
          <li key={v.title} className="info-page__value-card">
            <strong>{v.title}</strong>
            <span>{v.description}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
