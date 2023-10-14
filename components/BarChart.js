'use client'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Tooltip,
  PointElement,
  BarElement,
  Colors
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  Tooltip,
  PointElement,
  BarElement,
  Colors
)

export default function BarChart({ data, post }) {
  const chartData = {
    labels: data.map(d => d.course != 'NOTA' ? [d.name, d.course] : d.name),
    datasets: [
      {
        label: "Votes",
        data: data.map(d => d.votes),
        backgroundColor: "#652b7c",
        borderColor: "#652b7c",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      colors: {
        enabled: true
      }
    },
  };

  return (
    <div className='w-96 mx-auto h-full text-center mt-10'>
      <Bar data={chartData} options={options} />
    </div>
  );
}
