// WhyUs.jsx
import styles from './Home.module.css';

const FeatureIcon = ({ children }) => <div className={styles.iconWrapper}>{children}</div>;

export default function WhyUs() {

  return (
    <section className={styles.featuresSection}>
      <h2 className={styles.sectionTitle}>Why Centralized Data Management?</h2>
      <div className={styles.featuresGrid}>
        <div className={styles.featureCard}>
          <FeatureIcon>📄</FeatureIcon>
          <h3>Effortless Registration</h3>
          <p>Capture guest IDs and live photos quickly, eliminating manual uploads and paperwork.</p>
        </div>
        <div className={styles.featureCard}>
          <FeatureIcon>🔗</FeatureIcon>
          <h3>Instant Verification</h3>
          <p>Securely log every guest's details, creating a tamper-proof digital registry accessible anytime.</p>
        </div>
        <div className={styles.featureCard}>
          <FeatureIcon>🔔</FeatureIcon>
          <h3>Intelligent Alerts</h3>
          <p>Law enforcement agencies receive smart notifications for persons of interest, enhancing collaboration.</p>
        </div>
      </div>
    </section>
  );
}
