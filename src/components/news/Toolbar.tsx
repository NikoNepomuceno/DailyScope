'use client';

import { Volume2, VolumeX, Moon, Sun, ZoomIn, ZoomOut } from "lucide-react";

interface ToolbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  fontSize: number;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  isSpeaking: boolean;
  toggleSpeech: () => void;
}

export default function Toolbar({
  darkMode,
  toggleDarkMode,
  fontSize,
  increaseFontSize,
  decreaseFontSize,
  isSpeaking,
  toggleSpeech
}: ToolbarProps) {
  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <button onClick={decreaseFontSize} className="toolbar-btn" aria-label="Decrease font size">
          <ZoomOut size={20} />
        </button>
        <button onClick={increaseFontSize} className="toolbar-btn" aria-label="Increase font size">
          <ZoomIn size={20} />
        </button>
      </div>
      <div className="toolbar-right">
        <button onClick={toggleDarkMode} className="toolbar-btn" aria-label="Toggle dark mode">
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button onClick={toggleSpeech} className={`toolbar-btn ${isSpeaking ? 'active' : ''}`} aria-label="Toggle text to speech">
          {isSpeaking ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>
    </div>
  );
}
