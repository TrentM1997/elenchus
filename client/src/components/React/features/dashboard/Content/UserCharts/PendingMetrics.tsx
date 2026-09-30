import DelayedFallback from "@/components/React/global/fallbacks/DelayedFallback";
import ChartJsSkeleton, {
  DonutSkeletonChart,
} from "../../../charts/skeletons/ChartJsSkeleton";
import PieSkeleton from "../../../charts/skeletons/PieSkeleton";
import StatsSkeleton from "../../../charts/skeletons/StatsSkeleton";

export default function PendingMetrics() {
  return (
    <DelayedFallback>
      <ChartJsSkeleton>
        <DonutSkeletonChart />
      </ChartJsSkeleton>
      <ChartJsSkeleton>
        <PieSkeleton />
      </ChartJsSkeleton>
      <StatsSkeleton />
    </DelayedFallback>
  );
}
