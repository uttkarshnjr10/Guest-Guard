import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import AnimatedText from './AnimatedText'; 
import signupAnimation from './Signup Flow.json';

const FeatureIcon = ({ children }) => <div className={styles.iconWrapper}>{children}</div>;

export default function Home() {
  const featureVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Background Aurora */}
      <div className={styles.auroraBg}>
        <div className={`${styles.aurora} ${styles.aurora1}`}></div>
        <div className={`${styles.aurora} ${styles.aurora2}`}></div>
      </div>

      {/* Hero Section */}
      <motion.header 
        className={styles.hero}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className={styles.heroText}>
          <h1 className={styles.title}>
            <AnimatedText text="Welcome to Centralized Data Management System" />
          </h1>
          <motion.p 
            className={styles.subtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
          >
            We provides a unified platform for hotels and law enforcement to ensure guest safety through seamless digital verification and real-time data sharing.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.8 }}
          >
            <Link to="/login" className={styles.ctaButton}>
              Get Started
            </Link>
          </motion.div>
        </div>
        <motion.div 
          className={styles.heroAnimation}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <Lottie animationData={signupAnimation} loop={true} />
        </motion.div>
      </motion.header>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <h2 className={styles.sectionTitle}>Why Centralized Data Management?</h2>
        <div className={styles.featuresGrid}>
          <motion.div className={styles.featureCard} variants={featureVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <FeatureIcon>📄</FeatureIcon>
            <h3>Effortless Registration</h3>
            <p>Capture guest IDs and live photos in seconds with our webcam integration, eliminating manual uploads and paperwork.</p>
          </motion.div>
          <motion.div className={styles.featureCard} variants={featureVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }}>
            <FeatureIcon>🔗</FeatureIcon>
            <h3>Instant Verification</h3>
            <p>Securely log every guest's details, creating a reliable, tamper-proof digital registry accessible anytime.</p>
          </motion.div>
          <motion.div className={styles.featureCard} variants={featureVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }}>
            <FeatureIcon>🔔</FeatureIcon>
            <h3>Intelligent Alerts</h3>
            <p>Law enforcement agencies receive automated cross-jurisdictional notifications for persons of interest, enhancing collaboration.</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}