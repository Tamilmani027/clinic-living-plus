import type { Doctor } from "./types";

// -------------------------------------------------------------------
// Doctor directory (static seed data)
// -------------------------------------------------------------------
export const DOCTORS: Doctor[] = [
  {
    id: "dr-jenkins",
    name: "Dr. Sarah Jenkins",
    specialty: "Cardiology",
    rating: 4.9,
    nextAvailable: "02:00 PM",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCn2gQTQdmnWj52i2dFEycqT2fy6dn3Sq9A6tWTZAJstfohzFT6GM_qpAFnRZYmcYv_JQWpQ-Q2YgkFQbB3gfq6Zm3TsjxfGYwRV9chTBLtUbdeD7pLxSUeYDGAWS-XR_YzBJOectFvpt_jMDBh0C-1vd_XG_sk6RP8PScrWdgoZpqxKVvYx61CZshZ6sCICyycG0viJ6_WqEwg86zUGGr7wLhfvTn-Z413WLwZNkNB59CrH3yPD66Xww",
    avatarAlt:
      "Dr. Sarah Jenkins, cardiologist, in white medical coat with stethoscope",
  },
  {
    id: "dr-vance",
    name: "Dr. Marcus Vance",
    specialty: "Neurology",
    rating: 4.7,
    nextAvailable: "11:45 AM",
  },
  {
    id: "dr-rostova",
    name: "Dr. Elena Rostova",
    specialty: "Pediatrics",
    rating: 4.8,
    nextAvailable: "09:00 AM",
  },
  {
    id: "dr-kim",
    name: "Dr. David Kim",
    specialty: "General Medicine",
    rating: 4.8,
    nextAvailable: "Tomorrow",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD1CYvQrCgFakQhKuizJnA7ZIFkR3oJdP0Zsq57tf2FgOQ-WWo63cC4g3DZ3TDW4xIsvhMpe-Pt-gSD_gDGSwDh1WlKcQbI8IbLwYxxd0NYybjohyO73vF-sae__eCaH2ECBUv_bsniAp5Xld5wNgWVr66rvWK_uczM3Bj1_wSfi5pmxu_BuW90Uf-veyyUvddaIfbdsLUpCjF-56Spkj9-iQuccVyAHkZwIhYjI3IDdWVbbHt1mK99nA",
    avatarAlt:
      "Dr. David Kim, general physician in a contemporary outpatient clinic",
  },
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
    {
      id: "apt-101",
      patientName: "Eleanor Vance",
      phone: "+1 (555) 234-5678",
      doctor: "Dr. Sarah Jenkins",
      specialty: "Cardiology",
      date: formatDateIso(today),
      time: "10:30 AM",
      status: "Upcoming" as const,
    },
    {
      id: "apt-102",
      patientName: "Marcus Aurelius",
      phone: "+1 (555) 876-5432",
      doctor: "Dr. David Kim",
      specialty: "General Medicine",
      date: formatDateIso(tomorrow),
      time: "02:00 PM",
      status: "Upcoming" as const,
    },
    {
      id: "apt-103",
      patientName: "Clara Oswald",
      phone: "+1 (555) 345-6789",
      doctor: "Dr. Elena Rostova",
      specialty: "Pediatrics",
      date: formatDateIso(yesterday),
      time: "09:00 AM",
      status: "Completed" as const,
    },
  ];
};
