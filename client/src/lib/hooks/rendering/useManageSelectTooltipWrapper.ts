import { useEffect } from "react";
import { useTooltipFlags } from "@/lib/hooks/rendering/useTooltipFlags";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/state/store";
import { useMaxSelectedToast } from "@/lib/hooks/rendering/useAutoDismiss";
import { SelectedArticles } from "@/state/Reducers/Investigate/articles/ChosenArticles";
import { renderGuideTip } from "@/state/Reducers/Overlay/PipelineSlice";

export const useManageSelectTooltipWrapper = ({
  selected,
}: {
  selected: SelectedArticles;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { getFlags } = useTooltipFlags();
  const chosenCount = selected.status === "empty" ? 0 : selected.data.length;
  useMaxSelectedToast({ count: chosenCount });
  const surfaceTooltip = async () => {
    const flags = getFlags();
    if (flags.selectingTooltip === false) {
      dispatch(renderGuideTip("Guide Selection"));
    }
  };

  useEffect(() => {
    surfaceTooltip();
  }, []);

  return {
    count: chosenCount,
  };
};
