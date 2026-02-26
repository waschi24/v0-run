"use client"

import type { Run } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { RunDialog } from "@/components/run-dialog"
import { Pencil, Trash2 } from "lucide-react"

interface RunsTableProps {
  runs: Run[]
  onMutate: () => void
}

export function RunsTable({ runs, onMutate }: RunsTableProps) {
  const handleDelete = async (id: string) => {
    const supabase = createClient()
    await supabase.from("runs").delete().eq("id", id)
    onMutate()
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00")
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (runs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
        <p className="text-lg font-medium text-muted-foreground">
          No runs logged yet
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Click "Log Run" to add your first entry.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold text-foreground">Type</TableHead>
            <TableHead className="font-semibold text-foreground">Date</TableHead>
            <TableHead className="font-semibold text-foreground">Avg BPM</TableHead>
            <TableHead className="font-semibold text-foreground">Max BPM</TableHead>
            <TableHead className="font-semibold text-foreground">Avg Pace</TableHead>
            <TableHead className="font-semibold text-foreground">Avg SPM</TableHead>
            <TableHead className="font-semibold text-foreground">Notes</TableHead>
            <TableHead className="w-[100px] font-semibold text-foreground">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {runs.map((run) => (
            <TableRow key={run.id}>
              <TableCell>
                <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                  {run.type}
                </span>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {formatDate(run.date)}
              </TableCell>
              <TableCell>{run.avg_bpm ?? "-"}</TableCell>
              <TableCell>{run.max_bpm ?? "-"}</TableCell>
              <TableCell>{run.avg_pace ?? "-"}</TableCell>
              <TableCell>{run.avg_spm ?? "-"}</TableCell>
              <TableCell className="max-w-[200px] truncate">
                {run.notes ?? "-"}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <RunDialog
                    run={run}
                    onSuccess={onMutate}
                    trigger={
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit run</span>
                      </Button>
                    }
                  />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete run</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this run?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete this run entry.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(run.id)}
                          className="bg-destructive text-destructive-foreground text-white hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
