import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import type { ModalStages } from "@/state/Reducers/Investigate/wiki/WikiSlice";
import RenderInvestigationPhase from "../../switches/renderContent";
import { UserResearchType } from "@/state/Reducers/Investigate/research/types";

export default function Content({ research }: { research: UserResearchType }) {
  const wikiModalStages: ModalStages = useSelector(
    (state: RootState) => state.investigation.wiki.wikiModalStages,
  );

  if (research.phase !== "searching" && research.phase !== "evidence")
    return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: "tween", duration: 0.2 }}
      className={`${wikiModalStages.highlight && "cursor-text"}
                ${research.phase === "searching" || research.phase === "evidence" ? "min-h-screen" : ""}
                relative w-full h-full 
                mx-auto`}
    >
      <div className="relative w-full min-h-full box-border">
        <AnimatePresence mode="wait">
          <RenderInvestigationPhase research={research} />
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
