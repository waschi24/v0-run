-- Remove authentication: make user_id optional and disable RLS

-- Drop existing RLS policies
drop policy if exists "Users can view their own runs" on public.runs;
drop policy if exists "Users can insert their own runs" on public.runs;
drop policy if exists "Users can update their own runs" on public.runs;
drop policy if exists "Users can delete their own runs" on public.runs;

-- Disable Row Level Security
alter table public.runs disable row level security;

-- Make user_id nullable and drop the foreign key constraint
alter table public.runs
  alter column user_id drop not null,
  drop constraint if exists runs_user_id_fkey;

