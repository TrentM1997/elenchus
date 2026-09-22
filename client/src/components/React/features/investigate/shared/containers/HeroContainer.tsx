import { AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { ActiveModal } from "@/state/Reducers/RenderingPipelines/PipelineSlice";
import RenderHero from "../../switches/renderHero";
import { getHeroContainerStyles } from "./styles";

export default function HeroContainer() {
  const state = useSelector(
    (s: RootState) => s.investigation.research.research,
  );
  const modal: ActiveModal = useSelector((s: RootState) => s.overlay.modal);

  return (
    <section className={getHeroContainerStyles(modal)}>
      <AnimatePresence mode="wait">
        <RenderHero state={state} />
      </AnimatePresence>
    </section>
  );
}
