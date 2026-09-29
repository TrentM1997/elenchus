import { AnimatePresence } from "framer-motion";
import SelectionRequired from "../../../../../notifications/SelectionRequired";
import GuideSelectingArticles from "@/components/React/features/investigate/phase2/results/tooltips/GuideSelectingArticles";
import MaxChosen from "./MaxChosen";
import { TooltipDisplayed } from "@/state/Reducers/Investigate/Rendering";
import { SelectedArticles } from "@/state/Reducers/Investigate/articles/ChosenArticles";
import { useManageSelectTooltipWrapper } from "@/lib/hooks/rendering/useManageSelectTooltipWrapper";

interface TooltipWrapper {
  canAnimate: boolean;
  selected: SelectedArticles;
  tooltip: TooltipDisplayed;
}

export default function SelectTooltipWrapper({
  canAnimate,
  selected,
  tooltip,
}: TooltipWrapper): JSX.Element | null {
  const { count } = useManageSelectTooltipWrapper({ selected });

  return (
    <AnimatePresence mode="wait">
      {tooltip === "Selection Required" && canAnimate && (
        <SelectionRequired key={"minimum-chosen warning"} count={count} />
      )}

      {tooltip === "Guide Selection" && canAnimate && (
        <GuideSelectingArticles key={"tooltip"} />
      )}

      {tooltip === "Max Toast" && canAnimate && (
        <MaxChosen key={"max-articles-selected"} />
      )}
    </AnimatePresence>
  );
}
