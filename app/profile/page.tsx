"use client";

import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function Profile() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!user) {
    return (
      <div className={styles.container}>
        <p>You are not logged in.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        <h2>Profile</h2>
        <p>
          <strong>User ID:</strong> {user.uid}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Log out
        </button>
      </div>
    </div>
  );
}
