import { AnimatePresence } from "framer-motion";
import PanelLabel from "./PanelLabel";
import { useShowBackToolTip } from "@/lib/hooks/useShowBackToolTip";
import RenderBackArrowTooltip from "../render/RenderBackArrowTooltip";
import BackArrow from "./BackArrow";
import { buttonCSS, outerCSS } from "./styles";

export default function ReturnToSearch(): JSX.Element | null {
  const { tooltip, handleReturn } = useShowBackToolTip();

  return (
    <div className={outerCSS}>
      <button
        aria-label="Return to search"
        onClick={handleReturn}
        className={buttonCSS}
      >
        <AnimatePresence>
          <RenderBackArrowTooltip kind={tooltip} />
        </AnimatePresence>
        <BackArrow />
      </button>
      <PanelLabel description={"back"} />
    </div>
  );
}
