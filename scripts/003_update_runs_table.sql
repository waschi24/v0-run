-- Migration: Update runs table to include duration and distance, and remove avg_pace
alter table public.runs drop column if exists avg_pace; -- Remove avg_pace as it can be calculated from duration and distance
alter table public.runs add column if not exists duration text; -- Format mm:ss
alter table public.runs add column if not exists distance float; -- z.B. 5.0 für 5 km