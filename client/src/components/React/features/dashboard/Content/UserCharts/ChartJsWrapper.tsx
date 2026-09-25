import { Fragment, lazy, Suspense, useEffect } from "react";
import PieSkeleton from "@/components/React/features/charts/skeletons/PieSkeleton";
import { DonutSkeletonChart } from "@/components/React/features/charts/skeletons/ChartJsSkeleton";
import ChartJsSkeleton from "@/components/React/features/charts/skeletons/ChartJsSkeleton";
import DelayedFallback from "@/components/React/global/fallbacks/DelayedFallback";
import { Priority } from "@/lib/hooks/dashboard/rendering/useRenderMetrics";
import AsyncStateRenderer from "@/components/React/pipelines/AsyncStateRenderer";
import { ResearchMetrics } from "@/state/Reducers/Dashboard/DashboardSlice";
import StatsSkeleton from "../../../charts/skeletons/StatsSkeleton";
import StatsSection from "../../../charts/ResearchStats/StatsSection";
import ChartSuspenseSkeleton from "../../../charts/skeletons/ChartSectionSkeleton";
const BiasChart = lazy(
  () => import("@/components/React/features/charts/DonutChart/BiasChart"),
);
const IntegrityChart = lazy(
  () => import("@/components/React/features/charts/PieChart/IntegrityChart"),
);

interface RenderMetricsCharts {
  priority1: Priority;
  priority2: Priority;
  priority3: Priority;
  metrics: ResearchMetrics;
}

export default function RenderMetricsCharts({
  priority1,
  priority2,
  metrics,
}: RenderMetricsCharts): JSX.Element | null {
  return (
    <Fragment>
      <AsyncStateRenderer
        state={metrics.bias}
        pending={() => (
          <DelayedFallback key={"delay-skeleton"}>
            <ChartJsSkeleton key={"skeleton-wrapper"}>
              <DonutSkeletonChart key={"skeleton-donut"} />
            </ChartJsSkeleton>
          </DelayedFallback>
        )}
      >
        {(state) => (
          <Suspense>
            {priority1 === "complete" && (
              <BiasChart biasRatings={state} key={"bias-chart"} />
            )}
          </Suspense>
        )}
      </AsyncStateRenderer>

      <AsyncStateRenderer
        state={metrics.integrity}
        pending={() => (
          <DelayedFallback key={"delay-pie-skeleton"}>
            <ChartJsSkeleton key={"wrapper-skeleton"}>
              <PieSkeleton key={"pie-skeleton"} />
            </ChartJsSkeleton>
          </DelayedFallback>
        )}
      >
        {(state) => (
          <Suspense>
            (
            <IntegrityChart integrityRatings={state} key={"integrity-chart"} />)
          </Suspense>
        )}
      </AsyncStateRenderer>

      <AsyncStateRenderer
        state={metrics.outcomes}
        pending={() => (
          <DelayedFallback key={"delay-stats-fallback"}>
            <StatsSkeleton key={"stats-skeleton"} />
          </DelayedFallback>
        )}
      >
        {(state) => (
          <Suspense key={"stats-suspense"}>
            (<StatsSection outcomes={state} key={"investigation-stats"} />)
          </Suspense>
        )}
      </AsyncStateRenderer>
    </Fragment>
  );
}
