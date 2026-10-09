import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import ErrorBoundary from "../../../global/ErrorBoundaries/ErrorBoundary";
import { ChartData } from "chart.js";
import {
  factualReportingRatingConfig,
  getPieChartDataSet,
} from "./pieChartConfig";
ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({
  integrityRatings,
}: {
  integrityRatings: IntegrityRatings;
}) {
  const { colors, values, labels } = getPieChartDataSet({
    config: factualReportingRatingConfig,
    integrityRatings,
  });

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
    <div className="w-auto h-96 lg:h-112 flex items-center md:justify-center">
      <ErrorBoundary>
        <Pie key="pieChart" data={data} />
      </ErrorBoundary>
    </div>
  );
}
