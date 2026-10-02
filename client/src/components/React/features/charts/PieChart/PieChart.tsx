import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { motion } from "framer-motion";
import ErrorBoundary from "../../../global/ErrorBoundaries/ErrorBoundary";
import { ChartData } from "chart.js";
import React from "react";
import { factualReportingRatingConfig } from "./pieChartConfig";
ChartJS.register(ArcElement, Tooltip, Legend);

const variants = {
  open: { opacity: 1 },
  closed: { opacity: 0 },
};

function PieChart({
  integrityRatings,
}: {
  integrityRatings: IntegrityRatings;
}) {
  const labels = factualReportingRatingConfig.map(({ rating }) => rating);
  const colors = factualReportingRatingConfig.map(({ color }) => color);
  const values = factualReportingRatingConfig.map(
    ({ rating }) => integrityRatings[rating],
  );

  const data: ChartData<"pie", number[], string> = {
    labels: labels,
    datasets: [
      {
        label: "# of sources",
        data: values,
        backgroundColor: colors,
        borderColor: colors,
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
