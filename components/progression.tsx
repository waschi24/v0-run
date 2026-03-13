"use client"

import {
    CategoryScale,
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
import {useState, useMemo, useEffect} from "react";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Label} from "@/components/ui/label";

interface ProgressionProps {
    runs: Run[]
}

export function Progression({runs}: ProgressionProps) {
    ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

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
                reverse: true,
                labels: ["Heart Rate (BPM)"]
            },
            y: {
                reverse: true,
                labels: ["Pace (min/km)"]
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
                labels: ["Pace (min/km)"]
            },
        }
    };

    const usedRunTypes = useMemo(() => {
        return runs && Array.from(new Set(runs.map(run => run.type as RunType))) ? Array.from(new Set(runs.map(run => run.type as RunType))) : [RunType.EASY_RUN]
    }, [runs]);

    const [runType, setRunType] = useState<RunType>();

    useEffect(() => {
        setRunType(usedRunTypes[0]);
    }, [usedRunTypes]);

    const { lineRuns, labels, lineData, lineChartData } = useMemo(() => {
        const filteredRuns = runs.filter(run => run.duration !== null && run.distance !== null && run.type === runType).reverse()
        const runLabels = filteredRuns.map(run => formatDate(run.date))

        let data: number[] = []

        for (const run of filteredRuns) {
            if (!run.avg_bpm || !run.duration || !run.distance) return { lineRuns: [], labels: [], lineData: [], lineChartData: { labels: [], datasets: [] } };
            data.push(Math.round(run.duration / run.distance / 60 * 100) / 100)
        }

        const chartData: ChartData<"line"> = {
            labels: runLabels,
            datasets: [
                {
                    label: 'Run',
                    data: data,
                    backgroundColor: 'rgb(0, 140, 108)',
                    tooltip: {
                        callbacks: {
                            label(tooltipItem: TooltipItem<"line">): string | string[] | void {
                                const run = runs[tooltipItem.dataIndex]
                                return `${run.type} on ${formatDate(run.date)}: ${formatDuration(run.duration! / run.distance!)} min/km`
                            }
                        }
                    },
                }
            ],
        };

        return { lineRuns: filteredRuns, labels: runLabels, lineData: data, lineChartData: chartData };
    }, [runType, runs]);

    return (
        <div className="flex flex-col items-center justify-center pt-4">
            <h1 className="text-2xl font-bold">Progression Diagrams</h1>
            <p className="text-lg text-gray-600 mt-4">This scatter diagram shows your progression over time. </p>
            <Scatter options={scatterOptions} data={scatterChartData}/>
            <p className="text-lg text-gray-600 mt-4">This line diagram shows your pace over time.</p>
            <RadioGroup defaultValue={runType} className="mb-4 flex flex-row gap-4">
                {usedRunTypes.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                        <RadioGroupItem value={type} id={type} />
                        <Label htmlFor={type}>{type}</Label>
                    </div>
                ))}
            </RadioGroup>
            <select
                className="mb-4 px-4 py-2 border border-gray-400 rounded-md cursor-pointer flex flex-row"
                defaultValue={runType}
                onChange={(e) => setRunType(e.target.value as RunType)}
            >
                {usedRunTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                ))}
            </select>
            <Line key={runType} options={lineOptions} data={lineChartData}/>
        </div>
    );
}
