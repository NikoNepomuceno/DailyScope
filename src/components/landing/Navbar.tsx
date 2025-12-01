'use client';

import { MouseEvent, useState } from "react";

interface NavbarProps {
  onNavigate?: (sectionId: string) => void;
}

export default function Navbar({ onNavigate }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (
    event: MouseEvent<HTMLButtonElement>,
    sectionId: string
  ) => {
    event.preventDefault();
    if (onNavigate) {
      onNavigate(sectionId);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const NavButtons = ({ isMobile = false }: { isMobile?: boolean }) => (
    <>
      <button
        className={isMobile ? "ds-nav-link ds-nav-link-mobile" : "ds-nav-link"}
        onClick={(e) => handleNavClick(e, "about")}
      >
        About
      </button>
      <button
        className={isMobile ? "ds-nav-link ds-nav-link-mobile" : "ds-nav-link"}
        onClick={(e) => handleNavClick(e, "testimonials")}
      >
        Voices
      </button>
      <button
        className={isMobile ? "ds-nav-link ds-nav-link-mobile" : "ds-nav-link"}
        onClick={(e) => handleNavClick(e, "footer")}
      >
        Contact
      </button>
      <button
        className={isMobile ? "ds-nav-cta ds-nav-cta-mobile" : "ds-nav-cta"}
        onClick={(e) => handleNavClick(e, "hero")}
      >
        Start reading
      </button>
    </>
  );

  return (
    <header className="ds-navbar">
      <div className="ds-navbar-inner">
        <div className="ds-logo">
          <span className="ds-logo-mark">DS</span>
          <span>DailyScope</span>
        </div>

        {/* Desktop navigation */}
        <nav className="ds-nav-links" aria-label="Primary navigation">
          <NavButtons />
        </nav>

        {/* Mobile toggle button */}
        <button
          type="button"
          className="ds-nav-toggle"
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
          onClick={toggleMenu}
        >
          <span className="ds-nav-toggle-bar" />
          <span className="ds-nav-toggle-bar" />
        </button>
      </div>

      {/* Mobile menu */}
      <nav
        className={`ds-nav-mobile${isOpen ? " ds-nav-mobile-open" : ""}`}
        aria-label="Mobile primary navigation"
      >
        <NavButtons isMobile />
      </nav>
    </header>
  );
}


