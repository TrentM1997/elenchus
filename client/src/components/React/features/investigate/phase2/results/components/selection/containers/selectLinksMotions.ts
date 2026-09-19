import { softEase } from "@/motion/variants";
import { ActiveModal } from "@/state/Reducers/RenderingPipelines/PipelineSlice";

export function getSelectLinksMotions(modal: ActiveModal) {
  return {
    initial: { opacity: 0, y: 100 },
    animate: {
      opacity: 1,
      y: modal === null ? 0 : 100,
      transition: {
        type: "tween",
        duration: 0.23,
        delay: 0.5,
        ease: softEase,
      },
    },
    exit: {
      opacity: 0,
      y: 100,
      transition: {
        type: "tween",
        duration: 0.2,
        delay: 0.15,
        ease: softEase,
      },
    },
  };
}
