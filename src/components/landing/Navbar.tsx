'use client';

import { MouseEvent } from "react";

interface NavbarProps {
  onNavigate?: (sectionId: string) => void;
}

export default function Navbar({ onNavigate }: NavbarProps) {
  const handleNavClick = (event: MouseEvent<HTMLButtonElement>, sectionId: string) => {
    event.preventDefault();
    if (onNavigate) {
      onNavigate(sectionId);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <header className="ds-navbar">
      <div className="ds-navbar-inner">
        <div className="ds-logo">
          <span className="ds-logo-mark">DS</span>
          <span>DailyScope</span>
        </div>

        <nav className="ds-nav-links" aria-label="Primary navigation">
          <button
            className="ds-nav-link"
            onClick={(e) => handleNavClick(e, "about")}
          >
            About
          </button>
          <button
            className="ds-nav-link"
            onClick={(e) => handleNavClick(e, "testimonials")}
          >
            Voices
          </button>
          <button
            className="ds-nav-link"
            onClick={(e) => handleNavClick(e, "footer")}
          >
            Contact
          </button>
          <button
            className="ds-nav-cta"
            onClick={(e) => handleNavClick(e, "hero")}
          >
            Start reading
          </button>
        </nav>
      </div>
    </header>
  );
}


