import React from 'react';
import styles from './WhyUs.module.css';
// NEW: Import the animation hook and new icons
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { DocumentTextIcon, ShieldCheckIcon, BellAlertIcon } from '@heroicons/react/24/outline';

// NEW: A reusable animated card component
const AnimatedCard = ({ children, delay = 0 }) => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });
  return (
    <div 
      ref={ref} 
      className={`${styles.featureCard} ${isVisible ? styles.visible : styles.hidden}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
};

// Updated FeatureIcon component for the new icons
const FeatureIcon = (props) => {
  const IconComponent = props.icon;
  return (
    <div className={styles.featureIconWrapper}>
      <IconComponent className={styles.icon} />
    </div>
  );
};
export default function WhyUs() {
  return (
    <div className={styles.pageWrapper}>
      <section className={styles.featuresSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Why GuestGuard?</h2>
            <p className={styles.sectionSubtitle}>
              The future of secure, intelligent, and seamless guest management is here.
            </p>
          </div>
          <div className={styles.featuresGrid}>
            {/* Feature Card 1: Updated with new component and icon */}
            <AnimatedCard delay={0.1}>
              <FeatureIcon icon={DocumentTextIcon} />
              <h3 className={styles.cardTitle}>Effortless Registration</h3>
              <p className={styles.cardDescription}>
                Streamline guest onboarding with our AI-powered ID scanning and live photo integration, eliminating paperwork.
              </p>
            </AnimatedCard>

            {/* Feature Card 2: Updated with new component and icon */}
            <AnimatedCard delay={0.2}>
              <FeatureIcon icon={ShieldCheckIcon} />
              <h3 className={styles.cardTitle}>Instant Verification</h3>
              <p className={styles.cardDescription}>
                Securely log and verify guest details in real-time, creating a tamper-proof digital registry accessible anytime.
              </p>
            </AnimatedCard>

            {/* Feature Card 3: Updated with new component and icon */}
            <AnimatedCard delay={0.3}>
              <FeatureIcon icon={BellAlertIcon} />
              <h3 className={styles.cardTitle}>Intelligent Alerts</h3>
              <p className={styles.cardDescription}>
                Empower law enforcement with smart, real-time notifications for persons of interest, enhancing security.
              </p>
            </AnimatedCard>
          </div>
        </div>
      </section>

     {/* Testimonials Section for social proof - commented out */}
{/*
     <section className={styles.testimonialsSection}>
        <div className={styles.container}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Trusted by Leading Hoteliers</h2>
            </div>
            <div className={styles.testimonialsGrid}>
                <div className={styles.testimonialCard}>
                    <p className={styles.testimonialText}>"GuestGuard revolutionized our check-in process. What used to take minutes now takes seconds. Our staff and guests couldn't be happier!"</p>
                    <p className={styles.testimonialAuthor}>- Manager, The Grand Hotel</p>
                </div>
                <div className={styles.testimonialCard}>
                    <p className={styles.testimonialText}>"The security and verification features are top-notch. It gives us peace of mind knowing our guest registry is secure and compliant."</p>
                    <p className={styles.testimonialAuthor}>- Owner, Lakeside Resorts</p>
                </div>
            </div>
        </div>
      </section>
*/}

      {/* Meet Our Team Section (largely the same, but now animated!) */}
      <section className={styles.aboutSection}>
        <div className={styles.container}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Meet Our Team</h2>
                <p className={styles.sectionSubtitle}>
                    Dedicated professionals building the future of security.
                </p>
            </div>
            <div className={styles.aboutGrid}>
                <AnimatedCard delay={0.1}>
                    <div className={`${styles.avatar} ${styles.satyaAvatar}`}></div>
                    <h3 className={styles.cardTitle}>Satya Dev</h3>
                    <p className={styles.cardSubtitle}>Project Lead & Testing</p>
                </AnimatedCard>
                <AnimatedCard delay={0.2}>
                    <div className={`${styles.avatar} ${styles.uttkarshAvatar}`}></div>
                    <h3 className={styles.cardTitle}>Uttkarsh Kumar</h3>
                    <p className={styles.cardSubtitle}>Full-Stack Developer</p>
                </AnimatedCard>
            </div>
        </div>
      </section>
    </div>
  );
}