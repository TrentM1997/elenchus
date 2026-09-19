import { RootState } from "@/state/store";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { investigationsVariants } from "@/motion/variants";
import ResearchScroller from "./ResearchScroller";
import AsyncStateRenderer from "../../../../../pipelines/AsyncStateRenderer";
import InvestigationsFallback from "../fallbacks/InvestigationsFallback";

export default function SavedResearchLayout() {
  const savedInvestigations = useSelector(
    (state: RootState) => state.dash.investigations,
  );

  return (
    <motion.section
      key="savedResearch"
      variants={investigationsVariants}
      initial="closed"
      animate="open"
      exit="closed"
      className="w-full"
    >
      <div className="max-h-screen w-full">
        <AsyncStateRenderer
          state={savedInvestigations}
          empty={() => <InvestigationsFallback />}
        >
          {(state) => <ResearchScroller timeline={state} />}
        </AsyncStateRenderer>
      </div>
    </motion.section>
  );
}
