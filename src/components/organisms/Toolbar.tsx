"use client";

import type { ToolbarProps } from "@/interfaces/news";
import Button from "@/components/atoms/Button";
import styles from "./Toolbar.module.css";
import { Moon, Sun, Type, Volume2, VolumeX, Minus, Plus } from "lucide-react";

export default function Toolbar({
  darkMode,
  toggleDarkMode,
  fontSize,
  increaseFontSize,
  decreaseFontSize,
  isSpeaking,
  toggleSpeech,
}: ToolbarProps) {
  return (
    <nav className={styles.nav}>
      <div className={styles.group}>
        <span className={styles.label}>Display</span>
        <Button
          variant="outline"
          onClick={toggleDarkMode}
          title="Toggle Dark Mode"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </Button>
      </div>
      <div className={styles.group}>
        <span className={styles.label}>Reader</span>
        <div className={styles.group}>
          <Button
            variant="outline"
            onClick={decreaseFontSize}
            disabled={fontSize <= 12}
          >
            <Minus size={16} />
          </Button>
          <span
            style={{ minWidth: "3ch", textAlign: "center", fontSize: "0.9rem" }}
          >
            {fontSize}
          </span>
          <Button
            variant="outline"
            onClick={increaseFontSize}
            disabled={fontSize >= 24}
          >
            <Plus size={16} />
          </Button>
        </div>

        <Button
          variant={isSpeaking ? "default" : "outline"}
          onClick={toggleSpeech}
        >
          {isSpeaking ? <VolumeX size={18} /> : <Volume2 size={18} />}
          {isSpeaking ? "Stop" : "Listen"}
        </Button>
      </div>
    </nav>
  );
}
