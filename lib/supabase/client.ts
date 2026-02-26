import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_RUNSUPABASE_URL!,
    process.env.NEXT_PUBLIC_RUNSUPABASE_ANON_KEY!,
  )
}
