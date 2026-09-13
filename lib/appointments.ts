import { supabase, isSupabaseConfigured, type DbAppointment } from "./supabaseClient";

export interface NewAppointmentPayload {
  patient_name: string;
  mobile: string;
  doctor: string;
  date: string;
  time: string;
  status?: string;
  reason?: string;
  summary?: string;
}

/**
 * Fetch all appointments from Supabase sorted by date and time
 */
export async function getAppointments(): Promise<DbAppointment[]> {
  if (!isSupabaseConfigured) {
    throw new Error("SUPABASE_NOT_CONFIGURED");
  }

  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .order("date", { ascending: true })
    .order("time", { ascending: true });

  if (error) {
    console.error("Supabase fetch error:", error);
    throw new Error(error.message);
  }

  return data ?? [];
}

/**
 * Insert a new appointment record into Supabase
 */
export async function createAppointment(
  appointment: NewAppointmentPayload
): Promise<DbAppointment> {
  if (!isSupabaseConfigured) {
    throw new Error("SUPABASE_NOT_CONFIGURED");
  }

  const { data, error } = await supabase
    .from("appointments")
    .insert([
      {
        patient_name: appointment.patient_name,
        mobile: appointment.mobile,
        doctor: appointment.doctor,
        date: appointment.date,
        time: appointment.time,
        status: appointment.status ?? "Scheduled",
        reason: appointment.reason || null,
        summary: appointment.summary || null,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Supabase insert error:", error);
    throw new Error(error.message);
  }

  return data;
}

/**
 * Update the status of an appointment ('Upcoming' / 'Completed' / 'Canceled')
 */
export async function updateAppointmentStatus(
  id: number | string,
  newStatus: string
): Promise<DbAppointment> {
  if (!isSupabaseConfigured) {
    throw new Error("SUPABASE_NOT_CONFIGURED");
  }

  const numericId = typeof id === "string" ? parseInt(id, 10) : id;

  const { data, error } = await supabase
    .from("appointments")
    .update({ status: newStatus })
    .eq("id", numericId)
    .select()
    .single();

  if (error) {
    console.error("Supabase update error:", error);
    throw new Error(error.message);
  }

  return data;
}

/**
 * Delete an appointment by id from Supabase
 */
export async function deleteAppointment(id: number | string): Promise<void> {
  if (!isSupabaseConfigured) {
    throw new Error("SUPABASE_NOT_CONFIGURED");
  }

  const numericId = typeof id === "string" ? parseInt(id, 10) : id;

  const { error } = await supabase
    .from("appointments")
    .delete()
    .eq("id", numericId);

  if (error) {
    console.error("Supabase delete error:", error);
    throw new Error(error.message);
  }
}
