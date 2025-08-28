import React from 'react';
import styles from './WhyUs.module.css';

// Component for feature icons with a professional touch
const FeatureIcon = ({ children }) => (
  <div className={styles.featureIconWrapper}>{children}</div>
);

export default function App() {
  return (
    <div className={styles.pageWrapper}>
      {/* Why Choose Us Section */}
      <section className={styles.featuresSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Why Choose Us?</h2>
            <p className={styles.sectionSubtitle}>
              A secure and intelligent guest management solution.
            </p>
          </div>
          <div className={styles.featuresGrid}>
            {/* Feature Card 1: Effortless Registration */}
            <div className={styles.featureCard}>
              <FeatureIcon>
                <svg className={styles.icon} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 2v10h8V7.414L10.586 4H6zM8 9h4a1 1 0 110 2H8a1 1 0 010-2zm0 4h4a1 1 0 110 2H8a1 1 0 010-2z" clipRule="evenodd" />
                </svg>
              </FeatureIcon>
              <h3 className={styles.cardTitle}>Effortless Registration</h3>
              <p className={styles.cardDescription}>
                Streamline guest onboarding with quick ID capture and live photo integration, eliminating manual uploads and paperwork.
              </p>
            </div>
            {/* Feature Card 2: Instant Verification */}
            <div className={styles.featureCard}>
              <FeatureIcon>
                <svg className={styles.icon} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                </svg>
              </FeatureIcon>
              <h3 className={styles.cardTitle}>Instant Verification</h3>
              <p className={styles.cardDescription}>
                Securely log and verify guest details in real-time, creating a tamper-proof digital registry accessible anytime.
              </p>
            </div>
            {/* Feature Card 3: Intelligent Alerts */}
            <div className={styles.featureCard}>
              <FeatureIcon>
                <svg className={styles.icon} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.172a3 3 0 011.838.544l.955-.956a1 1 0 111.414 1.414l-.956.955A3 3 0 0116.828 8H18a1 1 0 110 2h-1.172a3 3 0 01-.544 1.838l.956.955a1 1 0 01-1.414 1.414l-.955-.956A3 3 0 0112 16.828V18a1 1 0 11-2 0v-1.172a3 3 0 01-1.838-.544l-.955.956a1 1 0 01-1.414-1.414l.956-.955A3 3 0 013.172 12H2a1 1 0 110-2h1.172a3 3 0 01.544-1.838l-.956-.955a1 1 0 011.414-1.414l.955.956A3 3 0 018 3.172V2a1 1 0 112 0z" clipRule="evenodd" />
                </svg>
              </FeatureIcon>
              <h3 className={styles.cardTitle}>Intelligent Alerts</h3>
              <p className={styles.cardDescription}>
                Empower law enforcement with smart, real-time notifications for persons of interest, enhancing security collaboration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Team Section */}
      <section className={styles.aboutSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Meet Our Team</h2>
            <p className={styles.sectionSubtitle}>
              Dedicated professionals building the future of security.
            </p>
          </div>
          <div className={styles.aboutGrid}>
            {/* Team Member 1: Satya Dev */}
            <div className={styles.teamCard}>
              <div className={`${styles.avatar} ${styles.satyaAvatar}`}></div>
              <h3 className={styles.cardTitle}>Satya Dev</h3>
              <p className={styles.cardSubtitle}>Project Lead & Test Engineer</p>
              <p className={styles.cardDescription}>
                A curious and hardworking problem-solver, Satya leads our project vision with a focus on meticulous testing and ensuring a robust, reliable system. He is constantly exploring new technologies to enhance our platform.
              </p>
              <a href="mailto:satya@mail29.com" className={styles.emailLink}>
                satya@mail29.com
              </a>
            </div>
            {/* Team Member 2: Uttkarsh Kumar */}
            <div className={styles.teamCard}>
              <div className={`${styles.avatar} ${styles.uttkarshAvatar}`}></div>
              <h3 className={styles.cardTitle}>Uttkarsh Kumar</h3>
              <p className={styles.cardSubtitle}>Full-Stack Developer</p>
              <p className={styles.cardDescription}>
                Uttkarsh is a dedicated and skilled full-stack developer, the technical backbone of the team. He is passionate about bringing seamless functionality and innovative solutions to life through his deep expertise.
              </p>
              <a href="mailto:uttkarsh.iist26@gmail.com" className={styles.emailLink}>
                uttkarsh.iist26@gmail.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}