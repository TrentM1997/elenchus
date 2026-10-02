import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { UserResearchType } from "@/state/Reducers/Investigate/research/types";
import RenderInvestigationContentPhase from "../../switches/RenderInvestigationContentPhase";

export default function Content({ research }: { research: UserResearchType }) {
  const wikiToolStatus = useSelector(
    (s: RootState) => s.investigation.wiki.extractTool.status,
  );

  if (research.phase !== "searching" && research.phase !== "evidence")
    return null;

  return (
    <motion.div
      key={"investigation-content-container"}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: "tween", duration: 0.2 }}
      className={`${wikiToolStatus === "highlight" && "cursor-text"}
                ${research.phase === "searching" || research.phase === "evidence" ? "min-h-screen" : ""}
                relative w-full h-full 
                mx-auto`}
    >
      <div className="relative w-full min-h-full box-border">
        <AnimatePresence mode="wait">
          <RenderInvestigationContentPhase
            research={research}
            key={research.phase}
          />
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
