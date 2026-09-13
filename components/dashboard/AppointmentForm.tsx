"use client";

import React, { useState, useCallback } from "react";
import Icon from "@/components/ui/Icon";
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
          <Icon name="error" size={14} />
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
}: { id: string; icon: string; hasError?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      <Icon
        name={icon}
        size={20}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-outline)]"
      />
      <input
        id={id}
        className={`w-full h-11 pl-11 pr-4 rounded-xl bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] text-sm placeholder:text-[var(--color-outline)] transition-all focus:outline-none focus:bg-[var(--color-surface-container-lowest)] ${
          hasError
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
  icon: string;
  hasError?: boolean;
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <Icon
        name={icon}
        size={20}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-outline)]"
      />
      <select
        id={id}
        className={`w-full h-11 pl-11 pr-8 appearance-none rounded-xl bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] text-sm transition-all focus:outline-none focus:bg-[var(--color-surface-container-lowest)] cursor-pointer ${
          hasError
            ? "ring-2 ring-[var(--color-error)]"
            : "focus:ring-1 focus:ring-[var(--color-primary-fixed-dim)]"
        }`}
        {...props}
      >
        {children}
      </select>
      <Icon
        name="expand_more"
        size={20}
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
  // Phone formatter
  // ----------------------------------------------------------------
  const formatPhone = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 10);
    if (digits.length === 0) return "";
    if (digits.length <= 3) return `+1 (${digits}`;
    if (digits.length <= 6)
      return `+1 (${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `+1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
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
  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (values.patientName.trim().length < 3)
      errs.patientName = "Please enter patient's legal name (at least 3 letters).";
    if (!/^\+1 \(\d{3}\) \d{3}-\d{4}$/.test(values.phone))
      errs.phone = "Enter a valid mobile number (e.g. +1 (555) 000-0000).";
    if (!values.doctor) errs.doctor = "Please select an attending practitioner.";
    if (!values.date) errs.date = "Choose a valid consultation date.";
    if (!values.time) errs.time = "Select an available slot.";
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
            style={{ backgroundColor: "#61ce70", color: "#143318" }}
          >
            <Icon name="edit_calendar" size={22} />
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
        className="flex flex-col gap-4"
      >
        {/* Patient Name */}
        <FieldWrapper
          id="patient-name"
          label="Patient Full Name"
          badge={
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-outline)]">
              Required
            </span>
          }
          error={errors.patientName}
        >
          <IconInput
            id="patient-name"
            name="patientName"
            icon="person"
            type="text"
            placeholder="e.g. Sarah Connor"
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
          badge={
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-outline)]">
              SMS Alert
            </span>
          }
          error={errors.phone}
        >
          <IconInput
            id="patient-phone"
            name="phone"
            icon="phone"
            type="tel"
            placeholder="+1 (555) 000-0000"
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
            icon="stethoscope"
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
              icon="event"
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
              icon="schedule"
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
                <Icon name="auto_awesome" size={13} />
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
              <Icon
                name="auto_awesome"
                size={16}
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
                <Icon name="psychology" size={14} />
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
                className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
                  values.time === slot
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
          <Icon name="event_available" size={20} />
          Confirm &amp; Book Appointment
        </button>
      </form>

      {/* Notice card */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--color-surface-container-low)]">
        <div className="w-8 h-8 rounded-lg bg-[var(--color-secondary-fixed)] flex items-center justify-center text-[var(--color-on-secondary-fixed)] shrink-0">
          <Icon name="info" size={18} />
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
