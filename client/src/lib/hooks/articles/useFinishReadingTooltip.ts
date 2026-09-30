import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/state/store";
import {
  populateTooltip,
  TooltipDisplayed,
} from "@/state/Reducers/Investigate/Rendering";
import { useEffect, useRef } from "react";
import { useTooltipFlags } from "@/lib/hooks/rendering/useTooltipFlags";
import { smoothScrollUp } from "@/lib/helpers/scroll/ScrollToTop";
import { wait } from "@/lib/helpers/formatting/Presentation";
import { startReflection } from "@/state/Reducers/Investigate/research/ResearchSlice";

export const useFinishedReadingTooltip = () => {
  const articles = useSelector((s: RootState) => s.investigation.read.articles);
  const tooltip = useSelector(
    (s: RootState) => s.investigation.rendering.tooltip,
  );
  const { getFlags, setFlag } = useTooltipFlags();
  const dispatch = useDispatch();

  const flagTimer = useRef<number | null>(null);

  useEffect(() => {
    const flags = getFlags();

    if (flags.readingTooltip === false) {
      flagTimer.current = window.setTimeout(() => {
        dispatch(populateTooltip("Finished Reading Button"));
        setFlag("readingTooltip", true);
        flagTimer.current = null;
      }, 2000);
    }
  }, [getFlags, setFlag, dispatch]);

  const handleClick = async (): Promise<void> => {
    smoothScrollUp();
    await wait(500);
    dispatch(
      startReflection({
        ending_perspective: null,
        changed_opinion: null,
        had_merit: null,
        new_concepts: null,
        takeaway: null,
      }),
    );
  };

  return {
    articles,
    tooltip,
    handleClick,
  };
};
