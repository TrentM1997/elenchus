import { AnimatePresence, motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { useMinTimeVisible } from "@/hooks/useMinTimeVisible";
import RetrieveChosenArticles from "../components/buttons/RetrieveChosenArticles";
import SelectTooltipWrapper from "../components/tooltips/SelectTooltipWrapper";
import CurrentChosen from "../components/info/CurrentChosen";
import type { ActiveModal } from "@/state/Reducers/RenderingPipelines/PipelineSlice";
import { softEase } from "@/motion/variants";


export default function SelectLinks() {
  const modal: ActiveModal = useSelector((s: RootState) => s.overlay.modal);
  const articleOptions: ArticleType[] = useSelector((s: RootState) => s.investigation.search.articleOptions);
  const status = useSelector((s: RootState) => s.investigation.search.status);
  const chosenArticles = useSelector((s: RootState) => s.investigation.getArticle.chosenArticles);
  const visible = useMinTimeVisible((status === 'pending'), 150, 800);
  const results = (Array.isArray(articleOptions)) && (articleOptions.length > 0);
  const canAnimate = (!visible) && (modal === null);


  return (
    <AnimatePresence initial={false}>
      {canAnimate && (results) &&
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: (modal === null) ? 0 : 100, transition: { type: 'tween', duration: 0.23, delay: 0.5, ease: softEase } }}
          exit={{ opacity: 0, y: 100, transition: { type: 'tween', duration: 0.2, delay: 0.15, ease: softEase } }}
          className={`
           bg-ebony fixed bottom-0 right-0 left-0 border-t border-border_gray
        text-white font-light tracking-tight flex 2xl:gap-x-16 py-4 gap-x-4 md:px-16 cursor-pointer
         mx-auto z-40 justify-center xl:justify-end content-center`
          }>

          <SelectTooltipWrapper canAnimate={canAnimate} />

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