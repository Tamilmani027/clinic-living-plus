import React from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="w-full border-t border-white/10 py-5 mt-auto text-white transition-colors"
      style={{ backgroundColor: "#0D2318" }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        {/* Left: Brand + Copyright */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 font-medium">
          <span className="font-bold tracking-wider uppercase text-white">
            CLINIC LIVING PLUS
          </span>
          <span className="text-white/40">•</span>
          <span className="text-white/80">© {currentYear} All Rights Reserved</span>
        </div>

        {/* Right: Policy & Protocol links */}
        <div className="flex items-center gap-6 font-medium text-white/85">
          <a
            href="#privacy"
            className="hover:text-white hover:underline transition-colors"
          >
            Patient Privacy
          </a>
          <a
            href="#terms"
            className="hover:text-white hover:underline transition-colors"
          >
            Terms of Care
          </a>
          <a
            href="#emergency"
            className="hover:text-white hover:underline transition-colors"
          >
            Emergency Protocols
          </a>
        </div>
      </div>
    </footer>
  );
}
