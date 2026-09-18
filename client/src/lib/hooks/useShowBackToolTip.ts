import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/state/store";
import { renderModal } from "@/state/Reducers/RenderingPipelines/PipelineSlice";

export type TooltipType = "failed" | "service-down" | "return";

type ShowBackTooltipHook = {
  handleReturn: () => void;
  tooltip: TooltipType;
};

export const useShowBackToolTip = (): ShowBackTooltipHook => {
  const status = useSelector(
    (s: RootState) => s.investigation.read.articles.status,
  );
  const [tooltip, setShowBackTooltip] = useState<TooltipType>("return");
  const dispatch = useDispatch<AppDispatch>();

  const handleReturn = () => {
    dispatch(renderModal("Back to Search"));
  };

  useEffect(() => {
    if (status !== "error") return;

    const TOASTKEY = "extraction-toast:v1";
    try {
      const toast = window.sessionStorage.getItem(TOASTKEY) ?? null;
      if (toast === "service-down" || toast === "failed") {
        setShowBackTooltip(toast);
      }
    } catch (err) {
      console.error(err);
    }
  }, [status]);

  return {
    handleReturn,
    tooltip,
  };
};
