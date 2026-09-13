import React from "react";
import type { AppointmentStatus } from "@/lib/types";

interface StatusBadgeProps {
  status: AppointmentStatus;
}

const STATUS_CONFIG: Record<
  AppointmentStatus,
  { bg: string; dot: string; text: string; label: string }
> = {
  Upcoming: {
    bg: "bg-[var(--color-secondary-fixed)]",
    dot: "bg-[var(--color-secondary)]",
    text: "text-[var(--color-on-secondary-fixed-variant)]",
    label: "Upcoming",
  },
  Completed: {
    bg: "bg-[var(--color-tertiary-fixed)]",
    dot: "bg-[var(--color-tertiary)]",
    text: "text-[var(--color-on-tertiary-fixed-variant)]",
    label: "Completed",
  },
  Canceled: {
    bg: "bg-[var(--color-error-container)]",
    dot: "bg-[var(--color-error)]",
    text: "text-[var(--color-on-error-container)]",
    label: "Canceled",
  },
};

/**
 * Pill badge that reflects appointment status with semantic colours.
 */
export default function StatusBadge({ status }: StatusBadgeProps) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${cfg.bg} ${cfg.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}
