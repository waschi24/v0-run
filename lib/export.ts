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
    let formattedTime = "-"
    let pace = "-"
    if (run.duration) {
      formattedTime = `${Math.floor(run.duration / 60)}:${Math.round(run.duration % 60).toString().padStart(2, "0")}`
      if (run.distance) {
        let secondsPerKm =  run.duration / run.distance
        pace = `${Math.floor(secondsPerKm / 60)}:${Math.round(secondsPerKm % 60).toString().padStart(2, "0")}`
      }
    }
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
