"use client";

import type { BreakingTickerProps } from "@/interfaces/news";
import styles from "./BreakingTicker.module.css";
import { useEffect, useState } from "react";

export default function BreakingTicker({ headlines }: BreakingTickerProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient || headlines.length === 0) return null;

  return (
    <div className={styles.container}>
      <div className={styles.label}>BREAKING</div>
      <div className={styles.track}>
        {/* Duplicate list to create seamless loop effect */}
        {[...headlines, ...headlines, ...headlines].map((text, i) => (
          <span key={i} className={styles.item}>
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
