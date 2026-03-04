"use client"

import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from 'chart.js';
import {Scatter} from "react-chartjs-2";
import {Run} from "@/lib/types";

interface ProgressionProps {
    runs: Run[]
}

export function Progression({runs}: ProgressionProps) {
    ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

    let data: { x: number, y: number }[] = []

    for (const run of runs) {
        if (!run.avg_bpm || !run.duration || !run.distance) return;
        data.push({x: run.avg_bpm, y: run.duration / run.distance})
    }

    const dataSet = {
        datasets: [
            {
                label: 'A dataset',
                data: data,
                backgroundColor: 'rgb(0, 140, 108)'
            }
        ]
    }


    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-4xl font-bold mb-4">Progression Page</h1>
            <p className="text-lg text-gray-600">This page will show your progression over time.</p>
            <Scatter data={dataSet} />
        </div>
    );
}