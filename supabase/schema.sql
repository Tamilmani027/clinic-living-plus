-- ==============================================================================
-- Clinic Living Plus: Appointments Table Schema for Supabase
-- ==============================================================================

-- 1. Create the appointments table
create table if not exists public.appointments (
  id bigint generated always as identity primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  patient_name text not null,
  mobile text not null,
  doctor text not null,
  date date not null,
  time text not null,
  status text not null default 'Upcoming',
  reason text,
  summary text
);

-- 2. Enable Row Level Security (RLS)
alter table public.appointments enable row level security;

-- 3. Policy: Allow all operations (select, insert, update, delete) for public/anon users
create policy "Allow all operations for anon users"
  on public.appointments
  for all
  using (true)
  with check (true);

-- 4. Helpful index for querying by date & status
create index if not exists idx_appointments_date on public.appointments(date desc);
create index if not exists idx_appointments_status on public.appointments(status);
