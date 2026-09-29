import { softEase } from "@/motion/variants";
import { ActiveModal } from "@/state/Reducers/RenderingPipelines/PipelineSlice";
import type { Variants } from "framer-motion";

export function getSelectLinksMotions(modal: ActiveModal): Variants {
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
