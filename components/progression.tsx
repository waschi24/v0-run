"use client"

import {
    Chart as ChartJS,
    ChartData,
    ChartOptions,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Tooltip,
    TooltipItem
} from 'chart.js';
import {Scatter} from "react-chartjs-2";
import {Run} from "@/lib/types";

interface ProgressionProps {
    runs: Run[]
}

export function Progression({runs}: ProgressionProps) {
    ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

    function formatDate (dateStr: string) {
        const d = new Date(dateStr + "T00:00:00")
        return d.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    function formatDuration (duration: number) {
        return `${Math.floor(duration / 60)}:${Math.round(duration % 60).toString().padStart(2, "0")}`
    }

    const options: ChartOptions<"scatter"> = {
        scales: {
            x: {
                reverse: true
            },
            y: {
                reverse: true
            }
        }
    }

    let data: { x: number, y: number }[] = []

    for (const run of runs) {
        if (!run.avg_bpm || !run.duration || !run.distance) return;
        data.push({x: run.avg_bpm, y: Math.round(run.duration / run.distance / 60 * 100) / 100})
    }

    const chartData: ChartData<"scatter"> = {
        datasets: [
            {
                label: 'Run',
                data: data,
                backgroundColor: 'rgb(0, 140, 108)',
                tooltip: {
                    callbacks: {
                        label(tooltipItem: TooltipItem<"scatter">): string | string[] | void {
                            const run = runs[tooltipItem.dataIndex]
                            return `${run.type} on ${formatDate(run.date)}: ${formatDuration(run.duration! / run.distance!)} min/km`
                        }
                    }
                },
            }
        ]
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-4xl font-bold mb-4">Progression Diagrams</h1>
            <p className="text-lg text-gray-600">This diagrams will show your progression over time.</p>
            <Scatter options={options} data={chartData}/>
        </div>
    );
}