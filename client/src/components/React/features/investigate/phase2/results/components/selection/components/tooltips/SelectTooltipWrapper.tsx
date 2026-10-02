import { AnimatePresence } from "framer-motion";
import SelectionRequired from "../../../../../notifications/SelectionRequired";
import GuideSelectingArticles from "@/components/React/features/investigate/phase2/results/tooltips/GuideSelectingArticles";
import MaxChosen from "./MaxChosen";
import { SelectedArticles } from "@/state/Reducers/Investigate/articles/ChosenArticles";
import { useManageSelectTooltipWrapper } from "@/lib/hooks/rendering/useManageSelectTooltipWrapper";
import { GuideTip } from "@/state/Reducers/Overlay/PipelineSlice";

interface TooltipWrapper {
  canAnimate: boolean;
  selected: SelectedArticles;
  guideTip: GuideTip;
}

export default function SelectTooltipWrapper({
  canAnimate,
  selected,
  guideTip,
}: TooltipWrapper): JSX.Element | null {
  const { count } = useManageSelectTooltipWrapper({ selected });

  return (
    <AnimatePresence mode="wait">
      {guideTip === "Selection Required" && canAnimate && (
        <SelectionRequired key={"minimum-chosen warning"} count={count} />
      )}

      {guideTip === "Guide Selection" && canAnimate && (
        <GuideSelectingArticles key={"tooltip"} />
      )}

      {guideTip === "Max Toast" && canAnimate && (
        <MaxChosen key={"max-articles-selected"} />
      )}
    </AnimatePresence>
  );
}
