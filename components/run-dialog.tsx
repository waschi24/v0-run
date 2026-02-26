"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Run } from "@/lib/types"
import { RUN_TYPES } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface RunDialogProps {
  run?: Run
  onSuccess: () => void
  trigger: React.ReactNode
}

export function RunDialog({ run, onSuccess, trigger }: RunDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [type, setType] = useState(run?.type ?? "Easy Run")
  const [date, setDate] = useState(
    run?.date ?? new Date().toISOString().split("T")[0]
  )
  const [avgBpm, setAvgBpm] = useState(run?.avg_bpm?.toString() ?? "")
  const [maxBpm, setMaxBpm] = useState(run?.max_bpm?.toString() ?? "")
  const [avgPace, setAvgPace] = useState(run?.avg_pace ?? "")
  const [avgSpm, setAvgSpm] = useState(run?.avg_spm?.toString() ?? "")
  const [notes, setNotes] = useState(run?.notes ?? "")

  const resetForm = () => {
    if (!run) {
      setType("Easy Run")
      setDate(new Date().toISOString().split("T")[0])
      setAvgBpm("")
      setMaxBpm("")
      setAvgPace("")
      setAvgSpm("")
      setNotes("")
    }
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    const data = {
      type,
      date,
      avg_bpm: avgBpm ? parseInt(avgBpm) : null,
      max_bpm: maxBpm ? parseInt(maxBpm) : null,
      avg_pace: avgPace || null,
      avg_spm: avgSpm ? parseInt(avgSpm) : null,
      notes: notes || null,
    }

    try {
      if (run) {
        const { error: updateError } = await supabase
          .from("runs")
          .update(data)
          .eq("id", run.id)
        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase
          .from("runs")
          .insert(data)
        if (insertError) throw insertError
      }
      onSuccess()
      setOpen(false)
      resetForm()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v)
        if (v && run) {
          setType(run.type)
          setDate(run.date)
          setAvgBpm(run.avg_bpm?.toString() ?? "")
          setMaxBpm(run.max_bpm?.toString() ?? "")
          setAvgPace(run.avg_pace ?? "")
          setAvgSpm(run.avg_spm?.toString() ?? "")
          setNotes(run.notes ?? "")
        }
        if (!v) resetForm()
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{run ? "Edit Run" : "Log a Run"}</DialogTitle>
          <DialogDescription>
            {run
              ? "Update the details of your run."
              : "Fill in the details of your run."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="type">Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {RUN_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="avg-bpm">Avg BPM</Label>
                <Input
                  id="avg-bpm"
                  type="number"
                  placeholder="145"
                  value={avgBpm}
                  onChange={(e) => setAvgBpm(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="max-bpm">Max BPM</Label>
                <Input
                  id="max-bpm"
                  type="number"
                  placeholder="180"
                  value={maxBpm}
                  onChange={(e) => setMaxBpm(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="avg-pace">Avg Pace</Label>
                <Input
                  id="avg-pace"
                  type="text"
                  placeholder="5:30 /km"
                  value={avgPace}
                  onChange={(e) => setAvgPace(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="avg-spm">Avg SPM</Label>
                <Input
                  id="avg-spm"
                  type="number"
                  placeholder="170"
                  value={avgSpm}
                  onChange={(e) => setAvgSpm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="How did it feel?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? run
                  ? "Saving..."
                  : "Adding..."
                : run
                  ? "Save Changes"
                  : "Add Run"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
