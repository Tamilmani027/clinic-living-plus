// Core domain types for the Clinic Living Plus application

export type AppointmentStatus = "Upcoming" | "Completed" | "Canceled";
export type FilterStatus = "All" | AppointmentStatus;

export interface Appointment {
  id: string;
  patientName: string;
  phone: string;
  doctor: string;
  specialty: string;
  date: string; // ISO date string: YYYY-MM-DD
  time: string; // e.g. "10:30 AM"
  status: AppointmentStatus;
  symptoms?: string;
  aiSummary?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  nextAvailable: string;
  avatarUrl?: string;
  avatarAlt?: string;
}

export interface AppointmentFormValues {
  patientName: string;
  phone: string;
  doctor: string; // "Name|Specialty" format
  date: string;
  time: string;
  symptoms?: string;
  aiSummary?: string;
}

export interface StatCardData {
  label: string;
  value: number;
  icon: string;
  colorClass: string;
}
