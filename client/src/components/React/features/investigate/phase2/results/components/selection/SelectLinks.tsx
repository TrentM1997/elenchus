import { AnimatePresence, motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/ReduxToolKit/store";
import { AppDispatch } from "@/ReduxToolKit/store";
import { useMemo } from "react";
import { useTooltipFlags } from "@/hooks/useTooltipFlags";
import { useMinTimeVisible } from "@/hooks/useMinTimeVisible";
import { InvestigateState } from "@/ReduxToolKit/Reducers/Root/InvestigateReducer";
import RetrieveChosenArticles from "./buttons/RetrieveChosenArticles";
import SelectTooltipWrapper from "./tooltips/SelectTooltipWrapper";

export default function SelectLinks() {
  const investigateState: InvestigateState = useSelector((state: RootState) => state.investigation);
  const { search } = investigateState;
  const { articleOptions, status } = search;
  const { getArticle } = investigateState;
  const { showGetArticlesModal } = investigateState.display;
  const { chosenArticles } = getArticle;
  const { getFlags, setFlag } = useTooltipFlags();
  const dispatch = useDispatch<AppDispatch>();
  const visible = useMinTimeVisible((status === 'pending'), 150, 1000);

  const showSelectBar = useMemo((): boolean => {
    const loaded: boolean = Array.isArray(articleOptions) && (articleOptions.length > 0) && (!showGetArticlesModal)
    const fallbackUnmounted = (visible === false);
    return (loaded && fallbackUnmounted);
  }, [status, articleOptions, visible, showGetArticlesModal]);



  return (
    <AnimatePresence>
      {showSelectBar &&
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ type: "tween", duration: 0.2, delay: 0.2, ease: [0.33, 0, 0.67, 1] }}
          className={`
           bg-ebony fixed bottom-0 right-0 left-0 border-t border-border_gray
        text-white font-light tracking-tight flex 2xl:gap-x-16 py-4 gap-x-4 md:px-16 cursor-pointer
         mx-auto z-40 justify-center 2xl:justify-end content-center`
          }>

          <SelectTooltipWrapper />

          <OptionsCeiling
            chosenArticles={chosenArticles}
          />
          <RetrieveChosenArticles
          />
        </motion.div>
      }

    </AnimatePresence>

  )
};





function OptionsCeiling({ chosenArticles }) {

  const selectedTotal = chosenArticles.length
  const selectedArticles = `${selectedTotal}/3`


  return (
    <div className="h-full my-auto">
      <p
        className="text-base md:text-xl 2xl:text-2xl"
      >Choose articles
        <span
          className={`
                text-blue-400 font-bold tracking-tight mx-2 
                ${selectedTotal === 3
              ? 'animate-pulse'
              : null}`
          }
        >
          {selectedArticles}
        </span>
      </p>
    </div>
  );
};