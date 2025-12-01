'use client';

import { useEffect } from "react";
import { motion, useAnimationControls, useReducedMotion } from "framer-motion";

interface HeroSectionProps {
  onPrimaryCtaClick?: () => void;
}

export default function HeroSection({ onPrimaryCtaClick }: HeroSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const letterControls = useAnimationControls();

  const heroInitial = prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 };
  const heroAnimate = { opacity: 1, y: 0 };

   // Looping animation config for hero chips & pill
  const CHIP_LOOP_DURATION = 2.4; // seconds
  const CHIP_KEYFRAME_TIMES = [0, 0.25, 0.75, 1]; // includes ~1.2s plateau

  const chipInitial = prefersReducedMotion
    ? { opacity: 1, x: 0 }
    : { opacity: 0, x: 24 };

  const chipAnimate = (index: number) =>
    prefersReducedMotion
      ? { opacity: 1, x: 0 }
      : {
          opacity: [0, 1, 1, 0],
          x: [24, 0, 0, -12],
          transition: {
            duration: CHIP_LOOP_DURATION,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "loop",
            delay: index * 0.4,
            times: CHIP_KEYFRAME_TIMES,
          },
        };

  const pillInitial = prefersReducedMotion
    ? { opacity: 1, x: 0 }
    : { opacity: 0, x: -24 };
  const pillAnimate = prefersReducedMotion
    ? { opacity: 1, x: 0 }
    : {
        opacity: [0, 1, 1, 0],
        x: [-24, 0, 0, 12],
        transition: {
          duration: CHIP_LOOP_DURATION,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "loop",
          delay: 0.3,
          times: CHIP_KEYFRAME_TIMES,
        },
      };

  // Headline configuration for per-letter animation
  const headlineParts = [
    { text: "Stay ahead with ", highlight: false },
    { text: "clarity-first", highlight: true },
    { text: " news briefings.", highlight: false },
  ];

  const totalLetters = headlineParts
    .map((part) => part.text.length)
    .reduce((sum, len) => sum + len, 0);

  // Letter-by-letter looping animation
  useEffect(() => {
    if (prefersReducedMotion || totalLetters === 0) return;

    let cancelled = false;

    const run = async () => {
      while (!cancelled) {
        // Reset all letters to hidden state to start the loop
        await letterControls.set(() => ({
          opacity: 0,
          y: 16,
        }));

        // Animate letters in with stagger
        await letterControls.start((index) => ({
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.25,
            ease: "easeOut",
            delay: index * 0.04,
          },
        }));

        // Hold full headline visible
        await new Promise((resolve) => setTimeout(resolve, 1200));

        // Fade all letters out together
        await letterControls.start({
          opacity: 0,
          y: -12,
          transition: {
            duration: 0.35,
            ease: "easeInOut",
          },
        });
      }
    };

    run();

    return () => {
      cancelled = true;
      letterControls.stop();
    };
  }, [letterControls, prefersReducedMotion, totalLetters]);

  return (
    <section id="hero" className="ds-hero">
      <div className="ds-hero-inner">
        <motion.div
          className="ds-fade-in"
          initial={heroInitial}
          whileInView={heroAnimate}
          viewport={{ once: true, amount: 0.45 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.7,
            ease: "easeOut",
          }}
        >
          <p className="ds-hero-eyebrow">Your daily window to the world</p>
          <h1 className="ds-hero-title">
            <span className="ds-hero-title-letters">
              {(() => {
                let runningIndex = 0;

                return headlineParts.flatMap((part, partIndex) => {
                  const tokens = part.text.split(/(\s+)/); // keep spaces as tokens

                  return tokens.map((token, tokenIndex) => {
                    const isSpaceToken = /^\s+$/.test(token);

                    // Render plain space token
                    if (isSpaceToken) {
                      const indexForSpace = runningIndex++;
                      const commonProps = {
                        key: `space-${partIndex}-${tokenIndex}`,
                        className: "ds-hero-letter ds-hero-letter-space",
                        custom: indexForSpace,
                        initial: prefersReducedMotion
                          ? { opacity: 1, y: 0 }
                          : { opacity: 0, y: 16 },
                        animate: prefersReducedMotion
                          ? { opacity: 1, y: 0 }
                          : letterControls,
                      };

                      return (
                        <motion.div {...commonProps}>
                          {"\u00A0"}
                        </motion.div>
                      );
                    }

                    // Word token – wrap letters in a non-wrapping flex container
                    const letters = token.split("");

                    return (
                      <span
                        key={`word-${partIndex}-${tokenIndex}`}
                        className={`ds-hero-word${
                          part.highlight ? " ds-hero-letter-highlight" : ""
                        }`}
                      >
                        {letters.map((char, charIndex) => {
                          const globalIndex = runningIndex++;

                          const commonProps = {
                            key: `${partIndex}-${tokenIndex}-${charIndex}`,
                            className: "ds-hero-letter",
                            custom: globalIndex,
                            initial: prefersReducedMotion
                              ? { opacity: 1, y: 0 }
                              : { opacity: 0, y: 16 },
                            animate: prefersReducedMotion
                              ? { opacity: 1, y: 0 }
                              : letterControls,
                          };

                          return <motion.div {...commonProps}>{char}</motion.div>;
                        })}
                      </span>
                    );
                  });
                });
              })()}
            </span>
          </h1>
          <p className="ds-hero-subtitle">
            DailyScope cuts through the noise to deliver balanced, human‑curated stories
            across technology, business, science, and world events — in minutes, not hours.
          </p>

          <div className="ds-hero-cta-row">
            <button
              className="ds-button-primary"
              onClick={onPrimaryCtaClick}
            >
              Start reading now
            </button>
            <button
              className="ds-button-ghost"
              onClick={() => {
                const el = document.getElementById("about");
                if (el) {
                  el.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }}
            >
              How DailyScope works
            </button>
          </div>

          <div className="ds-hero-meta" aria-label="Key product highlights">
            <div className="ds-hero-meta-item">
              <span className="ds-hero-meta-label">Tracked sources</span>
              <span className="ds-hero-meta-value">+2,500 outlets</span>
            </div>
            <div className="ds-hero-meta-item">
              <span className="ds-hero-meta-label">Fresh coverage</span>
              <span className="ds-hero-meta-value">Every 60 seconds</span>
            </div>
            <div className="ds-hero-meta-item">
              <span className="ds-hero-meta-label">Made for focus</span>
              <span className="ds-hero-meta-value">No clutter. Just context.</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="ds-hero-visual ds-fade-in"
          initial={prefersReducedMotion ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.85,
            ease: "easeOut",
            delay: prefersReducedMotion ? 0 : 0.12,
          }}
        >
          <div className="ds-hero-card">
            <div className="ds-hero-card-header">
              <span className="ds-hero-card-tag">Today’s Briefing</span>
              <span className="ds-hero-card-pulse">
                <span className="ds-dot" aria-hidden="true" />
                Live
              </span>
            </div>
            <h2 className="ds-hero-card-headline">
              Markets, tech, and climate — the 7 stories shaping your day.
            </h2>
            <div className="ds-hero-card-meta">
              <span>Curated by DailyScope editors</span>
              <span>Updated 3 min ago</span>
            </div>
            <div className="ds-hero-card-footer">
              <span>Tap into a personalized, bias-aware news feed.</span>
              <span>↗</span>
            </div>
          </div>

          <div className="ds-hero-chip-row">
            <motion.div
              className="ds-hero-chip"
              initial={chipInitial}
              animate={chipAnimate(0)}
            >
              💼 Business & Markets
            </motion.div>
            <motion.div
              className="ds-hero-chip"
              initial={chipInitial}
              animate={chipAnimate(1)}
            >
              🔬 Science & Health
            </motion.div>
            <motion.div
              className="ds-hero-chip"
              initial={chipInitial}
              animate={chipAnimate(2)}
            >
              🌍 Global Headlines
            </motion.div>
          </div>

          <motion.div
            className="ds-hero-pill"
            initial={pillInitial}
            animate={pillAnimate}
          >
            <span className="ds-hero-pill-badge">New</span>
            <span>Accessibility‑first reading controls</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}


