'use client';

import { motion } from "framer-motion";

const aboutCardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const aboutStatsVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delayChildren: 0.08,
      staggerChildren: 0.08,
    },
  },
};

const statItemVariants = {
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
    <section id="about" className="ds-section">
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
            newsrooms — designed to help you understand what’s happening, not just what’s trending.
          </p>
        </motion.div>

        <div className="ds-about-grid">
          <motion.div
            className="ds-about-card ds-fade-in"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.35 }}
            variants={aboutCardVariants}
          >
            <div className="ds-about-pill">
              <span className="ds-dot-muted" />
              Human‑curated, latest headlines
            </div>
            <p className="ds-about-body">
              Behind every briefing is clear editorial judgement. We aggregate thousands of
              sources, surface what matters, and filter out the duplicate, the trivial, and
              the sensational — so every scroll feels intentional and up to date.
            </p>
            <div className="ds-about-list">
              <div className="ds-about-list-item">
                <span className="ds-check">✓</span>
                <span>Balanced coverage from global, local, and specialist outlets.</span>
              </div>
              <div className="ds-about-list-item">
                <span className="ds-check">✓</span>
                <span>Smart topics from tech and markets to culture and climate.</span>
              </div>
              <div className="ds-about-list-item">
                <span className="ds-check">✓</span>
                <span>Reader controls for font size, dark mode, and audio briefings.</span>
              </div>
              <div className="ds-about-list-item">
                <span className="ds-check">✓</span>
                <span>Designed for clarity, with strong hierarchy and zero clutter.</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="ds-about-stats ds-fade-in"
            variants={aboutStatsVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div className="ds-about-stat" variants={statItemVariants}>
              <p className="ds-about-stat-label">Stories scanned / day</p>
              <p className="ds-about-stat-value">+50k</p>
            </motion.div>
            <motion.div className="ds-about-stat" variants={statItemVariants}>
              <p className="ds-about-stat-label">Avg. briefing time</p>
              <p className="ds-about-stat-value">7 min</p>
            </motion.div>
            <motion.div className="ds-about-stat" variants={statItemVariants}>
              <p className="ds-about-stat-label">Reader satisfaction</p>
              <p className="ds-about-stat-value">4.9/5</p>
            </motion.div>
            <motion.div className="ds-about-stat" variants={statItemVariants}>
              <p className="ds-about-stat-label">Regions covered</p>
              <p className="ds-about-stat-value">190+</p>
            </motion.div>
            <motion.div className="ds-about-stat" variants={statItemVariants}>
              <p className="ds-about-stat-label">Topics tracked</p>
              <p className="ds-about-stat-value">25+</p>
            </motion.div>
            <motion.div className="ds-about-stat" variants={statItemVariants}>
              <p className="ds-about-stat-label">Updates / hour</p>
              <p className="ds-about-stat-value">60</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


