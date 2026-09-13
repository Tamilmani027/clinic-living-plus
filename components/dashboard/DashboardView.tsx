"use client";

import React, { useState, useCallback } from "react";
import HeroBanner from "./HeroBanner";
import AppointmentForm from "./AppointmentForm";
import AppointmentTable from "./AppointmentTable";
import DoctorDirectory from "./DoctorDirectory";
import ToastContainer, { type ToastMessage } from "@/components/ui/ToastContainer";
import { DOCTORS, buildSeedAppointments, formatDateDisplay } from "@/lib/data";
import type {
  Appointment,
  AppointmentFormValues,
  AppointmentStatus,
} from "@/lib/types";

let idCounter = 200;

function generateId(): string {
  idCounter += 1;
  return `apt-${idCounter}`;
}

function generateToastId(): string {
  return `toast-${Date.now()}-${Math.random()}`;
}

/**
 * Top-level Client Component that owns all mutable state:
 * - appointments list
 * - search query (shared between HeroBanner and AppointmentTable)
 * - toast notifications
 *
 * It passes callbacks down to children; no prop drilling beyond one level.
 */
export default function DashboardView() {
  const [appointments, setAppointments] = useState<Appointment[]>(
    () => buildSeedAppointments()
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // ----------------------------------------------------------------
  // Toast helpers
  // ----------------------------------------------------------------
  const addToast = useCallback(
    (message: string, variant: ToastMessage["variant"] = "info") => {
      const id = generateToastId();
      setToasts((prev) => [...prev, { id, message, variant }]);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ----------------------------------------------------------------
  // Appointment mutations
  // ----------------------------------------------------------------
  const handleFormSubmit = useCallback(
    (values: AppointmentFormValues) => {
      const [doctorName, specialty] = values.doctor.split("|");
      const newApt: Appointment = {
        id: generateId(),
        patientName: values.patientName,
        phone: values.phone,
        doctor: doctorName,
        specialty,
        date: values.date,
        time: values.time,
        status: "Upcoming",
        symptoms: values.symptoms,
      };
      setAppointments((prev) => [newApt, ...prev]);
      addToast(
        `Appointment booked for ${values.patientName} on ${formatDateDisplay(values.date)} at ${values.time}.`,
        "success"
      );
    },
    [addToast]
  );

  const handleStatusChange = useCallback(
    (id: string, newStatus: AppointmentStatus) => {
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
      );
      const apt = appointments.find((a) => a.id === id);
      if (apt) {
        const msg =
          newStatus === "Completed"
            ? `Consultation for ${apt.patientName} marked as completed.`
            : `Appointment for ${apt.patientName} has been canceled.`;
        addToast(msg, newStatus === "Completed" ? "success" : "error");
      }
    },
    [appointments, addToast]
  );

  const handleDelete = useCallback(
    (id: string) => {
      const apt = appointments.find((a) => a.id === id);
      setAppointments((prev) => prev.filter((a) => a.id !== id));
      if (apt) {
        addToast(`Record for ${apt.patientName} removed.`, "info");
      }
    },
    [appointments, addToast]
  );

  return (
    <>
      {/* Toast layer */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      <div className="flex flex-col gap-8">
        {/* Hero + Search */}
        <HeroBanner
          appointments={appointments}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Master-detail layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Booking form */}
          <section className="lg:col-span-5">
            <AppointmentForm onSubmit={handleFormSubmit} />
          </section>

          {/* Right: Appointment list + doctor directory */}
          <section className="lg:col-span-7 flex flex-col gap-4">
            <AppointmentTable
              appointments={appointments}
              searchQuery={searchQuery}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
            <DoctorDirectory doctors={DOCTORS} />
          </section>
        </div>
      </div>
    </>
  );
}
