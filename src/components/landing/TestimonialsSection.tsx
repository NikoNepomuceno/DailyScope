'use client';

import { motion, type Variants } from "framer-motion";

const testimonials = [
  {
    initials: "AR",
    name: "Alex Rivera",
    role: "Product Lead, Fintech",
    quote:
      "DailyScope is the only news app that actually respects my time. I get the full picture in one coffee, not ten tabs.",
  },
  {
    initials: "MC",
    name: "Morgan Chen",
    role: "Analyst, Global Markets",
    quote:
      "The way context is layered around headlines is outstanding. It surfaces what matters without overwhelming me.",
  },
  {
    initials: "JS",
    name: "Jordan Singh",
    role: "Science Communicator",
    quote:
      "I love the focus tools and audio briefings. It makes long-form reporting feel approachable and genuinely accessible.",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.14,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="ds-section">
      <div className="ds-shell">
        <motion.div
          className="ds-section-header ds-fade-in"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
        >
          <p className="ds-section-eyebrow">What readers say</p>
          <h2 className="ds-section-title">
            Trusted by people who can’t afford bad information.
          </h2>
          <p className="ds-section-subtitle">
            From analysts and founders to curious generalists, DailyScope helps readers
            stay informed without burning out on endless feeds.
          </p>
        </motion.div>

        <motion.div
          className="ds-testimonials-grid ds-fade-in"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {testimonials.map((item) => (
            <motion.article
              key={item.name}
              className="ds-testimonial-card"
              variants={cardVariants}
            >
              <p className="ds-testimonial-quote">“{item.quote}”</p>
              <div className="ds-testimonial-footer">
                <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
                  <div className="ds-avatar" aria-hidden="true">
                    {item.initials}
                  </div>
                  <div>
                    <div className="ds-testimonial-name">{item.name}</div>
                    <div className="ds-testimonial-role">{item.role}</div>
                  </div>
                </div>
                <span>★ ★ ★ ★ ★</span>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}


