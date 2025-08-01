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
    const user = USERS.find((u) => u.username === form.username && u.password === form.password);
    if (user) navigate(user.redirectTo);
    else setError("Invalid username or password");
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h2 className={styles.title}>GuestGuard Login</h2>
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.inputGroup}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.submitBtn}>
            Sign In
          </button>
        </form>

        <div className={styles.demoInfo}>
          <p><strong>Demo Accounts:</strong></p>
          <ul>
            <li><strong>Hotel:</strong> hotel / hotel123</li>
            <li><strong>Police:</strong> police / police123</li>
            <li><strong>Regional:</strong> regional / regional123</li>
            <li><strong>Super Admin:</strong> superadmin / super123</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
