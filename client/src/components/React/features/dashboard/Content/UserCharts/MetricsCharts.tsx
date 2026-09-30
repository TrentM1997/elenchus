import { ResearchMetricsState } from "@/state/Reducers/Dashboard/DashboardSlice";
import BiasChart from "@/components/React/features/charts/DonutChart/BiasChart";
import IntegrityChart from "@/components/React/features/charts/PieChart/IntegrityChart";
import { motion } from "framer-motion";
import { chartVariants, metricsContainerVariants } from "@/motion/variants";
import StatsSection from "../../../charts/ResearchStats/StatsSection";

export default function MetricsCharts({
  state,
}: {
  state: Extract<ResearchMetricsState, { status: "ready" }>;
}) {
  return (
    <motion.div
      key={"container"}
      variants={metricsContainerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        key={"bias"}
        variants={chartVariants}
        initial="closed"
        animate="open"
        exit={"closed"}
      >
        <BiasChart biasRatings={state.data.bias} />
      </motion.div>

      <motion.div
        key={"integrity"}
        variants={chartVariants}
        initial="closed"
        animate="open"
        exit="closed"
      >
        <IntegrityChart integrityRatings={state.data.integrity} />
      </motion.div>

      <motion.div
        key={"stats"}
        variants={chartVariants}
        initial="closed"
        animate="open"
        exit="closed"
      >
        <StatsSection outcomes={state.data.outcomes} />
      </motion.div>
    </motion.div>
  );
}
