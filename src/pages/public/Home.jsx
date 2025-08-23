import { Link } from 'react-router-dom';
import styles from './Home.module.css';
import { motion } from 'framer-motion'; // Add this import
import Lottie from 'lottie-react';
import AnimatedText from './AnimatedText';
import signupAnimation from './Signup Flow.json';

export default function Home() {
  return (
    <div className={styles.pageWrapper}>
      {/* Upper right "Why Us" button */}
      <div className={styles.topRightButton}>
        <Link to="/why-us" className={styles.whyUsButton}>
          Why Us
        </Link>
      </div>

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
    </div>
  );
}