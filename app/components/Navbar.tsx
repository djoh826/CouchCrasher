import Link from "next/link";

export default async function Navbar({ loggedIn }: { loggedIn: boolean }) {
  return (
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
            {loggedIn ? (
              <Link href="/profile">Profile</Link>
            ) : (
              <Link href="/login">Log in</Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}
