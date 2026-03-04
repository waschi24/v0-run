import type { Run } from "@/lib/types"

export function exportToMarkdown(runs: Run[]): string {
  const header =
    "| Type | Date | Avg BPM | Max BPM | Distance | Duration | Avg Pace | Avg SPM | Notes |"
  const separator =
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- |"

  const rows = runs.map((run) => {
    const date = new Date(run.date + "T00:00:00").toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
    const formattedTime = formatTime(run.duration)
    const pace = formatPace(run.duration, run.distance)
    return `| ${run.type} | ${date} | ${run.avg_bpm ?? "-"} | ${run.max_bpm ?? "-"} | ${run.distance ? run.distance + "km" : "-"} | ${formattedTime} | ${pace} | ${run.avg_spm ?? "-"} | ${(run.notes ?? "-").replace(/\|/g, "\\|").replace(/\n/g, " ")} |`
  })

  return [header, separator, ...rows].join("\n")
}

export function downloadMarkdown(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function exportToCSV(runs: Run[]): string {
  const header = "Type,Date,Avg BPM,Max BPM,Distance (km),Duration (s),Avg Pace (s),Avg SPM,Notes"
  const rows = runs.map((run) => {
    const date = new Date(run.date + "T00:00:00").toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
    const pace = run.duration && run.distance ? Math.round(run.duration / run.distance) : null
    return `${run.type},${date},${run.avg_bpm},${run.max_bpm},${run.distance},${run.duration},${pace},${run.avg_spm},"${(run.notes ?? "-").replace(/"/g, '""')}"`
  })

  return [header, ...rows].join("\n")
}

export function downloadCSV(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}


function formatTime (duration: number | null) {
  if (duration === null) return "-"
  return `${Math.floor(duration / 60)}:${Math.round(duration % 60).toString().padStart(2, "0")}`
}

function formatPace (duration: number | null, distance: number | null) {
  if (duration === null || distance === null) return "-"
  let secondsPerKm =  duration / distance
  return formatTime(secondsPerKm)
}