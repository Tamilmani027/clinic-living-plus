import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes("your-project-id") &&
    !supabaseAnonKey.includes("your-anon-key")
);

// Fallback dummy URL to prevent createClient constructor error when env vars are not yet populated
export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : "https://placeholder-project.supabase.co",
  isSupabaseConfigured ? supabaseAnonKey : "placeholder-anon-key"
);

export interface DbAppointment {
  id: number;
  created_at?: string;
  patient_name: string;
  mobile: string;
  doctor: string;
  date: string;
  time: string;
  status: string;
  reason?: string | null;
  summary?: string | null;
}
