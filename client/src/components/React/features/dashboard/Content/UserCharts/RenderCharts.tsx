import { ResearchMetricsState } from "@/state/Reducers/Dashboard/DashboardSlice";
import { assertNever } from "@/lib/helpers/asserts/assertNever";
import MetricsCharts from "./MetricsCharts";
import PendingMetrics from "./PendingMetrics";
import FailedState from "@/components/React/global/fallbacks/FailedState";
import ResearchMetricsFallback from "./ResearchMetricsFallback";

export default function RenderCharts({
  metrics,
}: {
  metrics: ResearchMetricsState;
}) {
  switch (metrics.status) {
    case "initial": {
      return null;
    }
    case "failed": {
      return <FailedState />;
    }
    case "empty": {
      return <ResearchMetricsFallback />;
    }
    case "ready": {
      return <MetricsCharts state={metrics} />;
    }
    case "pending": {
      return <PendingMetrics />;
    }

    default: {
      return assertNever(metrics);
    }
  }
}
