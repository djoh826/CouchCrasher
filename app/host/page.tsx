"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { getUserProperties, UserPropertiesResponse } from "@/lib/apiEndpoints";
import UserPropertyForm from "@/app/components/UserPropertyForm";
import { useAuth } from "@/lib/AuthContext";

export default function Host() {
  const { user } = useAuth();
  const [userProperties, setUserProperties] =
    useState<UserPropertiesResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProperties = async () => {
      if (!user?.token) return; // dont fetch if no token

      setLoading(true);
      setError(null);

      try {
        const data = await getUserProperties(user.token);
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
        {loading && <p>Loading properties...</p>}
        {error && <p>{error}</p>}
        {!loading && !error && userProperties && (
          <UserPropertyForm data={userProperties} />
        )}
      </div>
    </section>
  );
}
