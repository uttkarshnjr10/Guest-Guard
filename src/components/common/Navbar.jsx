import React from "react";
import styles from "./Navbar.module.css";

export default function Navbar({ username, role }) {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>GuestGuard</div>
      <div className={styles.userInfo}>
        <span className={styles.role}>{role}</span>
        <span className={styles.username}>{username}</span>
      </div>
    </nav>
  );
}
