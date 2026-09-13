"use client";

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleQuestion,
  faUser,
  faBars,
  faXmark,
  faCalendarCheck,
  faClock,
  faStethoscope,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

interface NavItem {
  label: string;
  href: string;
  description: string;
  icon: typeof faCalendarCheck;
  active?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Book Appointment",
    href: "#book-appointment",
    description: "Schedule a patient consultation",
    icon: faCalendarCheck,
    active: true,
  },
  {
    label: "Schedule",
    href: "#schedule",
    description: "View upcoming & recorded visits",
    icon: faClock,
  },
  {
    label: "Doctors",
    href: "#doctors",
    description: "On-duty doctors & specialty directory",
    icon: faStethoscope,
  },
];

/**
 * Fixed top navigation header for Clinic Living Plus.
 * Includes desktop navigation and a responsive mobile hamburger menu.
 */
export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile drawer if viewport is resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    setIsMobileMenuOpen(false);
    if (href.startsWith("#")) {
      const el = document.querySelector(href);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header className="fixed top-0 w-full h-20 z-50 bg-[var(--color-surface-container-lowest)]/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[var(--color-outline-variant)]/20">
      <div className="h-full max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="h-full flex items-center gap-4">
          <a
            href="#"
            className="h-full flex items-center focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] rounded-lg py-1"
          >
            <div className="h-full w-auto overflow-hidden flex-shrink-0 flex items-center">
              <img
                src="/icons/CLP-logo.svg"
                alt="Clinic Living Plus logo"
                className="h-full w-auto object-contain"
              />
            </div>
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((link) =>
            link.active ? (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                aria-current="page"
                className="px-4 py-1.5 rounded-lg text-sm font-medium text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)] hover:text-[var(--color-on-surface)] transition-colors"
              >
                {link.label}
              </a>
            ) : (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="px-4 py-1.5 rounded-lg text-sm font-medium text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)] hover:text-[var(--color-on-surface)] transition-colors"
              >
                {link.label}
              </a>
            )
          )}
        </nav>

        {/* Right Actions & Mobile Hamburger */}
        <div className="flex items-center gap-3">
          {/* Support (Desktop) */}
          <button
            type="button"
            className="hidden lg:flex items-center gap-1.5 text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] text-sm transition-colors"
          >
            <FontAwesomeIcon icon={faCircleQuestion} style={{ width: 18, height: 18 }} />
            <span>Support</span>
          </button>

          <div className="h-4 w-px bg-[var(--color-outline-variant)] hidden lg:block" />

          {/* User Profile Avatar */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm"
            style={{ backgroundColor: "#0D2318", color: "rgba(240, 245, 248, 1)" }}
            title="Logged In Administrator"
          >
            <FontAwesomeIcon icon={faUser} style={{ width: 16, height: 16 }} />
          </div>

          {/* Mobile Hamburger Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMobileMenuOpen}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container)] active:scale-95 transition-all border border-[var(--color-outline-variant)]/30 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            <FontAwesomeIcon
              icon={isMobileMenuOpen ? faXmark : faBars}
              className="w-5 h-5 text-[var(--color-on-surface)]"
            />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 top-20 bg-black/40 backdrop-blur-sm z-40 md:hidden animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Navigation Dropdown Menu */}
      {isMobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className="absolute top-20 left-0 w-full bg-[var(--color-surface-container-lowest)] border-b border-[var(--color-outline-variant)]/30 shadow-2xl z-50 md:hidden overflow-hidden"
        >
          <div className="p-4 flex flex-col gap-2 max-w-lg mx-auto">
            <div className="px-3 pt-1 pb-2 text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider">
              <span>Quick Navigation</span>
            </div>

            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="flex items-center justify-between p-3.5 rounded-xl transition-all duration-150 group hover:bg-[var(--color-surface-container-low)] active:bg-[#0D2318] border border-transparent hover:border-[var(--color-outline-variant)]/30"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-[#0D2318] text-white shadow-sm group-hover:scale-105 transition-transform">
                    <FontAwesomeIcon icon={item.icon} className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-[var(--color-on-surface)] group-hover:text-[var(--color-primary)] transition-colors">
                      {item.label}
                    </span>
                    <span className="text-xs text-[var(--color-on-surface-variant)]">
                      {item.description}
                    </span>
                  </div>
                </div>
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className="w-3.5 h-3.5 text-[var(--color-outline)] group-hover:text-[var(--color-primary)] group-hover:translate-x-0.5 transition-all"
                />
              </a>
            ))}

            {/* Mobile Footer / Support info */}
            <div className="mt-2 pt-3 border-t border-[var(--color-outline-variant)]/20 px-3 flex items-center justify-between text-xs text-[var(--color-on-surface-variant)]">
              <span className="flex items-center gap-1.5">
                <FontAwesomeIcon icon={faCircleQuestion} className="w-3.5 h-3.5" />
                Need assistance?
              </span>
              <a
                href="tel:+919876543210"
                className="font-semibold text-[var(--color-primary)] hover:underline"
              >
                +91 98765-43210
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
