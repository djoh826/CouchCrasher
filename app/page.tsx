import Link from "next/link";

export default function Home() {
  return (
    <div className="layout">
      <header className="site-header">
        <nav className="primary-nav" aria-label="Primary navigation">
          <ul className="nav-list">
            <li>
              <Link href="/browse">Browse properties</Link>
            </li>
            <li>
              <Link href="/host">Create a listing</Link>
            </li>
            <li>
              <Link href="/profile">Profile</Link>
            </li>
          </ul>
        </nav>
      </header>

      <main className="main-content">
        <section className="hero">
          <h1>Live comfortably like at home, wherever you go</h1>
          <Link href="/browse" className="cta-primary">
            Book now
          </Link>
        </section>

        <section className="search-box" aria-label="Search stays">
          <form className="search-form">
            <div className="input-group">
              <label htmlFor="location">Where do you want to stay?</label>
              <input id="location" type="text" />
            </div>

            <div className="input-group">
              <label htmlFor="dates">When do you want to stay?</label>
              <input id="dates" type="text" />
            </div>

            <div className="input-group">
              <label htmlFor="guests">How many guests?</label>
              <input id="guests" type="number" min={1} />
            </div>
          </form>
        </section>

        <section className="host-cta">
          <h2>Interested in hosting?</h2>
          <Link href="/host" className="cta-secondary">
            List your property
          </Link>
        </section>
      </main>
    </div>
  );
}
