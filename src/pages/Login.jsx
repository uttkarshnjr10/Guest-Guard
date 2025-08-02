// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

const USERS = [
  { username: "hotel", password: "hotel123", role: "Hotel Staff", redirectTo: "/hotel" },
  { username: "police", password: "police123", role: "Police", redirectTo: "/police" },
  { username: "regional", password: "regional123", role: "Regional Admin", redirectTo: "/regional-admin" },
  { username: "superadmin", password: "super123", role: "Super Admin", redirectTo: "/super-admin" },
];

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = USERS.find(
      (u) => u.username === form.username && u.password === form.password
    );
    if (user) {
      navigate(user.redirectTo);
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className={styles.container}>
      {/* Animated background circles */}
      <div className={`${styles.circle} ${styles.c1}`}></div>
      <div className={`${styles.circle} ${styles.c2}`}></div>
      <div className={`${styles.circle} ${styles.c3}`}></div>

      <div className={styles.loginBox}>
        <div className={styles.header}>
          <h2>GuestGuard Login</h2>
          <p>Secure Access for Authorized Personnel</p>
        </div>
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.inputGroup}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              required
              autoComplete="username"
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.submitBtn}>
            Sign In
          </button>
        </form>
        <div className={styles.demoInfo}>
          <p><strong>Demo Accounts:</strong> hotel / police / regional / superadmin</p>
        </div>
      </div>
    </div>
  );
}
