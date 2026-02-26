"use client"

import { useEffect, useState, useCallback } from "react"
import useSWR from "swr"
import { createClient } from "@/lib/supabase/client"
import type { Run } from "@/lib/types"
import { RunDialog } from "@/components/run-dialog"
import { RunsTable } from "@/components/runs-table"
import { exportToMarkdown, downloadMarkdown } from "@/lib/export"
import { Button } from "@/components/ui/button"
import { Plus, Download } from "lucide-react"

function useRuns() {
  const supabase = createClient()
  const { data, error, mutate } = useSWR(
    "runs",
    async () => {
      const { data, error } = await supabase
        .from("runs")
        .select("*")
        .order("date", { ascending: false })
      if (error) throw error
      return data as Run[]
    }
  )
  return { runs: data ?? [], error, mutate }
}

export default function DashboardPage() {
  const { runs, mutate } = useRuns()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleExport = useCallback(() => {
    if (runs.length === 0) return
    const md = exportToMarkdown(runs)
    const today = new Date().toISOString().split("T")[0]
    downloadMarkdown(md, `runs-${today}.md`)
  }, [runs])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-primary-foreground"
              >
                <path d="M13 4v16" />
                <path d="M17 4v16" />
                <path d="M19 4H9.5a4.5 4.5 0 0 0 0 9H13" />
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Run Tracker
            </h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Your Runs
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {runs.length} {runs.length === 1 ? "run" : "runs"} logged
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={runs.length === 0}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Export Markdown
            </Button>
            <RunDialog
              onSuccess={() => mutate()}
              trigger={
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Log Run
                </Button>
              }
            />
          </div>
        </div>

        <RunsTable runs={runs} onMutate={() => mutate()} />
      </main>
    </div>
  )
}
