"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { isLoggedIn } = useAuth();
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const handleScroll = (): void => {
      nav.classList.toggle("scrolled", window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="site-header">
      <nav className="primary-nav" ref={navRef} aria-label="Primary navigation">
        <ul className="nav-list">
          <li className="nav-brand">
            <Link href="/">Couch Crasher</Link>
          </li>

          <li style={{ display: "contents" }}>
            <ul className="nav-links">
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
                <Link href="/user-bookings">My Guest Bookings</Link>
              </li>
            </ul>
          </li>

          <li className="nav-cta">
            {isLoggedIn ? (
              <Link href="/profile">Profile</Link>
            ) : (
              <Link href="/login" className="btn-login">
                Log in
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
}
