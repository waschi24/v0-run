"use client"

import { createClient } from "@/lib/supabase/server"
import {NextResponse} from "next/server";
import useSWR from "swr";
import type {Run} from "@/lib/types";

export async function GET() {
    const { runs, error} = useRuns()

    if (error) {
        return NextResponse.json({ error: error.message }, { status:500 })
    }

    return NextResponse.json(runs, { status:200 })
}

function useRuns() {
    const supabase = createClient()
    const { data, error, mutate } = useSWR(
        "runs",
        async () => {
            const { data, error } = await (await supabase)
                .from("runs")
                .select("*")
                .order("date", { ascending: false })
            if (error) throw error
            return data as Run[]
        }
    )
    return { runs: data ?? [], error, mutate }
}