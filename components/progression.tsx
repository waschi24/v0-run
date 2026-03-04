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
import {Line, Scatter} from "react-chartjs-2";
import {Run, RunType} from "@/lib/types";

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

    const scatterOptions: ChartOptions<"scatter"> = {
        scales: {
            x: {
                reverse: true
            },
            y: {
                reverse: true
            }
        }
    }

    let scatterData: { x: number, y: number }[] = []

    for (const run of runs) {
        if (!run.avg_bpm || !run.duration || !run.distance) return;
        scatterData.push({x: run.avg_bpm, y: Math.round(run.duration / run.distance / 60 * 100) / 100})
    }

    const scatterChartData: ChartData<"scatter"> = {
        datasets: [
            {
                label: 'Run',
                data: scatterData,
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

    const lineOptions: ChartOptions<"line"> = {
        scales: {
            y:{
                reverse: true,
            }
        }
    };

    let runType: RunType = RunType.EASY_RUN;
    const lineRuns = runs.filter(run => run.duration !== null && run.distance !== null && run.type === runType.toString())
    const labels = lineRuns.map(run => formatDate(run.date))

    let lineData: number[] = []

    for (const run of lineRuns) {
        if (!run.avg_bpm || !run.duration || !run.distance) return;
        lineData.push(Math.round(run.duration / run.distance / 60 * 100) / 100)
    }

    const lineChartData: ChartData<"line"> = {
        labels,
        datasets: [
            {
                label: 'Run',
                data: lineData,
                backgroundColor: 'rgb(0, 140, 108)',
            }
        ],
    };

    return (
        <div className="flex flex-col items-center justify-center pt-4">
            <h1 className="text-2xl font-bold mb-4">Progression Diagrams</h1>
            <p className="text-lg text-gray-600">This diagrams will show your progression over time.</p>
            <Scatter options={scatterOptions} data={scatterChartData}/>
            <Line options={lineOptions} data={lineChartData}/>
        </div>
    );
}