import type { Doctor } from "./types";

// -------------------------------------------------------------------
// Doctor directory (static seed data)
// -------------------------------------------------------------------
export const DOCTORS: Doctor[] = [
  {
    id: "dr-roshini",
    name: "Roshni Sanghvi",
    specialty: "Registered Holistic Nutritionist Transformation Specialist",
    rating: 4.9,
    nextAvailable: "02:00 PM",
  },
  {
    id: "dr-tejas",
    name: "Dr. Tejas Udayanand",
    specialty: "MBBS, MSc SEM",
    rating: 4.7,
    nextAvailable: "11:45 AM",
  },
  {
    id: "dr-deekkshitha",
    name: "Dr Deekkshitha",
    specialty: "MBBS , FID , Functional medicine",
    rating: 4.8,
    nextAvailable: "09:00 AM",
  },
  {
    id: "dr-ritika",
    name: "Dr. Ritika Raj (PT)",
    specialty: "Consultant physiotherapist",
    rating: 4.8,
    nextAvailable: "Tomorrow",

  },
  {
    id: "dr-anitha",
    name: "Dr. Anita GS",
    specialty: "OBGYN and Women’s Health Coach",
    rating: 4.8,
    nextAvailable: "09:00 AM",
  },
  {
    id: "dr-bijli",
    name: "Dr. Bijli Nanda",
    specialty: "Lifestyle Physician (MBBS) Palliative Medicine Practitioner",
    rating: 4.8,
    nextAvailable: "09:00 AM",
  },
  {
    id: "dr-sulaba",
    name: "Dr.Sulaba BNYS",
    specialty: "Naturopathic Doctor | Integrative Wellness Practitioner",
    rating: 4.8,
    nextAvailable: "09:00 AM",
  },
  {
    id: "dr-sowmya",
    name: "Sowmya C",
    specialty: "HOD-- Alternative Therapy and IV Nurse Practitioner (ND)",
    rating: 4.8,
    nextAvailable: "09:00 AM",
  }
];

// -------------------------------------------------------------------
// Available time slots
// -------------------------------------------------------------------
export const TIME_SLOTS = [
  { value: "09:00 AM", label: "09:00 AM (Morning)" },
  { value: "10:30 AM", label: "10:30 AM (Morning)" },
  { value: "11:45 AM", label: "11:45 AM (Morning)" },
  { value: "02:00 PM", label: "02:00 PM (Afternoon)" },
  { value: "03:30 PM", label: "03:30 PM (Afternoon)" },
  { value: "04:15 PM", label: "04:15 PM (Evening)" },
];

// Quick-select slot pills
export const QUICK_SLOTS = ["09:00 AM", "10:30 AM", "02:00 PM", "04:15 PM"];

// -------------------------------------------------------------------
// Helpers
// -------------------------------------------------------------------
export const formatDateIso = (d: Date): string =>
  d.toISOString().split("T")[0];

export const formatDateDisplay = (isoStr: string): string => {
  if (!isoStr) return "";
  const [y, m, day] = isoStr.split("-");
  const date = new Date(Number(y), Number(m) - 1, Number(day));
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const getInitials = (name: string): string =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

/** Build seed appointments relative to today so the design always looks live */
export const buildSeedAppointments = () => {
  const today = new Date();
  const tomorrow = new Date(Date.now() + 86400000);
  const yesterday = new Date(Date.now() - 86400000);

  return [
  ];
};
