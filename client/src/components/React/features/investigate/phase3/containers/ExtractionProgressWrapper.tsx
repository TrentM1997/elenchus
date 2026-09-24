import { ArticleExtractionState } from "@/state/Reducers/Investigate/articles/types";
import RenderExtractProgressToast from "./RenderExtractProgressToast";
import { AnimatePresence } from "framer-motion";

type ExtractionProgressWrapperProps = {
  progress: string;
  articles: ArticleExtractionState;
};

export default function ExtractionProgressWrapper({
  articles,
  progress,
}: ExtractionProgressWrapperProps) {
  return (
    <AnimatePresence mode="wait">
      <RenderExtractProgressToast articles={articles} progress={progress} />
    </AnimatePresence>
  );
}
