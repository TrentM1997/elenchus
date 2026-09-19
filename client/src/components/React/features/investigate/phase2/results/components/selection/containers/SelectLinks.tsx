import { AnimatePresence, motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import RetrieveChosenArticles from "../components/buttons/RetrieveChosenArticles";
import SelectTooltipWrapper from "../components/tooltips/SelectTooltipWrapper";
import CurrentChosen from "../components/info/CurrentChosen";
import type { ActiveModal } from "@/state/Reducers/RenderingPipelines/PipelineSlice";
import { selectLinksCSS } from "./styles";
import { getSelectLinksMotions } from "./selectLinksMotions";

export default function SelectLinks() {
  const modal: ActiveModal = useSelector((s: RootState) => s.overlay.modal);
  const motions = getSelectLinksMotions(modal);
  const results = useSelector((s: RootState) => s.investigation.search.pages);
  const selected = useSelector(
    (s: RootState) => s.investigation.getArticle.selected,
  );
  return (
    <AnimatePresence initial={false}>
      {results.status === "ready" && (
        <motion.div
          initial={motions.initial}
          animate={motions.animate}
          exit={motions.exit}
          className={selectLinksCSS}
        >
          <SelectTooltipWrapper canAnimate={results.status === "ready"} />
          <CurrentChosen chosenArticles={selected} />
          <RetrieveChosenArticles />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
