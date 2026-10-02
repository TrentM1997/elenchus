import { AnimatePresence } from "framer-motion";
import TermModalContainer from "@/components/React/features/wiki/components/popovers/containers/TermModalContainer";
import TermModal from "@/components/React/features/wiki/components/popovers/modals/TermModal";
import WikiTermExtract from "@/components/React/features/wiki/components/WikiTermExtract";
import ArticleBody from "./ArticleBody";
import ErrorBoundary from "@/components/React/global/ErrorBoundaries/ErrorBoundary";
import { useHighlightTerm } from "@/lib/hooks/wiki/useHighlightTerm";

interface FullTextProps {
  article_text: string;
  article_url: string;
}

export default function FullText({ article_text, article_url }: FullTextProps) {
  const { handleHighlightEnd, handleHighlightStart, toolState } =
    useHighlightTerm();

  return (
    <div
      onMouseDown={(e) => handleHighlightStart(e)}
      onMouseUp={handleHighlightEnd}
      className={`pt-6 text-white w-full h-full tracking-tight relative selection:bg-blue-300 selection:text-black`}
    >
      {toolState.status === "confirm" && (
        <TermModalContainer>
          <TermModal />
        </TermModalContainer>
      )}
      <ErrorBoundary>
        <AnimatePresence>
          {toolState.status !== "closed" && (
            <WikiTermExtract article_url={article_url} />
          )}
        </AnimatePresence>
      </ErrorBoundary>

      <ArticleBody markdown={article_text} />
    </div>
  );
}
