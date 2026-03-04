"use server";

import {NextResponse} from "next/server";
import {createClient} from "@/lib/supabase/server";

export async function GET() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("runs")
        .select("*")
        .order("date", { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status:500 });
    }

    return NextResponse.json(data ?? [], { status:200 });
}