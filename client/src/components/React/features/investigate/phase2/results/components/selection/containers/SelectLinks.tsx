import { AnimatePresence, motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/ReduxToolKit/store";
import { useMemo, useRef } from "react";
import { useMinTimeVisible } from "@/hooks/useMinTimeVisible";
import { InvestigateState } from "@/ReduxToolKit/Reducers/Root/InvestigateReducer";
import RetrieveChosenArticles from "../components/buttons/RetrieveChosenArticles";
import SelectTooltipWrapper from "../components/tooltips/SelectTooltipWrapper";
import CurrentChosen from "../components/info/CurrentChosen";
import type { ModalDisplayed, SelectionBar } from "@/ReduxToolKit/Reducers/Investigate/Rendering";
import type { Tooltips } from "@/env";

interface SelectLinksProps {
  flags: Tooltips
}

export default function SelectLinks() {
  const investigateState: InvestigateState = useSelector((state: RootState) => state.investigation);
  const modal: ModalDisplayed = useSelector((s: RootState) => s.investigation.rendering.modal);
  const { articleOptions, status } = investigateState.search;
  const { getArticle } = investigateState;
  const { showGetArticlesModal } = investigateState.display;
  const { chosenArticles } = getArticle;
  const visible = useMinTimeVisible((status === 'pending'), 150, 800);
  const results = (Array.isArray(articleOptions)) && (articleOptions.length > 0);
  const canAnimate = (!visible) && (modal === null);


  return (
    <AnimatePresence initial={false}>
      {canAnimate && (results) &&
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: showGetArticlesModal ? 100 : 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: "tween", duration: 0.2, delay: 0.3, ease: [0.33, 0, 0.67, 1] }}
          className={`
           bg-ebony fixed bottom-0 right-0 left-0 border-t border-border_gray
        text-white font-light tracking-tight flex 2xl:gap-x-16 py-4 gap-x-4 md:px-16 cursor-pointer
         mx-auto z-40 justify-center xl:justify-end content-center`
          }>

          <SelectTooltipWrapper />

          <CurrentChosen
            chosenArticles={chosenArticles}
          />
          <RetrieveChosenArticles
          />
        </motion.div>
      }
    </AnimatePresence>
  );
};