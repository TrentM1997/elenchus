import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/state/store";
import { useEffect, useRef } from "react";
import { useTooltipFlags } from "@/lib/hooks/rendering/useTooltipFlags";

export const useFinishedReadingTooltip = () => {
  const articles = useSelector((s: RootState) => s.investigation.read.articles);
  const guideTip = useSelector((s: RootState) => s.overlay.guideTip);
  const { getFlags, setFlag } = useTooltipFlags();
  const dispatch = useDispatch();

  const flagTimer = useRef<number | null>(null);

  useEffect(() => {
    const flags = getFlags();

    if (flags.readingTooltip === false) {
      flagTimer.current = window.setTimeout(() => {
        setFlag("readingTooltip", true);
        flagTimer.current = null;
      }, 2000);
    }
  }, [getFlags, setFlag, dispatch]);

  return {
    articles,
    guideTip,
  };
};
