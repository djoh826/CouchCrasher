import "../info-page.css";

export default function AboutPage() {
  return (
    <div className="info-page">
      <p className="info-page__eyebrow">About Us</p>
      <h1 className="info-page__hero">
        We believe travel should feel personal.
      </h1>
      <p className="info-page__lead">
        Couch Crasher connects travelers with welcoming hosts — making stays
        more human, more affordable, and more community-driven.
      </p>
      <hr className="info-page__divider" />

      <div className="info-page__sections">
        <section className="info-page__section">
          <p className="info-page__section-label">Our Story</p>
          <h2>Where it started</h2>
          <p>
            Couch Crasher was built on a simple idea: that staying somewhere
            shouldn&#39;t feel like checking into a hotel. We set out to create
            a platform that helps travelers find genuine, welcoming places to
            stay while giving hosts an easy way to share their space.
          </p>
        </section>
        <section className="info-page__section">
          <p className="info-page__section-label">Our Mission</p>
          <h2>What drives us</h2>
          <p>
            Our goal is to make travel more personal, affordable, and
            community-driven by connecting people from around the world — one
            couch at a time.
          </p>
        </section>
      </div>
    </div>
  );
}
