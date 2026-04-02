"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { getUserProperties, UserPropertiesResponse } from "@/lib/apiEndpoints";
import UserPropertyForm from "@/app/components/UserPropertyForm";
import { useAuth } from "@/lib/AuthContext";
import Link from "next/link";

export default function Host() {
  const { user } = useAuth();
  const [userProperties, setUserProperties] =
    useState<UserPropertiesResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      setUserProperties(null);
      return;
    }

    const fetchUserProperties = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getUserProperties();
        setUserProperties(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load user's properties");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProperties();
  }, [user]);

  return (
    <section className={styles.host}>
      <div className={styles.form}>
        {!user && (
          <div>
            <p>Log in to view or create property listings.</p>
            <Link href="/login" className={styles.button}>
              Log In
            </Link>
          </div>
        )}

        {user && loading && <p>Loading properties...</p>}
        {user && error && <p>{error}</p>}

        {user && !loading && !error && userProperties && (
          <div className={styles.properties}>
            <h1>Your Properties</h1>
            <UserPropertyForm data={userProperties} />
          </div>
        )}
      </div>

      {user && (
        <div className={styles.newListing}>
          <Link href="/host/create" className={styles.button}>
            Create a new property listing
          </Link>
        </div>
      )}
    </section>
  );
}
