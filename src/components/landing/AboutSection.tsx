import { motion, type Variants } from "framer-motion";
import { TrendingUp, Zap, Clock, Globe, Users, BarChart2, Check } from "lucide-react";
import styles from "./AboutSection.module.css";

const slideLeftVariants: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: [0.215, 0.61, 0.355, 1] as const, // easeOutCubic approx
    },
  },
};

const slideRightVariants: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: [0.215, 0.61, 0.355, 1] as const,
      staggerChildren: 0.1,
    },
  },
};

const statItemVariants: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.35 },
  },
};

export default function AboutSection() {
  return (
    <section id="about" className="ds-section" style={{ overflowX: "hidden" }}>
      <div className="ds-shell">
        <motion.div
          className="ds-section-header ds-fade-in"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="ds-section-eyebrow">About DailyScope</p>
          <h2 className="ds-section-title">
            Built for readers who value depth over noise.
          </h2>
          <p className="ds-section-subtitle">
            DailyScope is your calm, curated layer on top of the world’s most trusted
            newsrooms.
          </p>
        </motion.div>

        <div className={styles.contentGrid}>
          {/* Left Column: Quote + Editorial Standard */}
          <motion.div
            className={styles.leftColumn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={slideLeftVariants}
          >
            <div className={styles.quoteBlock}>
              &quot;We aggregate thousands of sources, surface what matters, and filter out the duplicate, the trivial, and
              the sensational — so every scroll feels intentional.&quot;
            </div>

            <div className={styles.standardCard}>
              <h3 className={styles.cardTitle}>The Editorial Standard</h3>
              <div className={styles.list}>
                <div className={styles.listItem}>
                  <span className={styles.check}>
                    <Check size={10} strokeWidth={3} />
                  </span>
                  <span>Balanced coverage from global, local, and specialist outlets.</span>
                </div>
                <div className={styles.listItem}>
                  <span className={styles.check}>
                    <Check size={10} strokeWidth={3} />
                  </span>
                  <span>Smart topics from tech and markets to culture and climate.</span>
                </div>
                <div className={styles.listItem}>
                  <span className={styles.check}>
                    <Check size={10} strokeWidth={3} />
                  </span>
                  <span>Reader controls for font size, dark mode, and audio briefings.</span>
                </div>
                <div className={styles.listItem}>
                  <span className={styles.check}>
                    <Check size={10} strokeWidth={3} />
                  </span>
                  <span>Designed for clarity, with strong hierarchy and zero clutter.</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Live Metrics */}
          <motion.div
            className={styles.metricsCard}
            variants={slideRightVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className={styles.metricsHeader}>
              <span className={styles.metricsTitle}>Live Metrics</span>
              <div className={styles.systemActive}>
                <span className={styles.greenDot} />
                System Active
              </div>
            </div>

            <div className={styles.statsGrid}>
              <motion.div className={styles.statItem} variants={statItemVariants}>
                <TrendingUp className={styles.statIcon} size={20} />
                <p className={styles.statValue}>50k+</p>
                <p className={styles.statLabel}>Stories Scanned</p>
              </motion.div>

              <motion.div className={styles.statItem} variants={statItemVariants}>
                <Zap className={styles.statIcon} size={20} />
                <p className={styles.statValue}>60</p>
                <p className={styles.statLabel}>Updates / Hour</p>
              </motion.div>

              <motion.div className={styles.statItem} variants={statItemVariants}>
                <Clock className={styles.statIcon} size={20} />
                <p className={styles.statValue}>7m</p>
                <p className={styles.statLabel}>Avg. Briefing</p>
              </motion.div>

              <motion.div className={styles.statItem} variants={statItemVariants}>
                <Globe className={styles.statIcon} size={20} />
                <p className={styles.statValue}>190+</p>
                <p className={styles.statLabel}>Regions</p>
              </motion.div>

              <motion.div className={styles.statItem} variants={statItemVariants}>
                <Users className={styles.statIcon} size={20} />
                <p className={styles.statValue}>4.9</p>
                <p className={styles.statLabel}>Satisfaction</p>
              </motion.div>

              <motion.div className={styles.statItem} variants={statItemVariants}>
                <BarChart2 className={styles.statIcon} size={20} />
                <p className={styles.statValue}>25+</p>
                <p className={styles.statLabel}>Topics</p>
              </motion.div>
            </div>

            <div className={styles.metricsFooter}>
              Powered by GNews v4
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
