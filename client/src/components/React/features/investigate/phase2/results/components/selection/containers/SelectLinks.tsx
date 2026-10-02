import { AnimatePresence, motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import RetrieveChosenArticles from "../components/buttons/RetrieveChosenArticles";
import SelectTooltipWrapper from "../components/tooltips/SelectTooltipWrapper";
import CurrentChosen from "../components/info/CurrentChosen";
import { selectLinksCSS } from "./styles";
import { getSelectLinksMotions } from "./selectLinksMotions";

export default function SelectLinks() {
  const modal = useSelector((s: RootState) => s.overlay.modal);
  const motions = getSelectLinksMotions(modal);
  const results = useSelector((s: RootState) => s.investigation.search.pages);
  const selected = useSelector(
    (s: RootState) => s.investigation.getArticle.selected,
  );
  const guideTip = useSelector((s: RootState) => s.overlay.guideTip);

  return (
    <AnimatePresence initial={false}>
      {results.status === "ready" && (
        <motion.div
          variants={motions}
          initial={"initial"}
          animate={"animate"}
          exit={"exit"}
          className={selectLinksCSS}
        >
          <SelectTooltipWrapper
            selected={selected}
            canAnimate={modal === null}
            guideTip={guideTip}
          />
          <CurrentChosen chosenArticles={selected} />
          <RetrieveChosenArticles />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
