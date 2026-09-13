"use client";

import React, { useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleExclamation,
  faCalendarCheck,
  faWandMagicSparkles,
  faBrain,
  faCircleInfo,
  faUser,
  faPhone,
  faStethoscope,
  faCalendar,
  faClock,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { DOCTORS, TIME_SLOTS, QUICK_SLOTS, formatDateIso } from "@/lib/data";
import type { AppointmentFormValues } from "@/lib/types";

interface AppointmentFormProps {
  onSubmit: (values: AppointmentFormValues) => void;
}

// -------------------------------------------------------------------
// AI summary samples keyed to specialty keywords
// -------------------------------------------------------------------
const AI_SUMMARIES: { keywords: string[]; summary: string }[] = [
  {
    keywords: ["migrain", "headach", "cephal"],
    summary:
      "Patient reports acute cephalalgia (migraine, 3-day duration) with photophobia and mild nausea. Flagged for initial neurological triage assessment.",
  },
  {
    keywords: ["chest", "heart", "cardio", "palpit"],
    summary:
      "Reported intermittent chest discomfort with palpitations. Recommend ECG prior to consultation and cardiology review.",
  },
  {
    keywords: ["fever", "cough", "cold", "flu"],
    summary:
      "Presents with acute upper respiratory symptoms. Recommend vitals triage and possible influenza panel screening.",
  },
  {
    keywords: ["child", "pediatr", "infant", "baby"],
    summary:
      "Paediatric visit — guardian present. Recommend age-appropriate assessment checklist and height/weight recording.",
  },
];

function generateAiSummary(symptoms: string): string {
  const lower = symptoms.toLowerCase();
  const match = AI_SUMMARIES.find((s) =>
    s.keywords.some((kw) => lower.includes(kw))
  );
  return (
    match?.summary ??
    "Symptoms logged for primary intake. Clinician will perform full assessment at consultation."
  );
}

// -------------------------------------------------------------------
// Reusable field wrapper
// -------------------------------------------------------------------
function FieldWrapper({
  id,
  label,
  badge,
  error,
  children,
}: {
  id: string;
  label: string;
  badge?: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className="flex items-center justify-between text-sm font-medium text-[var(--color-on-surface)]"
      >
        <span className="flex items-center gap-1.5">
          {label}
          {badge}
        </span>
      </label>
      {children}
      {error && (
        <span className="flex items-center gap-1 text-xs text-[var(--color-error)] mt-0.5">
          <FontAwesomeIcon icon={faCircleExclamation} style={{ width: 14, height: 14 }} />
          {error}
        </span>
      )}
    </div>
  );
}

// -------------------------------------------------------------------
// Input with leading icon
// -------------------------------------------------------------------
function IconInput({
  id,
  icon,
  hasError,
  ...props
}: { id: string; icon: IconDefinition; hasError?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      <FontAwesomeIcon
        icon={icon}
        style={{ width: 20, height: 20 }}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-outline)]"
      />
      <input
        id={id}
        className={`w-full h-11 pl-11 pr-4 rounded-xl bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] text-sm placeholder:text-[var(--color-outline)] transition-all focus:outline-none focus:bg-[var(--color-surface-container-lowest)] ${hasError
          ? "ring-2 ring-[var(--color-error)]"
          : "focus:ring-1 focus:ring-[var(--color-primary-fixed-dim)]"
          }`}
        {...props}
      />
    </div>
  );
}

// -------------------------------------------------------------------
// Select with leading icon
// -------------------------------------------------------------------
function IconSelect({
  id,
  icon,
  hasError,
  children,
  ...props
}: {
  id: string;
  icon: IconDefinition;
  hasError?: boolean;
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <FontAwesomeIcon
        icon={icon}
        style={{ width: 20, height: 20 }}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-outline)]"
      />
      <select
        id={id}
        className={`w-full h-11 pl-11 pr-8 appearance-none rounded-xl bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] text-sm transition-all focus:outline-none focus:bg-[var(--color-surface-container-lowest)] cursor-pointer ${hasError
          ? "ring-2 ring-[var(--color-error)]"
          : "focus:ring-1 focus:ring-[var(--color-primary-fixed-dim)]"
          }`}
        {...props}
      >
        {children}
      </select>
      <FontAwesomeIcon
        icon={faChevronDown}
        style={{ width: 20, height: 20 }}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-outline)] pointer-events-none"
      />
    </div>
  );
}

