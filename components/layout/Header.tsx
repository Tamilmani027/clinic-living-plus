import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion, faUser } from "@fortawesome/free-solid-svg-icons";

/**
 * Fixed top navigation header for the Clinical Portal.
 * Pure Server Component — no interactivity needed here.
 */
export default function Header() {
  const navLinks = [
    { label: "Dashboard", path: "dashboard" },
    { label: "Bookings", path: "bookings", active: true },
    { label: "Doctors", path: "doctors" },
    { label: "Schedule", path: "schedule" },
  ];

  return (
    <header className="fixed top-0 w-full h-20 z-50 bg-[var(--color-surface-container-lowest)]/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-full max-w-7xl mx-auto pr-4 md:pr-8 flex items-stretch justify-between gap-6">
        {/* Brand + Status */}
        <div className="flex items-stretch gap-6">
          <div className="flex items-center gap-3">
            {/* Logo mark */}
            <div className="h-full aspect-square overflow-hidden flex-shrink-0">
              <img src='/images/CLP-logo.png' alt="Clinic Living Plus logo" className="w-full h-full object-contain" />
            </div>
          </div>

          {/* Clinic open indicator */}
          <div className="hidden sm:flex self-center items-center justify-center gap-1.5 w-25 h-8 px-1 py-0.5 rounded-lg bg-[var(--color-surface-container-low)]">
            <span className="w-2 h-2 rounded-full bg-[var(--color-tertiary)] animate-pulse-slow" />
            <span className="text-xs font-semibold text-[var(--color-tertiary)]">
              Clinic Open
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) =>
            link.active ? (
              <a
                key={link.path}
                href="#"
                aria-current="page"
                className="px-4 py-1.5 rounded-lg text-sm font-semibold bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)] shadow-sm transition-colors"
              >
                {link.label}
              </a>
            ) : (
              <a
                key={link.path}
                href="#"
                className="px-4 py-1.5 rounded-lg text-sm font-medium text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)] hover:text-[var(--color-on-surface)] transition-colors"
              >
                {link.label}
              </a>
            )
          )}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="flex items-center gap-1.5 text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] text-sm transition-colors"
          >
            <FontAwesomeIcon icon={faCircleQuestion} style={{ width: 20, height: 20 }} />
            <span className="hidden lg:inline">Support</span>
          </button>
          <div className="h-4 w-px bg-[var(--color-outline-variant)] hidden sm:block" />
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "#61ce70", color: "#143318" }}
          >
            <FontAwesomeIcon icon={faUser} style={{ width: 18, height: 18 }} />
          </div>
        </div>
      </div>
    </header>
  );
}
