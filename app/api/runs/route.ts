import {NextResponse} from "next/server";
import {useRuns} from "@/app/page";

export async function GET() {
    const {runs, error} = useRuns()

    if (error) {
        return NextResponse.json({ error: error.message }, { status:500 })
    }

    return NextResponse.json(runs, { status:200 })
}