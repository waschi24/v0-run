export interface Run {
  id: string
  user_id?: string
  type: string
  date: string
  avg_bpm: number | null
  max_bpm: number | null
  duration: number | null
  distance: number | null
  avg_spm: number | null
  notes: string | null
  created_at: string
}

export type RunInsert = Omit<Run, "id" | "created_at">

export const RUN_TYPES = [
  "Easy Run",
  "Long Run",
  "Tempo Run",
  "Interval",
  "Fartlek",
  "Recovery",
  "Race",
  "Trail",
  "Treadmill",
] as const

export enum RunType {
  EASY_RUN = "Easy Run",
  LONG_RUN = "Long Run",
  TEMPO_RUN = "Tempo Run",
  INTERVAL = "Interval",
  FARTLEK = "Fartlek",
  RECOVERY = "Recovery",
  RACE = "Race",
  TRAIL = "Trail",
  TREADMILL = "Treadmill",
}
