import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";

interface StatCardProps {
  label: string;
  value: number;
  icon: IconDefinition;
  /** Tailwind text colour class for the accent (e.g. "text-[var(--color-primary)]") */
  accentClass: string;
}

/**
 * Small KPI card used in the hero banner bento grid.
 */
export default function StatCard({ label, value, icon, accentClass }: StatCardProps) {
  return (
    <div className="flex flex-col p-4 rounded-xl bg-[var(--color-surface-container-low)] hover:bg-[var(--color-surface-container)] transition-colors duration-200">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-[var(--color-outline)]">
          {label}
        </span>
        <FontAwesomeIcon icon={icon} style={{ width: 18, height: 18 }} className={accentClass} />
      </div>
      <span className={`text-2xl font-bold mt-1 ${accentClass}`}>{value}</span>
    </div>
  );
}
