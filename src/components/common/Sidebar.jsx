// src/components/common/Sidebar.jsx 

import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";

export default function Sidebar({ links }) {
  return (
    <aside className={styles.sidebar}>
      <nav>
        <ul>
          {links.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) => (isActive ? styles.active : undefined)}
                end
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
