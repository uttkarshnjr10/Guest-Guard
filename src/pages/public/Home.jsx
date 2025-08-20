// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you are using React Router
import styles from './Home.module.css';

// Simple SVG Icons for visual appeal
const ShieldIcon = () => (
  <svg className={styles.featureIcon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.917l9 3 9-3a12.02 12.02 0 00-2.382-9.971z" />
  </svg>
);

const BoltIcon = () => (
  <svg className={styles.featureIcon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const UsersIcon = () => (
  <svg className={styles.featureIcon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.995 5.995 0 0012 12a5.995 5.995 0 00-3-5.197M15 21a9 9 0 00-9-9" />
  </svg>
);


export default function Home() {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Welcome to Centralized Data Managment</h1>
          <p className={styles.subtitle}>
            The unified platform for digital guest registration, enhancing security and cooperation between hotels and law enforcement across India.
          </p>
          {/* Note: If your app uses state-based navigation instead of routes, 
              you might need to change this Link to a button with an onClick handler. */}
          <Link to="/login" className={styles.ctaButton}>
            Get Your Acess
          </Link>
        </div>
      </header>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <h2 className={styles.sectionTitle}>Why Choose Centralized Data Managment?</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <ShieldIcon />
            <h3>Secure & Centralized</h3>
            <p>All guest information is encrypted and stored in a single, unified database, replacing insecure physical ledgers.</p>
          </div>
          <div className={styles.featureCard}>
            <BoltIcon />
            <h3>Instant Verification</h3>
            <p>Authorized police personnel can access verified guest data in real-time, saving critical time during investigations.</p>
          </div>
          <div className={styles.featureCard}>
            <UsersIcon />
            <h3>Role-Based Access</h3>
            <p>Each user type—Hotel, Police, and Admin—gets a dedicated portal with tools and controls relevant to their responsibilities.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
    <footer className={styles.footer}>
  <p>© {new Date().getFullYear()} Centralized Data Management. All rights reserved.</p>
  
</footer>
    </div>
  );
}