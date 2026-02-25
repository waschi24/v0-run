import type { Run } from "@/lib/types"

export function exportToMarkdown(runs: Run[]): string {
  const header =
    "| Type | Date | Avg BPM | Max BPM | Avg Pace | Avg SPM | Notes |"
  const separator =
    "| --- | --- | --- | --- | --- | --- | --- |"

  const rows = runs.map((run) => {
    const date = new Date(run.date + "T00:00:00").toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
    return `| ${run.type} | ${date} | ${run.avg_bpm ?? "-"} | ${run.max_bpm ?? "-"} | ${run.avg_pace ?? "-"} | ${run.avg_spm ?? "-"} | ${(run.notes ?? "-").replace(/\|/g, "\\|").replace(/\n/g, " ")} |`
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
