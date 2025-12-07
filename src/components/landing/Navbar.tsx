import styles from "./Navbar.module.css";

import { MouseEvent, useState, useEffect, useRef } from "react";

interface NavbarProps {
  onNavigate?: (sectionId: string) => void;
  isSticky?: boolean;
}

export default function Navbar({ onNavigate, isSticky = true }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLElement>(null);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        const toggleButton = document.querySelector(`.${styles.navToggle}`);
        if (toggleButton && !toggleButton.contains(event.target as Node)) {
          setIsOpen(false);
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside as any);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside as any);
      };
    }
  }, [isOpen]);

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
        className={isMobile ? `${styles.navLink} ${styles.mobileLink}` : styles.navLink}
        onClick={(e) => handleNavClick(e, "about")}
      >
        About
      </button>
      <button
        className={isMobile ? `${styles.navLink} ${styles.mobileLink}` : styles.navLink}
        onClick={(e) => handleNavClick(e, "testimonials")}
      >
        Voices
      </button>
      <button
        className={isMobile ? `${styles.navLink} ${styles.mobileLink}` : styles.navLink}
        onClick={(e) => handleNavClick(e, "footer")}
      >
        Contact
      </button>
      <button
        className={isMobile ? `${styles.cta} ${styles.mobileCta}` : styles.cta}
        onClick={(e) => handleNavClick(e, "hero")}
      >
        Start reading
      </button>
    </>
  );

  return (
    <header
      className={styles.navbar}
      style={{ position: isSticky ? 'sticky' : 'relative' }}
    >
      <div className={styles.inner}>
        <div className={styles.logo}>
          <span className={styles.logoMark}>DS</span>
          <span>DailyScope</span>
        </div>

        {/* Desktop navigation */}
        <nav className={styles.navLinks} aria-label="Primary navigation">
          <NavButtons />
        </nav>

        {/* Mobile toggle button */}
        <button
          type="button"
          className={styles.navToggle}
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
          onClick={toggleMenu}
        >
          <span className={styles.navToggleBar} />
          <span className={styles.navToggleBar} />
          <span className={styles.navToggleBar} />
        </button>
      </div>

      {/* Mobile menu backdrop */}
      {isOpen && (
        <div
          className={styles.mobileBackdrop}
          onClick={toggleMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile menu */}
      <nav
        ref={menuRef}
        className={`${styles.mobileMenu}${isOpen ? ` ${styles.mobileMenuOpen}` : ""}`}
        aria-label="Mobile primary navigation"
        aria-hidden={!isOpen}
      >
        <NavButtons isMobile />
      </nav>
    </header>
  );
}


