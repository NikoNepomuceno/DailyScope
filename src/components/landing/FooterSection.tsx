'use client';

import { motion } from "framer-motion";

export default function FooterSection() {
  return (
    <footer id="footer" className="ds-footer">
      <motion.div
        className="ds-footer-inner ds-fade-in"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div>
          <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>DailyScope</div>
          <div>Balanced briefings for a world that moves fast.</div>
        </div>
        <div className="ds-footer-links">
          <button className="ds-footer-link">Privacy</button>
          <button className="ds-footer-link">Terms</button>
          <button className="ds-footer-link">Press</button>
          <button className="ds-footer-link">Contact</button>
        </div>
        <div>© {new Date().getFullYear()} DailyScope. All rights reserved.</div>
      </motion.div>
    </footer>
  );
}


