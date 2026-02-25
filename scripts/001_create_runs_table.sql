-- Create the runs table for the run tracker
create table if not exists public.runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null default 'Easy Run',
  date date not null default current_date,
  avg_bpm integer,
  max_bpm integer,
  avg_pace text,
  avg_spm integer,
  notes text,
  created_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.runs enable row level security;

-- RLS policies: users can only access their own runs
create policy "Users can view their own runs" on public.runs
  for select using (auth.uid() = user_id);

create policy "Users can insert their own runs" on public.runs
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own runs" on public.runs
  for update using (auth.uid() = user_id);

create policy "Users can delete their own runs" on public.runs
  for delete using (auth.uid() = user_id);
