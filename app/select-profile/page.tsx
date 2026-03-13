"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useProfile, type Profile } from "@/lib/profile-context"

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function ProfileCard({ profile, onSelect }: { profile: Profile; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      className="group flex flex-col items-center gap-4 focus:outline-none"
      aria-label={`Select profile: ${profile.name}`}
    >
      <div
        className="relative flex h-28 w-28 items-center justify-center rounded-lg transition-all duration-200 group-hover:scale-110 group-hover:ring-4 group-hover:ring-gray-300 group-focus-visible:ring-4 group-focus-visible:ring-gray-300 sm:h-36 sm:w-36"
        style={{ backgroundColor: profile.avatar_color }}
      >
        <span className="text-4xl font-bold text-white sm:text-5xl">
          {getInitials(profile.name)}
        </span>
      </div>
      <span className="text-base font-medium text-gray-700 transition-colors group-hover:text-gray-900 sm:text-lg">
        {profile.name}
      </span>
    </button>
  )
}

export default function SelectProfilePage() {
  const { profiles, selectedProfile, selectProfile, loading } = useProfile()
  const router = useRouter()

  useEffect(() => {
    if (!loading && selectedProfile) {
      router.replace("/")
    }
  }, [loading, selectedProfile, router])

  const handleSelect = (profile: Profile) => {
    selectProfile(profile)
    router.push("/")
  }

  if (loading || selectedProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
      <div className="mb-12 flex flex-col items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-primary-foreground"
          >
            <path d="M13 4v16" />
            <path d="M17 4v16" />
            <path d="M19 4H9.5a4.5 4.5 0 0 0 0 9H13" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Run Tracker
        </h1>
        <p className="text-base text-gray-500">Who is running today?</p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
        {profiles.map((profile) => (
          <ProfileCard
            key={profile.id}
            profile={profile}
            onSelect={() => handleSelect(profile)}
          />
        ))}
      </div>
    </div>
  )
}
