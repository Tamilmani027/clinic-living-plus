"use client";

import React, { useState, useEffect, useCallback } from "react";
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
import {
  getAppointments,
  createAppointment,
  updateAppointmentStatus,
  deleteAppointment,
} from "@/lib/appointments";
import { isSupabaseConfigured, type DbAppointment } from "@/lib/supabaseClient";

let idCounter = 200;

function generateId(): string {
  idCounter += 1;
  return `apt-${idCounter}`;
}

function generateToastId(): string {
  return `toast-${Date.now()}-${Math.random()}`;
}

const LOCAL_STORAGE_KEY = "clinic_living_plus_appointments_cache_v1";

function loadLocalAppointments(): Appointment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Could not parse localStorage appointments:", err);
  }
  return [];
}

function saveLocalAppointments(items: Appointment[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.warn("Could not save appointments to localStorage:", err);
  }
}

// Convert Supabase DB record to frontend Appointment model
function mapDbToFrontend(item: DbAppointment): Appointment {
  const [doctorName, specialty] = item.doctor.includes("|")
    ? item.doctor.split("|")
    : [item.doctor, "General Medicine"];

  let status: AppointmentStatus = "Upcoming";
  if (item.status === "Completed") status = "Completed";
  else if (item.status === "Canceled" || item.status === "Cancelled") status = "Canceled";
  else status = "Upcoming"; // "Scheduled" or "Upcoming"

  return {
    id: item.id.toString(),
    patientName: item.patient_name,
    phone: item.mobile,
    doctor: doctorName,
    specialty: specialty || "General Medicine",
    date: item.date,
    time: item.time,
    status,
    symptoms: item.reason || undefined,
    aiSummary: item.summary || undefined,
  };
}

/**
 * Top-level Client Component that connects to Supabase database
 * with real-time UI updates, optimistic UI, and localStorage persistence.
 */
export default function DashboardView() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

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
  // 1. Immediate load from localStorage on client mount (prevents wipe on F5)
  // ----------------------------------------------------------------
  useEffect(() => {
    const cached = loadLocalAppointments();
    if (cached.length > 0) {
      setAppointments(cached);
    }
    setIsInitialized(true);
  }, []);

  // ----------------------------------------------------------------
  // 2. Fetch latest records from Supabase and sync
  // ----------------------------------------------------------------
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let isMounted = true;
    async function fetchFromSupabase() {
      try {
        const dbData = await getAppointments();
        if (isMounted && dbData) {
          if (dbData.length > 0) {
            const mapped = dbData.map(mapDbToFrontend);
            setAppointments(mapped);
            saveLocalAppointments(mapped);
          }
        }
      } catch (err: any) {
        console.warn("Supabase fetch notice:", err?.message || err);
      }
    }

    fetchFromSupabase();
    return () => {
      isMounted = false;
    };
  }, []);

  // ----------------------------------------------------------------
  // Appointment mutations
  // ----------------------------------------------------------------
  const handleFormSubmit = useCallback(
    async (values: AppointmentFormValues) => {
      const [doctorName, specialty] = values.doctor.split("|");
      const localId = generateId();

      const newApt: Appointment = {
        id: localId,
        patientName: values.patientName,
        phone: values.phone,
        doctor: doctorName,
        specialty,
        date: values.date,
        time: values.time,
        status: "Upcoming",
        symptoms: values.symptoms,
        aiSummary: values.aiSummary,
      };

      // 1. Immediately persist to state & localStorage
      setAppointments((prev) => {
        const updated = [newApt, ...prev];
        saveLocalAppointments(updated);
        return updated;
      });

      addToast(
        `Appointment booked for ${values.patientName} on ${formatDateDisplay(values.date)} at ${values.time}.`,
        "success"
      );

      // 2. Sync to Supabase in background
      if (isSupabaseConfigured) {
        try {
          const created = await createAppointment({
            patient_name: values.patientName,
            mobile: values.phone,
            doctor: values.doctor,
            date: values.date,
            time: values.time,
            status: "Upcoming",
            reason: values.symptoms,
            summary: values.aiSummary,
          });

          const mapped = mapDbToFrontend(created);
          setAppointments((prev) => {
            const updated = prev.map((a) => (a.id === localId ? mapped : a));
            saveLocalAppointments(updated);
            return updated;
          });
        } catch (err: any) {
          console.warn("Could not save to Supabase immediately (saved in browser):", err?.message || err);
        }
      }
    },
    [addToast]
  );

  const handleStatusChange = useCallback(
    async (id: string, newStatus: AppointmentStatus) => {
      // Optimistic update in state + localStorage
      setAppointments((prev) => {
        const updated = prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a));
        saveLocalAppointments(updated);
        return updated;
      });

      const apt = appointments.find((a) => a.id === id);
      const msg =
        newStatus === "Completed"
          ? `Consultation for ${apt?.patientName ?? "patient"} marked as completed.`
          : `Appointment for ${apt?.patientName ?? "patient"} has been canceled.`;
      addToast(msg, newStatus === "Completed" ? "success" : "error");

      if (isSupabaseConfigured && !id.startsWith("apt-")) {
        try {
          await updateAppointmentStatus(id, newStatus);
        } catch (err) {
          console.warn("Could not sync status change to Supabase:", err);
        }
      }
    },
    [appointments, addToast]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      const apt = appointments.find((a) => a.id === id);
      setAppointments((prev) => {
        const updated = prev.filter((a) => a.id !== id);
        saveLocalAppointments(updated);
        return updated;
      });

      if (apt) {
        addToast(`Record for ${apt.patientName} removed.`, "info");
      }

      if (isSupabaseConfigured && !id.startsWith("apt-")) {
        try {
          await deleteAppointment(id);
        } catch (err) {
          console.warn("Could not sync delete to Supabase:", err);
        }
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
          <section id="book-appointment" className="lg:col-span-5 scroll-mt-24">
            <AppointmentForm onSubmit={handleFormSubmit} />
          </section>

          {/* Right: Appointment list + doctor directory */}
          <section className="lg:col-span-7 flex flex-col gap-4">
            <div id="schedule" className="scroll-mt-24">
              <AppointmentTable
                appointments={appointments}
                searchQuery={searchQuery}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            </div>
            <div id="doctors" className="scroll-mt-24">
              <DoctorDirectory doctors={DOCTORS} />
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
