import { ResearchMetricsState } from "@/state/Reducers/Dashboard/DashboardSlice";
import BiasChart from "@/components/React/features/charts/DonutChart/BiasChart";
import IntegrityChart from "@/components/React/features/charts/PieChart/IntegrityChart";
import StatsSection from "../../../charts/ResearchStats/StatsSection";
import { Fragment } from "react/jsx-runtime";

export default function MetricsCharts({
  state,
}: {
  state: Extract<ResearchMetricsState, { status: "ready" }>;
}) {
  return (
    <Fragment>
      <BiasChart key={"bias-chart"} biasRatings={state.data.bias} />
      <IntegrityChart
        key={"reporting-integrity-chart"}
        integrityRatings={state.data.integrity}
      />
      <StatsSection key={"stats"} outcomes={state.data.outcomes} />
    </Fragment>
  );
}
