import styles from './WhyUs.module.css';

const FeatureIcon = ({ children }) => (
  <div className={styles.iconWrapper}>{children}</div>
);

export default function WhyUs() {
  return (
    <div className={styles.pageWrapper}>
      <section className={styles.featuresSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Why Choose Us?</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <FeatureIcon>📄</FeatureIcon>
              <h3 className={styles.cardTitle}>Effortless Registration</h3>
              <p className={styles.cardDescription}>
                Streamline guest onboarding with quick ID capture and live photo integration, eliminating manual uploads and paperwork.
              </p>
            </div>
            <div className={styles.featureCard}>
              <FeatureIcon>🔗</FeatureIcon>
              <h3 className={styles.cardTitle}>Instant Verification</h3>
              <p className={styles.cardDescription}>
                Securely log and verify guest details in real-time, creating a tamper-proof digital registry accessible anytime.
              </p>
            </div>
            <div className={styles.featureCard}>
              <FeatureIcon>🔔</FeatureIcon>
              <h3 className={styles.cardTitle}>Intelligent Alerts</h3>
              <p className={styles.cardDescription}>
                Empower law enforcement with smart, real-time notifications for persons of interest, enhancing security collaboration.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.aboutSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Meet Our Team</h2>
          <div className={styles.aboutGrid}>
            <div className={styles.teamCard}>
              <div className={styles.avatar}></div>
              <h3 className={styles.cardTitle}>Satya Dev</h3>
              <p className={styles.cardSubtitle}>Visionary Project Lead & Tester</p>
              <p className={styles.cardDescription}>
                Satya, the mastermind behind the project’s vision, spearheaded the ideation and non-technical coordination. His meticulous testing ensures a robust and reliable system.
              </p>
              <a href="mailto:satya@mail29.com" className={styles.emailLink}>
                satya@mail29.com
              </a>
            </div>
            <div className={styles.teamCard}>
              <div className={styles.avatar}></div>
              <h3 className={styles.cardTitle}>Uttkarsh Kumar</h3>
              <p className={styles.cardSubtitle}>Full-Stack Developer</p>
              <p className={styles.cardDescription}>
                Uttkarsh, the technical backbone, single-handedly developed the entire platform, bringing seamless functionality and innovation to life with his full-stack expertise.
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