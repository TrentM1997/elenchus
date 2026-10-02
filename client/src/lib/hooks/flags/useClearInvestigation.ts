import { useEffect } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/state/store";
import { CLEAR_INVESTIGATION } from "@/state/Reducers/Root/InvestigateReducer";
import { useTooltipFlags } from "../rendering/useTooltipFlags";
import {
  GuideTip,
  renderGuideTip,
} from "@/state/Reducers/Overlay/PipelineSlice";

export const PLAYSTATE_KEYS = [
  "previous-biases",
  "previous-perspective",
  "previous-expertise",
];

export function clearCachedPlayStates(keys: Array<string>) {
  try {
    for (const k of keys) {
      sessionStorage.removeItem(k);
    }
  } catch (err) {
    console.error(err);
  }
}

type ReturnTooltipFunction = (tooltip: GuideTip) => Promise<void>;

interface ClearInvestigationReturnType {
  removeTooltip: ReturnTooltipFunction;
}

const useClearInvestigation = (): ClearInvestigationReturnType => {
  const { setFlag } = useTooltipFlags();
  const dispatch = useDispatch<AppDispatch>();

  async function removeToolTip(tooltip: GuideTip) {
    if (tooltip === "Guide Selection") {
      setFlag("selectingTooltip", true);
      dispatch(renderGuideTip(null));
    } else if (tooltip === "Finished Reading Button") {
      setFlag("readingTooltip", true);
      dispatch(renderGuideTip(null));
    }
  }

  useEffect(() => {
    return () => {
      clearCachedPlayStates(PLAYSTATE_KEYS);
      dispatch({ type: CLEAR_INVESTIGATION });
    };
  }, []);

  return { removeTooltip: removeToolTip };
};

export { useClearInvestigation };
