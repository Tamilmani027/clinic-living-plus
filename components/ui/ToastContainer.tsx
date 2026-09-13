"use client";

import React, { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircleExclamation, faCircleInfo, faXmark } from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";

export type ToastVariant = "success" | "error" | "info";

export interface ToastMessage {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

const VARIANT_CONFIG: Record<
  ToastVariant,
  { icon: IconDefinition; bg: string; text: string; border: string }
> = {
  success: {
    icon: faCircleCheck,
    bg: "bg-[var(--color-tertiary-fixed)]",
    text: "text-[var(--color-on-tertiary-fixed-variant)]",
    border: "border-[var(--color-tertiary)]",
  },
  error: {
    icon: faCircleExclamation,
    bg: "bg-[var(--color-error-container)]",
    text: "text-[var(--color-on-error-container)]",
    border: "border-[var(--color-error)]",
  },
  info: {
    icon: faCircleInfo,
    bg: "bg-[var(--color-secondary-fixed)]",
    text: "text-[var(--color-on-secondary-fixed-variant)]",
    border: "border-[var(--color-secondary)]",
  },
};

/** Single dismissible toast notification. Auto-removes after 4 seconds. */
function Toast({ toast, onDismiss }: ToastProps) {
  const cfg = VARIANT_CONFIG[toast.variant];
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => onDismiss(toast.id), 4000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [toast.id, onDismiss]);

  return (
    <div
      role="alert"
      className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg border ${cfg.bg} ${cfg.text} ${cfg.border} animate-slide-in min-w-[280px] max-w-xs`}
    >
      <FontAwesomeIcon icon={cfg.icon} style={{ width: 20, height: 20 }} className="shrink-0 mt-0.5" />
      <p className="text-sm font-medium leading-snug flex-1">{toast.message}</p>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Dismiss notification"
      >
        <FontAwesomeIcon icon={faXmark} style={{ width: 18, height: 18 }} />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

/** Fixed-position container that stacks toast notifications. */
export default function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed top-20 right-6 z-50 flex flex-col gap-2 pointer-events-none"
    >
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
