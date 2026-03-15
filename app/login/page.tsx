"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

export default function Login() {
  //TODO: Refactor below
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

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      login({ uid: data.uid, email: loginEmail });

      // Redirect to home page after login
      router.push("/");
    } catch (err) {
      console.error(err);
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

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      // const token = data.token;

      // Redirect to home page and refresh (to load new jwt cookie) after login
      router.push("/");
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    }
  };

  return (
    <div className="layout">
      {/* <Navbar /> */}
      <main>
        <div className="background">
          <section className="login-bubble">
            <div className="title">
              <h3>Log in or Sign up</h3>
            </div>
            <div className="flexbox">
              <div className="login">
                <h3>Already have an account? Log in</h3>
                <form className="login" onSubmit={handleLogin}>
                  <label className="email-label">
                    Email
                    <input
                      type="text"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="email-input"
                    ></input>
                  </label>
                  <label className="password-label">
                    Password
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="password-input"
                    ></input>
                  </label>
                  <button type="submit">Log in</button>
                </form>
              </div>
              <div className="register">
                <h3>Don&apos;t have an account? Register</h3>
                <form className="register" onSubmit={handleRegister}>
                  <label className="email-label">
                    Email
                    <input
                      type="text"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      className="email-input"
                    ></input>
                  </label>
                  <label className="password-label">
                    Password
                    <input
                      type="password"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      className="password-input"
                    ></input>
                  </label>
                  <label className="name-label">
                    Full Name
                    <input
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      className="name-input"
                      placeholder="John Smith"
                    ></input>
                  </label>
                  <label className="phone-label">
                    Phone
                    <input
                      value={registerPhone}
                      onChange={(e) => setRegisterPhone(e.target.value)}
                      className="phone-input"
                      placeholder="1231231234"
                    ></input>
                  </label>
                  <label className="dob-label">
                    Date of Birth
                    <input
                      value={registerDOB}
                      onChange={(e) => setRegisterDOB(e.target.value)}
                      className="dob-input"
                      placeholder="YYYY-MM-DD"
                    ></input>
                  </label>

                  <button type="submit">Register</button>
                </form>
              </div>
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </section>
        </div>
      </main>
    </div>
  );
}
