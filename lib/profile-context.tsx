"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"

export interface Profile {
  id: string
  name: string
  avatar_color: string
}

interface ProfileContextValue {
  profiles: Profile[]
  selectedProfile: Profile | null
  selectProfile: (profile: Profile) => void
  clearProfile: () => void
  loading: boolean
}

const ProfileContext = createContext<ProfileContextValue | null>(null)

const STORAGE_KEY = "run_tracker_profile"

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        const list = (data as Profile[]) ?? []
        setProfiles(list)

        // Restore from localStorage
        try {
          const stored = localStorage.getItem(STORAGE_KEY)
          if (stored) {
            const parsed: Profile = JSON.parse(stored)
            // Verify the stored profile still exists in the DB
            const match = list.find((p) => p.id === parsed.id)
            if (match) setSelectedProfile(match)
          }
        } catch {
          // ignore
        }

        setLoading(false)
      })
  }, [])

  const selectProfile = useCallback((profile: Profile) => {
    setSelectedProfile(profile)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
  }, [])

  const clearProfile = useCallback(() => {
    setSelectedProfile(null)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return (
    <ProfileContext.Provider value={{ profiles, selectedProfile, selectProfile, clearProfile, loading }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider")
  return ctx
}
