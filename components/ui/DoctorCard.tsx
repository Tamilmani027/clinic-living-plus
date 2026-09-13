import React from "react";
import Image from "next/image";
import type { Doctor } from "@/lib/types";
import { getInitials } from "@/lib/data";

interface DoctorCardProps {
  doctor: Doctor;
}

/**
 * Compact doctor directory card showing avatar, specialty, rating,
 * and next-available slot.
 */
export default function DoctorCard({ doctor }: DoctorCardProps) {
  return (
    <div className="bg-[var(--color-surface-container-lowest)] p-4 rounded-xl shadow-sm flex items-center gap-4">
      {/* Avatar */}
      <div className="w-12 h-12 rounded-full shrink-0 overflow-hidden bg-[var(--color-surface-container)] flex items-center justify-center">
        {doctor.avatarUrl ? (
          <Image
            src={doctor.avatarUrl}
            alt={doctor.avatarAlt ?? doctor.name}
            width={48}
            height={48}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-sm font-bold text-[var(--color-on-surface-variant)]">
            {getInitials(doctor.name)}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-[var(--color-on-surface)] truncate">
            {doctor.name}
          </span>
        </div>
        <span className="text-xs text-[var(--color-outline)]">
          {doctor.specialty} Department
        </span>
        {/*<span className="text-[11px] font-semibold text-[var(--color-tertiary)] mt-0.5">
          Next Available: {doctor.nextAvailable}
        </span>*/}
      </div>
    </div>
  );
}
