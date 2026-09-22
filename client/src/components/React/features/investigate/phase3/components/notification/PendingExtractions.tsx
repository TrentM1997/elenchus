import { motion } from "framer-motion";
import { extractionToastVariants } from "@/motion/variants";
import { createPortal } from "react-dom";
import PulseDot from "./PulseDot";
import ExtractionProgress from "./ExtractionProgress";

export default function PendingExtractions({
  progress,
}: {
  progress: string;
}): JSX.Element | null {
  const root = document.getElementById("portal-root");
  if (root === null) return null;

  const toast: JSX.Element = (
    <motion.div
      aria-label="Pending extracts notification"
      variants={extractionToastVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="lg:fixed relative lg:left-16 lg:mx-0 top-4 md:top-12 lg:top-16 
            h-10 w-[15.5rem] ring-2 ring-white/20 backdrop-blur-sm transform-gpu 
            will-change-transform p-2 rounded-xl px-2.5 z-[900]"
    >
      <div
        key="title"
        className="flex w-full h-full items-center justify-between"
      >
        <ExtractionProgress progress={progress} />
        <PulseDot key={"pending-status"} />
      </div>
    </motion.div>
  );

  return createPortal(toast, root);
}
