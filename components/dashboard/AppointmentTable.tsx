"use client";

import React, { useMemo, useState } from "react";
import type { Appointment, AppointmentStatus, FilterStatus } from "@/lib/types";
import StatusBadge from "@/components/ui/StatusBadge";
import Icon from "@/components/ui/Icon";
import { formatDateDisplay, getInitials } from "@/lib/data";

const FILTER_TABS: FilterStatus[] = ["All", "Upcoming", "Completed", "Canceled"];

interface AppointmentTableProps {
  appointments: Appointment[];
  searchQuery: string;
  onStatusChange: (id: string, newStatus: AppointmentStatus) => void;
  onDelete: (id: string) => void;
}

// -------------------------------------------------------------------
// Action buttons
// -------------------------------------------------------------------
interface ActionButtonProps {
  icon: string;
  label: string;
  colorClass: string;
  disabled?: boolean;
  onClick: () => void;
}

function ActionButton({
  icon,
  label,
  colorClass,
  disabled = false,
  onClick,
}: ActionButtonProps) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`p-1.5 rounded-xl transition-all ${
        disabled
          ? "opacity-30 cursor-not-allowed"
          : "hover:bg-[var(--color-surface-container)] hover:scale-105 active:scale-95"
      } ${colorClass}`}
    >
      <Icon name={icon} size={19} />
    </button>
  );
}

// -------------------------------------------------------------------
// Main component
// -------------------------------------------------------------------
export default function AppointmentTable({
  appointments,
  searchQuery,
  onStatusChange,
  onDelete,
}: AppointmentTableProps) {
  const [activeFilter, setActiveFilter] = useState<FilterStatus>("All");

  // Filtered + searched list
  const filtered = useMemo(() => {
    let list = appointments;
    if (activeFilter !== "All") {
      list = list.filter((a) => a.status === activeFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (a) =>
          a.patientName.toLowerCase().includes(q) ||
          a.doctor.toLowerCase().includes(q) ||
          a.specialty.toLowerCase().includes(q)
      );
    }
    return list;
  }, [appointments, activeFilter, searchQuery]);

  const upcomingCount = appointments.filter((a) => a.status === "Upcoming").length;

  return (
    <div className="bg-[var(--color-surface-container-lowest)] rounded-2xl shadow-sm flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-[var(--color-on-surface)]">
              Scheduled Appointments
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-[var(--color-surface-container)] text-[11px] font-bold text-[var(--color-on-surface-variant)]">
              {filtered.length}
            </span>
          </div>
          <p className="text-xs text-[var(--color-on-surface-variant)]">
            Live roster of patient consultations
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center p-1 bg-[var(--color-surface-container-low)] rounded-xl gap-1 self-start sm:self-auto overflow-x-auto max-w-full">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveFilter(tab)}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                activeFilter === tab
                  ? "bg-[var(--color-surface-container-lowest)] text-[var(--color-primary)] font-semibold shadow-sm"
                  : "text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {filtered.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-surface-container-low)] text-[var(--color-outline)] text-[11px] font-semibold uppercase tracking-widest">
                <th className="py-2.5 px-4">Patient &amp; Clinical Intake</th>
                <th className="py-2.5 px-4">Doctor &amp; Field</th>
                <th className="py-2.5 px-4">Schedule</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-[var(--color-on-surface)]">
              {filtered.map((apt) => (
                <AppointmentRow
                  key={apt.id}
                  appointment={apt}
                  onStatusChange={onStatusChange}
                  onDelete={onDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-4">
          <div className="w-14 h-14 rounded-full bg-[var(--color-surface-container)] flex items-center justify-center text-[var(--color-outline)]">
            <Icon name="event_busy" size={32} />
          </div>
          <div>
            <p className="text-base font-medium text-[var(--color-on-surface)]">
              No appointments found
            </p>
            <p className="text-xs text-[var(--color-outline)] max-w-xs mt-1">
              There are no records matching your current filter or search query.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveFilter("All")}
            className="text-xs text-[var(--color-primary)] hover:underline font-medium"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="px-6 py-2.5 bg-[var(--color-surface-container-lowest)] flex items-center justify-between text-[var(--color-outline)] text-xs border-t border-[var(--color-outline-variant)]/20">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[var(--color-tertiary)]" />
          Synchronized with Local Clinic Registry
        </span>
        <span className="text-[var(--color-on-surface-variant)] font-medium">
          {upcomingCount} Pending Attention
        </span>
      </div>
    </div>
  );
}

// -------------------------------------------------------------------
// Individual appointment row
// -------------------------------------------------------------------
interface RowProps {
  appointment: Appointment;
  onStatusChange: (id: string, status: AppointmentStatus) => void;
  onDelete: (id: string) => void;
}

function AppointmentRow({ appointment: apt, onStatusChange, onDelete }: RowProps) {
  const initials = getInitials(apt.patientName);
  const isCompleted = apt.status === "Completed";
  const isCanceled = apt.status === "Canceled";

  return (
    <tr className="transition-colors hover:bg-[var(--color-surface-container-low)]/60 border-b border-[var(--color-outline-variant)]/10 last:border-0">
      {/* Patient */}
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[var(--color-surface-container)] flex items-center justify-center text-xs font-bold text-[var(--color-on-surface)] shrink-0">
            {initials}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-[var(--color-on-surface)] truncate">
              {apt.patientName}
            </span>
            <span className="text-xs text-[var(--color-outline)] flex items-center gap-1">
              <Icon name="phone_iphone" size={13} />
              {apt.phone}
            </span>
          </div>
        </div>
      </td>

      {/* Doctor */}
      <td className="py-4 px-4">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-[var(--color-on-surface)]">
            {apt.doctor}
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-[var(--color-outline)]">
            {apt.specialty}
          </span>
        </div>
      </td>

      {/* Schedule */}
      <td className="py-4 px-4">
        <div className="flex flex-col">
          <span className="text-xs text-[var(--color-on-surface)] flex items-center gap-1">
            <Icon name="calendar_month" size={15} className="text-[var(--color-outline)]" />
            {formatDateDisplay(apt.date)}
          </span>
          <span className="text-xs text-[var(--color-outline)] flex items-center gap-1">
            <Icon name="schedule" size={15} className="text-[var(--color-outline)]" />
            {apt.time}
          </span>
        </div>
      </td>

      {/* Status */}
      <td className="py-4 px-4 whitespace-nowrap">
        <StatusBadge status={apt.status} />
      </td>

      {/* Actions */}
      <td className="py-4 px-4 text-right whitespace-nowrap">
        <div className="flex items-center justify-end gap-1">
          <ActionButton
            icon="check_circle"
            label="Mark as Completed"
            colorClass="text-[var(--color-tertiary)]"
            disabled={isCompleted || isCanceled}
            onClick={() => onStatusChange(apt.id, "Completed")}
          />
          <ActionButton
            icon="cancel"
            label="Mark as Canceled"
            colorClass="text-[var(--color-error)]"
            disabled={isCanceled}
            onClick={() => onStatusChange(apt.id, "Canceled")}
          />
          <ActionButton
            icon="delete"
            label="Remove record"
            colorClass="text-[var(--color-outline)] hover:text-[var(--color-error)]"
            onClick={() => onDelete(apt.id)}
          />
        </div>
      </td>
    </tr>
  );
}
