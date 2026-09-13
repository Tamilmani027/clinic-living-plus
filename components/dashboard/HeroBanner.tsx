"use client";

import React, { useMemo } from "react";
import StatCard from "@/components/ui/StatCard";
import Icon from "@/components/ui/Icon";
import type { Appointment } from "@/lib/types";

interface HeroBannerProps {
  appointments: Appointment[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

/**
 * Top hero section containing:
 * - Page heading + live date
 * - KPI stat cards bento grid
 * - Global search bar + info chips
 */
export default function HeroBanner({
  appointments,
  searchQuery,
  onSearchChange,
}: HeroBannerProps) {
  const today = useMemo(
    () =>
      new Date().toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    []
  );

  const stats = useMemo(() => {
    const total = appointments.length;
    const upcoming = appointments.filter((a) => a.status === "Upcoming").length;
    const completed = appointments.filter((a) => a.status === "Completed").length;
    const canceled = appointments.filter((a) => a.status === "Canceled").length;
    return { total, upcoming, completed, canceled };
  }, [appointments]);

  return (
    <div className="flex flex-col gap-5">
      {/* Hero card */}
      <div className="relative overflow-hidden rounded-2xl bg-[var(--color-surface-container-lowest)] shadow-sm p-6 md:p-10">
        {/* Decorative blobs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[var(--color-primary-fixed)]/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-[var(--color-surface-container-high)]/40 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Heading */}
          <div className="flex flex-col gap-1 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-[var(--color-primary)]">
                Clinical Management System
              </span>
              <span className="text-[var(--color-outline-variant)]">•</span>
              <span className="text-[11px] font-semibold uppercase tracking-widest text-[var(--color-outline)]">
                {today}
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-[var(--color-on-surface)]">
              Clinical Outpatient Desk
            </h1>
            <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
              Streamlined scheduling, triage prioritization, and real-time patient
              encounter tracking for health practitioners.
            </p>
          </div>

          {/* Bento stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
            <StatCard
              label="Total"
              value={stats.total}
              icon="calendar_today"
              accentClass="text-[var(--color-primary)]"
            />
            <StatCard
              label="Upcoming"
              value={stats.upcoming}
              icon="schedule"
              accentClass="text-[var(--color-secondary)]"
            />
            <StatCard
              label="Done"
              value={stats.completed}
              icon="check_circle"
              accentClass="text-[var(--color-tertiary)]"
            />
            <StatCard
              label="Canceled"
              value={stats.canceled}
              icon="cancel"
              accentClass="text-[var(--color-error)]"
            />
          </div>
        </div>
      </div>

      {/* Search + info chips */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[var(--color-surface-container-lowest)] p-4 rounded-2xl shadow-sm">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Icon
            name="search"
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-outline)]"
          />
          <input
            id="global-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by patient name, doctor, or specialty..."
            className="w-full h-11 pl-11 pr-4 rounded-xl bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] text-sm placeholder:text-[var(--color-outline)] focus:outline-none focus:bg-[var(--color-surface-container-lowest)] shadow-sm transition-all"
          />
        </div>

        {/* Info chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-0.5 md:pb-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--color-surface-container-low)] shrink-0">
            <Icon
              name="medical_services"
              size={18}
              className="text-[var(--color-primary)]"
            />
            <span className="text-xs font-medium text-[var(--color-on-surface)]">
              4 On-Duty Clinicians
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--color-surface-container-low)] shrink-0">
            <Icon
              name="verified_user"
              size={18}
              className="text-[var(--color-tertiary)]"
            />
            <span className="text-xs font-medium text-[var(--color-on-surface)]">
              HIPAA Secured
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
