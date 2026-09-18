import { AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import type { Phase } from "@/state/Reducers/Investigate/Rendering";
import { ActiveModal } from "@/state/Reducers/RenderingPipelines/PipelineSlice";
import RenderHero from "../../switches/renderHero";
import { getHeroContainerStyles } from "./styles";

export default function HeroContainer() {
  const phase: Phase = useSelector(
    (s: RootState) => s.investigation.rendering.phase,
  );
  const modal: ActiveModal = useSelector((s: RootState) => s.overlay.modal);

  return (
    <section className={getHeroContainerStyles(modal)}>
      <AnimatePresence mode="wait">
        <RenderHero phase={phase} />
      </AnimatePresence>
    </section>
  );
}
