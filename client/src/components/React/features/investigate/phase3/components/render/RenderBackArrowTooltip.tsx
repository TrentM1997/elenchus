import BackToSearchTooltip from "../../tooltips/BackToSearchTooltip";
import ButtonHoverTooltip from "../../tooltips/ButtonHoverTooltip";
import { TooltipType } from "@/lib/hooks/useShowBackToolTip";
import { assertNever } from "@/lib/helpers/asserts/assertNever";

export default function RenderBackArrowTooltip({
  kind,
}: {
  kind: TooltipType;
}) {
  switch (kind) {
    case "failed":
    case "service-down": {
      <BackToSearchTooltip id={kind} />;
    }
    case "return": {
      return <ButtonHoverTooltip description="back to search" />;
    }

    default: {
      return assertNever(kind);
    }
  }
}
