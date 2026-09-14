import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import ErrorBoundary from "../../../global/ErrorBoundaries/ErrorBoundary";
import { ChartData } from "chart.js";
import React from "react";
ChartJS.register(ArcElement, Tooltip, Legend);

const variants = {
  open: { opacity: 1 },
  closed: { opacity: 0 },
};

const ratings: string[] = [
  "Very High",
  "High",
  "Mostly Factual",
  "Mixed",
  "Low",
  "Very Low",
  "Conspiracy-Pseudoscience",
  "Pro-Science",
  "Questionable Source",
  "Satire",
  "Unknown",
];

const tableColors: string[] = [
  "#0d9488",
  "#2628a1",
  "#a1a1aa",
  "#64748b",
  "#eab308",
  "#f97316",
  "#dc2626",
  "#2e8b57",
  "#71717a",
  "#8695f9",
  "#ffffff",
];

function PieChart({ integrityRatings }: { integrityRatings: number[] }) {
  const data: ChartData<"pie", number[], string> = {
    labels: ratings,
    datasets: [
      {
        label: "# of sources",
        data: integrityRatings,
        backgroundColor: tableColors,
        borderColor: tableColors,
        borderWidth: 1,
      },
    ],
  };

  return (
    <motion.div
      variants={variants}
      initial="closed"
      animate="open"
      exit="closed"
      transition={{ type: "tween", duration: 0.2 }}
      className="w-auto h-96 xl:h-112 xl:p-2 flex items-center justify-center"
    >
      <ErrorBoundary>
        <Pie key="pieChart" data={data} />
      </ErrorBoundary>
    </motion.div>
  );
}

export default React.memo(PieChart);
