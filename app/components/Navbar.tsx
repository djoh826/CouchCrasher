"use client";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { isLoggedIn } = useAuth();

  return (
    <div className="site-header">
      <nav className="primary-nav" aria-label="Primary navigation">
        <ul className="nav-list">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/browse">Browse Properties</Link>
          </li>
          <li>
            <Link href="/host">My Listings</Link>
          </li>
          <li>
            {isLoggedIn ? (
              <Link href="/profile">Profile</Link>
            ) : (
              <Link href="/login">Log in</Link>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
}
