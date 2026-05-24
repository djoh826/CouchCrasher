import "../info-page.css";

export default function CareersPage() {
  return (
    <div className="info-page">
      <p className="info-page__eyebrow">Careers</p>
      <h1 className="info-page__hero">Come build with us.</h1>
      <p className="info-page__lead">
        We&#39;re a small team working on something meaningful. If you love
        building products that connect people, we&#39;d love to hear from you.
      </p>
      <hr className="info-page__divider" />

      <div className="info-page__sections">
        <section className="info-page__section">
          <p className="info-page__section-label">Who we&#39;re looking for</p>
          <h2>Builders & problem solvers</h2>
          <p>
            We&#39;re passionate about building products that solve real
            problems and create great user experiences. If that sounds like you,
            you&#39;ll fit right in.
          </p>
        </section>
        <section className="info-page__section">
          <p className="info-page__section-label">Open Roles</p>
          <h2>Positions</h2>
          <p>
            We don&#39;t have any open positions listed right now, but check
            back soon — we&#39;re growing.
          </p>
        </section>
      </div>
    </div>
  );
}
