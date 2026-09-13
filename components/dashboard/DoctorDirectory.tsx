import React from "react";
import DoctorCard from "@/components/ui/DoctorCard";
import type { Doctor } from "@/lib/types";

interface DoctorDirectoryProps {
  doctors: Doctor[];
}

/**
 * Mini bento grid of on-duty doctor cards shown beneath the appointment table.
 */
export default function DoctorDirectory({ doctors }: DoctorDirectoryProps) {
  // Show max 4 on-duty doctors
  const featured = doctors

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {featured.map((doctor) => (
        <DoctorCard key={doctor.id} doctor={doctor} />
      ))}
    </div>
  );
}