// -------------------------------------------------------------------
// Main component
// -------------------------------------------------------------------
const EMPTY: AppointmentFormValues = {
  patientName: "",
  phone: "",
  doctor: "",
  date: "",
  time: "",
  symptoms: "",
};

type FormErrors = Partial<Record<keyof AppointmentFormValues, string>>;

export default function AppointmentForm({ onSubmit }: AppointmentFormProps) {
  const todayStr = formatDateIso(new Date());
  const [values, setValues] = useState<AppointmentFormValues>({
    ...EMPTY,
    date: todayStr,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [aiSummary, setAiSummary] = useState(
    "Patient reports acute cephalalgia (migraine, 3-day duration) with photophobia and mild nausea. Flagged for initial neurological triage assessment."
  );
  const [aiGenerating, setAiGenerating] = useState(false);

  // ----------------------------------------------------------------
  // Phone formatter (India: +91 XXXXX-XXXXX)
  // ----------------------------------------------------------------
  const formatPhone = (raw: string) => {
    let cleaned = raw.trim();
    if (cleaned.startsWith("+91")) {
      cleaned = cleaned.slice(3).trim();
    } else if (cleaned.startsWith("91") && cleaned.replace(/\D/g, "").length > 10) {
      cleaned = cleaned.replace(/\D/g, "").slice(2);
    }
    const digits = cleaned.replace(/\D/g, "").slice(0, 10);
    if (digits.length === 0) return "";
    if (digits.length <= 5) return `+91 ${digits}`;
    return `+91 ${digits.slice(0, 5)}-${digits.slice(5)}`;
  };

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const { name, value } = e.target;
      setValues((prev) => ({
        ...prev,
        [name]: name === "phone" ? formatPhone(value) : value,
      }));
      // Clear error on change
      if (errors[name as keyof AppointmentFormValues]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    },
    [errors]
  );

  // ----------------------------------------------------------------
  // Quick slot pills
  // ----------------------------------------------------------------
  const handleQuickSlot = (slot: string) => {
    setValues((prev) => ({ ...prev, time: slot }));
    if (errors.time) setErrors((prev) => ({ ...prev, time: undefined }));
  };

  // ----------------------------------------------------------------
  // Validation
  // ----------------------------------------------------------------
  const validateField = (
    name: keyof AppointmentFormValues,
    value: string
  ): string | undefined => {
    switch (name) {
      case "patientName":
        if (value.trim().length < 3) {
          return "Please enter patient's legal name (at least 3 letters).";
        }
        return undefined;
      case "phone":
        if (!/^\+91 [6-9]\d{4}-\d{5}$/.test(value)) {
          return "Enter a valid 10-digit Indian mobile number (e.g. +91 98765-43210).";
        }
        return undefined;
      case "doctor":
        if (!value) return "Please select an attending practitioner.";
        return undefined;
      case "date":
        if (!value) return "Choose a valid consultation date.";
        return undefined;
      case "time":
        if (!value) return "Select an available slot.";
        return undefined;
      default:
        return undefined;
    }
  };

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    const fields: (keyof AppointmentFormValues)[] = [
      "patientName",
      "phone",
      "doctor",
      "date",
      "time",
    ];
    for (const f of fields) {
      const err = validateField(f, values[f] ?? "");
      if (err) errs[f] = err;
    }
    return errs;
  };

  // ----------------------------------------------------------------
  // Submit
  // ----------------------------------------------------------------
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSubmit(values);
    setValues({ ...EMPTY, date: todayStr });
    setErrors({});
  };

  // ----------------------------------------------------------------
  // Keyboard Enter handler: validate only current active field
  // ----------------------------------------------------------------
  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "TEXTAREA" ||
        target.getAttribute("type") === "submit"
      ) {
        return;
      }
      e.preventDefault();
      const name = target.getAttribute("name") as keyof AppointmentFormValues | null;
      if (name) {
        const val = values[name] ?? "";
        const err = validateField(name, val);
        setErrors((prev) => ({ ...prev, [name]: err }));
      }
    }
  };

  // ----------------------------------------------------------------
  // AI summary generation
  // ----------------------------------------------------------------
  const handleGenerateAi = () => {
    if (!values.symptoms?.trim()) return;
    setAiGenerating(true);
    setTimeout(() => {
      setAiSummary(generateAiSummary(values.symptoms ?? ""));
      setAiGenerating(false);
    }, 900);
  };

  return (
    <div className="bg-[var(--color-surface-container-lowest)] rounded-2xl shadow-sm p-6 md:p-8 flex flex-col gap-6">
      {/* Card header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ color: "#143318" }}
          >
            <FontAwesomeIcon icon={faCalendarCheck} style={{ width: 22, height: 22 }} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-[var(--color-on-surface)]">
              Book an Appointment
            </h2>
            <p className="text-xs text-[var(--color-on-surface-variant)]">
              Reserve slot &amp; assign primary physician
            </p>
          </div>
        </div>
        <span
          className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
          style={{ backgroundColor: "#61ce70", color: "#143318" }}
        >
          New Intake
        </span>
      </div>

      {/* Form */}
      <form
        id="appointment-form"
        noValidate
        onSubmit={handleSubmit}
        onKeyDown={handleKeyDown}
        className="flex flex-col gap-4"
      >
        {/* Patient Name */}
        <FieldWrapper
          id="patient-name"
          label="Patient Full Name"
          error={errors.patientName}
        >
          <IconInput
            id="patient-name"
            name="patientName"
            icon={faUser}
            type="text"
            placeholder="e.g. Surya"
            value={values.patientName}
            onChange={handleChange}
            hasError={!!errors.patientName}
            autoComplete="off"
          />
        </FieldWrapper>

        {/* Phone */}
        <FieldWrapper
          id="patient-phone"
          label="Mobile Number"
          error={errors.phone}
        >
          <IconInput
            id="patient-phone"
            name="phone"
            icon={faPhone}
            type="tel"
            placeholder="+91 12345-67890"
            value={values.phone}
            onChange={handleChange}
            hasError={!!errors.phone}
            maxLength={18}
          />
        </FieldWrapper>

        {/* Doctor */}
        <FieldWrapper
          id="doctor-select"
          label="Attending Physician"
          error={errors.doctor}
        >
          <IconSelect
            id="doctor-select"
            name="doctor"
            icon={faStethoscope}
            value={values.doctor}
            onChange={handleChange}
            hasError={!!errors.doctor}
          >
            <option value="" disabled>
              Select an affiliated specialist...
            </option>
            {DOCTORS.map((d) => (
              <option key={d.id} value={`${d.name}|${d.specialty}`}>
                {d.name} ({d.specialty})
              </option>
            ))}
          </IconSelect>
        </FieldWrapper>

        {/* Date & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FieldWrapper
            id="appointment-date"
            label="Consultation Date"
            error={errors.date}
          >
            <IconInput
              id="appointment-date"
              name="date"
              icon={faCalendar}
              type="date"
              value={values.date}
              onChange={handleChange}
              hasError={!!errors.date}
              min={todayStr}
            />
          </FieldWrapper>

          <FieldWrapper
            id="appointment-time"
            label="Session Slot"
            error={errors.time}
          >
            <IconSelect
              id="appointment-time"
              name="time"
              icon={faClock}
              value={values.time}
              onChange={handleChange}
              hasError={!!errors.time}
            >
              <option value="" disabled>
                Slot...
              </option>
              {TIME_SLOTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </IconSelect>
          </FieldWrapper>
        </div>

        {/* Symptoms + AI */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="patient-symptoms"
            className="flex items-center justify-between text-sm font-medium text-[var(--color-on-surface)]"
          >
            <span className="flex items-center gap-1.5">
              Reason for Visit / Symptoms
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                style={{ backgroundColor: "#61ce70", color: "#143318" }}
              >
                <FontAwesomeIcon icon={faWandMagicSparkles} style={{ width: 13, height: 13 }} />
                AI Intake
              </span>
            </span>
            <span className="text-[10px] uppercase tracking-wider text-[var(--color-outline)]">
              Optional
            </span>
          </label>

          <textarea
            id="patient-symptoms"
            name="symptoms"
            rows={2}
            value={values.symptoms}
            onChange={handleChange}
            placeholder="e.g., Persistent dull migraine for 3 days, sensitivity to light, slight nausea..."
            className="w-full p-3 rounded-xl bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] text-sm placeholder:text-[var(--color-outline)] transition-all focus:outline-none focus:bg-[var(--color-surface-container-lowest)] focus:ring-1 focus:ring-[var(--color-primary-fixed-dim)] resize-none"
          />

          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleGenerateAi}
              disabled={aiGenerating}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--color-surface-container)] hover:bg-[var(--color-surface-container-high)] text-[var(--color-primary)] text-xs font-semibold transition-colors disabled:opacity-60"
            >
              <FontAwesomeIcon
                icon={faWandMagicSparkles}
                style={{ width: 16, height: 16 }}
                className={aiGenerating ? "animate-spin" : ""}
              />
              {aiGenerating ? "Generating..." : "Generate AI Clinical Summary"}
            </button>
            <span className="text-xs text-[var(--color-outline)] hidden sm:inline">
              Synthesizes triage assessment
            </span>
          </div>

          {/* AI summary box */}
          <div className="p-3 rounded-xl bg-[var(--color-surface-container-low)] border border-[var(--color-primary-fixed-dim)]/40 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-primary)]">
                <FontAwesomeIcon icon={faBrain} style={{ width: 14, height: 14 }} />
                AI Clinical Triage Summary
              </div>
              <span className="text-[10px] text-[var(--color-outline)]">
                {aiGenerating ? "Generating…" : "Ready"}
              </span>
            </div>
            <p className="text-xs text-[var(--color-on-surface-variant)] leading-snug italic">
              {aiSummary}
            </p>
          </div>
        </div>

        {/* Quick slot pills */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-[var(--color-outline)]">
            Rapid Slot Quick Select
          </span>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_SLOTS.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => handleQuickSlot(slot)}
                className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${values.time === slot
                  ? "bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)] font-semibold"
                  : "bg-[var(--color-surface-container-low)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)] hover:text-[var(--color-on-surface)]"
                  }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="mt-1 h-12 w-full rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99]"
          style={{ backgroundColor: "#61ce70", color: "#143318" }}
        >
          <FontAwesomeIcon icon={faCalendarCheck} style={{ width: 20, height: 20 }} />
          Confirm &amp; Book Appointment
        </button>
      </form>

      {/* Notice card */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--color-surface-container-low)]">
        <div className="w-8 h-8 rounded-lg bg-[var(--color-secondary-fixed)] flex items-center justify-center text-[var(--color-on-secondary-fixed)] shrink-0">
          <FontAwesomeIcon icon={faCircleInfo} style={{ width: 18, height: 18 }} />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-semibold text-[var(--color-on-surface)]">
            Triage &amp; Rescheduling Note
          </span>
          <p className="text-xs text-[var(--color-outline)] leading-relaxed">
            Appointments can be amended or canceled up to 2 hours prior to
            consultation time without outpatient administrative penalty.
          </p>
        </div>
      </div>
    </div>
  );
}
