"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import styles from "./page.module.css";

export default function Login() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [registerDOB, setRegisterDOB] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error || "Login failed");
      login({ uid: data.uid, email: loginEmail, token: data.token });
      router.push("/");
    } catch {
      setError("Something went wrong");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: registerEmail,
          password: registerPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error || "Register failed");
      router.push("/");
    } catch {
      setError("Something went wrong");
    }
  };

  return (
    <div className={styles.background}>
      <section className={styles.loginBubble}>
        <div className={styles.loginBubbleTitle}>
          <h3>Log in or Sign up</h3>
        </div>

        <div className={styles.flexbox}>
          {/* Login */}
          <div className={styles.column}>
            <h3 className={styles.sectionTitle}>
              Already have an account? Log in
            </h3>
            <form className={styles.form} onSubmit={handleLogin}>
              <label className={styles.label}>
                Email
                <input
                  type="text"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className={`${styles.input} ${styles.inputFocus}`}
                />
              </label>
              <label className={styles.label}>
                Password
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className={`${styles.input} ${styles.inputFocus}`}
                />
              </label>
              <button type="submit" className={styles.button}>
                Log in
              </button>
            </form>
          </div>

          {/* Register */}
          <div className={styles.column}>
            <h3 className={styles.sectionTitle}>
              Don&apos;t have an account? Register
            </h3>
            <form className={styles.form} onSubmit={handleRegister}>
              <label className={styles.label}>
                Email
                <input
                  type="text"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  className={`${styles.input} ${styles.inputFocus}`}
                />
              </label>
              <label className={styles.label}>
                Password
                <input
                  type="password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  className={`${styles.input} ${styles.inputFocus}`}
                />
              </label>
              <label className={styles.label}>
                Full Name
                <input
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  className={`${styles.input} ${styles.inputFocus}`}
                  placeholder="John Smith"
                />
              </label>
              <label className={styles.label}>
                Phone
                <input
                  value={registerPhone}
                  onChange={(e) => setRegisterPhone(e.target.value)}
                  className={`${styles.input} ${styles.inputFocus}`}
                  placeholder="1231231234"
                />
              </label>
              <label className={styles.label}>
                Date of Birth
                <input
                  value={registerDOB}
                  onChange={(e) => setRegisterDOB(e.target.value)}
                  className={`${styles.input} ${styles.inputFocus}`}
                  placeholder="YYYY-MM-DD"
                />
              </label>
              <button type="submit" className={styles.button}>
                Register
              </button>
            </form>
          </div>
        </div>

        {error && <p className={styles.errorMessage}>{error}</p>}
      </section>
    </div>
  );
}
