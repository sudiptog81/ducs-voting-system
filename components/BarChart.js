"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Tooltip,
  PointElement,
  BarElement,
  Colors,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  Tooltip,
  PointElement,
  BarElement,
  ChartDataLabels,
  Colors,
);

export default function BarChart({ data, post }) {
  const chartData = {
    labels: data.map((d) => (d.course != "NOTA" ? [d.name, d.course] : d.name)),
    datasets: [
      {
        label: "Votes",
        data: data.map((d) => d.votes),
        backgroundColor: "#652b7c",
        borderColor: "#652b7c",
        borderWidth: 1,
        barThickness: 24,
        maxBarThickness: 24,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
        display: true,
        color: "white",
        rotation: -90,
      },
    },
  };

  return (
    <div className="w-96 mx-auto h-full text-center">
      <Bar data={chartData} options={options} className="mt-0" />
    </div>
  );
}
